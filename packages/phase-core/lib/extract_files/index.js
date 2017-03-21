'use strict';

var getFiles = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(absolutePath, filter) {
    var stats, files, contents, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, content, nextFiles;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return stat(absolutePath);

          case 2:
            stats = _context.sent;
            files = [];

            if (!stats.isDirectory()) {
              _context.next = 38;
              break;
            }

            _context.next = 7;
            return readdir(absolutePath);

          case 7:
            contents = _context.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 11;
            _iterator = contents[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 22;
              break;
            }

            content = _step.value;
            _context.next = 17;
            return getFiles(getAbsolutePath(absolutePath, content), filter);

          case 17:
            nextFiles = _context.sent;

            files = files.concat(nextFiles);

          case 19:
            _iteratorNormalCompletion = true;
            _context.next = 13;
            break;

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context['catch'](11);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 28:
            _context.prev = 28;
            _context.prev = 29;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 31:
            _context.prev = 31;

            if (!_didIteratorError) {
              _context.next = 34;
              break;
            }

            throw _iteratorError;

          case 34:
            return _context.finish(31);

          case 35:
            return _context.finish(28);

          case 36:
            _context.next = 43;
            break;

          case 38:
            if (!stats.isFile()) {
              _context.next = 42;
              break;
            }

            if (isValidFile(filter, absolutePath)) {
              files = files.concat([absolutePath]);
            }
            _context.next = 43;
            break;

          case 42:
            throw new Error('unexpected file: ' + absolutePath);

          case 43:
            return _context.abrupt('return', files);

          case 44:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[11, 24, 28, 36], [29,, 31, 35]]);
  }));

  return function getFiles(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var extractFiles = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(absolutePath) {
    var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
      return true;
    };
    var files;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getFiles(absolutePath, filter);

          case 2:
            files = _context2.sent;
            return _context2.abrupt('return', files);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function extractFiles(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

var getFilesInfo = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(targetFiles) {
    var rawFileInfos, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, targetFilePath, rawContent;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            rawFileInfos = [];
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 4;
            _iterator2 = targetFiles[Symbol.iterator]();

          case 6:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context3.next = 15;
              break;
            }

            targetFilePath = _step2.value;
            _context3.next = 10;
            return readFile(targetFilePath, { encoding: 'utf8' });

          case 10:
            rawContent = _context3.sent;


            rawFileInfos.push({
              rawContent: rawContent,
              filePath: targetFilePath
            });

          case 12:
            _iteratorNormalCompletion2 = true;
            _context3.next = 6;
            break;

          case 15:
            _context3.next = 21;
            break;

          case 17:
            _context3.prev = 17;
            _context3.t0 = _context3['catch'](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 21:
            _context3.prev = 21;
            _context3.prev = 22;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 24:
            _context3.prev = 24;

            if (!_didIteratorError2) {
              _context3.next = 27;
              break;
            }

            throw _iteratorError2;

          case 27:
            return _context3.finish(24);

          case 28:
            return _context3.finish(21);

          case 29:
            return _context3.abrupt('return', rawFileInfos);

          case 30:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[4, 17, 21, 29], [22,, 24, 28]]);
  }));

  return function getFilesInfo(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var outputFiles = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(fileInfos) {
    var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, fileInfo, content, path;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // TODO: validate
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _iteratorError3 = undefined;
            _context4.prev = 3;
            _iterator3 = fileInfos[Symbol.iterator]();

          case 5:
            if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
              _context4.next = 14;
              break;
            }

            fileInfo = _step3.value;
            content = fileInfo.content, path = fileInfo.path;


            labelMsg(chalk.green('WRITE'), path);
            _context4.next = 11;
            return outputFile(path, content);

          case 11:
            _iteratorNormalCompletion3 = true;
            _context4.next = 5;
            break;

          case 14:
            _context4.next = 20;
            break;

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4['catch'](3);
            _didIteratorError3 = true;
            _iteratorError3 = _context4.t0;

          case 20:
            _context4.prev = 20;
            _context4.prev = 21;

            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }

          case 23:
            _context4.prev = 23;

            if (!_didIteratorError3) {
              _context4.next = 26;
              break;
            }

            throw _iteratorError3;

          case 26:
            return _context4.finish(23);

          case 27:
            return _context4.finish(20);

          case 28:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[3, 16, 20, 28], [21,, 23, 27]]);
  }));

  return function outputFiles(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('path'),
    join = _require.join;

var _require2 = require('../utils/operations'),
    stat = _require2.stat,
    readdir = _require2.readdir,
    readFile = _require2.readFile,
    outputFile = _require2.outputFile;

var _require3 = require('../log'),
    chalk = _require3.chalk,
    labelMsg = _require3.labelMsg;

// TODO: check windows support


function getAbsolutePath(prefix, path) {
  return join(prefix, path);
}

function isValidFile(filter, path) {
  if (filter instanceof RegExp) {
    return filter.test(path);
  } else if (typeof filter === 'function') {
    return filter(path);
  }

  throw new Error('invalid filter: ' + filter);
}

module.exports = {
  extractFiles: extractFiles,
  getFilesInfo: getFilesInfo,
  outputFiles: outputFiles
};