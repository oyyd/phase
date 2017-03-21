type Account = {
  name: String,
}

const name: string = 'oyyd'

function createError() {
  return new Error(name)
}

throw createError()

console.log(name)
