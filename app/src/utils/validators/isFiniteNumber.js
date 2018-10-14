export default function (input) {
  return typeof input === 'number' && !isNaN(input) && isFinite(input)
}
