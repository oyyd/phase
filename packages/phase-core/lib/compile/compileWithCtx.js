'use strict';

var compileWithLog = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            labelMsg(label.safe('BUILD'));
            return _context.abrupt('return', compile.apply(undefined, _args));

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function compileWithLog() {
    return _ref.apply(this, arguments);
  };
}();

var addCompiledFileInfos = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(compiledFiles, filePaths) {
    var newFilesInfo;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getFilesInfo(filePaths);

          case 2:
            newFilesInfo = _context2.sent;
            return _context2.abrupt('return', compiledFiles.concat(newFilesInfo));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function addCompiledFileInfos(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

// TODO: allow no-cache


var changeCompiledFileInfos = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(compiledFiles, filePaths) {
    var changedFilesInfo;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getFilesInfo(filePaths);

          case 2:
            changedFilesInfo = _context3.sent;
            return _context3.abrupt('return', removeFileInfos(compiledFiles, filePaths).concat(changedFilesInfo));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function changeCompiledFileInfos(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var removeCompiledFileInfos = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(compiledFiles, filePaths) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', removeFileInfos(compiledFiles, filePaths));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function removeCompiledFileInfos(_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}();

// NOTE: mutate object
/* eslint-disable no-param-reassign */


var consume = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(ctx, buffer, next) {
    var bufferBackup, compiledFiles, operations, _ref6, nextOptions, nextCompiledFiles;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            bufferBackup = createBufferBackup(buffer);

            // clean status

            buffer['@@status'] = 'CONSUMING';

            compiledFiles = ctx.compiledFiles;
            operations = getOperationsAndClean(buffer, compiledFiles);

            // consume operations

            _context5.next = 6;
            return addCompiledFileInfos(compiledFiles, operations.add);

          case 6:
            compiledFiles = _context5.sent;
            _context5.next = 9;
            return changeCompiledFileInfos(compiledFiles, operations.change);

          case 9:
            compiledFiles = _context5.sent;
            _context5.next = 12;
            return removeCompiledFileInfos(compiledFiles, operations.unlink);

          case 12:
            compiledFiles = _context5.sent;
            _context5.prev = 13;
            _context5.next = 16;
            return compileWithLog(null, ctx);

          case 16:
            _ref6 = _context5.sent;
            nextOptions = _ref6.options;
            nextCompiledFiles = _ref6.compiledFiles;


            // update context
            ctx.options = nextOptions;
            ctx.compiledFiles = nextCompiledFiles;

            // next

            if (hasOperations(buffer)) {
              _context5.next = 25;
              break;
            }

            buffer['@@status'] = 'READY';

            if (typeof next === 'function') {
              next();
            }

            return _context5.abrupt('return');

          case 25:

            // consume immediately
            consume(ctx, buffer, next);
            _context5.next = 33;
            break;

          case 28:
            _context5.prev = 28;
            _context5.t0 = _context5['catch'](13);

            // TODO: prettify
            console.error(_context5.t0); // eslint-disable-line

            // restore buffer when compiling fails
            buffer['@@status'] = 'READY';
            restoreBuffer(buffer, bufferBackup);

          case 33:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[13, 28]]);
  }));

  return function consume(_x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
/* eslint-enable no-param-reassign */

// cache and make diff


var compileWithCtx = function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(options) {
    var ctx, _ctx$options, exec, absoluteBaseDir, filter, watch, statusBuffer;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return compileWithLog(options);

          case 2:
            ctx = _context6.sent;
            _ctx$options = ctx.options, exec = _ctx$options.exec, absoluteBaseDir = _ctx$options.absoluteBaseDir, filter = _ctx$options.filter, watch = _ctx$options.watch;


            restart(exec);

            if (watch) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt('return');

          case 7:
            statusBuffer = createFileStatusBuffer();


            fileUpdateStream(filter, absoluteBaseDir, function (event, filePath) {
              // mutate statusBuffer
              updateBuffer(statusBuffer, event, filePath);

              tryToConsume(statusBuffer, function () {
                return consume(ctx, statusBuffer, function () {
                  restart(exec);
                });
              });
            });

          case 9:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, this);
  }));

  return function compileWithCtx(_x11) {
    return _ref7.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('./compile'),
    compile = _require.compile;

var _require2 = require('../watcher'),
    fileUpdateStream = _require2.fileUpdateStream;

var _require3 = require('../extract_files'),
    getFilesInfo = _require3.getFilesInfo;

var _require4 = require('../start'),
    startChild = _require4.startChild,
    stopChild = _require4.stopChild;

var _require5 = require('../log'),
    label = _require5.label,
    labelMsg = _require5.labelMsg;

// ms


var DEFAULT_WAIT_TIME = 200;

var child = null;

function restart(exec) {
  if (!exec) {
    return;
  }

  if (child) {
    stopChild(child);
  }

  labelMsg(label.safe('EXEC'), exec);
  child = startChild(exec, function () {
    labelMsg(label.highlight('STOP'), exec);
    child = null;
  });
}

function getFileInfoIndex(compiledFiles, filePath) {
  var index = null;

  for (var i = 0; i < compiledFiles.length; i += 1) {
    var info = compiledFiles[i];

    if (info.filePath === filePath) {
      index = i;
      break;
    }
  }

  return index;
}

function removeFileInfo(compiledFiles, filePath) {
  var index = getFileInfoIndex(compiledFiles, filePath);

  if (index === null) {
    throw new Error('failed to find changed file: ' + filePath);
  }

  return compiledFiles.slice(0, index).concat(compiledFiles.slice(index + 1));
}

function removeFileInfos(compiledFiles, filePaths) {
  var files = compiledFiles;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = filePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var filePath = _step.value;

      files = removeFileInfo(files, filePath);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return files;
}

function createFileStatusBuffer() {
  return {
    // 'READY', 'WAIT', 'CONSUMING'
    '@@status': 'READY',
    '@@timeout': null
  };
}

function getOperations(buffer) {
  return Object.keys(buffer).filter(function (propName) {
    return !/^@@/.test(propName);
  });
}

function hasOperations(buffer) {
  return getOperations(buffer).length > 0;
}

function getOperationsAndClean(buffer) {
  var operations = {
    add: [],
    unlink: [],
    change: []
  };

  // get all operations
  getOperations(buffer).forEach(function (filePath) {
    var event = buffer[filePath];

    operations[event].push(filePath);

    delete buffer[filePath];
  });

  return operations;
}

function tryToConsume(buffer, next) {
  var waitTime = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_WAIT_TIME;

  var status = buffer['@@status'];

  if (status === 'READY') {
    // enter wait
    buffer['@@status'] = 'WAIT';

    buffer['@@timeout'] = setTimeout(function () {
      next();
    }, waitTime);
  } else if (status === 'WAIT') {
    // wait again
    clearTimeout(buffer['@@timeout']);

    buffer['@@timeout'] = setTimeout(function () {
      next();
    }, waitTime);
  }

  // CONSUMING do nothing
}

function updateBuffer(buffer, event, filePath) {
  if (!Object.hasOwnProperty.call(buffer, filePath)) {
    buffer[filePath] = event;
    return;
  }

  var status = buffer[filePath];

  if (status === 'add' && event === 'unlink') {
    delete buffer[filePath];
    return;
  }

  if (status === 'unlink' && event === 'add') {
    buffer[filePath] = 'change';
    return;
  }

  if (status === 'change' && event === 'unlink') {
    buffer[filePath] = 'unlink';
  }

  // do nothing
}

function createBufferBackup(buffer) {
  var backup = Object.assign({}, buffer);

  delete backup['@@status'];
  delete backup['@@timeout'];

  return backup;
}

function restoreBuffer(buffer, backup) {
  Object.assign(buffer, backup);
}

module.exports = {
  compileWithCtx: compileWithCtx,
  addCompiledFileInfos: addCompiledFileInfos,
  changeCompiledFileInfos: changeCompiledFileInfos,
  removeCompiledFileInfos: removeCompiledFileInfos,
  createFileStatusBuffer: createFileStatusBuffer,
  updateBuffer: updateBuffer,
  getOperations: getOperations,
  hasOperations: hasOperations,
  getOperationsAndClean: getOperationsAndClean,
  tryToConsume: tryToConsume,
  createBufferBackup: createBufferBackup,
  restoreBuffer: restoreBuffer
};