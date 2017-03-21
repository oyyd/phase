'use strict';

var _require = require('./createWatcher'),
    createWatcher = _require.createWatcher;

var VALID_EVENT_TYPES = ['unlink', 'change', 'add'];

function fileUpdateStream(filter, dir, next) {
  var watcher = createWatcher(dir, function (event, file) {
    if (!filter(file) || !VALID_EVENT_TYPES.some(function (e) {
      return e === event;
    })) {
      return;
    }

    next(event, file);
  });

  return watcher;
}

module.exports = {
  fileUpdateStream: fileUpdateStream
};