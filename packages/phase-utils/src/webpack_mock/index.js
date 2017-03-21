/**
 * currently compatible loaders: babel
 */

// TODO: do cache

// try to be compatible with webpack loaders
class WebpackContext {
  constructor(options, sourceMap, localOptions, filename, targetFilename) {
    // context properties
    this.isCacheable = false
    this.options = options
    this.sourceMap = sourceMap
    // TODO: provide absolute path
    this.currentRequest = targetFilename
    this.remainingRequest = filename
    // TODO: check the 1.x version of loader utils
    this.query = null

    // bind
    this.callback = this.callback.bind(this)

    // output
    this.doneDeferred = Promise.defer()
    this.done = this.doneDeferred.promise
  }

  cacheable() {
    this.isCacheable = true
  }

  // the loader would return the result asyncly
  async() {
    return this.callback
  }

  callback(error, code, sourceMap) {
    if (error) {
      this.doneDeferred.reject(error)
      return
    }

    this.doneDeferred.resolve({
      code, sourceMap,
    })
  }
}

async function compileWebpackLoader(options, source) {
  const { compileFunc, compileOptions, sourceMap, filename, targetFilename } = options
  const context = new WebpackContext(compileOptions, sourceMap, null, filename, targetFilename)

  try {
    compileFunc.call(context, source)
  } catch (err) {
    context.doneDeferred.reject(err)
  }

  return context.done
}

module.exports = {
  compileWebpackLoader,
  WebpackContext,
}
