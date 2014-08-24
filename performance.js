var time = require("measure-time");
var serially = require("./");

time('basic', function (end) {
  serially()
    .then(quux)
    .then(corge)
    .then(span)
    .done(end);
});

time('with parameters and aliases', function (end) {
  serially()
    .then(foo, ['hello', 'world', '!'])
    .then('bar-alias', bar, [1, 2, 3])
    .then(qux, [4, 5, 6])
    .done(end);
});

function foo (pa, ra, ms, callback) {
  setImmediate(function () {
    callback(undefined, pa + '\n' + ra + '\n' + ms);
  });
}

function bar (pa, ra, ms, callback) {
  setImmediate(function () {
    callback(undefined, pa + ra + ms);
  });
}

function qux (pa, ra, ms, callback) {
  setImmediate(function () {
    callback(undefined, pa * ra * ms);
  });
}

function quux (callback) {
  setImmediate(function () {
    callback();
  });
}

function corge (callback) {
  setImmediate(function () {
    callback();
  });
}

function span (callback) {
  setImmediate(function () {
    callback();
  });
}
