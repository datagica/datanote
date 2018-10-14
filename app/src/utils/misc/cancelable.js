export default function cancelable (promise) {
  let hasCanceled = false
  return {
    promise: new Promise((resolve, reject) => {
      promise.then((val)    => hasCanceled ? reject({ isCanceled: true }) : resolve(val))
      promise.catch((error) => hasCanceled ? reject({ isCanceled: true }) : reject(error))
    }),
    cancel() {
      hasCanceled = true
    }
  }
}
