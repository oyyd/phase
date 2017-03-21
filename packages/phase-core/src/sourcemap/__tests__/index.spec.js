const { getSourceMapOutputFiles, appendSupport } = require('../index')

describe('sourcemap', () => {
  describe('appendSupport', () => {
    it('should append map file path', () => {
      const code = 'var a = 10'
      const mapFilePath = '/home/a.js'

      expect(appendSupport(code, mapFilePath)).toBe('var a = 10\n//# sourceMappingURL=/home/a.js.map')
    })
  })

  describe('getSourceMapOutputFiles', () => {
    it('should get all output files from compiledFileInfos', () => {
      const compiledFileInfos = [{
        targetFilePath: '/home/abc/a.js',
        sourceMap: { version: 3 },
      }]

      const res = getSourceMapOutputFiles(compiledFileInfos)

      expect(Array.isArray(res)).toBe(true)
      const item = res[0]
      expect(item.content).toBe(JSON.stringify(compiledFileInfos[0].sourceMap))
      expect(item.path).toBe(`${compiledFileInfos[0].targetFilePath}.map`)
    })

    it('should not generate output files from infos without sourceMap', () => {
      const compiledFileInfos = [{
        targetFilePath: '/home/abc/a.js',
      }]

      const res = getSourceMapOutputFiles(compiledFileInfos)

      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toBe(0)
    })
  })
})
