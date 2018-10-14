
function xmlopts(opts, pretty=false, indent="") {
  opts = opts instanceof Object ? opts : {}
  return Object.keys(opts)
    .map(key => ({
       key: key,
       value: `${opts[key]}`.replace(/"/gi,'"')
    }))
    .map(({ key, value }) => `${indent}${key}="${value}"`)
    .join(pretty ? '\n' : ' ')
}


function xml(name, attribs, children) {
  if (children instanceof Object && Object.keys(children).length) {
    return `
    <${name} ${xmlopts(attribs)}>
      ${Object.keys(children).map(name => xml(name, children[name])).join('\n')}
    </${name}>
    `.trim()
  } else {
    return `<${name} ${xmlopts(attribs)} />`
  }
}

export default function toGexf(title, nodes, edges) {

  const date = new Date()
  const lastModifiedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  return `<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://www.gexf.net/1.3" version="1.3" xmlns:viz="http://www.gexf.net/1.3/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.3 http://www.gexf.net/1.3/gexf.xsd">
  <meta lastmodifieddate="${lastModifiedDate}">
    <creator>Datanote</creator>
    <description>${title}</description>
  </meta>
  <graph defaultedgetype="undirected" mode="static">
    <nodes>
    ${
      nodes.map(({ id, label, position, color }) =>
        xml('node',
          {
            id   : id,
            label: label
          },
          Object.assign({},
            position instanceof Object ? { 'viz:position': position } : null,
            color    instanceof Object ? { 'viz:color'    : color   } : null,
          )
        )
      ).join('\n')
    }
    </nodes>
    <edges>
    ${
      edges.map(({ id, source, target }) =>
        xml('edge',
          {
            id    : id,
            source: source,
            target: target
          }
        )
      ).join('\n')
    }
    </edges>
  </graph>
</gexf>`
}
