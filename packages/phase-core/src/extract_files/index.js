const { join } = require('path')
const { stat, readdir, readFile, outputFile } = require('../utils/operations')
const { chalk, labelMsg } = require('../log')

// TODO: check windows support
function getAbsolutePath(prefix, path) {
  return join(prefix, path)
}

function isValidFile(filter, path) {
  if (filter instanceof RegExp) {
    return filter.test(path)
  } else if (typeof filter === 'function') {
    return filter(path)
  }

  throw new Error(`invalid filter: ${filter}`)
}

async function getFiles(absolutePath, filter) {
  const stats = await stat(absolutePath)

  let files = []

  if (stats.isDirectory()) {
    const contents = await readdir(absolutePath)

    for (const content of contents) {
      const nextFiles = await getFiles(getAbsolutePath(absolutePath, content), filter)
      files = files.concat(nextFiles)
    }
  } else if (stats.isFile()) {
    if (isValidFile(filter, absolutePath)) {
      files = files.concat([absolutePath])
    }
  } else {
    throw new Error(`unexpected file: ${absolutePath}`)
  }

  return files
}

async function extractFiles(absolutePath, filter = () => true) {
  const files = await getFiles(absolutePath, filter)

  return files
}

async function getFilesInfo(targetFiles) {
  const rawFileInfos = []

  for (const targetFilePath of targetFiles) {
    const rawContent = await readFile(targetFilePath, { encoding: 'utf8' })

    rawFileInfos.push({
      rawContent,
      filePath: targetFilePath,
    })
  }

  return rawFileInfos
}

async function outputFiles(fileInfos) {
  // TODO: validate
  for (const fileInfo of fileInfos) {
    const { content, path } = fileInfo

    labelMsg(chalk.green('WRITE'), path)
    await outputFile(path, content)
  }
}

module.exports = {
  extractFiles,
  getFilesInfo,
  outputFiles,
}
