const { compile } = require('../index')

function createOptions() {
  return {
    filename: 'abc.js',
    targetFilename: 'abc.js',
    compileOptions: {},
    sourceMap: true,
  }
}

describe('compile', () => {
  let options

  beforeEach(() => {
    options = createOptions()
  })

  it('should compile coffee to es correctly', async () => {
    const { code, sourceMap } = await compile(options, 'var number: String = 42')

    expect(code).toBe('var number = 42;')
    expect(typeof sourceMap).toBe('object')
    expect(sourceMap.file).toBe('abc.js')
    expect(sourceMap.version).toBe(3)
  })
})
