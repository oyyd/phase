'use strict';

var mm = require('micromatch');

function promisify(func) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    func.apply(undefined, args.concat([function (err, result) {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    }]));
  });
}

function createFilterFromString(string) {
  return function (items) {
    return mm(items, string);
  };
}

module.exports = {
  promisify: promisify,
  createFilterFromString: createFilterFromString
};