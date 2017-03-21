const { createFilterFromString, promisify } = require('../index')

describe('utils', () => {
  describe('createFilterFromString', () => {
    const filter = createFilterFromString('*.coffee')

    expect(typeof filter).toBe('function')
  })

  describe('promisify', () => {
    it('should receive a callbak function and return a promise', async () => {
      const func = (data, callback) => setTimeout(() => callback(null, data))

      const res = await promisify(func, 10)

      expect(res).toBe(10)
    })

    it('should throw when ecounter an error as the first callback argument', async () => {
      const func = (data, callback) => setTimeout(() => callback(new Error('invalid'), data))

      try {
        await promisify(func, 10)
      } catch (err) {
        expect(err.message).toBe('invalid')
        return
      }

      throw new Error('expect receive error')
    })
  })
})
