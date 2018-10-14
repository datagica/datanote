
import tryToGetNumber from './tryToGetNumber';

test('tryToGetNumber', () => {
  expect(tryToGetNumber(42)).toBe(42);
  expect(tryToGetNumber("42")).toBe(42);
  expect(tryToGetNumber("x")).toBe(null);
  expect(tryToGetNumber()).toBe(null);
  expect(tryToGetNumber("")).toBe(null);
});
