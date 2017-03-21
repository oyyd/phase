const { createWatcher } = require('./createWatcher')

const VALID_EVENT_TYPES = [
  'unlink',
  'change',
  'add',
]

function fileUpdateStream(filter, dir, next) {
  const watcher = createWatcher(dir, (event, file) => {
    if (!filter(file) || !VALID_EVENT_TYPES.some(e => e === event)) {
      return
    }

    next(event, file)
  })

  return watcher
}

module.exports = {
  fileUpdateStream,
}
