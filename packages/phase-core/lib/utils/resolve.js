'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// from: https://github.com/babel/babel/blob/master/packages/babel-core/src/helpers/resolve.js
var path = require('path');
var Module = require('module');

var relativeModules = {};

function resolve(loc) {
  var relative = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.cwd();

  if ((typeof Module === 'undefined' ? 'undefined' : _typeof(Module)) === 'object') return null;

  var relativeMod = relativeModules[relative];

  if (!relativeMod) {
    relativeMod = new Module();

    var filename = path.join(relative, '.phaserc');
    relativeMod.id = filename;
    relativeMod.filename = filename;

    relativeMod.paths = Module._nodeModulePaths(relative);
    relativeModules[relative] = relativeMod;
  }

  try {
    return Module._resolveFilename(loc, relativeMod);
  } catch (err) {
    return null;
  }
}

module.exports = {
  resolve: resolve
};