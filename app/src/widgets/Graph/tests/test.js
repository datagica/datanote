
// Just some mocks for D3 and C3
/*
window.MutationObserver = window.MutationObserver || function() {
  return { observe : function() {} };
};
*/

jest.mock('roboto-fontface');
jest.mock('themes/lightTheme');

import React    from 'react';
import renderer from 'react-test-renderer';

import Graph  from '../index';

test('Default Graph', () => {

  const node1 = {
    id: "node1",
    type: "test",
    weight: 0.5
  }

  const node2 = {
    id: "node1",
    type: "test",
    weight: 0.5
  }

  const component = renderer.create(
    <Graph
      data={{
        hash: "",
        minEdgeWeight: 0.0,
        maxEdgeWeight: 1.0,
        minNodeWeight: 0.0,
        maxNodeWeight: 1.0,
        nbNodes: 2,
        nbEdges: 1,
        nodes: [
          node1,
          node2
        ],
        edges: [
          {
            node1: node1,
            node2: node2,
            weight: 1.0
          }
        ]
      }}
      style={{}}
      isVisible={true}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
