
import isFiniteNumber from './isFiniteNumber';

test('isFiniteNumber', () => {
  expect(isFiniteNumber()).toBe(false);
  expect(isFiniteNumber(null)).toBe(false);
  expect(isFiniteNumber(undefined)).toBe(false);
  expect(isFiniteNumber("")).toBe(false);
  expect(isFiniteNumber(-1)).toBe(true);
  expect(isFiniteNumber(0)).toBe(true);
  expect(isFiniteNumber(1)).toBe(true);
  expect(isFiniteNumber(10 / 0)).toBe(false);
});
