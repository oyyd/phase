const path = require('path')
const { ensureDir } = require('../utils/operations')
const { outputFiles, extractFiles, getFilesInfo } = require('../extract_files')
const { resolve } = require('../utils/resolve')
const { getSourceMapOutputFiles, appendSupport } = require('../sourcemap')
const { createFilterFromString } = require('../utils')

const { join, dirname, extname, basename, format } = path

/**
 * options {
 *   compileFunc,
 *   compileOptions,
 *   sourceMap,
 *   filename,
 *   targetFilename,
 * }
 */

function replaceExtToJS(file) {
  return join(dirname(file), `${basename(file, extname(file))}.js`)
}

function getExtJS(filePath) {
  return extname(filePath) === '.js'
}

const DEFAULT_OPTIONS = {
  sourceMap: true,
  // TODO:
  replaceExt: replaceExtToJS,
  filter: getExtJS,
}

async function createOutDir(dirName = '.phase') {
  const outDir = path.resolve(process.cwd(), dirName)

  await ensureDir(outDir)

  return outDir
}

// TODO: allow no-cache
// Compile all given files into target source codes
// and return fileInfos.
async function compileFiles(loader, globalOptions, fileInfos) {
  const { sourceMap: shouldDoSouceMap, compileOptions } = globalOptions
  const compiledFileInfos = []

  for (const fileInfo of fileInfos) {
    if (!fileInfo.compiledContent) {
      const { rawContent, filePath } = fileInfo
      const options = {
        filename: filePath,
        // TODO: somewhere to specify target file paths
        targetFilename: filePath,
        compileOptions,
        sourceMap: shouldDoSouceMap,
      }

      const { code, sourceMap } = await loader(options, rawContent)

      // append "compiledContent" and "sourceMap"
      const compiledFileInfo = Object.assign({}, fileInfo, {
        compiledContent: code,
        sourceMap,
      })

      compiledFileInfos.push(Object.assign({}, fileInfo, compiledFileInfo))
    } else {
      compiledFileInfos.push(fileInfo)
    }
  }

  return compiledFileInfos
}

function getTargetFilePath(baseDir, outDir, filePath) {
  return `${outDir}${filePath.slice(baseDir.length)}`
}

function appendTargetFilePath(replaceExt, baseDir, outDir, fileInfos) {
  return fileInfos.map((fileInfo) => {
    if (fileInfo.targetFilePath) {
      return fileInfo
    }

    let targetFilePath = getTargetFilePath(baseDir, outDir, fileInfo.filePath)

    if (replaceExt) {
      targetFilePath = replaceExt(targetFilePath)
    }

    return Object.assign({
      targetFilePath,
    }, fileInfo)
  })
}

function getOutputSourceFileInfos(compiledFiles) {
  return compiledFiles.map(item => ({
    content: item.compiledContent,
    path: item.targetFilePath,
  }))
}

function getOutPutFiles(shouldAppendSourceMap, compiledFiles) {
  let filesToOuput = getOutputSourceFileInfos(compiledFiles)

  if (shouldAppendSourceMap) {
    filesToOuput = filesToOuput.map(fileToOuput => Object.assign({}, fileToOuput, {
      content: appendSupport(fileToOuput.content, fileToOuput.path),
    }))

    const sourceMapFiles = getSourceMapOutputFiles(compiledFiles)

    filesToOuput = filesToOuput.concat(sourceMapFiles)
  }

  // return object with properties of file paths
  const outputFilesByPath = {}

  filesToOuput.forEach((file) => {
    const { path: filePath } = file
    outputFilesByPath[filePath] = file
  })

  return outputFilesByPath
}

function getLoader(loaderName) {
  const loaderFilePath = resolve(loaderName)

  if (!loaderFilePath) {
    throw new Error(`failed to get "${loaderName}"`)
  }

  // eslint-disable-next-line
  const loader = require(loaderFilePath).compile

  if (typeof loader !== 'function') {
    throw new Error(`expect "compile" property of function type from "${loaderName}"\n`
     + `but got ${typeof loader}`)
  }

  return loader
}

async function createOptions(opts) {
  const options = Object.assign({}, DEFAULT_OPTIONS, opts)
  const { loader, loaderName, outDir: dir, replaceExt, baseDir } = options

  // validate
  if (!loader && !loaderName) {
    throw new Error('expect "loaderName"')
  }

  if (replaceExt && typeof replaceExt !== 'function') {
    throw new Error('expect "replaceExt" to be a function')
  }

  const outDir = await createOutDir(dir || undefined)

  options.filter = typeof options.filter === 'string' ? createFilterFromString(options.filter) : options.filter
  options.outDir = outDir
  options.absoluteBaseDir = format({ dir: path.resolve(process.cwd(), baseDir) })
  options.absoluteOutDir = format({ dir: path.resolve(process.cwd(), outDir) })

  if (!loader) {
    options.loader = getLoader(loaderName)
  }

  return options
}

function getDiff(lastFiles = {}, files) {
  const filesToOuput = []

  Object.keys(files).forEach((filePath) => {
    const fileContent = files[filePath].content
    const originalFileContent = lastFiles[filePath] ? lastFiles[filePath].content : null

    if (fileContent !== originalFileContent) {
      filesToOuput.push(files[filePath])
    }
  })

  return filesToOuput
}

// TODO: how to deprecate a building process
// keep all states here
async function compile(opts, ctx = {}) {
  const options = ctx.options || await createOptions(opts)

  const {
    filter,
    loader,
    sourceMap,
    replaceExt,
    absoluteBaseDir,
    absoluteOutDir,
  } = options

  const files = await extractFiles(absoluteBaseDir, filter)

  const basicFileInfos = await getFilesInfo(files)

  // repeat
  const rawFileInfos = appendTargetFilePath(
    replaceExt,
    absoluteBaseDir,
    absoluteOutDir,
    basicFileInfos,
  )

  const compiledFiles = await compileFiles(loader, options, rawFileInfos)

  const outputFilesByPath = getOutPutFiles(sourceMap, compiledFiles)

  const filesToOuput = getDiff(ctx.outputFilesByPath, outputFilesByPath)

  await outputFiles(filesToOuput)

  return {
    options,
    compiledFiles,
    outputFilesByPath,
  }
}

module.exports = {
  getOutputSourceFileInfos,
  compileFiles,
  getTargetFilePath,
  appendTargetFilePath,
  createOptions,
  replaceExtToJS,
  getDiff,
  compile,
}
