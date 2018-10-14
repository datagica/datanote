export default function delay (duration) {
  return new Promise(function (resolve) {
    setTimeout(resolve, duration)
  })
}
