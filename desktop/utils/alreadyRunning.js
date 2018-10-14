const electron = require('electron')
const { app } = electron

module.exports = (context) => {
  return app.makeSingleInstance((commandLine, workingDir) => {
    // Someone tried to run a second instance, we should focus our window.
    console.log("someone tried to run a second instance!")
    if (context && context.mainWindow) {
      if (context.mainWindow.isMinimized()) {
        context.mainWindow.restore()
      }
      context.mainWindow.focus()
    }
  })
}
