
import getIcon from './getIcon';

test('getIcon', () => {
  expect(getIcon("hello")).toEqual({
    code: "",
    color: "rgb(100, 162, 18)",
    face: "FontAwesome",
    size: 25
  });
});
