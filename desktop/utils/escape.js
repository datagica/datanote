

export default function escape (str) {
  return str.replace(/\\/gi, "\\\\")
}
