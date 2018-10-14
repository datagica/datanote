
import toCsv from './toCsv';

test('toCsv with basic csv', () => {

  const output = toCsv(
    [
      { id: 0, label: "A" },
      { id: 1, label: "B" },
      { id: 2, label: "C" },
   ]
  )
  console.log('output.trim(): ' + output.trim())
  expect(output.trim()).toBe(`
xx
`.trim())
});

