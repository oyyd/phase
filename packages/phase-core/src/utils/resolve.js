// from: https://github.com/babel/babel/blob/master/packages/babel-core/src/helpers/resolve.js
const path = require('path')
const Module = require('module')

const relativeModules = {}

function resolve(loc, relative = process.cwd()) {
  if (typeof Module === 'object') return null

  let relativeMod = relativeModules[relative]

  if (!relativeMod) {
    relativeMod = new Module()

    const filename = path.join(relative, '.phaserc')
    relativeMod.id = filename
    relativeMod.filename = filename

    relativeMod.paths = Module._nodeModulePaths(relative)
    relativeModules[relative] = relativeMod
  }

  try {
    return Module._resolveFilename(loc, relativeMod)
  } catch (err) {
    return null
  }
}

module.exports = {
  resolve,
}
