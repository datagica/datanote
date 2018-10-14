// new in Chrome

window.addEventListener('unhandledrejection', function (event) {
  console.log('A rejected promise was unhandled', event.promise, event.reason)
})

window.addEventListener('rejectionhandled', function (event) {
  console.log('A rejected promise was handled', event.promise, event.reason)
})

/*
const reactDevtools = require('electron-react-devtools');
reactDevtools.inject();
reactDevtools.install();
*/

//import {hashHistory} from 'react-router';
//window.debugHashHistory = hashHistory;

// !!!!!!!!!! USE THIS ONLY FOR LIVE DEBUG !!!!!!!!!!!!!!!
window.datanote          = window.datanote          || {}
window.datanote.browser  = window.datanote.browser  || {}
window.datanote.settings = window.datanote.settings || {}
window.datanote.stores   = window.datanote.stores   || {}
window.datanote.views    = window.datanote.views    || {}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
