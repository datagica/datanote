
import getLabel from './getLabel';

test('getLabel', () => {

  expect(getLabel())           .toBe('')
  expect(getLabel(null))       .toBe('')
  expect(getLabel(undefined))  .toBe('')

  // basic types
  expect(getLabel(0))          .toBe('0')
  expect(getLabel(42))         .toBe('42')
  expect(getLabel("some-id"))  .toBe('some-id')

  // basic objects
  expect(getLabel({ value: 42 }))        .toBe('42')
  expect(getLabel({ id: 'some-item' }))  .toBe('some-item')

  // localized objects
  expect(getLabel({ label: { en: "World" } }))  .toBe('World')

  // sub-values objects
  expect(getLabel({ value: { id: 42 } }))       .toBe('42')
  expect(getLabel({ value: { en: "Hello" } }))  .toBe('Hello')

  expect(getLabel({ value: { label: "test" } }))           .toBe('test')
  expect(getLabel({ value: { label: { en: "Hello" } } }))  .toBe('Hello')
});
