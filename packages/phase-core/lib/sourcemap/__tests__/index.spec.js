'use strict';

var _require = require('../index'),
    getSourceMapOutputFiles = _require.getSourceMapOutputFiles,
    appendSupport = _require.appendSupport;

describe('sourcemap', function () {
  describe('appendSupport', function () {
    it('should append map file path', function () {
      var code = 'var a = 10';
      var mapFilePath = '/home/a.js';

      expect(appendSupport(code, mapFilePath)).toBe('var a = 10\n//# sourceMappingURL=/home/a.js.map');
    });
  });

  describe('getSourceMapOutputFiles', function () {
    it('should get all output files from compiledFileInfos', function () {
      var compiledFileInfos = [{
        targetFilePath: '/home/abc/a.js',
        sourceMap: { version: 3 }
      }];

      var res = getSourceMapOutputFiles(compiledFileInfos);

      expect(Array.isArray(res)).toBe(true);
      var item = res[0];
      expect(item.content).toBe(JSON.stringify(compiledFileInfos[0].sourceMap));
      expect(item.path).toBe(compiledFileInfos[0].targetFilePath + '.map');
    });

    it('should not generate output files from infos without sourceMap', function () {
      var compiledFileInfos = [{
        targetFilePath: '/home/abc/a.js'
      }];

      var res = getSourceMapOutputFiles(compiledFileInfos);

      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBe(0);
    });
  });
});