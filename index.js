var loop = require("serial-loop");

module.exports = serially;

function serially (options) {
  options || (options = {});

  var fns = [];

  var self = {
    then: then,
    run: then,
    done: call,
    end: call
  };

  return self;

  function then (alias, fn, params) {
    if (typeof alias != 'string') {
      params = fn;
      fn = alias;
      alias = fn && fn.name;
    }

    if (typeof fn == 'undefined') {
      throw new Error('serially: Undefined function given');
    }

    fns.push({ alias: alias, fn: fn, params: params });

    return self;
  }

  function call (callback) {
    var results = {};
    var len = fns.length;

    (function next (i, error) {
      if (error) return callback(error, results);

      if (i >= len) return callback(undefined, results);

      var params = fns[i].params;

      if (!params) {
        params = [];
      } else {
        params = params.slice();
      }

      params.push(function (error) {
        if (error) return next(i + 1, error);
        results[fns[i].alias] = Array.prototype.slice.call(arguments, 1);
        next(i+1);
      });

      fns[i].fn.apply(options.context, params);
    }(0));
  }

}
