'use strict';

var version = require('./version');

var cmds = [{
  option: 'version',
  run: version
}];

function handle(argv) {
  for (var i = 0; i < cmds.length; i += 1) {
    var _cmds$i = cmds[i],
        option = _cmds$i.option,
        run = _cmds$i.run;


    if (argv[option]) {
      run();
      return true;
    }
  }

  return false;
}

module.exports = {
  handle: handle
};