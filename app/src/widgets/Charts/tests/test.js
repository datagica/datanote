
// Just some mocks for D3 and C3
jest.mock('react-dom');
window.MutationObserver = window.MutationObserver || function() {
  return { observe : function() {} };
};

import React    from 'react';
import renderer from 'react-test-renderer';

import Charts  from '../index';

test('Default Charts', () => {
  const component = renderer.create(
    <Charts
      style={{}}
      size={{
        width: 200,
        height: 200
      }}
      donut={{ title: "Test" }}
      data={{
        type: 'donut',
        json: [{
          x: 25,
          y: 25,
          z: 50
        }],
        keys: {
          value: [ 'x', 'y', 'z' ]
        },
        onclick: (d, element) => {}
      }}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // note: since nearly everything is mocked, we don't get much DOM out of the
  // component anyway.. still, it tests props parsing and stuff
});
