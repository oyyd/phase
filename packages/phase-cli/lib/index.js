'use strict';

require('babel-polyfill');

var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require('child_process'),
    fork = _require2.fork;

var yargs = require('yargs');
var args = require('./args');

var _require3 = require('./client_cmds'),
    handleClientCommands = _require3.handle;

var VALID_ARGS = ['baseDir', 'outDir', 'watch', 'sourceMap', 'loaderName', 'filter'];

function getOptions(argv) {
  var options = {};

  for (var i = 0; i < VALID_ARGS.length; i += 1) {
    var argName = VALID_ARGS[i];
    var value = argv[argName];
    if (value) {
      options[argName] = value;
    }
  }

  options.baseDir = argv._[0];

  return options;
}

function main() {
  var _yargs$usage$help$ali = yargs(process.argv.slice(2)).usage(args.usage).help().alias('help', 'h').options(args.options).epilogue(args.docs).check(args.check),
      argv = _yargs$usage$help$ali.argv;

  if (argv.help) {
    yargs.showHelp();
    return;
  }

  if (handleClientCommands(argv)) {
    return;
  }

  var child = fork(resolve(__dirname, './processor'));

  child.send({
    task: 'start',
    data: getOptions(argv)
  });
}

module.exports = {
  main: main
};