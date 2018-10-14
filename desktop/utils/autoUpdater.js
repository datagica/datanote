const os = require('os')
const electron = require('electron')
const { app, autoUpdater } = electron

function getAutoUpdater(urlPrefix) {

  autoUpdater.on('checking-for-update', () => {
    console.log("checking-for-update");
  });

  autoUpdater.on('update-available', () => {
    console.log("update-available");
  });

  autoUpdater.on('update-not-available', () => {
    console.log("update-not-available");
  });

  autoUpdater.on('update-downloaded', () => {
    console.log(" update-downloaded");
  });


  const platform = `${os.platform()}_${os.arch()}`
  const version  = app.getVersion()
  const channel  = `/stable`
  const autoUpdateFeedUrl = `${urlPrefix}/${platform}/${version}${channel}`

  console.log("autoUpdateFeedUrl: "+autoUpdateFeedUrl)
  try {
  	autoUpdater.setFeedURL(autoUpdateFeedUrl)
  	autoUpdater.checkForUpdates();
  	console.log("auto-update initialized")
  	//process.exit(1)
  } catch (exc) {
  	console.log("auto-update failed: "+exc)
  	//process.exit(1)
  }
}

module.exports = getAutoUpdater
