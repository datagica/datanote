
import boundaries from './boundaries';

test('boundaries', () => {
  expect(boundaries([
    { value: 4 },
    { value: 8 },
    { value: 2 }
  ], x => x.value)).toEqual({
    min: 2,
    max: 8
  });
});
