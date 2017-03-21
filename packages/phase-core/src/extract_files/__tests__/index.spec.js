const path = require('path')
const { getFilesInfo, extractFiles } = require('../')

const dir = path.resolve(__dirname, 'test_folders')
const relative = file => path.resolve(__dirname, file)

function hasExpectedFiles(expected, files) {
  expected.forEach(file => expect(files.some(getFile => getFile.indexOf(file) > -1)))
}

describe('extract_files', () => {
  describe('extractFiles', () => {
    it('should get all files in the target folders', async () => {
      const files = await extractFiles(dir)

      expect(Array.isArray(files)).toBe(true)
      expect(files.length).toBe(4)
      hasExpectedFiles([
        'test_folders/file.es',
        'test_folders/folder/file.es',
        'test_folders/folder/file.js',
        'test_folders/index.js',
      ], files)
    })

    it('should filter files by functions', async () => {
      const filter = file => /\.js$/.test(file)
      const files = await extractFiles(dir, filter)

      hasExpectedFiles([
        'test_folders/folder/file.js',
        'test_folders/index.js',
      ], files)
    })

    it('should filter files by regexp', async () => {
      const filter = /\.es$/
      const files = await extractFiles(dir, filter)

      hasExpectedFiles([
        'test_folders/file.es',
        'test_folders/folder/file.es',
      ], files)
    })
  })

  describe('getFilesInfo', () => {
    const files = [
      relative('./test_folders/index.js'),
      relative('./test_folders/folder/file.js'),
    ]

    it('should return a list of objects with properties of "rawContent"', async () => {
      const res = await getFilesInfo(files)

      expect(Array.isArray(res)).toBeTruthy()
      expect(res[0]).toBeTruthy()
      expect(res[0].rawContent).toBe('var a = 10;\n')
      expect(res[1]).toBeTruthy()
      expect(res[1].rawContent).toBe('var b = 10;\n')
    })
  })
})
