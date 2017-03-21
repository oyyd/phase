require('babel-polyfill')

const { resolve } = require('path')
const { fork } = require('child_process')
const yargs = require('yargs')
const args = require('./args')
const { handle: handleClientCommands } = require('./client_cmds')

const VALID_ARGS = ['baseDir', 'outDir', 'watch', 'sourceMap', 'loaderName', 'filter']

function getOptions(argv) {
  const options = {}

  for (let i = 0; i < VALID_ARGS.length; i += 1) {
    const argName = VALID_ARGS[i]
    const value = argv[argName]
    if (value) {
      options[argName] = value
    }
  }

  options.baseDir = argv._[0]

  return options
}

function main() {
  const { argv } = yargs(process.argv.slice(2))
    .usage(args.usage)
    .help()
    .alias('help', 'h')
    .options(args.options)
    .epilogue(args.docs)
    .check(args.check)

  if (argv.help) {
    yargs.showHelp()
    return
  }

  if (handleClientCommands(argv)) {
    return
  }

  const child = fork(resolve(__dirname, './processor'))

  child.send({
    task: 'start',
    data: getOptions(argv),
  })
}

module.exports = {
  main,
}
