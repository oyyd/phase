const usage = 'Usage: $0 [--config=<pathToConfigFile>] [TestPathPattern]'
const docs = 'Documentation: https://github.com/oyyd/phase'
const options = {
  filter: {
    description: 'Filter files which will be compiled.',
    type: 'string',
  },
  loaderName: {
    description: 'The name of loader used to compile target files.',
    type: 'string',
  },
  outDir: {
    default: '.phase',
    description: 'The path to a directory where phase will output transformed' +
      ' codes.',
    type: 'string',
  },
  sourceMap: {
    default: true,
    description: 'Compile with source map support.',
    type: 'boolean',
  },
  silent: {
    default: false,
    description: 'Prevent compiling from printing messages through the console.',
    type: 'boolean',
  },
  version: {
    alias: 'v',
    description: 'Print the version and exit',
    type: 'boolean',
  },
  watch: {
    description: 'Watch files for changes and rerun tests related to ' +
      'changed files. If you want to re-run all tests when a file has ' +
      'changed, use the `--watchAll` option.',
    type: 'boolean',
  },
}

function check(argv) {
  if (!Object.hasOwnProperty.call(argv, 'loaderName')) {
    throw new Error('You have to specify a "loaderName"')
  }

  return true
}

module.exports = {
  usage,
  docs,
  options,
  check,
}
