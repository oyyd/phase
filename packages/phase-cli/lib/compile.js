'use strict';

var compile = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return compileWithCtx(data);

          case 3:
            _context.next = 9;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context['catch'](0);

            // eslint-disable-next-line
            console.error(_context.t0);
            process.exit();

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function compile(_x) {
    return _ref.apply(this, arguments);
  };
}();

var handleMessage = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(task, data) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = task;
            _context2.next = _context2.t0 === 'start' ? 3 : 5;
            break;

          case 3:
            compile(data);
            return _context2.abrupt('break', 6);

          case 5:
            throw new Error('unexpected task: "' + task + '"');

          case 6:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function handleMessage(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('phase-core'),
    compileWithCtx = _require.compileWithCtx;

module.exports = {
  compile: compile,
  handleMessage: handleMessage
};