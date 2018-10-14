
/**
 * Transform a list of samples into a continuous distribution
 *
 * eg. for input:
 *   makeContinuous([ {x: 18, value: 1}, { x: 20, value: 42 }, {x: 22, value: 1 }   ])
 *
 * it will return:
 *   [ {x: 18, value: 1}, {x: 19, value: 0}, {x: 20, value: 42 }, {x: 21, value: 0}, {x: 22, value: 1 }]
 *
 *
 */
 export default function makeContinuous(data) {
  if (data.length < 0) return []
  const first = data[0].x
  const last = data[data.length - 1].x
  const res = []
  for (let x = first; x < last; x++) {
    const value = (typeof data[x] !== 'undefined' && typeof data[x].value === 'number') ? data[x].value : 0
    res.push({
      x: x,
      value: value
    })
  }
  return res
}
