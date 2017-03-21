'use strict';

/* eslint-disable no-console */
var chalk = require('chalk');

function log(msg) {
  console.log(chalk.cyan(msg));
}

module.exports = {
  log: log
};