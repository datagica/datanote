'use strict'

export class ProcessPool {

  constructor(workers) {

    workers = Array.isArray(workers) ? workers : []

    this.id = 0

    this.pending = {}
    this.workers = workers

    this.workers.forEach(worker => {
      worker.instance.on('message', msg => {
        worker.load--
        //console.log("received data from childProcess:", msg)
        //console.log("ProcessPool > worker: received message from childProcess")
        if (typeof msg !== 'undefined' && typeof msg.id === 'number') {

          const pending = this.pending[msg.id]

          if (typeof pending !== 'undefined') {
            delete this.pending[msg.id]
            if (typeof pending.error !== 'undefined') {
              //console.log("rejecting", msg.error)
              pending.reject(msg.error)
            } else {
              //console.log("resolving", msg.data)
              pending.resolve(msg.data)
            }

          } else {
            console.log("received a zombie message: ", msg)
          }
        }
      })
      worker.instance.on('data', data => {
        //console.log("ProcessPool > worker: received data from childProcess")
        //console.log(data)
      })
      worker.instance.on('error', err => {
        console.error(err)
      })
    })
  }

  call (opts) {

    //console.log("workers: ", this.workers)

    if (this.workers.length < 1) return Promise.reject(new Error ("[ProcessPool.call] no worker available"))

    return new Promise((resolve, reject) => {

      if (this.id >= Number.MAX_SAFE_INTEGER) this.id = 0;

      opts.id = this.id++

      this.pending[opts.id] = {
        resolve: resolve,
        reject:  reject
      }

      if (opts.broadcast) {
        this.workers.forEach(worker => {
          worker.instance.send(opts)
        })
      } else {
        // send a job to the worker with the least busy one
        const worker = this.workers.sort((a, b) => a.load - b.load)[0]
        worker.load++
        worker.instance.send(opts)
      }

    })
  }
}


export const canFork = (
  window
  && window.node
  && window.node.child_process
  && window.node.child_process.fork instanceof Function
);
export function spawnInstance (prefix, path, args, silent, maxBuffer, bufferInterval) {

  args = Array.isArray(args) ? args : typeof args === 'string' ? [ args ] : []

  const child = window.node.child_process.fork(
    path,
    args,
    {
      silent: silent ,
      execArgv: ['--harmony', '--max-old-space-size=5120','--max_old_space_size=5120']
    })

    /*
  console.log("[spawnInstance] ", {
    prefix: prefix,
    path: path,
    silent: silent,
    maxBuffer: maxBuffer,
    bufferInterval: bufferInterval
  })
  */

  let buffText = "";
  let buffAll  = "";
  let buffJson = "";

  function bufferedConsole (func, data) {
    console.log(data.toString())
    return;
    var str = data.toString().split('');
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      buffAll += c;
      if (!buffJson) {
        if (c === "{" || c === "[") {
          buffJson += c
        } else {
          buffText += c
        }
      } else {
        buffJson += c
        try {
          var test = JSON.parse(buffJson)
          // success!
          console[func](prefix+buffText, test)
          buffText = ""
          buffJson = ""
          buffAll  = ""
        } catch (err) {} // never catch, it just means there is no json yet
      }
    }
  }

  setInterval(function() {
    if (!buffJson || buffAll.length > maxBuffer) {
  	 	if (buffAll.length) console.log(prefix+buffAll)
  	 	// force reset
  	 	buffText = ""
  	 	buffJson = ""
  	 	buffAll  = ""
   }
 }, bufferInterval)

  if (child.stdout != null) child.stdout.on('data', data => bufferedConsole('log',   data));
  if (child.stderr != null) child.stderr.on('data', data => bufferedConsole('error', data));

  child.on('close', code => console.log(`child process exited with code ${code}`));

  //console.log("[spawnInstance] got child", child)
  return child
}

export function processPool (opts) {

  opts = typeof opts !== 'undefined' ? opts : {};

  // console.log("opts: "+JSON.stringify(opts, null, 2))
  // console.log("fucking window: ", window)
  // console.log("debug: "+JSON.stringify({ workerPath: window.workerPath, workerArgs: window.workerArgs }, null, 2))
  const size   = typeof opts.size   === 'number'  ? opts.size   : 1
  //const path   = typeof opts.path   === 'string'  ? opts.path   : window.workerPath
  const path = window.workerPath
  const args = window.workerArgs
  const silent = typeof opts.silent === 'boolean' ? opts.silent : true
  const api    = typeof opts.api    === 'string'  ? opts.api    : 'Backend'

  const maxBuffer      = 50000 // how many console output chars to store
  const bufferInterval = 200   // how long should we wait for some JSON

  /*
  console.log("processPool options: "+JSON.stringify({
    size: size,
    path: path,
    silent: silent,
    api: api
  }, null, 2))
  */

  const instances = [];

  if (!canFork) {
    console.log("cannot fork")
  } else {
    console.log(`forking ${size} instances..`)
    for (let i = 0; i < size; i++) {
      console.log("[processPool] spawning instance "+i + " with args: "+ JSON.stringify(args))
      instances.push({
        instance: spawnInstance(`[instance ${i}] `, path, args, silent, maxBuffer, bufferInterval),
        load: 0,
        i: i
      })
    }
  }

  //console.log("[process-pool.js] creating new instance of ProcessPool..")
  const pool = new ProcessPool(instances)

  //console.log("[process-pool.js] building function..")
  return function(func, p1, p2, p3, p4, p5, p6) {
    /*console.log("[process-pool.js] called function ", {
      func: func,
      p1: p1,
      p2: p2,
      p3: p3,
      p4: p4,
      p5: p5
    })*/
    //console.log("[process-pool.js] calling pool.call")
    return pool.call({
      broadcast: func === 'init', //  if func is init, then call ALL the instances in the pool
      api:  api,
      func: func,
      // data: Array.prototype.slice.call(arguments).slice(1)
      data: [p1, p2, p3, p4, p5, p6]
    })
  }
}
