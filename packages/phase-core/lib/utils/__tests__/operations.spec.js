'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var operations = require('../operations');

describe('operations', function () {
  it('should make sure all operations are of "function" type', function () {
    Object.keys(operations).forEach(function (name) {
      expect(_typeof(operations[name])).toBe('function');
    });
  });
});