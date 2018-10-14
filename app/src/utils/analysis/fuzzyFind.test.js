
import fuzzyFind from './fuzzyFind';

test('fuzzyFind', () => {
  expect(fuzzyFind(
    "étrange",
    "ceci est étrange"
  )).toEqual({"begin": 9, "end": 16, "left": 0.5625, "right": 1, "width": 0.4375});
});
