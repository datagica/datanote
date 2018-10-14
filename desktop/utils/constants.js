
// some constants
const constants = {
  apiUrl: 'wss://beta-api.datanote.io',
  enabledSources: [
    '@datagica/backend-source-api',
    '@datagica/backend-source-filesystem',
    '@datagica/backend-source-database',
    '@datagica/backend-source-social',
    '@datagica/backend-source-note',
    // '@datagica/backend-source-web',
    // '@datagica/backend-source-bigdata',
    // '@datagica/backend-source-mail',
    // '@datagica/backend-source-search'
  ],
  graphConfig: {
    host: "localhost",
    storage: "plocal",
    type: "graph",
    reset: false,
    debug: false,
    username: "root",
    password: "hirejitsu",
  },
  defaultUsers: {
    // necessary for free browsing of local databases / projects
    guest: {
      resources: "connect,server.listDatabases,server.dblist",
      password: "guest"
    }
  }
}

module.exports = constants
