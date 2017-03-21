'use strict';

var compileCoffee = require('coffee-loader');

var _require = require('phase-utils'),
    compileWebpackLoader = _require.compileWebpackLoader;

function compile(options, source) {
  var compileOptions = options.compileOptions,
      sourceMap = options.sourceMap,
      filename = options.filename,
      targetFilename = options.targetFilename;


  return compileWebpackLoader({
    compileFunc: compileCoffee,
    compileOptions: compileOptions || {},
    sourceMap: sourceMap,
    filename: filename,
    targetFilename: targetFilename
  }, source);
}

module.exports = {
  compile: compile
};