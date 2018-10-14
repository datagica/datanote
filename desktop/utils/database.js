const path       = require('path')
const OrientDB   = require('@datagica/orientdb-server')
const argv       = require('./argv')
const getAppRoot = require('./appRoot')
const constants  = require('./constants')

function getDatabase(settings, port) {

  // console.log('settings: ', settings)
  // console.log('database: ', JSON.stringify(settings.get('database')))
  const { username, password } = settings.get('database')

  // console.log('username: ', username)
  // console.log('password: ', password)

  const serverDatabasePath = settings.paths.databases

  // console.log('serverDatabasePath: ', serverDatabasePath)

  // console.log("There is a free TCP port we can use for OrientDB: "+port)

  // FIXME this is probably not necessary anymore
  process.env['ORIENTDB_ROOT_PASSWORD'] = password

  // console.log("rootPath: "+path.join(getAppRoot(true), "node_modules","@datagica","orientdb-server"))

  const orientDbConfig = {
    rootPath: path.join(getAppRoot(true), "node_modules","@datagica","orientdb-server"),
    initTimeout: 10000, // important to set a delay large enough (ie. larger than 2 seconds)
    debug: argv.devel,
    pipe: true, // false, // true, //
    properties: {
      serverDatabasePath: serverDatabasePath,
      //isAfterFirstTime: true
    },
    users: constants.defaultUsers
  }

  orientDbConfig.users[username] = {
    password: password,
    resources: '*'
  }
  
  console.log("orientDbConfig: "+JSON.stringify(orientDbConfig, null, 2))

  return new OrientDB(orientDbConfig)
}

module.exports = getDatabase
