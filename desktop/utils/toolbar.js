const menubar    = require('menubar')
const getAppRoot = require('./appRoot')

function getToolbar () {

	const dir = `file://${getAppRoot()}/html`

	const indexPath = `${dir}/systempopin.html`
  const iconPath  = `${dir}/assets/toolbar.png`

	const mb = menubar({

		//you can pass an optional options object into the menubar constructor

		//dir (default process.cwd()) - the app source directory
		index: indexPath, // `(default file:// + opts.dir + index.html) - the html to load for the pop up window
		icon: iconPath, // (default opts.dir + IconTemplate.png) - the png icon to use for the menubar. A good size to start with is 20x20. To support retina, supply a 2x sized image (e.g. 40x40) with @2x added to the end of the name, so icon.png and icon@2x.png and Electron will automatically use your @2x version on retina screens.
		//tooltip (default empty) - menubar tray icon tooltip text
		//tray (default created on-the-fly) - an electron Tray instance. if provided opts.icon will be ignored
		preloadWindow: true, // (default false) - Create BrowserWindow instance before it is used -- increasing resource usage, but making the click on the menubar load faster.
		width: 280, // (default 400) - window width
		height: 300, // (default 400) - window height
		//x: null, // (default null) - the x position of the window
		//y: null, // (default null) - the y position of the window
		//alwaysOnTop: false, // (default false) - if true, the window will not hide on blur
		//showOnAllWorkspaces: true, //  (default true) - Makes the window available on all OS X workspaces.
		//windowPosition: trayCenter, // (default trayCenter and trayBottomCenter on Windows) - Sets the window position (x and y will still override this), check positioner docs for valid values.
		//showDockIcon: false, // (default false) - Configure the visibility of the application dock icon.
		//showOnRightClick: false, // (default false) - Show the window on 'right-click' event instead of regular 'click'

	});

	mb.on('ready', () => {
	  console.log('menu is ready');

	  // your menu bar code here

		/*
		{
		  app: the electron require('app') instance,
		  window: the electron require('browser-window') instance,
		  tray: the electron require('tray') instance,
		  positioner: the electron-positioner instance,
		  setOption(option, value): change an option after menubar is created,
		  getOption(option): get an menubar option,
		  showWindow(): show the menubar window,
		  hideWindow(): hide the menubar window
		}
		*/
	})

  return mb;
}

module.exports = getToolbar
