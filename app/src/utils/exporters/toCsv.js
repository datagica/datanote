
function toRow (fields, separator) {
  return fields.map(x => JSON.stringify(`${x}`)).join(separator)
}

export default function toCsv (nodes, separator = ',', lr = '\n') {
  return (
    [toRow([ 'id', 'label' ])]
    .concat(nodes.map(({ id, label }) => toRow([id, label], separator)))
    .join(lr)
  )
}
