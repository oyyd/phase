"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var compileWebpackLoader = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(options, source) {
    var compileFunc, compileOptions, sourceMap, filename, targetFilename, context;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            compileFunc = options.compileFunc, compileOptions = options.compileOptions, sourceMap = options.sourceMap, filename = options.filename, targetFilename = options.targetFilename;
            context = new WebpackContext(compileOptions, sourceMap, null, filename, targetFilename);


            try {
              compileFunc.call(context, source);
            } catch (err) {
              context.doneDeferred.reject(err);
            }

            return _context.abrupt("return", context.done);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function compileWebpackLoader(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * currently compatible loaders: babel
 */

// TODO: do cache

// try to be compatible with webpack loaders
var WebpackContext = function () {
  function WebpackContext(options, sourceMap, localOptions, filename, targetFilename) {
    _classCallCheck(this, WebpackContext);

    // context properties
    this.isCacheable = false;
    this.options = options;
    this.sourceMap = sourceMap;
    // TODO: provide absolute path
    this.currentRequest = targetFilename;
    this.remainingRequest = filename;
    // TODO: check the 1.x version of loader utils
    this.query = null;

    // bind
    this.callback = this.callback.bind(this);

    // output
    this.doneDeferred = Promise.defer();
    this.done = this.doneDeferred.promise;
  }

  _createClass(WebpackContext, [{
    key: "cacheable",
    value: function cacheable() {
      this.isCacheable = true;
    }

    // the loader would return the result asyncly

  }, {
    key: "async",
    value: function async() {
      return this.callback;
    }
  }, {
    key: "callback",
    value: function callback(error, code, sourceMap) {
      if (error) {
        this.doneDeferred.reject(error);
        return;
      }

      this.doneDeferred.resolve({
        code: code, sourceMap: sourceMap
      });
    }
  }]);

  return WebpackContext;
}();

module.exports = {
  compileWebpackLoader: compileWebpackLoader,
  WebpackContext: WebpackContext
};