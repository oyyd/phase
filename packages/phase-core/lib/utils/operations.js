'use strict';

var fs = require('fs-extra');

var _require = require('./index'),
    promisify = _require.promisify;

var readdir = promisify.bind(null, fs.readdir);
var stat = promisify.bind(null, fs.stat);
var readFile = promisify.bind(null, fs.readFile);
var outputFile = promisify.bind(null, fs.outputFile);
var emptyDir = promisify.bind(null, fs.emptyDir);
var ensureDir = promisify.bind(null, fs.ensureDir);

module.exports = {
  readdir: readdir,
  stat: stat,
  readFile: readFile,
  outputFile: outputFile,
  emptyDir: emptyDir,
  ensureDir: ensureDir
};