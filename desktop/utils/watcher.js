'use strict'

import fs from 'fs'
import cp from 'child_process'
import net from 'net'
import config from '../config/electron.json'

var client = null

function connect() {
  return net.connect({port: config.port}, function () {
    if (client !== null) {
      client.write('hello');
    }
  });
}

function start(app) {
  if (client === null) {
    client = connect();
    client.on('data', function (data) {
      app.quit();
      client.end();
      client = null;
    });
  }
}

export default function Watcher (app, files) {
  const opts = { persistent: true, recursive: true };
  files.forEach(file => {
    fs.watch(file, opts, function (event, filename) {
      start(app);
    });
  });
}
