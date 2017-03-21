'use strict';

// TODO: Should read files here or outsize?
var chokidar = require('chokidar');

function createWatcher(dir, onEvent) {
  var watcher = chokidar.watch(dir);

  watcher.on('ready', function () {
    watcher.on('all', onEvent);
  });

  return watcher;
}

module.exports = {
  createWatcher: createWatcher
};