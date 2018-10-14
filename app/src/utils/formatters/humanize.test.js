
import {filename} from './humanize';

test('filename', () => {
  expect(filename({
    en: "some_fake.file"
  })).toEqual({
    en: "some fake file"
  });
});
