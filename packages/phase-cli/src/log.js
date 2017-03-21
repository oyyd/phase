/* eslint-disable no-console */
const chalk = require('chalk')

function log(msg) {
  console.log(chalk.cyan(msg))
}

module.exports = {
  log,
}
