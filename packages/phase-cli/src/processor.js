require('babel-polyfill')
const { handleMessage } = require('./compile')

function addListeners() {
  // "restart", "watch", "stop"
  process.on('message', (message) => {
    const { task, data } = message
    handleMessage(task, data)
  })
}

if (module === require.main) {
  addListeners()
}
