'use strict';

require('babel-polyfill');

var _require = require('./compile'),
    handleMessage = _require.handleMessage;

function addListeners() {
  // "restart", "watch", "stop"
  process.on('message', function (message) {
    var task = message.task,
        data = message.data;

    handleMessage(task, data);
  });
}

if (module === require.main) {
  addListeners();
}