'use strict';

// run as a child process
var _require = require('child_process'),
    exec = _require.exec;

function startChild(cmd, onExit) {
  var child = exec(cmd);

  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('exit', onExit);

  return child;
}

function stopChild(child) {
  child.kill();
}

module.exports = {
  startChild: startChild,
  stopChild: stopChild
};