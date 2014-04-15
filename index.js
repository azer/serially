var loop = require("serial-loop");

module.exports = serially;

function serially (fn, params) {
  var fns = [];

  call.add = add;
  return call;

  function call (callback) {
    var results = [];

    loop(fns.length, each, function (error) {
      callback(error, results);
    });

    function each (done, i) {
      var params = fns[i].params ? fns[i].params.slice() : [];

      params.push(function callback (error) {
        if (error) return done(error);
        results[fns[i].alias] = Array.prototype.slice.call(arguments, 1);
        done();
      });

      fns[i].fn.apply(undefined, params);
    }
  }

  function add (alias, fn, params) {
    if (typeof alias != 'string') {
      params = fn;
      fn = alias;
      alias = fn.name;
    }

    if (!alias) {
      throw new Error('Function does not have a name. Either declare it with a name or specify an alias.');
    }

    fns.push({ alias: alias, fn: fn, params: params });

    return call;
  }
}
