const { compile } = require('../index')

function createOptions() {
  return {
    filename: 'abc.coffee',
    targetFilename: 'abc.coffee',
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
    const { code, sourceMap } = await compile(options, 'number = 42')

    expect(code).toBe('var number;\n\nnumber = 42;\n')
    expect(typeof sourceMap).toBe('object')
    expect(sourceMap.file).toBe('abc.coffee')
    expect(sourceMap.version).toBe(3)
  })
})
