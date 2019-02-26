const path = require('path')
const minimist = require('minimist')

const args = minimist(process.argv.slice(2))

const parentDir = path.dirname(process.mainModule.filename)
// console.log("parentDir: "+parentDir)
args.devel = Boolean(
  typeof args.devel !== 'undefined'
    ? args.devel
    // : parentDir.match(/^[\/\\]desktop[\/\\]?/gi)
    : parentDir.match(/[\/\\]desktop(?:[\/\\]node_modules[\/\\]electron-prebuilt-compile[\/\\]lib[\/\\])?/gi)
)

// cannot use export here because it will be called from browser code!
module.exports = args
