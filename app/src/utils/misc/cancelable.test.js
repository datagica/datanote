
import cancelable from './cancelable';

test('cancelable', (done) => {
  const p = cancelable(
    new Promise((resolve, reject) => setTimeout(() => resolve(42), 100))
  );
  setTimeout(() => p.cancel(), 50)
  p.promise.catch(err => {
    expect(err.isCanceled).toBe(true)
    done()
  })
});
