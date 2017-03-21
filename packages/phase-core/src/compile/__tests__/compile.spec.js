const mockExtractFiles = jest.fn(() => Promise.resolve(['/home/a/a.js']))
const mockGetFilesInfo = jest.fn(() => Promise.resolve([{
  rawContent: 'a = 20',
  filePath: '/home/a/a.js',
}]))
const mockOutputFiles = jest.fn(() => Promise.resolve([]))

jest.mock('../../utils/operations', () => ({
  ensureDir: jest.fn(),
}))

jest.mock('../../extract_files', () => ({
  extractFiles: mockExtractFiles,
  getFilesInfo: mockGetFilesInfo,
  outputFiles: mockOutputFiles,
}))

const { compile, getDiff } = require('../compile')

const defaultOutputCode = 'var a = 20'
const defaultOutputSourceMap = '{}'

function createMockLoader() {
  return jest.fn((/* options, rawContent */) => ({
    code: defaultOutputCode,
    sourceMap: defaultOutputSourceMap,
  }))
}

// function createGlobalOptions() {
//   return {}
// }

describe('compile', () => {
  describe('compile', () => {
    let userOptions
    let mockLoader

    beforeEach(() => {
      mockLoader = createMockLoader()

      userOptions = {
        baseDir: './abc',
        outDir: './defg',

        loader: mockLoader,
      }
    })

    it('should "extractFiles" and "compile" and "outputFiles" and return the infos of "compiledFiles"',
      async () => {
        const { compiledFiles: res, options, outputFilesByPath } = await compile(userOptions)

        expect(typeof options).toBe('object')
        expect(typeof outputFilesByPath).toBe('object')
        expect(Array.isArray(res)).toBe(true)

        res.forEach((info) => {
          expect(info.rawContent).toBeTruthy()
          expect(info.filePath).toBeTruthy()
          expect(info.compiledContent).toBeTruthy()
          expect(info.sourceMap).toBeTruthy()
          expect(info.targetFilePath).toBeTruthy()
        })
      })
  })

  describe('getDiff', () => {
    it('should', () => {
      const info1 = {
        '/home/a.js': {
          path: '/home/a.js',
          content: 'abc',
        },
        '/home/b.js': {
          path: '/home/b.js',
          content: 'abc',
        },
      }

      const info2 = {
        '/home/a.js': {
          path: '/home/a.js',
          content: 'd',
        },
        '/home/b.js': {
          path: '/home/b.js',
          content: 'abc',
        },
        '/home/c.js': {
          path: '/home/c.js',
          content: 'abc',
        },
      }

      const res = getDiff(info1, info2)

      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toBe(2)
      expect(res[0].content).toBe('d')
      expect(res[1].path).toBe('/home/c.js')
    })
  })
})
