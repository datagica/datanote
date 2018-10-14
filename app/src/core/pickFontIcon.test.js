
import pickFontIcon from './pickFontIcon';

test('pickFontIcon', () => {
  expect(pickFontIcon("hello")).toEqual({
    code: "",
    face: "FontAwesome"
  });
});
