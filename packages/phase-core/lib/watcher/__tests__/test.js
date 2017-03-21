'use strict';

var _require = require('path'),
    resolve = _require.resolve;

var _require2 = require('../index'),
    createWatcher = _require2.createWatcher;

var relative = function relative(file) {
  return resolve(__dirname, file);
};

// NOTE: running chokidar in jest would emit strange errors
var dir = relative('./folder/');

createWatcher(dir, function (event, path) {
  console.log(event, path);
});