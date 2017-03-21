'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('../compile'),
    getOutputSourceFileInfos = _require.getOutputSourceFileInfos,
    compileFiles = _require.compileFiles,
    getTargetFilePath = _require.getTargetFilePath,
    appendTargetFilePath = _require.appendTargetFilePath,
    replaceExtToJS = _require.replaceExtToJS;

var defaultCompiledContent = 'var a = 10;';
var defaultTargetFilePath = '/home/abc.js';

function createFileInfo() {
  return {
    compiledContent: defaultCompiledContent,
    targetFilePath: defaultTargetFilePath
  };
}

var defaultCompileOutputCode = 'var a = 20';
var defaultOutputSourceMap = '{}';

function createMockLoader() {
  return jest.fn(function () {
    return (/* options, rawContent */{
        code: defaultCompileOutputCode,
        sourceMap: defaultOutputSourceMap
      }
    );
  });
}

function createGlobalOptions() {
  return {};
}

describe('compile', function () {
  describe('compileFiles', function () {
    var fileInfos = void 0;
    var mockLoader = void 0;
    var globalOptions = void 0;

    beforeEach(function () {
      var fileInfo = createFileInfo();
      fileInfos = [fileInfo];
      mockLoader = createMockLoader();
      globalOptions = createGlobalOptions();
    });

    it('should return compiled file infos with "code" and "sourceMap" properties', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var compiledFileInfos, info;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return compileFiles(mockLoader, globalOptions, fileInfos);

            case 2:
              compiledFileInfos = _context.sent;


              expect(Array.isArray(compiledFileInfos)).toBeTruthy();

              info = compiledFileInfos[0];


              expect(info.compiledContent).toBe(defaultCompiledContent);

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('should not re-compile file infos that exist', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var compiledFileInfos, info;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return compileFiles(mockLoader, globalOptions, [{
                targetFilePath: '/home/a.js'
              }]);

            case 2:
              compiledFileInfos = _context2.sent;


              expect(Array.isArray(compiledFileInfos)).toBeTruthy();

              info = compiledFileInfos[0];


              expect(info.compiledContent).toBe(defaultCompileOutputCode);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));
  });

  describe('getTargetFilePath', function () {
    it('should be replace "baseDir" to "outDir"', function () {
      var baseDir = '/home/a';
      var outDir = '/home/b';
      var filePath = '/home/a/b/10';

      expect(getTargetFilePath(baseDir, outDir, filePath)).toBe('/home/b/b/10');
    });
  });

  describe('appendTargetFilePath', function () {
    it('should return lists of objects with "targetFilePath" properties', function () {
      var baseDir = '/home/a';
      var outDir = '/home/b';

      var fileInfos = [{
        filePath: '/home/a/a.js'
      }, {
        filePath: '/home/a/b/b.js'
      }];

      var res = appendTargetFilePath(null, baseDir, outDir, fileInfos);

      expect(res[0].targetFilePath).toBe('/home/b/a.js');
      expect(res[1].targetFilePath).toBe('/home/b/b/b.js');
    });

    it('should replace the targetFilePath extension', function () {
      var replaceExt = replaceExtToJS;
      var baseDir = '/home/a';
      var outDir = '/home/b';

      var fileInfos = [{
        filePath: '/home/a/a.coffee'
      }, {
        filePath: '/home/a/b/b.coffee'
      }];

      var res = appendTargetFilePath(replaceExt, baseDir, outDir, fileInfos);

      expect(res[0].targetFilePath).toBe('/home/b/a.js');
      expect(res[1].targetFilePath).toBe('/home/b/b/b.js');
    });
  });

  describe('getOutputSourceFileInfos', function () {
    it('should take "compiledContent", "targetFilePath" as "content" and "path"', function () {
      var res = getOutputSourceFileInfos([{
        compiledContent: 'var a = 10',
        targetFilePath: '/home/abc.js'
      }]);

      expect(Array.isArray(res)).toBe(true);
      expect(res[0].path).toBe('/home/abc.js');
      expect(res[0].content).toBe('var a = 10');
    });
  });
});