'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../index'),
    compile = _require.compile;

function createOptions() {
  return {
    filename: 'abc.coffee',
    targetFilename: 'abc.coffee',
    compileOptions: {},
    sourceMap: true
  };
}

describe('compile', function () {
  var options = void 0;

  beforeEach(function () {
    options = createOptions();
  });

  it('should compile coffee to es correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _ref2, code, sourceMap;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return compile(options, 'number = 42');

          case 2:
            _ref2 = _context.sent;
            code = _ref2.code;
            sourceMap = _ref2.sourceMap;


            expect(code).toBe('var number;\n\nnumber = 42;\n');
            expect(typeof sourceMap === 'undefined' ? 'undefined' : _typeof(sourceMap)).toBe('object');
            expect(sourceMap.file).toBe('abc.coffee');
            expect(sourceMap.version).toBe(3);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});