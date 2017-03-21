'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../index'),
    createFilterFromString = _require.createFilterFromString,
    promisify = _require.promisify;

describe('utils', function () {
  describe('createFilterFromString', function () {
    var filter = createFilterFromString('*.coffee');

    expect(typeof filter === 'undefined' ? 'undefined' : _typeof(filter)).toBe('function');
  });

  describe('promisify', function () {
    it('should receive a callbak function and return a promise', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var func, res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              func = function func(data, callback) {
                return setTimeout(function () {
                  return callback(null, data);
                });
              };

              _context.next = 3;
              return promisify(func, 10);

            case 3:
              res = _context.sent;


              expect(res).toBe(10);

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('should throw when ecounter an error as the first callback argument', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var func;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              func = function func(data, callback) {
                return setTimeout(function () {
                  return callback(new Error('invalid'), data);
                });
              };

              _context2.prev = 1;
              _context2.next = 4;
              return promisify(func, 10);

            case 4:
              _context2.next = 10;
              break;

            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2['catch'](1);

              expect(_context2.t0.message).toBe('invalid');
              return _context2.abrupt('return');

            case 10:
              throw new Error('expect receive error');

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined, [[1, 6]]);
    })));
  });
});