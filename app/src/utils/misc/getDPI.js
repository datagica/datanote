import findFirstPositive from '~/utils/misc/findFirstPositive'

// search the DPI
export default function getDPI() {
  return findFirstPositive(x => matchMedia(`(max-resolution: ${x}dpi)`).matches)
}
