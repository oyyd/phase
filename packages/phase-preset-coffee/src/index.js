const compileCoffee = require('coffee-loader')
const { compileWebpackLoader } = require('phase-utils')

function compile(options, source) {
  const { compileOptions, sourceMap, filename, targetFilename } = options

  return compileWebpackLoader({
    compileFunc: compileCoffee,
    compileOptions: compileOptions || {},
    sourceMap,
    filename,
    targetFilename,
  }, source)
}

module.exports = {
  compile,
}
