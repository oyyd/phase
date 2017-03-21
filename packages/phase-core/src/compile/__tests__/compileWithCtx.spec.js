jest.mock('../../extract_files', () => ({
  getFilesInfo: jest.fn(filePaths => (filePaths.map(filePath => ({
    filePath,
    rawContent: 'NEW_CONTENT',
  })))),
}))

const {
  addCompiledFileInfos,
  changeCompiledFileInfos,
  removeCompiledFileInfos,
  createFileStatusBuffer,
  updateBuffer,
  getOperations,
  hasOperations,
  // consume,
  tryToConsume,
  getOperationsAndClean,
  createBufferBackup,
  restoreBuffer,
} = require('../compileWithCtx')

function createFileInfos() {
  return [{
    filePath: '/home/a',
  }, {
    filePath: '/home/b',
  }]
}

describe('compileWithCtx', () => {
  let compiledFileInfos

  beforeEach(() => {
    compiledFileInfos = createFileInfos()
  })

  describe('addCompiledFileInfos', () => {
    it('should add file infos', async () => {
      const infos = await addCompiledFileInfos(compiledFileInfos, ['/home/c', '/home/d'])

      expect(Array.isArray(infos)).toBe(true)
      expect(infos.length).toBe(4)
      expect(infos[0].filePath).toBe('/home/a')
      expect(infos[1].filePath).toBe('/home/b')
      expect(infos[2].filePath).toBe('/home/c')
      expect(infos[3].filePath).toBe('/home/d')
    })
  })

  describe('changeCompiledFileInfos', () => {
    it('should replace the file info with same filePath', async () => {
      const fileInfos = [{
        filePath: '/home/a',
        rawContent: 'a',
      }, {
        filePath: '/home/b',
        rawContent: 'b',
      }, {
        filePath: '/home/c',
        rawContent: 'c',
      }]
      const aInfo = fileInfos[0]
      const bInfo = fileInfos[1]
      const cInfo = fileInfos[2]
      const infos = await changeCompiledFileInfos(fileInfos, ['/home/b', '/home/c'])

      expect(Array.isArray(infos)).toBe(true)
      expect(infos.length).toBe(3)
      expect(infos[0].filePath).toBe('/home/a')
      expect(infos[1].filePath).toBe('/home/b')
      expect(infos[2].filePath).toBe('/home/c')
      expect(aInfo !== infos[0]).toBe(false)
      expect(bInfo !== infos[1]).toBe(true)
      expect(cInfo !== infos[2]).toBe(true)
    })
  })

  describe('removeCompiledFileInfos', () => {
    it('should remove the target file info', async () => {
      const infos = await removeCompiledFileInfos(compiledFileInfos, ['/home/b', '/home/a'])

      expect(Array.isArray(infos)).toBe(true)
      expect(infos.length).toBe(0)
    })
  })

  describe('FileStatusBuffer', () => {
    let buffer

    beforeEach(() => {
      buffer = createFileStatusBuffer()
    })

    describe('updateBuffer', () => {
      it('should add an "add" operation to the file', () => {
        updateBuffer(buffer, 'add', '/home/a.js')

        expect(typeof buffer).toBe('object')
        expect(buffer['/home/a.js']).toBe('add')
      })

      it('should clear write "add" operations encountering an "unlink"', () => {
        updateBuffer(buffer, 'add', '/home/a.js')

        expect(typeof buffer).toBe('object')
        expect(buffer['/home/a.js']).toBe('add')

        updateBuffer(buffer, 'add', '/home/a.js')
        expect(buffer['/home/a.js']).toBe('add')

        updateBuffer(buffer, 'change', '/home/a.js')
        expect(buffer['/home/a.js']).toBe('add')

        updateBuffer(buffer, 'unlink', '/home/a.js')
        expect(buffer['/home/a.js']).toBeFalsy()
      })

      it('should overwrite "unlink" with "change" when encountering an "add"', () => {
        updateBuffer(buffer, 'unlink', '/home/a.js')

        expect(typeof buffer).toBe('object')
        expect(buffer['/home/a.js']).toBe('unlink')

        updateBuffer(buffer, 'add', '/home/a.js')
        expect(buffer['/home/a.js']).toBe('change')
      })

      it('should overwrite "change" with "unlink" when encountering an "unlink"', () => {
        updateBuffer(buffer, 'change', '/home/a.js')

        expect(typeof buffer).toBe('object')
        expect(buffer['/home/a.js']).toBe('change')

        updateBuffer(buffer, 'unlink', '/home/a.js')
        expect(buffer['/home/a.js']).toBe('unlink')
      })
    })

    describe('createFileStatusBuffer', () => {
      it('should have "@@status" and "@@timeout" properties', () => {
        expect(Object.hasOwnProperty.call(buffer, '@@status')).toBe(true)
        expect(Object.hasOwnProperty.call(buffer, '@@timeout')).toBe(true)
      })
    })

    describe('getOperations', () => {
      it('should get all operations', () => {
        buffer['/home/a.js'] = 'add'
        buffer['/home/b.js'] = 'unlink'

        const res = getOperations(buffer)

        expect(res.length).toBe(2)
      })
    })

    describe('hasOperations', () => {
      it('should have operations', () => {
        buffer['/home/a.js'] = 'add'
        buffer['/home/b.js'] = 'unlink'

        expect(hasOperations(buffer)).toBe(true)
      })

      it('should have no operations', () => {
        expect(hasOperations(buffer)).toBe(false)
      })
    })

    describe('getOperationsAndClean', () => {
      it('should get all operations and clean object pathes', () => {
        buffer['/home/a.js'] = 'add'
        buffer['/home/b.js'] = 'unlink'

        const operations = getOperationsAndClean(buffer)

        expect(Object.keys(operations)).toEqual(['add', 'unlink', 'change'])
        expect(hasOperations(buffer)).toBe(false)
      })
    })

    describe('tryToConsume', () => {
      function wait(next) {
        setTimeout(next, 10)
      }

      let next

      beforeEach(() => {
        next = jest.fn()
      })

      it('should do nothing if the status is neither "READY" nor "WAIT"', (done) => {
        buffer['@@status'] = 'CONSUMING'

        tryToConsume(buffer, next, 0)

        wait(() => {
          expect(next.mock.calls.length).toBe(0)
          done()
        })
      })

      it('should begin to wait when the status is "READY"', (done) => {
        buffer['@@status'] = 'READY'

        tryToConsume(buffer, next, 0)

        wait(() => {
          expect(buffer['@@timeout']).toBeTruthy()
          expect(next.mock.calls.length).toBe(1)
          done()
        })
      })

      it('should restart the timeout if the status is "WAIT"', (done) => {
        buffer['@@status'] = 'WAIT'
        buffer['@@timeout'] = 1

        tryToConsume(buffer, next, 0)

        wait(() => {
          expect(buffer['@@timeout']).toBeTruthy()
          expect(buffer['@@timeout']).not.toBe(1)
          expect(next.mock.calls.length).toBe(1)
          done()
        })
      })
    })

    describe('BufferBackup', () => {
      it('should restore all paths', () => {
        buffer['@@status'] = 'ABC'
        buffer['/home/a.js'] = 'add'
        buffer['/home/b.js'] = 'unlink'

        const backup = createBufferBackup(buffer)

        expect(backup['/home/a.js']).toBe('add')
        expect(backup['/home/b.js']).toBe('unlink')

        buffer['@@status'] = 'DEF'
        delete buffer['/home/a.js']
        delete buffer['/home/b.js']

        restoreBuffer(buffer, backup)

        expect(buffer['@@status']).toBe('DEF')
        expect(buffer['/home/a.js']).toBe('add')
        expect(buffer['/home/b.js']).toBe('unlink')
      })
    })
  })
})
