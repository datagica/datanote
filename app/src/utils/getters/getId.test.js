
import getId from './getId';

test('getId', () => {
  console.log(getId())
  console.log(getId(null))
  console.log(getId(undefined))
  console.log(getId(0))
  console.log(getId(42))
  console.log(getId("some-id"))
  /*
  expect(isDefined("")).toBe(true);
  expect(isDefined(true)).toBe(true);
  expect(isDefined(null)).toBe(false);
  expect(isDefined(undefined)).toBe(false);
  */
});
