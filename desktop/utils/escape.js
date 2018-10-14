

module.exports = function escape(str) {
  return str.replace(/\\/gi, "\\\\")
}
