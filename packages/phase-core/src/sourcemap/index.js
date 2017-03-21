function getSourceMapOutputFiles(compiledFileInfos) {
  return compiledFileInfos.filter(info => info.sourceMap).map(info => ({
    content: JSON.stringify(info.sourceMap),
    path: `${info.targetFilePath}.map`,
  }))
}

function appendSupport(code, targetFilePath) {
  return `${code}\n//# sourceMappingURL=${targetFilePath}.map`
}

module.exports = {
  appendSupport,
  getSourceMapOutputFiles,
}
