const mm = require('micromatch')

function promisify(func, ...args) {
  return new Promise((resolve, reject) => {
    func(...args, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      resolve(result)
    })
  })
}

function createFilterFromString(string) {
  return items => mm(items, string)
}

module.exports = {
  promisify,
  createFilterFromString,
}
