
import isDefined from './isDefined';

test('isDefined', () => {
  expect(isDefined("")).toBe(true);
  expect(isDefined(true)).toBe(true);
  expect(isDefined(null)).toBe(false);
  expect(isDefined(undefined)).toBe(false);
});
