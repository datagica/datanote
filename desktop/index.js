'use strict'

import electron from 'electron'
const { app, ipcMain } = electron

// native modules
import notifier from 'node-notifier'
import opn from 'opn'
import { getFreePort } from 'endpoint-utils'

// our own utilities
import getSettings from './utils/settings'
import getDatabase from './utils/database'
import getDatanoteApi from './utils/datanoteApi'
import getToolbar from './utils/toolbar'
import getMainWindow from './utils/mainWindow'
import getAutoUpdater from './utils/autoUpdater'
import watcher from './utils/watcher'
import quitter from './utils/quitter'
import preventMultipleInstances from './utils/preventMultipleInstances'

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

  const lock = preventMultipleInstances(context)
  if (!lock) {
    return quit("Datanote is already running")
  }

  process.on('exit', () => quit("operating system asked us to leave"))
  process.on('SIGINT', () => quit("received a SIGINT"))
  app.on('window-all-closed', () => quit("user closed all windows"))
  app.on('activate-with-no-open-windows', () => {
    console.log("activate with no open windows => what should we do?")
    // if (!context.mainWindow) { context.mainWindow = getMainWindow() }
  })

  try {
    const settings = await getSettings()
    const port = await getFreePort()
  
    await getDatanoteApi(settings)

    context.db = getDatabase(settings, port)
    await context.db.start()

    await startApp(settings)
  } catch (err) {
    quit(err, 1)
  }
}

main()