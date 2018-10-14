//console.log("[worker.js] started")

const stringify   = require('json-stringify-safe')
const Backend     = require('@datagica/datanote-desktop-engine')
const argv        = require('./utils/argv')
const getSettings = require('./utils/settings')
const constants   = require('./utils/constants')

// to catch our first "handshake" message we need to listen to 'message' at the
// top of the call stack, hence we have to buffer commands until we are
// able to respond to them
let handleMessage = null
const msgQueue = []
process.on('message', function(message) {
  //console.log("[worker] received message: "+JSON.stringify(message, null, 2))
  if (!handleMessage) {
    //console.log("[worker.js] buffering..")
    msgQueue.push(message)
  } else {
    while (msgQueue.length) {
      //console.log("[worker.js] unwrapping queue..")
      handleMessage(msgQueue.pop())
    }
    //console.log("[worker.js] handling immediately..")
    handleMessage(message)
  }
})

process.on('uncaughtException', function(err){
  console.error("[worker.js] error: " + err.message + "\n" + err.stack);
})


console.log("[worker.js] getting local user settings..")
getSettings().then(userSettings => {

  /*
  console.log("[worker.js] generating backend configuration..")
  // TODO make the "graph" dynamic (and maybe call it "project"), so we can switch databases later
  console.log('[worker.js] debug : '+JSON.stringify({
    userSettings: userSettings,
  }, null, 2))
  */

  const finalGraphSettings = Object.assign({}, constants.graphConfig)

  const userGraphSettings = userSettings.get('database') || {}
  finalGraphSettings.port = userGraphSettings.port || finalGraphSettings.port
  finalGraphSettings.username = userGraphSettings.username || finalGraphSettings.username
  finalGraphSettings.password = userGraphSettings.password || finalGraphSettings.password
  finalGraphSettings.name = userGraphSettings.name || finalGraphSettings.name

  const finalApiSettings = {}

  const userApiSettings = userSettings.get('api') || {}
 
  finalApiSettings.url = argv.api || userApiSettings.url || constants.apiUrl
  finalApiSettings.login = userApiSettings.login
  finalApiSettings.token = userApiSettings.token
  finalApiSettings.domain = userApiSettings.domain

  /*
  console.log('DEBUG THIS: ' + JSON.stringify({
    argv: argv,
    userApiSettingsUrl: userApiSettings.url,
    constantsApiUrl: constants.apiUrl,
    finalApiSettings: finalApiSettings,
  }))
  */

  /*
  console.log('[worker.js] creating a backend using this config: ' + 
    JSON.stringify({
    version: userSettings.version,
    graph: finalGraphSettings,
    sources: constants.enabledSources,
    api: finalApiSettings,
  }, null, 2))
  */

  const backend = new Backend({
    version: userSettings.version,
    graph: finalGraphSettings,
    sources: constants.enabledSources,
    api: finalApiSettings,
  })

  // console.log("created instance of backend");

  // auto-init the backend (warning: might take up to 50 seconds to load the
  // world cities dataset)

  const APIs = {
    Backend: backend
  };

  // console.log("[worker.js] attaching listener..")

  handleMessage = message => {

    //console.log("[worker.js] handleMessage: got message: "+JSON.stringify(message, null, 2))

    const api = APIs[message.api];
    if (typeof api === 'undefined' || api == null) {
      const apiErr = "no API for "+message.api;
      console.error(apiErr);
      process.send({
        role: message.role,
        id:   message.id,
        api:  message.api,
        func: message.func,
        error: `${apiErr}`
      });
      return;
    }

    const func = api[message.func];

    if (typeof func !== 'function') {
      const funcErr = "no function for "+message.func;
      console.error(funcErr);
      process.send({
        role: message.role,
        id:   message.id,
        api:  message.api,
        func: message.func,
        error: funcErr
      });
      return;
    }

    try {
      const inputData = message.data;
      //console.log("LocalAPI: calling func.apply(api, inputData)")
      const prom = func.apply(api, inputData);
      //console.log("LocalAPI: calling prom.then")
      prom.then(function(outputData) {
        //console.log("LocalAPI: got result, calling process.send")
        try {
          process.send({
            role: message.role,
            id:   message.id,
            api:  message.api,
            func: message.func,
            data: outputData
          });
        } catch(err){
          console.error("[worker.js] failed to send response, data probably has circular references: "+stringify(outputData));
          process.send({
            role: message.role,
            id:   message.id,
            api:  message.api,
            func: message.func,
            error: 'failed to send response, data probably has circular references'
          });
        }
      }).catch(function(exc) {
        const promiseErr = ""+exc.stack;
        console.error(exc.stack);
        process.send({
          role: message.role,
          id:   message.id,
          api:  message.api,
          func: message.func,
          error: `${promiseErr}`
        });
      })
    } catch (exc){
      console.error("[worker.js] something bad arrived: "+ exc);
      const globalErr = ""+exc.stack;
      console.error(exc.stack);
      process.send({
        role: message.role,
        id:   message.id,
        api:  message.api,
        func: message.func,
        error: `${globalErr}`
      });
    }

  }
  while (msgQueue.length) {
    //console.log("[worker.js] unwrapping queue..")
    handleMessage(msgQueue.pop())
  }
}).catch(err => {
  console.error("[worker.js] couldn't get settings: "+err)
})
