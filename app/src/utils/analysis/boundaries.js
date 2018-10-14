export default function boundaries(arr, func) {
  let len = arr.length;
  let min = Infinity;
  let max = -Infinity;
  while (len--) {
    const value = func(arr[len]);
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }
  return {
    min: min,
    max: max
  };
}
