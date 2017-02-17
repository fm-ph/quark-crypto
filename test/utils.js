import tmp from 'tmp'

function createTmpFile (options) {
  return tmp.fileSync(options)
}

export default {
  createTmpFile
}
