const { compileWebpackLoader, WebpackContext } = require('../')

const properties = [
  'options',
  'sourceMap',
  'currentRequest',
  'remainingRequest',
  'query',
  'callback',
  'doneDeferred',
  'done',
]

describe('webpack_mock', () => {
  describe('WebpackContext', () => {
    let instance

    beforeEach(() => {
      instance = new WebpackContext({}, true, {}, 'abc.js', 'abc.js')
    })

    it('should create an instance', () => {
      expect(instance instanceof WebpackContext).toBeTruthy()
    })

    it(`should have "${properties.join('", "')}`, () => {
      properties.forEach((prop) => {
        expect(instance[prop] !== undefined).toBeTruthy()
      })
    })

    it('should have a remainingRequest string starting with "!"', () => {
      expect(instance.remainingRequest).toBe('abc.js')
    })
  })

  describe('compileWebpackLoader', () => {
    function createOptions(compileFunc) {
      return {
        compileFunc,
        compileOptions: {},
        sourceMap: false,
        filename: 'a.js',
        targetFilename: 'a.js',
      }
    }

    const defaultOutputCode = 'var a = 10'
    const defaultOutputSourceMap = '{}'
    let mockCompileFunc
    let options

    beforeEach(() => {
      mockCompileFunc = jest.fn(function mock() {
        this.callback(null, defaultOutputCode, defaultOutputSourceMap)
      })

      options = createOptions(mockCompileFunc)
    })

    it('should return an object with "code" and "sourceMap" properties', async () => {
      const { code, sourceMap } = await compileWebpackLoader(options, 'code')

      expect(code).toBe(defaultOutputCode)
      expect(sourceMap).toBe(defaultOutputSourceMap)
    })

    it('should throw errors correctly', async () => {
      // eslint-disable-next-line
      const mock = jest.fn(function mock() {
        throw new Error('invalid')
      })

      const opts = createOptions(mock)

      try {
        await compileWebpackLoader(opts, '')
      } catch (err) {
        expect(err.message).toBe('invalid')
        return
      }

      throw new Error('expect error')
    })

    it('should throw if the first argument of a callback is truthy', async () => {
      // eslint-disable-next-line
      const mock = jest.fn(function mock() {
        const err = new Error('invalid')
        this.callback(err)
      })

      const opts = createOptions(mock)

      try {
        await compileWebpackLoader(opts, '')
      } catch (err) {
        expect(err.message).toBe('invalid')
        return
      }

      throw new Error('expect error')
    })

    it('should wait for the response when this.async called', async () => {
      // eslint-disable-next-line
      const mock = jest.fn(function mock() {
        const callback = this.async()
        setTimeout(() => {
          callback(null, 'a', 'b')
        })
      })

      const opts = createOptions(mock)

      const { code, sourceMap } = await compileWebpackLoader(opts, '')
      expect(code).toBe('a')
      expect(sourceMap).toBe('b')
    })
  })
})
