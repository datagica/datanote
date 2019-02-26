const fs = require('fs')
const path = require ('path')
const LocalSettings = require('@datagica/local-settings')
const argv = require ('./argv')
const getAppRoot = require ('./appRoot')

function getSettings () {
  // console.log("argv: "+JSON.stringify(argv))
  const domain = typeof argv.domain === 'string' ? argv.domain : 'detective'
  // const api = typeof argv.api === 'string' ? argv.api : 'wss://beta-api.datanote.io'
  // console.log("appRoot: "+getAppRoot(true))
  // note: here we ask for the unpacked version, however all things considered
  // that might be necessary
  const configPath = path.join(getAppRoot(true), "config", `${domain}.json`)

  // console.log("configPath: "+configPath)

  return new Promise((resolve, reject) =>
    fs.readFile(configPath, 'utf-8', (err, data) => {
      if (err) {
        reject(new Error("cannot load config: "+err))
        return;
      }
      try {
        
        // console.log("DATA: "+data)
        data = JSON.parse(data)
        data.database.name = 'datanote-beta'
        const settings = {
          name: `Datanote Beta`, // data.name,
          app: `datanote-beta`, // data.app,
          vendor: data.vendor,
          version: data.version,
          defaults: {
            debug: data.debug,
            api: data.api,
            database: data.database,
          }
        }
        console.log("settings: "+JSON.stringify(settings, null, 2))
        const localSettings = new LocalSettings(settings)
        // console.log("localSettings: "+JSON.stringify(localSettings, null, 2))
        resolve(localSettings)
      } catch (err) {
        reject(new Error("cannot load config: "+err))
      }
    })
  )
}

module.exports = getSettings