let trigger

jest.mock('../createWatcher', () => ({
  createWatcher: jest.fn((_, listener) => {
    trigger = listener
  }),
}))

const { fileUpdateStream } = require('../index')

describe('watcher', () => {
  describe('fileUpdateStream', () => {
    let filter
    let dir

    beforeEach(() => {
      filter = () => true
      dir = '/home'
    })

    it('should pass events that are "unlink" or "change" or "add"', (done) => {
      fileUpdateStream(filter, dir, (event, file) => {
        expect(event).toBe('change')
        expect(file).toBe('abc')
        done()
      })

      trigger('change', 'abc')
    })

    it('should filter uncessary events', (done) => {
      fileUpdateStream(filter, dir, (event, file) => {
        expect(event).toBe('change')
        expect(file).toBe('abc')
        done()
      })

      trigger('addDir', 'abc')
      trigger('removeDir', 'abc')
      trigger('other', 'abc')
      trigger('events', 'abc')
      trigger('change', 'abc')
    })

    it('should use "filter" function to filter paths', (done) => {
      const filterJSX = path => (/jsx$/).test(path)
      fileUpdateStream(filterJSX, dir, (event, file) => {
        expect(event).toBe('change')
        expect(file).toBe('/a.jsx')
        done()
      })

      trigger('change', '/a.js')
      trigger('change', '/a.jsx')
    })
  })
})
