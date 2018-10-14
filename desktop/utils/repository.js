
DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED
DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED
DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED DEPRECATED


/*

const fs            = require('fs')
const path          = require('path')
const argv          = require('./argv')
const getAppRoot    = require('./appRoot')

function getRepository() {
  const repositoryPath = path.join(getAppRoot(true), "config", `repository.json`)
  return new Promise((resolve, reject) =>
    fs.readFile(repositoryPath, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error("cannot load repository: "+err))
        return;
      }
      try {
        const repository = JSON.parse(data)
        resolve(repository)
      } catch (err) {
        reject(new Error("cannot load repository: "+err))
      }
    })
  )
}

module.exports = getRepository

*/
