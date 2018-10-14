const path = require('path')
const argv = require('./argv')
const parentDirName = path.dirname(process.mainModule.filename).split(path.delimiter).pop()

function getAppRoot(unpacked) {

  // get out of the "utils/" directory
  const appRoot = path.resolve(__dirname, path.join(".."))

  // console.log("appRoot: "+appRoot)
  // console.log("argv.devel: "+argv.devel)
  // console.log("parentDirName: "+parentDirName)

  if (argv.devel) {
    return appRoot;
  }

  // in production, we might want to optionnal access the unpacked asar..
  if (unpacked) {
    return path.resolve(appRoot, path.join("..", "app.asar.unpacked"))
  }

  return appRoot
}

module.exports = getAppRoot
