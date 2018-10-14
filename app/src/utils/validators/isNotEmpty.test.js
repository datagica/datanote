
import isNotEmpty from './isNotEmpty';

test('isNotEmpty', () => {
  expect(isNotEmpty("")).toBe(false);
  expect(isNotEmpty("not empty")).toBe(true);
});
