import electron from 'electron'
const { app } = electron

function quitNow(errorCode) {
  console.log("politely asking Electron to leave..")
  app.quit(errorCode)

  setTimeout(() => {
    console.error("Electron refused to leave, calling the cops..")
    process.exit(errorCode)
  }, 2000)
}

export default function quitter (context) {

  return function(msg, errorCode) {

    errorCode = typeof errorCode === 'Number' ? errorCode : 0

    if (errorCode === 0) {
      console.log(msg)
    } else {
      console.error(msg)
    }

    delete context.mainWindow;
    if (context.isExiting) return;
    context.isExiting = true;

    console.log("closing Datanote..")
    if (typeof context.db === 'undefined' || context.db === null || typeof context.db.stop !== 'function') {
      console.error("exiting now since there is no database server to stop")
      quitNow(errorCode)
      return
    }

    console.log("program exit requested, stopping database..")
    const stopped = context.db.stop()

    if (typeof stopped === 'undefined' || typeof stopped.then !== 'function') {
      console.error("couldn't stop the database server: no promise")
      quitNow(1)
      return
    }

    stopped.then(done => {
      console.log("successfully stopped the database server")
      quitNow(errorCode)
    }).catch(err => {
      console.error("couldn't stop the database server: "+err)
      quitNow(1)
    })
  }

}
