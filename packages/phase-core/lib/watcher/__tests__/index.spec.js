'use strict';

var trigger = void 0;

jest.mock('../createWatcher', function () {
  return {
    createWatcher: jest.fn(function (_, listener) {
      trigger = listener;
    })
  };
});

var _require = require('../index'),
    fileUpdateStream = _require.fileUpdateStream;

describe('watcher', function () {
  describe('fileUpdateStream', function () {
    var filter = void 0;
    var dir = void 0;

    beforeEach(function () {
      filter = function filter() {
        return true;
      };
      dir = '/home';
    });

    it('should pass events that are "unlink" or "change" or "add"', function (done) {
      fileUpdateStream(filter, dir, function (event, file) {
        expect(event).toBe('change');
        expect(file).toBe('abc');
        done();
      });

      trigger('change', 'abc');
    });

    it('should filter uncessary events', function (done) {
      fileUpdateStream(filter, dir, function (event, file) {
        expect(event).toBe('change');
        expect(file).toBe('abc');
        done();
      });

      trigger('addDir', 'abc');
      trigger('removeDir', 'abc');
      trigger('other', 'abc');
      trigger('events', 'abc');
      trigger('change', 'abc');
    });

    it('should use "filter" function to filter paths', function (done) {
      var filterJSX = function filterJSX(path) {
        return (/jsx$/.test(path)
        );
      };
      fileUpdateStream(filterJSX, dir, function (event, file) {
        expect(event).toBe('change');
        expect(file).toBe('/a.jsx');
        done();
      });

      trigger('change', '/a.js');
      trigger('change', '/a.jsx');
    });
  });
});