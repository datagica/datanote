
import sortNumberOrString from './sortNumberOrString';

test('sortNumberOrString', () => {
  expect(sortNumberOrString("42", "41")).toBe(+1);
  expect(sortNumberOrString("41", "42")).toBe(-1);
  expect(sortNumberOrString("41", "41")).toBe(0);

  expect(sortNumberOrString(42, 41)).toBe(+1);
  expect(sortNumberOrString(41, 42)).toBe(-1);
  expect(sortNumberOrString(41, 41)).toBe(0);

  expect(sortNumberOrString("42", 41)).toBe(+1);
  expect(sortNumberOrString("41", 42)).toBe(-1);
  expect(sortNumberOrString("41", 41)).toBe(0);
});
