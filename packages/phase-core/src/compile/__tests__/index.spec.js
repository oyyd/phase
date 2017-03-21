const { getOutputSourceFileInfos, compileFiles, getTargetFilePath,
  appendTargetFilePath, replaceExtToJS } = require('../compile')

const defaultCompiledContent = 'var a = 10;'
const defaultTargetFilePath = '/home/abc.js'

function createFileInfo() {
  return {
    compiledContent: defaultCompiledContent,
    targetFilePath: defaultTargetFilePath,
  }
}

const defaultCompileOutputCode = 'var a = 20'
const defaultOutputSourceMap = '{}'

function createMockLoader() {
  return jest.fn((/* options, rawContent */) => ({
    code: defaultCompileOutputCode,
    sourceMap: defaultOutputSourceMap,
  }))
}

function createGlobalOptions() {
  return {}
}

describe('compile', () => {
  describe('compileFiles', () => {
    let fileInfos
    let mockLoader
    let globalOptions

    beforeEach(() => {
      const fileInfo = createFileInfo()
      fileInfos = [fileInfo]
      mockLoader = createMockLoader()
      globalOptions = createGlobalOptions()
    })

    it('should return compiled file infos with "code" and "sourceMap" properties', async () => {
      const compiledFileInfos = await compileFiles(mockLoader, globalOptions, fileInfos)

      expect(Array.isArray(compiledFileInfos)).toBeTruthy()

      const info = compiledFileInfos[0]

      expect(info.compiledContent).toBe(defaultCompiledContent)
    })

    it('should not re-compile file infos that exist', async () => {
      const compiledFileInfos = await compileFiles(mockLoader, globalOptions, [{
        targetFilePath: '/home/a.js',
      }])

      expect(Array.isArray(compiledFileInfos)).toBeTruthy()

      const info = compiledFileInfos[0]

      expect(info.compiledContent).toBe(defaultCompileOutputCode)
    })
  })

  describe('getTargetFilePath', () => {
    it('should be replace "baseDir" to "outDir"', () => {
      const baseDir = '/home/a'
      const outDir = '/home/b'
      const filePath = '/home/a/b/10'

      expect(getTargetFilePath(baseDir, outDir, filePath)).toBe('/home/b/b/10')
    })
  })

  describe('appendTargetFilePath', () => {
    it('should return lists of objects with "targetFilePath" properties', () => {
      const baseDir = '/home/a'
      const outDir = '/home/b'

      const fileInfos = [{
        filePath: '/home/a/a.js',
      }, {
        filePath: '/home/a/b/b.js',
      }]

      const res = appendTargetFilePath(null, baseDir, outDir, fileInfos)

      expect(res[0].targetFilePath).toBe('/home/b/a.js')
      expect(res[1].targetFilePath).toBe('/home/b/b/b.js')
    })

    it('should replace the targetFilePath extension', () => {
      const replaceExt = replaceExtToJS
      const baseDir = '/home/a'
      const outDir = '/home/b'

      const fileInfos = [{
        filePath: '/home/a/a.coffee',
      }, {
        filePath: '/home/a/b/b.coffee',
      }]

      const res = appendTargetFilePath(replaceExt, baseDir, outDir, fileInfos)

      expect(res[0].targetFilePath).toBe('/home/b/a.js')
      expect(res[1].targetFilePath).toBe('/home/b/b/b.js')
    })
  })

  describe('getOutputSourceFileInfos', () => {
    it('should take "compiledContent", "targetFilePath" as "content" and "path"', () => {
      const res = getOutputSourceFileInfos([{
        compiledContent: 'var a = 10',
        targetFilePath: '/home/abc.js',
      }])

      expect(Array.isArray(res)).toBe(true)
      expect(res[0].path).toBe('/home/abc.js')
      expect(res[0].content).toBe('var a = 10')
    })
  })
})
