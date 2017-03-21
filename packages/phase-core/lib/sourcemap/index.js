"use strict";

function getSourceMapOutputFiles(compiledFileInfos) {
  return compiledFileInfos.filter(function (info) {
    return info.sourceMap;
  }).map(function (info) {
    return {
      content: JSON.stringify(info.sourceMap),
      path: info.targetFilePath + ".map"
    };
  });
}

function appendSupport(code, targetFilePath) {
  return code + "\n//# sourceMappingURL=" + targetFilePath + ".map";
}

module.exports = {
  appendSupport: appendSupport,
  getSourceMapOutputFiles: getSourceMapOutputFiles
};