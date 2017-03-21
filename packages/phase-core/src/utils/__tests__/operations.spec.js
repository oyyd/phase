const operations = require('../operations')

describe('operations', () => {
  it('should make sure all operations are of "function" type', () => {
    Object.keys(operations).forEach((name) => {
      expect(typeof operations[name]).toBe('function')
    })
  })
})
