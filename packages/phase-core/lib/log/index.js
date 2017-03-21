'use strict';

var chalk = require('chalk');

// eslint-disable-next-line
var log = console.log;

function bg(style, msg) {
  return style(' ' + msg + ' ');
}

var label = {
  highlight: bg.bind(null, chalk.black.bgRed),
  warn: bg.bind(null, chalk.black.bgYellow),
  safe: bg.bind(null, chalk.black.bgGreen)
};

function labelMsg(labelLog) {
  var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  log(labelLog + ' ' + msg);
}

module.exports = {
  chalk: chalk,
  label: label,
  labelMsg: labelMsg
};