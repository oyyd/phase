'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mockExtractFiles = jest.fn(function () {
  return Promise.resolve(['/home/a/a.js']);
});
var mockGetFilesInfo = jest.fn(function () {
  return Promise.resolve([{
    rawContent: 'a = 20',
    filePath: '/home/a/a.js'
  }]);
});
var mockOutputFiles = jest.fn(function () {
  return Promise.resolve([]);
});

jest.mock('../../utils/operations', function () {
  return {
    ensureDir: jest.fn()
  };
});

jest.mock('../../extract_files', function () {
  return {
    extractFiles: mockExtractFiles,
    getFilesInfo: mockGetFilesInfo,
    outputFiles: mockOutputFiles
  };
});

var _require = require('../compile'),
    compile = _require.compile,
    getDiff = _require.getDiff;

var defaultOutputCode = 'var a = 20';
var defaultOutputSourceMap = '{}';

function createMockLoader() {
  return jest.fn(function () {
    return (/* options, rawContent */{
        code: defaultOutputCode,
        sourceMap: defaultOutputSourceMap
      }
    );
  });
}

// function createGlobalOptions() {
//   return {}
// }

describe('compile', function () {
  describe('compile', function () {
    var userOptions = void 0;
    var mockLoader = void 0;

    beforeEach(function () {
      mockLoader = createMockLoader();

      userOptions = {
        baseDir: './abc',
        outDir: './defg',

        loader: mockLoader
      };
    });

    it('should "extractFiles" and "compile" and "outputFiles" and return the infos of "compiledFiles"', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var _ref2, res, options, outputFilesByPath;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return compile(userOptions);

            case 2:
              _ref2 = _context.sent;
              res = _ref2.compiledFiles;
              options = _ref2.options;
              outputFilesByPath = _ref2.outputFilesByPath;


              expect(typeof options === 'undefined' ? 'undefined' : _typeof(options)).toBe('object');
              expect(typeof outputFilesByPath === 'undefined' ? 'undefined' : _typeof(outputFilesByPath)).toBe('object');
              expect(Array.isArray(res)).toBe(true);

              res.forEach(function (info) {
                expect(info.rawContent).toBeTruthy();
                expect(info.filePath).toBeTruthy();
                expect(info.compiledContent).toBeTruthy();
                expect(info.sourceMap).toBeTruthy();
                expect(info.targetFilePath).toBeTruthy();
              });

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  describe('getDiff', function () {
    it('should', function () {
      var info1 = {
        '/home/a.js': {
          path: '/home/a.js',
          content: 'abc'
        },
        '/home/b.js': {
          path: '/home/b.js',
          content: 'abc'
        }
      };

      var info2 = {
        '/home/a.js': {
          path: '/home/a.js',
          content: 'd'
        },
        '/home/b.js': {
          path: '/home/b.js',
          content: 'abc'
        },
        '/home/c.js': {
          path: '/home/c.js',
          content: 'abc'
        }
      };

      var res = getDiff(info1, info2);

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(2);
      expect(res[0].content).toBe('d');
      expect(res[1].path).toBe('/home/c.js');
    });
  });
});