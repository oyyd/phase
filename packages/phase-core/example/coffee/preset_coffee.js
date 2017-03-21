/* eslint-disable */
require('babel-polyfill')
const { extname, resolve } = require('path')
const { compileWithCtx } = require('../../lib/compile')
const { emptyDir } = require('../../lib/utils/operations')

const relative = file => resolve(__dirname, file)

const baseDir = relative('./src')
const outDir = relative('./lib')

emptyDir(outDir).then(() => compileWithCtx({
  loaderName: 'phase-preset-coffee',
  baseDir,
  outDir,
  filter: filePath => extname(filePath) === '.coffee',
  watch: true,
  exec: 'node example/coffee/lib/server.js',
})).catch(console.error)
