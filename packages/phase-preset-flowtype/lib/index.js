'use strict';

var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require('babel-core'),
    transform = _require2.transform;

var packageModules = function packageModules(name) {
  return resolve(__dirname, '../node_modules/', name);
};

function compile(options, source) {
  var compileOptions = options.compileOptions,
      sourceMap = options.sourceMap,
      filename = options.filename,
      targetFilename = options.targetFilename;

  var _transform = transform(source, {
    moduleRoot: __dirname,
    sourceRoot: __dirname,
    babelrc: false,
    filename: filename,
    sourceMaps: sourceMap,
    presets: [packageModules('babel-preset-flow')]
  }),
      code = _transform.code,
      map = _transform.map;

  return {
    code: code,
    sourceMap: map
  };
}

module.exports = {
  compile: compile
};