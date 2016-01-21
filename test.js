var test = require("prova");
var serially = require("./");

test('composing functions into one', function (assert) {
  serially()
    .then(foo, ['hello', 'world', '!'])
    .then('bar-alias', bar, [1, 2, 3])
    .then(qux, [4, 5, 6])
    .done(function (error, results) {
      assert.notOk(error);
      assert.deepEqual(results.foo, ['hello\nworld\n!']);
      assert.deepEqual(results['bar-alias'], [6]);
      assert.deepEqual(results.qux, [120]);
      assert.end();
    });
});

test('stops at error', function (assert) {
  serially()
    .then(foo, ['hello', 'world', '!'])
    .then(fail)
    .then('bar-alias', bar, [1, 2, 3])
    .then(qux, [4, 5, 6])
    .done(function (error, results) {
      assert.ok(error);
      assert.equal(error.message, 'fail');
      assert.deepEqual(results.foo, ['hello\nworld\n!']);
      assert.notOk(results['bar-alias']);
      assert.notOk(results.qux);
      assert.end();
    });
});

test('fails if undefined functions given', function (assert) {
  assert.plan(2);

  try {
    serially()
      .then(undefined, 'fail');
  } catch (err) {
    assert.equal(err.message, "serially: Undefined function given");
    assert.ok(err);
  }
});

test('allows customizing context', function (t) {
  t.plan(3);

  var ctx = {};

  serially({ context: ctx })
    .then(function (next) {
      t.equal(this, ctx);
      next();
    })
    .then(function (next) {
      t.equal(this, ctx);
      next();
    })
    .done(function () {
      t.notEqual(this, ctx);
    });
});

function foo (pa, ra, ms, callback) {
  callback(undefined, pa + '\n' + ra + '\n' + ms);
}

function bar (pa, ra, ms, callback) {
  setTimeout(function () {
    callback(undefined, pa + ra + ms);
  });
}

function qux (pa, ra, ms, callback) {
  setTimeout(function () {
    callback(undefined, pa * ra * ms);
  });
}

function fail (callback) {
  callback(new Error('fail'));
}
