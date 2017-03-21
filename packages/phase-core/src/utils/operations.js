const fs = require('fs-extra')
const { promisify } = require('./index')

const readdir = promisify.bind(null, fs.readdir)
const stat = promisify.bind(null, fs.stat)
const readFile = promisify.bind(null, fs.readFile)
const outputFile = promisify.bind(null, fs.outputFile)
const emptyDir = promisify.bind(null, fs.emptyDir)
const ensureDir = promisify.bind(null, fs.ensureDir)

module.exports = {
  readdir,
  stat,
  readFile,
  outputFile,
  emptyDir,
  ensureDir,
}
