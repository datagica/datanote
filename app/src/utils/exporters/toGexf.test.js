
import toGexf from './toGexf';

test('toGexf with basic gexf', () => {

  const date = new Date()
  const lastModifiedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  const output = toGexf(
    "this is a test graph",
    [
    { id: 0, label: "A" },
    { id: 1, label: "B" },
    { id: 2, label: "C" },
  ], [
    { id: 0, source: 0, target: 1, weight: 0.5 },
    { id: 1, source: 1, target: 2, weight: 1 }
  ])
  console.log("gexf: ", output)

  expect(output.trim()).toBe(`
<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://www.gexf.net/1.3" version="1.3" xmlns:viz="http://www.gexf.net/1.3/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.3 http://www.gexf.net/1.3/gexf.xsd">
  <meta lastmodifieddate="${lastModifiedDate}">
    <creator>Datanote</creator>
    <description>this is a test graph</description>
  </meta>
  <graph defaultedgetype="undirected" mode="static">
    <nodes>
    <node id="0" label="A" />
<node id="1" label="B" />
<node id="2" label="C" />
    </nodes>
    <edges>
    <edge id="0" source="0" target="1" />
<edge id="1" source="1" target="2" />
    </edges>
  </graph>
</gexf>
`.trim())
});


test('toGexf with coordinates', () => {

  const date = new Date()
  const lastModifiedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  const output = toGexf(
    "this is a test graph with coordinates",
    [
    {
      id: 0,
      label: "A",
      position: { x: 10, y: 20 }
    },
    {
      id: 1,
      label: "B",
      position: { x: 20, y: 10 }
    },
    {
      id: 2,
      label: "C",
      position: { x: 20, y: 20 }
    },
  ], [
    {
      id: 0,
      source: 0,
      target: 1,
      weight: 0.5
    },
    {
      id: 1,
      source: 1,
      target: 2,
      weight: 1
    }
  ])
  console.log("gexf: ", output)

  expect(output.trim()).toBe(`
<?xml version="1.0" encoding="UTF-8"?>
<gexf xmlns="http://www.gexf.net/1.3" version="1.3" xmlns:viz="http://www.gexf.net/1.3/viz" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.gexf.net/1.3 http://www.gexf.net/1.3/gexf.xsd">
  <meta lastmodifieddate="${lastModifiedDate}">
    <creator>Datanote</creator>
    <description>this is a test graph with coordinates</description>
  </meta>
  <graph defaultedgetype="undirected" mode="static">
    <nodes>
    <node id="0" label="A">
      <viz:position x="10" y="20" />
    </node>
<node id="1" label="B">
      <viz:position x="20" y="10" />
    </node>
<node id="2" label="C">
      <viz:position x="20" y="20" />
    </node>
    </nodes>
    <edges>
    <edge id="0" source="0" target="1" />
<edge id="1" source="1" target="2" />
    </edges>
  </graph>
</gexf>
`.trim())
});
