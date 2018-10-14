
const fetch = require('node-fetch')

// store stuff
const freeStorePlugins    = {};
const premiumStorePlugins = {};
const downloadedPlugins   = {};


const runningInstances = {
  sources: {},
  sourcesQueue: [],
  sourcesMax: 1,
  parsers: {},
  parsersQueue: [],
  parsersMax: 1
};

const credentials = {
  apiToken: "OPENBAR"
}

function downloadRepository() {

}
function askTheApi() {
  // GET http://download.myapp.com/api/version
}

/**
 *
 * Connect to Squirrel and ask for the full list of plugins
 *
 */
function listPluginsFromStore() {

}


/**
 *
 * Connect to Squirrel and ask for the full list of plugins
 *
 */
function buyPlugin() {
  // for now, it's free!
}


/**
 * Require a plugin. Typically called when hydrating a project.
 */
function requirePlugin(moduleName) {
}

/**
 * Run a plugin n a separate thread
 */
function runPlugin(moduleName) {

}

/**
 * Pass some data to a plugin instance
 */
function callPlugin(instanceId, params) {

}

/**
 * Stop a plugin
 */
function stopPlugin(instanceId) {

}


/**
 * Upgrade a plugin
 */
function upgradePlugin(instanceId) {
  // look for a fresher version available to the current user
}
