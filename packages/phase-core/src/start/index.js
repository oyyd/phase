// run as a child process
const { exec } = require('child_process')

function startChild(cmd, onExit) {
  const child = exec(cmd)

  process.stdin.pipe(child.stdin)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)

  child.on('exit', onExit)

  return child
}

function stopChild(child) {
  child.kill()
}

module.exports = {
  startChild,
  stopChild,
}
