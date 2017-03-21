const { compileWithCtx } = require('phase-core')

async function compile(data) {
  // const { outDir, target } = data
  try {
    await compileWithCtx(data)
  } catch (err) {
    // eslint-disable-next-line
    console.error(err)
    process.exit()
  }
}

async function handleMessage(task, data) {
  switch (task) {
    case 'start': {
      compile(data)
      break
    }
    default: {
      throw new Error(`unexpected task: "${task}"`)
    }
  }
}

module.exports = {
  compile,
  handleMessage,
}
