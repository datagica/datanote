/**
 * A permissive number getter, to read number from text
 */
export default function tryToGetNumber(x) {
  const y = Number(x === '' ? 'x' : x)
  if (isNaN(y) || !isFinite(y)) {
    return null
  } else {
    return y
  }
}
