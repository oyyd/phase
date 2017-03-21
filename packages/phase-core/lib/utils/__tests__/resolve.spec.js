'use strict';

var path = require('path');

var _require = require('../resolve'),
    resolve = _require.resolve;

describe('resolve', function () {
  describe('resolve', function () {
    var folderPath = path.resolve(__dirname, './folder');

    it('should return the file path of the "mod" from "node_modules"', function () {
      var filepath = resolve('mod', folderPath);

      expect(filepath).toBe(path.resolve(folderPath, './node_modules/mod/index.js'));
    });

    it('should return the file path of the "file.js" from "folder"', function () {
      var filepath = resolve('./file', folderPath);

      expect(filepath).toBe(path.resolve(folderPath, './file.js'));
    });

    it('should get the process.cwd() as relative path by default', function () {
      var filepath = resolve('./package.json');

      expect(filepath).toBe(path.resolve(process.cwd(), './package.json'));
    });

    it('should return "null" if the file doesn\'t exist', function () {
      var filepath = resolve('./FILE_THAT_NOT_EXIST');

      expect(filepath).toBe(null);
    });
  });
});