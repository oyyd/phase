const chalk = require('chalk')

// eslint-disable-next-line
const log = console.log

function bg(style, msg) {
  return style(` ${msg} `)
}

const label = {
  highlight: bg.bind(null, chalk.black.bgRed),
  warn: bg.bind(null, chalk.black.bgYellow),
  safe: bg.bind(null, chalk.black.bgGreen),
}

function labelMsg(labelLog, msg = '') {
  log(`${labelLog} ${msg}`)
}

module.exports = {
  chalk,
  label,
  labelMsg,
}
