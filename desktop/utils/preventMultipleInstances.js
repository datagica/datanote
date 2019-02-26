import electron from 'electron'
const { app } = electron

export default async function preventMultipleInstances (context) {
  return new Promise((resolve, reject) => {
    const lock = app.requestSingleInstanceLock()
    if (lock) {
      app.on('second-instance', (event, commandLine, workingDirectory) => {
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
    resolve(lock)
  })  
}