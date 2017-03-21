'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var createOutDir = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var dirName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.phase';
    var outDir;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outDir = path.resolve(process.cwd(), dirName);
            _context.next = 3;
            return ensureDir(outDir);

          case 3:
            return _context.abrupt('return', outDir);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createOutDir() {
    return _ref.apply(this, arguments);
  };
}();

// TODO: allow no-cache
// Compile all given files into target source codes
// and return fileInfos.


var compileFiles = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(loader, globalOptions, fileInfos) {
    var shouldDoSouceMap, compileOptions, compiledFileInfos, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fileInfo, rawContent, filePath, options, _ref3, code, sourceMap, compiledFileInfo;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            shouldDoSouceMap = globalOptions.sourceMap, compileOptions = globalOptions.compileOptions;
            compiledFileInfos = [];
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 5;
            _iterator = fileInfos[Symbol.iterator]();

          case 7:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 25;
              break;
            }

            fileInfo = _step.value;

            if (fileInfo.compiledContent) {
              _context2.next = 21;
              break;
            }

            rawContent = fileInfo.rawContent, filePath = fileInfo.filePath;
            options = {
              filename: filePath,
              // TODO: somewhere to specify target file paths
              targetFilename: filePath,
              compileOptions: compileOptions,
              sourceMap: shouldDoSouceMap
            };
            _context2.next = 14;
            return loader(options, rawContent);

          case 14:
            _ref3 = _context2.sent;
            code = _ref3.code;
            sourceMap = _ref3.sourceMap;


            // append "compiledContent" and "sourceMap"
            compiledFileInfo = Object.assign({}, fileInfo, {
              compiledContent: code,
              sourceMap: sourceMap
            });


            compiledFileInfos.push(Object.assign({}, fileInfo, compiledFileInfo));
            _context2.next = 22;
            break;

          case 21:
            compiledFileInfos.push(fileInfo);

          case 22:
            _iteratorNormalCompletion = true;
            _context2.next = 7;
            break;

          case 25:
            _context2.next = 31;
            break;

          case 27:
            _context2.prev = 27;
            _context2.t0 = _context2['catch'](5);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 31:
            _context2.prev = 31;
            _context2.prev = 32;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 34:
            _context2.prev = 34;

            if (!_didIteratorError) {
              _context2.next = 37;
              break;
            }

            throw _iteratorError;

          case 37:
            return _context2.finish(34);

          case 38:
            return _context2.finish(31);

          case 39:
            return _context2.abrupt('return', compiledFileInfos);

          case 40:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[5, 27, 31, 39], [32,, 34, 38]]);
  }));

  return function compileFiles(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var createOptions = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(opts) {
    var options, loader, loaderName, dir, replaceExt, baseDir, outDir;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            options = Object.assign({}, DEFAULT_OPTIONS, opts);
            loader = options.loader, loaderName = options.loaderName, dir = options.outDir, replaceExt = options.replaceExt, baseDir = options.baseDir;

            // validate

            if (!(!loader && !loaderName)) {
              _context3.next = 4;
              break;
            }

            throw new Error('expect "loaderName"');

          case 4:
            if (!(replaceExt && typeof replaceExt !== 'function')) {
              _context3.next = 6;
              break;
            }

            throw new Error('expect "replaceExt" to be a function');

          case 6:
            _context3.next = 8;
            return createOutDir(dir || undefined);

          case 8:
            outDir = _context3.sent;


            options.filter = typeof options.filter === 'string' ? createFilterFromString(options.filter) : options.filter;
            options.outDir = outDir;
            options.absoluteBaseDir = format({ dir: path.resolve(process.cwd(), baseDir) });
            options.absoluteOutDir = format({ dir: path.resolve(process.cwd(), outDir) });

            if (!loader) {
              options.loader = getLoader(loaderName);
            }

            return _context3.abrupt('return', options);

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function createOptions(_x5) {
    return _ref4.apply(this, arguments);
  };
}();

// TODO: how to deprecate a building process
// keep all states here
var compile = function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(opts) {
    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options, filter, loader, sourceMap, replaceExt, absoluteBaseDir, absoluteOutDir, files, basicFileInfos, rawFileInfos, compiledFiles, outputFilesByPath, filesToOuput;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.t0 = ctx.options;

            if (_context4.t0) {
              _context4.next = 5;
              break;
            }

            _context4.next = 4;
            return createOptions(opts);

          case 4:
            _context4.t0 = _context4.sent;

          case 5:
            options = _context4.t0;
            filter = options.filter, loader = options.loader, sourceMap = options.sourceMap, replaceExt = options.replaceExt, absoluteBaseDir = options.absoluteBaseDir, absoluteOutDir = options.absoluteOutDir;
            _context4.next = 9;
            return extractFiles(absoluteBaseDir, filter);

          case 9:
            files = _context4.sent;
            _context4.next = 12;
            return getFilesInfo(files);

          case 12:
            basicFileInfos = _context4.sent;


            // repeat
            rawFileInfos = appendTargetFilePath(replaceExt, absoluteBaseDir, absoluteOutDir, basicFileInfos);
            _context4.next = 16;
            return compileFiles(loader, options, rawFileInfos);

          case 16:
            compiledFiles = _context4.sent;
            outputFilesByPath = getOutPutFiles(sourceMap, compiledFiles);
            filesToOuput = getDiff(ctx.outputFilesByPath, outputFilesByPath);
            _context4.next = 21;
            return outputFiles(filesToOuput);

          case 21:
            return _context4.abrupt('return', {
              options: options,
              compiledFiles: compiledFiles,
              outputFilesByPath: outputFilesByPath
            });

          case 22:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function compile(_x7) {
    return _ref5.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var path = require('path');

var _require = require('../utils/operations'),
    ensureDir = _require.ensureDir;

var _require2 = require('../extract_files'),
    outputFiles = _require2.outputFiles,
    extractFiles = _require2.extractFiles,
    getFilesInfo = _require2.getFilesInfo;

var _require3 = require('../utils/resolve'),
    resolve = _require3.resolve;

var _require4 = require('../sourcemap'),
    getSourceMapOutputFiles = _require4.getSourceMapOutputFiles,
    appendSupport = _require4.appendSupport;

var _require5 = require('../utils'),
    createFilterFromString = _require5.createFilterFromString;

var join = path.join,
    dirname = path.dirname,
    extname = path.extname,
    basename = path.basename,
    format = path.format;

/**
 * options {
 *   compileFunc,
 *   compileOptions,
 *   sourceMap,
 *   filename,
 *   targetFilename,
 * }
 */

function replaceExtToJS(file) {
  return join(dirname(file), basename(file, extname(file)) + '.js');
}

function getExtJS(filePath) {
  return extname(filePath) === '.js';
}

var DEFAULT_OPTIONS = {
  sourceMap: true,
  // TODO:
  replaceExt: replaceExtToJS,
  filter: getExtJS
};

function getTargetFilePath(baseDir, outDir, filePath) {
  return '' + outDir + filePath.slice(baseDir.length);
}

function appendTargetFilePath(replaceExt, baseDir, outDir, fileInfos) {
  return fileInfos.map(function (fileInfo) {
    if (fileInfo.targetFilePath) {
      return fileInfo;
    }

    var targetFilePath = getTargetFilePath(baseDir, outDir, fileInfo.filePath);

    if (replaceExt) {
      targetFilePath = replaceExt(targetFilePath);
    }

    return Object.assign({
      targetFilePath: targetFilePath
    }, fileInfo);
  });
}

function getOutputSourceFileInfos(compiledFiles) {
  return compiledFiles.map(function (item) {
    return {
      content: item.compiledContent,
      path: item.targetFilePath
    };
  });
}

function getOutPutFiles(shouldAppendSourceMap, compiledFiles) {
  var filesToOuput = getOutputSourceFileInfos(compiledFiles);

  if (shouldAppendSourceMap) {
    filesToOuput = filesToOuput.map(function (fileToOuput) {
      return Object.assign({}, fileToOuput, {
        content: appendSupport(fileToOuput.content, fileToOuput.path)
      });
    });

    var sourceMapFiles = getSourceMapOutputFiles(compiledFiles);

    filesToOuput = filesToOuput.concat(sourceMapFiles);
  }

  // return object with properties of file paths
  var outputFilesByPath = {};

  filesToOuput.forEach(function (file) {
    var filePath = file.path;

    outputFilesByPath[filePath] = file;
  });

  return outputFilesByPath;
}

function getLoader(loaderName) {
  var loaderFilePath = resolve(loaderName);

  if (!loaderFilePath) {
    throw new Error('failed to get "' + loaderName + '"');
  }

  // eslint-disable-next-line
  var loader = require(loaderFilePath).compile;

  if (typeof loader !== 'function') {
    throw new Error('expect "compile" property of function type from "' + loaderName + '"\n' + ('but got ' + (typeof loader === 'undefined' ? 'undefined' : _typeof(loader))));
  }

  return loader;
}

function getDiff() {
  var lastFiles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var files = arguments[1];

  var filesToOuput = [];

  Object.keys(files).forEach(function (filePath) {
    var fileContent = files[filePath].content;
    var originalFileContent = lastFiles[filePath] ? lastFiles[filePath].content : null;

    if (fileContent !== originalFileContent) {
      filesToOuput.push(files[filePath]);
    }
  });

  return filesToOuput;
}

module.exports = {
  getOutputSourceFileInfos: getOutputSourceFileInfos,
  compileFiles: compileFiles,
  getTargetFilePath: getTargetFilePath,
  appendTargetFilePath: appendTargetFilePath,
  createOptions: createOptions,
  replaceExtToJS: replaceExtToJS,
  getDiff: getDiff,
  compile: compile
};