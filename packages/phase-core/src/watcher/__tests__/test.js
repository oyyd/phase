const { resolve } = require('path')
const { createWatcher } = require('../index')

const relative = file => resolve(__dirname, file)

// NOTE: running chokidar in jest would emit strange errors
const dir = relative('./folder/')

createWatcher(dir, (event, path) => {
  console.log(event, path)
})
