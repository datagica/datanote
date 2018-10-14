
import safeFileName from './safeFileName';

test('safeFileName', () => {
  expect(safeFileName("  some.bad (ç!*ù¨:=# file  ???.; name )")).toBe('_some_bad_file_name_');
});
