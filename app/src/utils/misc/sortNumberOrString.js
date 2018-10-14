
export default function sortNumberOrString (a, b) {
  const na = Number(a);
  const nb = Number(b);
  return (!isNaN(na*nb) && isFinite(na*nb))
    ? (na - nb)
    : `${a}`.localeCompare(`${b}`);
}
