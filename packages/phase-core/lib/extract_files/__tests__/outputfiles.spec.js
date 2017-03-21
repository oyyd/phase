'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mockOutputFile = jest.fn();

jest.mock('../../utils/operations', function () {
  return {
    readdir: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    outputFile: mockOutputFile,
    emptyDir: jest.fn()
  };
});

var _require = require('../'),
    outputFiles = _require.outputFiles;

var defaultCompiledContent = 'var a = 10;';
var defaultTargetFilePath = '/home/abc';

function createFileInfo() {
  return {
    content: defaultCompiledContent,
    path: defaultTargetFilePath
  };
}

describe('outputFiles', function () {
  var fileInfos = void 0;

  beforeEach(function () {
    fileInfos = [createFileInfo()];
  });

  it('should write "content" to "path" from options', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return outputFiles(fileInfos);

          case 2:

            expect(mockOutputFile.mock.calls[0][0]).toBe(defaultTargetFilePath);
            expect(mockOutputFile.mock.calls[0][1]).toBe(defaultCompiledContent);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});