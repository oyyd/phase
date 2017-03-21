/* eslint-disable */
require('babel-polyfill')
const { extname, resolve } = require('path')
const { compileWithCtx } = require('../../lib/compile')
const { emptyDir } = require('../../lib/utils/operations')

const relative = file => resolve(__dirname, file)

const baseDir = relative('./src')
const outDir = relative('./lib')

emptyDir(outDir).then(() => compileWithCtx({
  loaderName: 'phase-preset-flowtype',
  baseDir,
  outDir,
  filter: filePath => extname(filePath) === '.js',
  watch: true,
  exec: 'node example/flowtype/lib/server.js',
})).catch(console.error)
