import React, { Component }   from 'react'
import PropTypes from 'prop-types'
import {Link, hashHistory, withRouter} from 'react-router'

import {toJS, action} from 'mobx'
import {observer}     from 'mobx-react'

import { UI_WIDTH_LISTS } from '~/config/constants'

import uiStore        from '~/stores/ui'
import searchStore    from '~/stores/search'
import metricsStore   from '~/stores/metrics'
import projectStore   from '~/stores/project'
import Collection     from '~/widgets/Collection'
import throttle       from '~/utils/misc/throttle'


const noFilter = {
  position: 'fixed',
  zIndex: 2,
  margin: 0,
  padding: 0,
  top: '90px',
  width: `${UI_WIDTH_LISTS}px`,
  transition: 'all 0.4s ease',
  border: 'solid 1px rgba(255, 255, 255, 0)',
  //background: 'rgba(237, 237, 237, 0.0)',
  //background: 'rgba(233, 230, 239, 0.0)',
  //backdropFilter: 'blur(0px)',
  pointerEvents: 'auto',
  opacity: 1
}

const hidden = Object.assign({}, noFilter, {
  transform: 'translate(-150px, 0px)',
  //background: 'rgba(233, 230, 239, 0.0)',
  //backdropFilter: 'blur(0px)',
  pointerEvents: 'none',
  opacity: 0
})

const withFilter = Object.assign({}, noFilter, {
  transform: 'translate(170px, 0px)'
})

const withFilterBlur = Object.assign({}, withFilter, {
  //backdropFilter: 'blur(16px)',
  background: 'rgba(233, 230, 239, 0.35)',
  //backdropFilter: 'blur(10px)',
  //border: 'solid 1px rgba(255, 255, 255, 0.17)',
  //background: 'rgba(237, 237, 237, 0.65)',
});
const noFilterBlur = Object.assign({}, noFilter, {
  //backdropFilter: 'blur(16px)',
  //border: 'solid 1px rgba(255, 255, 255, 0.17)',
  //background: 'rgba(237, 237, 237, 0.65)',
  background: 'rgba(233, 230, 239, 0.35)',
  //backdropFilter: 'blur(10px)',
});

@observer
class EntitiesPanel extends Component {

	constructor(props, context) {
		super(props, context)
    this.state = {
    }
    this.throttle = throttle(50)
	}

  onSelection = (entities) => {
    if (window._graph) {
      window._graph.select(entities)
    }

    metricsStore.find({ entities: entities })
  }



  getRootStyle() {

    const stats = projectStore.getStats()

    if (stats.entities && uiStore.section === 'project' && uiStore.list === 'entities') {
      if (uiStore.filters === 'show') {
        return uiStore.effect === 'blur' ? withFilterBlur : withFilter
      } else {
        return uiStore.effect === 'blur' ? noFilterBlur   : noFilter
      }
    }
    return hidden
  }

	render() {

    const entityTypes = searchStore.entities
    const entities    = entityTypes.keys().sort().map(type => entityTypes.get(type)).slice(0, 1)
		return (
      <div style={this.getRootStyle()}>
        {entities.map((props, i) =>
          <Collection
            key={i}
            {...props}
            hash={searchStore.entitiesHash}
            width={500}
            height={window.innerHeight - 100}
            onSelection={this.onSelection}
          />
        )}
		</div>
    )
	}
}

export default EntitiesPanel;
