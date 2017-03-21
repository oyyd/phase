const path = require('path')
const { resolve } = require('../resolve')

describe('resolve', () => {
  describe('resolve', () => {
    const folderPath = path.resolve(__dirname, './folder')

    it('should return the file path of the "mod" from "node_modules"', () => {
      const filepath = resolve('mod', folderPath)

      expect(filepath).toBe(path.resolve(folderPath, './node_modules/mod/index.js'))
    })

    it('should return the file path of the "file.js" from "folder"', () => {
      const filepath = resolve('./file', folderPath)

      expect(filepath).toBe(path.resolve(folderPath, './file.js'))
    })

    it('should get the process.cwd() as relative path by default', () => {
      const filepath = resolve('./package.json')

      expect(filepath).toBe(path.resolve(process.cwd(), './package.json'))
    })

    it('should return "null" if the file doesn\'t exist', () => {
      const filepath = resolve('./FILE_THAT_NOT_EXIST')

      expect(filepath).toBe(null)
    })
  })
})
