'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../'),
    compileWebpackLoader = _require.compileWebpackLoader,
    WebpackContext = _require.WebpackContext;

var properties = ['options', 'sourceMap', 'currentRequest', 'remainingRequest', 'query', 'callback', 'doneDeferred', 'done'];

describe('webpack_mock', function () {
  describe('WebpackContext', function () {
    var instance = void 0;

    beforeEach(function () {
      instance = new WebpackContext({}, true, {}, 'abc.js', 'abc.js');
    });

    it('should create an instance', function () {
      expect(instance instanceof WebpackContext).toBeTruthy();
    });

    it('should have "' + properties.join('", "'), function () {
      properties.forEach(function (prop) {
        expect(instance[prop] !== undefined).toBeTruthy();
      });
    });

    it('should have a remainingRequest string starting with "!"', function () {
      expect(instance.remainingRequest).toBe('abc.js');
    });
  });

  describe('compileWebpackLoader', function () {
    function createOptions(compileFunc) {
      return {
        compileFunc: compileFunc,
        compileOptions: {},
        sourceMap: false,
        filename: 'a.js',
        targetFilename: 'a.js'
      };
    }

    var defaultOutputCode = 'var a = 10';
    var defaultOutputSourceMap = '{}';
    var mockCompileFunc = void 0;
    var options = void 0;

    beforeEach(function () {
      mockCompileFunc = jest.fn(function mock() {
        this.callback(null, defaultOutputCode, defaultOutputSourceMap);
      });

      options = createOptions(mockCompileFunc);
    });

    it('should return an object with "code" and "sourceMap" properties', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var _ref2, code, sourceMap;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return compileWebpackLoader(options, 'code');

            case 2:
              _ref2 = _context.sent;
              code = _ref2.code;
              sourceMap = _ref2.sourceMap;


              expect(code).toBe(defaultOutputCode);
              expect(sourceMap).toBe(defaultOutputSourceMap);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('should throw errors correctly', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var mock, opts;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // eslint-disable-next-line
              mock = jest.fn(function mock() {
                throw new Error('invalid');
              });
              opts = createOptions(mock);
              _context2.prev = 2;
              _context2.next = 5;
              return compileWebpackLoader(opts, '');

            case 5:
              _context2.next = 11;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2['catch'](2);

              expect(_context2.t0.message).toBe('invalid');
              return _context2.abrupt('return');

            case 11:
              throw new Error('expect error');

            case 12:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[2, 7]]);
    })));

    it('should throw if the first argument of a callback is truthy', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var mock, opts;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              // eslint-disable-next-line
              mock = jest.fn(function mock() {
                var err = new Error('invalid');
                this.callback(err);
              });
              opts = createOptions(mock);
              _context3.prev = 2;
              _context3.next = 5;
              return compileWebpackLoader(opts, '');

            case 5:
              _context3.next = 11;
              break;

            case 7:
              _context3.prev = 7;
              _context3.t0 = _context3['catch'](2);

              expect(_context3.t0.message).toBe('invalid');
              return _context3.abrupt('return');

            case 11:
              throw new Error('expect error');

            case 12:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[2, 7]]);
    })));

    it('should wait for the response when this.async called', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var mock, opts, _ref6, code, sourceMap;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // eslint-disable-next-line
              mock = jest.fn(function mock() {
                var callback = this.async();
                setTimeout(function () {
                  callback(null, 'a', 'b');
                });
              });
              opts = createOptions(mock);
              _context4.next = 4;
              return compileWebpackLoader(opts, '');

            case 4:
              _ref6 = _context4.sent;
              code = _ref6.code;
              sourceMap = _ref6.sourceMap;

              expect(code).toBe('a');
              expect(sourceMap).toBe('b');

            case 9:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });
});