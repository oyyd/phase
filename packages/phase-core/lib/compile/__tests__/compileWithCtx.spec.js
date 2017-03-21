'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

jest.mock('../../extract_files', function () {
  return {
    getFilesInfo: jest.fn(function (filePaths) {
      return filePaths.map(function (filePath) {
        return {
          filePath: filePath,
          rawContent: 'NEW_CONTENT'
        };
      });
    })
  };
});

var _require = require('../compileWithCtx'),
    addCompiledFileInfos = _require.addCompiledFileInfos,
    changeCompiledFileInfos = _require.changeCompiledFileInfos,
    removeCompiledFileInfos = _require.removeCompiledFileInfos,
    createFileStatusBuffer = _require.createFileStatusBuffer,
    updateBuffer = _require.updateBuffer,
    getOperations = _require.getOperations,
    hasOperations = _require.hasOperations,
    tryToConsume = _require.tryToConsume,
    getOperationsAndClean = _require.getOperationsAndClean,
    createBufferBackup = _require.createBufferBackup,
    restoreBuffer = _require.restoreBuffer;

function createFileInfos() {
  return [{
    filePath: '/home/a'
  }, {
    filePath: '/home/b'
  }];
}

describe('compileWithCtx', function () {
  var compiledFileInfos = void 0;

  beforeEach(function () {
    compiledFileInfos = createFileInfos();
  });

  describe('addCompiledFileInfos', function () {
    it('should add file infos', _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var infos;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return addCompiledFileInfos(compiledFileInfos, ['/home/c', '/home/d']);

            case 2:
              infos = _context.sent;


              expect(Array.isArray(infos)).toBe(true);
              expect(infos.length).toBe(4);
              expect(infos[0].filePath).toBe('/home/a');
              expect(infos[1].filePath).toBe('/home/b');
              expect(infos[2].filePath).toBe('/home/c');
              expect(infos[3].filePath).toBe('/home/d');

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  describe('changeCompiledFileInfos', function () {
    it('should replace the file info with same filePath', _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
      var fileInfos, aInfo, bInfo, cInfo, infos;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              fileInfos = [{
                filePath: '/home/a',
                rawContent: 'a'
              }, {
                filePath: '/home/b',
                rawContent: 'b'
              }, {
                filePath: '/home/c',
                rawContent: 'c'
              }];
              aInfo = fileInfos[0];
              bInfo = fileInfos[1];
              cInfo = fileInfos[2];
              _context2.next = 6;
              return changeCompiledFileInfos(fileInfos, ['/home/b', '/home/c']);

            case 6:
              infos = _context2.sent;


              expect(Array.isArray(infos)).toBe(true);
              expect(infos.length).toBe(3);
              expect(infos[0].filePath).toBe('/home/a');
              expect(infos[1].filePath).toBe('/home/b');
              expect(infos[2].filePath).toBe('/home/c');
              expect(aInfo !== infos[0]).toBe(false);
              expect(bInfo !== infos[1]).toBe(true);
              expect(cInfo !== infos[2]).toBe(true);

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));
  });

  describe('removeCompiledFileInfos', function () {
    it('should remove the target file info', _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var infos;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return removeCompiledFileInfos(compiledFileInfos, ['/home/b', '/home/a']);

            case 2:
              infos = _context3.sent;


              expect(Array.isArray(infos)).toBe(true);
              expect(infos.length).toBe(0);

            case 5:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));
  });

  describe('FileStatusBuffer', function () {
    var buffer = void 0;

    beforeEach(function () {
      buffer = createFileStatusBuffer();
    });

    describe('updateBuffer', function () {
      it('should add an "add" operation to the file', function () {
        updateBuffer(buffer, 'add', '/home/a.js');

        expect(typeof buffer === 'undefined' ? 'undefined' : _typeof(buffer)).toBe('object');
        expect(buffer['/home/a.js']).toBe('add');
      });

      it('should clear write "add" operations encountering an "unlink"', function () {
        updateBuffer(buffer, 'add', '/home/a.js');

        expect(typeof buffer === 'undefined' ? 'undefined' : _typeof(buffer)).toBe('object');
        expect(buffer['/home/a.js']).toBe('add');

        updateBuffer(buffer, 'add', '/home/a.js');
        expect(buffer['/home/a.js']).toBe('add');

        updateBuffer(buffer, 'change', '/home/a.js');
        expect(buffer['/home/a.js']).toBe('add');

        updateBuffer(buffer, 'unlink', '/home/a.js');
        expect(buffer['/home/a.js']).toBeFalsy();
      });

      it('should overwrite "unlink" with "change" when encountering an "add"', function () {
        updateBuffer(buffer, 'unlink', '/home/a.js');

        expect(typeof buffer === 'undefined' ? 'undefined' : _typeof(buffer)).toBe('object');
        expect(buffer['/home/a.js']).toBe('unlink');

        updateBuffer(buffer, 'add', '/home/a.js');
        expect(buffer['/home/a.js']).toBe('change');
      });

      it('should overwrite "change" with "unlink" when encountering an "unlink"', function () {
        updateBuffer(buffer, 'change', '/home/a.js');

        expect(typeof buffer === 'undefined' ? 'undefined' : _typeof(buffer)).toBe('object');
        expect(buffer['/home/a.js']).toBe('change');

        updateBuffer(buffer, 'unlink', '/home/a.js');
        expect(buffer['/home/a.js']).toBe('unlink');
      });
    });

    describe('createFileStatusBuffer', function () {
      it('should have "@@status" and "@@timeout" properties', function () {
        expect(Object.hasOwnProperty.call(buffer, '@@status')).toBe(true);
        expect(Object.hasOwnProperty.call(buffer, '@@timeout')).toBe(true);
      });
    });

    describe('getOperations', function () {
      it('should get all operations', function () {
        buffer['/home/a.js'] = 'add';
        buffer['/home/b.js'] = 'unlink';

        var res = getOperations(buffer);

        expect(res.length).toBe(2);
      });
    });

    describe('hasOperations', function () {
      it('should have operations', function () {
        buffer['/home/a.js'] = 'add';
        buffer['/home/b.js'] = 'unlink';

        expect(hasOperations(buffer)).toBe(true);
      });

      it('should have no operations', function () {
        expect(hasOperations(buffer)).toBe(false);
      });
    });

    describe('getOperationsAndClean', function () {
      it('should get all operations and clean object pathes', function () {
        buffer['/home/a.js'] = 'add';
        buffer['/home/b.js'] = 'unlink';

        var operations = getOperationsAndClean(buffer);

        expect(Object.keys(operations)).toEqual(['add', 'unlink', 'change']);
        expect(hasOperations(buffer)).toBe(false);
      });
    });

    describe('tryToConsume', function () {
      function wait(next) {
        setTimeout(next, 10);
      }

      var next = void 0;

      beforeEach(function () {
        next = jest.fn();
      });

      it('should do nothing if the status is neither "READY" nor "WAIT"', function (done) {
        buffer['@@status'] = 'CONSUMING';

        tryToConsume(buffer, next, 0);

        wait(function () {
          expect(next.mock.calls.length).toBe(0);
          done();
        });
      });

      it('should begin to wait when the status is "READY"', function (done) {
        buffer['@@status'] = 'READY';

        tryToConsume(buffer, next, 0);

        wait(function () {
          expect(buffer['@@timeout']).toBeTruthy();
          expect(next.mock.calls.length).toBe(1);
          done();
        });
      });

      it('should restart the timeout if the status is "WAIT"', function (done) {
        buffer['@@status'] = 'WAIT';
        buffer['@@timeout'] = 1;

        tryToConsume(buffer, next, 0);

        wait(function () {
          expect(buffer['@@timeout']).toBeTruthy();
          expect(buffer['@@timeout']).not.toBe(1);
          expect(next.mock.calls.length).toBe(1);
          done();
        });
      });
    });

    describe('BufferBackup', function () {
      it('should restore all paths', function () {
        buffer['@@status'] = 'ABC';
        buffer['/home/a.js'] = 'add';
        buffer['/home/b.js'] = 'unlink';

        var backup = createBufferBackup(buffer);

        expect(backup['/home/a.js']).toBe('add');
        expect(backup['/home/b.js']).toBe('unlink');

        buffer['@@status'] = 'DEF';
        delete buffer['/home/a.js'];
        delete buffer['/home/b.js'];

        restoreBuffer(buffer, backup);

        expect(buffer['@@status']).toBe('DEF');
        expect(buffer['/home/a.js']).toBe('add');
        expect(buffer['/home/b.js']).toBe('unlink');
      });
    });
  });
});