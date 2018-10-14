import React    from 'react';
import renderer from 'react-test-renderer';

// mock the matchMedia (used by Flexbox)
window.matchMedia = window.matchMedia || function() {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    };
};

import Ranking  from '../index';


test('Default Ranking', () => {
  const component = renderer.create(<Ranking />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  //expect(sum(1, 2)).toBe(3);
});

test('Basic Ranking', () => {
  const component = renderer.create(
    <Ranking
      title={"Test"}
      data={[
        {
          id: "one",
          label: {
            en: "One",
          },
          rank: 50
        },
        {
          id: "two",
          label: {
            en: "Two"
          },
          rank: 25
        },
        {
          id: "three",
          label: {
            en: "Three"
          },
          rank: 100
        }
      ]}
      maxRank={100}
      shownItems={2}
      itemHeight={35}
      fixHeight={false}
      scrollable={false}
      normalize={true}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  //expect(sum(1, 2)).toBe(3);
});
