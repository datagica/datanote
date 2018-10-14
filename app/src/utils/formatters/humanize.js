export function filename(data) {
  const labels = typeof data !== 'undefined' && data.en !== 'undefined' ? data : {};
  const out = {}
  Object.keys(labels).map(key => {
    const parts = `${labels[key]}`.replace(/[_ ]+/gi, ' ').split('.');
    out[key] = parts.join(' ');
  })
  return out;
}
