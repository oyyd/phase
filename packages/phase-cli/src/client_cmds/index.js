const version = require('./version')

const cmds = [{
  option: 'version',
  run: version,
}]

function handle(argv) {
  for (let i = 0; i < cmds.length; i += 1) {
    const { option, run } = cmds[i]

    if (argv[option]) {
      run()
      return true
    }
  }

  return false
}

module.exports = {
  handle,
}
