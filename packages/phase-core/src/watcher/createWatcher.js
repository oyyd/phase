// TODO: Should read files here or outsize?
const chokidar = require('chokidar')

function createWatcher(dir, onEvent) {
  const watcher = chokidar.watch(dir)

  watcher.on('ready', () => {
    watcher.on('all', onEvent)
  })

  return watcher
}


module.exports = {
  createWatcher,
}
