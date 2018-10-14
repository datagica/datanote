const path = require('path')
const electron = require('electron')
const { BrowserWindow, ipcMain } = electron

const electronDebug = require('electron-debug')

const argv          = require('./argv')
const escape        = require('./escape')
const getAppRoot    = require('./appRoot')
// const analytics     = require('./analytics')
const saveDialog    = require('./saveDialog')

// http://electron.atom.io/docs/api/browser-window/

function getOptionsFor2ndScreen (opts) {
  opts = JSON.parse(JSON.stringify(opts))
  const displays = electron.screen.getAllDisplays()
  const d2 = displays.length > 1 ? displays[1] : null
  if (d2) {
    opts.x = (d2.bounds.x + (d2.size.width  - opts.width)  / 2)
    opts.y = (d2.bounds.y + (d2.size.height - opts.height) / 2)
  }
  return opts
}

const WIN_OPTIONS = {

  show            : false, // in order to wait for assets to be loaded
	width           : 1200,
	height          : 600,
  minWidth        : 500,
  minHeight       : 200,

	title           : 'Datanote',
	acceptFirstMouse: true, // to accept a single mouse-down event

	// titleBarStyle: 'hidden',	// see: https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
  frame : false,

	// note: transparent backgrounds have issues with some systems
	// see: https://github.com/electron/electron/blob/master/docs/api/frameless-window.md
	// transparent: true,
	//backgroundColor: 'rgba(0,0,0,0)',
	// vibrancy: 'dark'

  resizable: true,
  movable  : true,
  hasShadow: true,

  webPreferences: {
    experimentalFeatures: false, // don't need that since we now have ES7 support
    subpixelFontScaling : true,
    scrollBounce        : false,
    defaultFontFamily   : 'sansSerif',
    defaultEncoding     : 'utf-8'
  }
}

async function getMainWindow (settings) {

	const mainWindow = new electron.BrowserWindow(
    argv['2nd']
      ? getOptionsFor2ndScreen(WIN_OPTIONS)
      : WIN_OPTIONS
  )

  const appRoot = getAppRoot()

  // activate the dev tools and reload
  electronDebug({ showDevTools: true })
  if (argv.devel) {
    //win.loadURL('http://localhost:8000/dev.html') // no Node context
  }
  mainWindow.loadURL(`file://${appRoot}/html/index.html`) // Node
	mainWindow.openDevTools()

  mainWindow.setTitle(WIN_OPTIONS.title)

  ipcMain.on('close', (event, arg) => {
    console.log('close')
    mainWindow.close()
  })

  ipcMain.on('minimize', (event, arg) => {
    console.log('minimize')
    mainWindow.setFullScreen(false)
    mainWindow.minimize()
  })

  ipcMain.on('fullscreen', (event, arg) => {
    console.log('fullscreen')
    mainWindow.setFullScreen(!mainWindow.isFullScreen())
  })

  ipcMain.on('showSaveDialog', async (event, arg) => {
    console.log('showSaveDialog', arg)
    const filePath = await saveDialog()
    console.log("saveDialog success: "+filepath)
    event.sender.send('showSaveDialog', filepath)
  })

  ipcMain.on('progress', (event, progress) => {
    console.log('progress')
    mainWindow.setProgressBar(progress)
  })

  // mainWindow.webContents.send({ command })

  // wait for assets to be loaded
  // or 'ready-to-show'
  //mainWindow.once('ready-to-show', () => {
  //console.log("settings root path..")
  //console.log("appRoot: "+appRoot)

  // inject the path constant into a global window var
  const workerPath = path.join(appRoot, 'worker.js')
  const workerArgs = []
  if (argv.domain) { workerArgs.push(`--domain=${argv.domain}`) }
  if (argv.api) { workerArgs.push(`--api=${argv.api}`) }

  // console.log("workerPath: "+workerPath)
  // console.log("workerArgs: "+workerArgs)
  /*
  console.log('javascript: ', `Promise.resolve(
    window.workerPath = "${escape(workerPath)}",
    window.workerArgs = "${JSON.stringify(workerArgs)}",
    setTimeout(() => window.main(), 1000)
  )`)
  */

  try {
    await mainWindow.webContents.executeJavaScript(
      `Promise.resolve(
        window.workerPath = "${escape(workerPath)}",
        window.workerArgs = ${JSON.stringify(workerArgs)},
        setTimeout(() => window.main(), 100)
      )`,
      true
    )
  } catch (err) {
    console.error(exc)
  }
  // the app feels less slow to load if we delay the display, because there
  // is less loading time on the splash screen then (so it will feel like
  // it's the user's OS which is slow!)
  setTimeout(() => { mainWindow.show() }, 1000)

  /*
	if (appMenu) {
		Menu.setApplicationMenu(appMenu)
		appMenu = null
	}
  */

	return mainWindow
}

module.exports = getMainWindow
