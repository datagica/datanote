'use strict'

const electron = require('electron')
const { app, ipcMain } = electron

// native modules
const notifier      = require('node-notifier')
const opn           = require('opn')
const getFreePort   = require('endpoint-utils').getFreePort

// our own utilities
const getSettings     = require('./utils/settings')
const getDatabase     = require('./utils/database')
const getToolbar      = require('./utils/toolbar')
const getMainWindow   = require('./utils/mainWindow')
const getAutoUpdater  = require('./utils/autoUpdater')
const watcher         = require('./utils/watcher')
const quitter         = require('./utils/quitter')
const alreadyRunning  = require('./utils/alreadyRunning')

////////////////////////////////////////////////////////////////////////////////

// Datanote is a memory hog
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096 --harmony')

// mutable variables - used to share data among windows, instances..
const context = {
  mainWindow: null,
  database  : null,
	isExiting : false
}

const quit = quitter(context)

async function startApp (settings) {

  // console.log("running web app..")

  if (process.env.DEV) {
    console.log("dev mode: watching index.js and current dir..")
    watcher(app, ['../index.js', '.'])
  }

  // console.log("NOT initializing auto-updater..")
  //const autoUpdater = getAutoUpdater('localhost:5000/update')

  // ATTENTION: loading the mini toolbar icon will mae the big toolbar icon disappear!!
  // const toolbar = getToolbar()

  context.mainWindow = await getMainWindow(settings)

  context.mainWindow.on('unresponsive', () => {
    console.error(`CRITICAL: the browser window has become unresponsive!`)
    // instead of quitting the app, we should just reload it
    // quit(1)
  })

  context.mainWindow.webContents.on('crashed', () => {
    console.error(`FATAL: the browser window has crashed!`)
    // instead of quitting the app, we should just reload it
    // quit(1)
  })

  context.mainWindow.on('closed', () => quit("main window is now closed"))
}

async function main () {

  process.on('exit',                      () => quit("operating system asked us to leave"))
  process.on('SIGINT',                    () => quit("received a SIGINT"))
  app.on('window-all-closed',             () => quit("user closed all windows"))
  app.on('activate-with-no-open-windows', () => {
    console.log("activate with no open windows => what should we do?")
    // if (!context.mainWindow) { context.mainWindow = getMainWindow() }
  })

  try {
    const settings = await getSettings()
    const port = await getFreePort()
    context.db = getDatabase(settings, port)
    await context.db.start()
    await startApp(settings)
  } catch (err) {
    quit(err, 1)
  }
}

////////////////////////////////////////////////////////////////////////////////

if (alreadyRunning(context)) {
  quit("Datanote is already running")
} else {
  main()
}
