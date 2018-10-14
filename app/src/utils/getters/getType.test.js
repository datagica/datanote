
import getType from './getType';

test('getType', () => {
  expect(getType("aaa:bbb__ccc")).toEqual("bbb");
});
