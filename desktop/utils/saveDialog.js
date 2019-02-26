import electron from 'electron'
const { app, dialog } = electron

/**
{
  title:          String (optional)
  defaultPath:    String (optional)
  buttonLabel:    String (optional) - Custom label for the confirmation button, when left empty the default label will be used.
  filters:        FileFilter[] (optional)
  message String: (optional) macOS - Message to display above text fields.
  nameFieldLabel: String (optional) macOS - Custom label for the text displayed in front of the filename text field.
  showsTagField:  Boolean (optional) macOS - Show the tags input box, defaults to true.

*/
export default function saveDialog (browserWindow, options) {
  options = options instanceof Object ? options : {}
  return new Promise((resolve, reject) => {
    console.log("calling dialog.showSaveDialog")
    const defaultPath = app.getPath('downloads')
    console.log("defaultPath: "+defaultPath)
    dialog.showSaveDialog(browserWindow, {
      title: options.title || 'Save As',
      // https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname
      defaultPath: defaultPath,
      buttonLabel: 'Save',
      //title:          String (optional)
      //defaultPath:    String (optional)
      //buttonLabel:    String (optional) - Custom label for the confirmation button, when left empty the default label will be used.
      //filters:        FileFilter[] (optional)
      //message String: (optional) macOS - Message to display above text fields.
      //nameFieldLabel: String (optional) macOS - Custom label for the text displayed in front of the filename text field.
      //showsTagField:  Boolean (optional) macOS - Show the tags input box, defaults to true.
    }, (filename) => {
      console.log("got filename: "+filename)
      resolve(filename)
    })
  })
}

