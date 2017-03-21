'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('../'),
    getFilesInfo = _require.getFilesInfo,
    extractFiles = _require.extractFiles;

var dir = path.resolve(__dirname, 'test_folders');
var relative = function relative(file) {
  return path.resolve(__dirname, file);
};

function hasExpectedFiles(expected, files) {
  expected.forEach(function (file) {
    return expect(files.some(function (getFile) {
      return getFile.indexOf(file) > -1;
    }));
  });
}

describe('extract_files', function () {
  describe('extractFiles', function () {
    it('should get all files in the target folders', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var files;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return extractFiles(dir);

            case 2:
              files = _context.sent;


              expect(Array.isArray(files)).toBe(true);
              expect(files.length).toBe(4);
              hasExpectedFiles(['test_folders/file.es', 'test_folders/folder/file.es', 'test_folders/folder/file.js', 'test_folders/index.js'], files);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('should filter files by functions', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var filter, files;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              filter = function filter(file) {
                return (/\.js$/.test(file)
                );
              };

              _context2.next = 3;
              return extractFiles(dir, filter);

            case 3:
              files = _context2.sent;


              hasExpectedFiles(['test_folders/folder/file.js', 'test_folders/index.js'], files);

            case 5:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('should filter files by regexp', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var filter, files;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              filter = /\.es$/;
              _context3.next = 3;
              return extractFiles(dir, filter);

            case 3:
              files = _context3.sent;


              hasExpectedFiles(['test_folders/file.es', 'test_folders/folder/file.es'], files);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));
  });

  describe('getFilesInfo', function () {
    var files = [relative('./test_folders/index.js'), relative('./test_folders/folder/file.js')];

    it('should return a list of objects with properties of "rawContent"', _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var res;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getFilesInfo(files);

            case 2:
              res = _context4.sent;


              expect(Array.isArray(res)).toBeTruthy();
              expect(res[0]).toBeTruthy();
              expect(res[0].rawContent).toBe('var a = 10;\n');
              expect(res[1]).toBeTruthy();
              expect(res[1].rawContent).toBe('var b = 10;\n');

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });
});