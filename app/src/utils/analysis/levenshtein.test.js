
import levenshtein from './levenshtein';

test('levenshtein', () => {
  expect(levenshtein(
    "Hello, sombre héros que Laval a cru; Socrate erre en forêts qu'ornent",
    "Et l'eau, sombre et rauque, l'avala cru. Seaux, cratère, amphore et cornes."
  )).toEqual(42);
});
