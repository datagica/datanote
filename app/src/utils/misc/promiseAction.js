import {runInAction} from 'mobx'

export function promiseAction (cb) {
  return new Promise(function (resolve, reject) {
    runInAction(function () {
      try {
        resolve(Promise.resolve(cb()))
      } catch(err) {
        reject(err)
      }
    })
  })
};
