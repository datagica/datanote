'use strict'

// TODO put inside a separate library
class IPCPromise {
  constructor(ipc) {
    this.id = 0;
    this.ipc = ipc;
    this.listeners = {};
    this.promises = {};
  }

  call(channel, payload) {
    const id = 0 + this.id;

    // console.log("call " + channel + " id: " + id);
    this.id += 1;

    return new Promise((resolve, reject) => {
      if (typeof this.listeners[channel] === 'undefined') {
        // console.log("constructing new listener for channel " + channel);
        this.promises[channel] = [];
        this.listeners[channel] = (data) => {
          // console.log("got data: " + JSON.stringify(data));
          const matched = [];
          this.promises[channel] = this.promises[channel].reduce((acc, promise) => {
            if (promise.id == data.id) {
              matched.push(promise);
              return acc;
            } else {
              return acc.concat([promise]);
            }
          }, []);
          matched.map(promise => {
            setTimeout(function() {
              // console.log("HERE");
              if (data.error) {
                promise.reject(data.error);
              } else {
                promise.resolve(data.data);
              }
            }, 0);
          });
        };

        this.ipc.on(channel, this.listeners[channel]);
      };
      // console.log("saving current promise context for " + channel);
      this.promises[channel].push({
        channel: channel,
        id: id,
        resolve: resolve,
        reject: reject
      });
      // console.log("sending payload to " + channel);
      this.ipc.send(channel, {
        id: id,
        data: payload
      });
    });
  }
}

export default IPCPromise;
