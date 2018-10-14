
import isString from './isString';

test('isString', () => {
  expect(isString()).toBe(false);
  expect(isString("")).toBe(true);
  expect(isString("42")).toBe(true);
  expect(isString(42)).toBe(false);
});
