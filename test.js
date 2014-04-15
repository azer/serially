var test = require("prova");
var serially = require("./");

test('composing functions into one', function (assert) {
  var all = serially()
        .add(foo, ['hello', 'world', '!'])
        .add('bar-alias', bar, [1, 2, 3])
        .add(qux, [4, 5, 6]);

  all(function (error, results) {
    assert.notOk(error);
    assert.deepEqual(results.foo, ['hello\nworld\n!']);
    assert.deepEqual(results['bar-alias'], [6]);
    assert.deepEqual(results.qux, [120]);
    assert.end();
  });
});

test('stops at error', function (assert) {
  var all = serially()
        .add(foo, ['hello', 'world', '!'])
        .add(fail)
        .add('bar-alias', bar, [1, 2, 3])
        .add(qux, [4, 5, 6]);

  all(function (error, results) {
    assert.ok(error);
    assert.equal(error.message, 'fail');
    assert.deepEqual(results.foo, ['hello\nworld\n!']);
    assert.notOk(results['bar-alias']);
    assert.notOk(results.qux);
    assert.end();
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
