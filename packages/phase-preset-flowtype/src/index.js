const { resolve } = require('path')
const { transform } = require('babel-core')

const packageModules = name => resolve(__dirname, '../node_modules/', name)

function compile(options, source) {
  const { compileOptions, sourceMap, filename, targetFilename } = options

  const { code, map } = transform(source, {
    moduleRoot: __dirname,
    sourceRoot: __dirname,
    babelrc: false,
    filename,
    sourceMaps: sourceMap,
    presets: [packageModules('babel-preset-flow')],
  })

  return {
    code,
    sourceMap: map,
  }
}

module.exports = {
  compile,
}
