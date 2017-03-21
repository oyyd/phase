const mockOutputFile = jest.fn()

jest.mock('../../utils/operations', () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(),
  outputFile: mockOutputFile,
  emptyDir: jest.fn(),
}))

const { outputFiles } = require('../')

const defaultCompiledContent = 'var a = 10;'
const defaultTargetFilePath = '/home/abc'

function createFileInfo() {
  return {
    content: defaultCompiledContent,
    path: defaultTargetFilePath,
  }
}

describe('outputFiles', () => {
  let fileInfos

  beforeEach(() => {
    fileInfos = [createFileInfo()]
  })

  it('should write "content" to "path" from options', async () => {
    await outputFiles(fileInfos)

    expect(mockOutputFile.mock.calls[0][0]).toBe(defaultTargetFilePath)
    expect(mockOutputFile.mock.calls[0][1]).toBe(defaultCompiledContent)
  })
})
