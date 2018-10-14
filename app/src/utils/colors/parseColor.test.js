
import parseColor from './parseColor'

test('parseColor', () => {

  expect(parseColor("rgb(12, 34, 56)"))
    .toEqual({
      r: 12,
      g: 34,
      b: 56,
      a: 1
    })

  expect(parseColor("rgb(12, 34, 56, 0.4)"))
    .toEqual({
      r: 12,
      g: 34,
      b: 56,
      a: 0.4
    })

})
