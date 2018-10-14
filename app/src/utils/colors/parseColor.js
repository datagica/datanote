const pattern = /rgba?\( *(\d+) *, *(\d+) *, *(\d+) *(?:, *(\d+|\.\d+|\d+\.|\d+\.\d+) *)?\)/i

export default function (txt) {
  const match = txt.match(pattern)
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: Number(match[4]) ? Number(match[4]) : 1
  }
}
