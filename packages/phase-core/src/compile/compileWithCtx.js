const { compile } = require('./compile')
const { fileUpdateStream } = require('../watcher')
const { getFilesInfo } = require('../extract_files')
const { startChild, stopChild } = require('../start')
const { label, labelMsg } = require('../log')

// ms
const DEFAULT_WAIT_TIME = 200

async function compileWithLog(...args) {
  labelMsg(label.safe('BUILD'))
  return compile(...args)
}

let child = null

function restart(exec) {
  if (!exec) {
    return
  }

  if (child) {
    stopChild(child)
  }

  labelMsg(label.safe('EXEC'), exec)
  child = startChild(exec, () => {
    labelMsg(label.highlight('STOP'), exec)
    child = null
  })
}

function getFileInfoIndex(compiledFiles, filePath) {
  let index = null

  for (let i = 0; i < compiledFiles.length; i += 1) {
    const info = compiledFiles[i]

    if (info.filePath === filePath) {
      index = i
      break
    }
  }

  return index
}

function removeFileInfo(compiledFiles, filePath) {
  const index = getFileInfoIndex(compiledFiles, filePath)

  if (index === null) {
    throw new Error(`failed to find changed file: ${filePath}`)
  }

  return compiledFiles.slice(0, index).concat(compiledFiles.slice(index + 1))
}

function removeFileInfos(compiledFiles, filePaths) {
  let files = compiledFiles

  for (const filePath of filePaths) {
    files = removeFileInfo(files, filePath)
  }

  return files
}

async function addCompiledFileInfos(compiledFiles, filePaths) {
  const newFilesInfo = await getFilesInfo(filePaths)

  return compiledFiles.concat(newFilesInfo)
}

// TODO: allow no-cache
async function changeCompiledFileInfos(compiledFiles, filePaths) {
  const changedFilesInfo = await getFilesInfo(filePaths)

  return removeFileInfos(compiledFiles, filePaths).concat(changedFilesInfo)
}

async function removeCompiledFileInfos(compiledFiles, filePaths) {
  return removeFileInfos(compiledFiles, filePaths)
}

// NOTE: mutate object
/* eslint-disable no-param-reassign */
function createFileStatusBuffer() {
  return {
    // 'READY', 'WAIT', 'CONSUMING'
    '@@status': 'READY',
    '@@timeout': null,
  }
}

function getOperations(buffer) {
  return Object.keys(buffer).filter(propName => !/^@@/.test(propName))
}

function hasOperations(buffer) {
  return getOperations(buffer).length > 0
}

function getOperationsAndClean(buffer) {
  const operations = {
    add: [],
    unlink: [],
    change: [],
  }

  // get all operations
  getOperations(buffer).forEach((filePath) => {
    const event = buffer[filePath]

    operations[event].push(filePath)

    delete buffer[filePath]
  })

  return operations
}

function tryToConsume(buffer, next, waitTime = DEFAULT_WAIT_TIME) {
  const status = buffer['@@status']

  if (status === 'READY') {
    // enter wait
    buffer['@@status'] = 'WAIT'

    buffer['@@timeout'] = setTimeout(() => {
      next()
    }, waitTime)
  } else if (status === 'WAIT') {
    // wait again
    clearTimeout(buffer['@@timeout'])

    buffer['@@timeout'] = setTimeout(() => {
      next()
    }, waitTime)
  }

  // CONSUMING do nothing
}

function updateBuffer(buffer, event, filePath) {
  if (!Object.hasOwnProperty.call(buffer, filePath)) {
    buffer[filePath] = event
    return
  }

  const status = buffer[filePath]

  if (status === 'add' && event === 'unlink') {
    delete buffer[filePath]
    return
  }

  if (status === 'unlink' && event === 'add') {
    buffer[filePath] = 'change'
    return
  }

  if (status === 'change' && event === 'unlink') {
    buffer[filePath] = 'unlink'
  }

  // do nothing
}

function createBufferBackup(buffer) {
  const backup = Object.assign({}, buffer)

  delete backup['@@status']
  delete backup['@@timeout']

  return backup
}

function restoreBuffer(buffer, backup) {
  Object.assign(buffer, backup)
}

async function consume(ctx, buffer, next) {
  const bufferBackup = createBufferBackup(buffer)

  // clean status
  buffer['@@status'] = 'CONSUMING'

  let { compiledFiles } = ctx

  const operations = getOperationsAndClean(buffer, compiledFiles)

  // consume operations
  compiledFiles = await addCompiledFileInfos(compiledFiles, operations.add)
  compiledFiles = await changeCompiledFileInfos(compiledFiles, operations.change)
  compiledFiles = await removeCompiledFileInfos(compiledFiles, operations.unlink)

  // compiledFiles
  try {
    const { options: nextOptions, compiledFiles: nextCompiledFiles } =
      await compileWithLog(null, ctx)

    // update context
    ctx.options = nextOptions
    ctx.compiledFiles = nextCompiledFiles

    // next
    if (!hasOperations(buffer)) {
      buffer['@@status'] = 'READY'

      if (typeof next === 'function') {
        next()
      }

      return
    }

    // consume immediately
    consume(ctx, buffer, next)
  } catch (err) {
    // TODO: prettify
    console.error(err) // eslint-disable-line

    // restore buffer when compiling fails
    buffer['@@status'] = 'READY'
    restoreBuffer(buffer, bufferBackup)
  }
}
/* eslint-enable no-param-reassign */

// cache and make diff
async function compileWithCtx(options) {
  const ctx = await compileWithLog(options)

  const { exec, absoluteBaseDir, filter, watch } = ctx.options

  restart(exec)

  if (!watch) {
    return
  }

  const statusBuffer = createFileStatusBuffer()

  fileUpdateStream(filter, absoluteBaseDir, (event, filePath) => {
    // mutate statusBuffer
    updateBuffer(statusBuffer, event, filePath)

    tryToConsume(statusBuffer, () => consume(ctx, statusBuffer, () => {
      restart(exec)
    }))
  })
}

module.exports = {
  compileWithCtx,
  addCompiledFileInfos,
  changeCompiledFileInfos,
  removeCompiledFileInfos,
  createFileStatusBuffer,
  updateBuffer,
  getOperations,
  hasOperations,
  getOperationsAndClean,
  tryToConsume,
  createBufferBackup,
  restoreBuffer,
}
