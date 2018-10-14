
import changeOpacity from './changeOpacity';

test('changeOpacity', () => {
  expect(changeOpacity(`rgb(42, 42, 42)`, 0.5)).toBe(`rgba(42, 42, 42, 0.5)`)
  expect(changeOpacity(`rgba(1, 25, 255, 1.0)`, 0.1)).toBe(`rgba(1, 25, 255, 0.1)`)
  expect(changeOpacity(`rgba(1, 25, 255, 0.5)`, 1.0)).toBe(`rgb(1, 25, 255)`)
});
