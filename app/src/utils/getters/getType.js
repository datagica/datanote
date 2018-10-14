export default function getType(id) {
  if (typeof id === 'undefined' || id === null) return;

  const a = `${id}`.split(':')[1]
  // console.log("a: "+a)
  if (typeof a !== 'string') return;
  const b = a.split('__')[0]
  // console.log("b: "+b)
  if (typeof b !== 'string') return;
  return b
}
