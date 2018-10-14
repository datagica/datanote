/**
 * limit the number of calls to a certain function
 */
export default function (time = 50) {
  const throttle = function(cb) {
    if (throttle.timeout !== null) {
      clearTimeout(throttle.timeout)
    }
    (throttle.timeout = setTimeout(function () {
      throttle.timeout = null
      cb()
    }, time))
  }
  return throttle
}
