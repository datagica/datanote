import React, { Component } from 'react'
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
import RecordDialog   from '~/views/Project/RecordDialog'

const noFilter = {
  position: 'fixed',
  zIndex: 2,
  margin: 0,
  padding: 0,
  top: '90px',
  width: `${UI_WIDTH_LISTS}px`,
  transition: 'all 0.4s ease',
  border: 'solid 1px rgba(255, 255, 255, 0)',
  background: 'rgba(237, 237, 237, 0.0)',
  pointerEvents: 'auto',
  opacity: 1
}

const hidden = Object.assign({}, noFilter, {
  transform: 'translate(-150px, 0px)',
  pointerEvents: 'none',
  opacity: 0
})

const withFilter = Object.assign({}, noFilter, {
  transform: `translate(170px, 0px)`
})

const withFilterBlur = Object.assign({}, withFilter, {
  backdropFilter: 'blur(16px)',
  border: 'solid 1px rgba(255, 255, 255, 0.17)',
  background: 'rgba(237, 237, 237, 0.65)',
});
const noFilterBlur = Object.assign({}, noFilter, {
  backdropFilter: 'blur(16px)',
  border: 'solid 1px rgba(255, 255, 255, 0.17)',
  background: 'rgba(237, 237, 237, 0.65)',
});

@observer
class RecordsPanel extends Component {

	constructor(props, context) {
		super(props, context)
    this.state = {
    }
    this.throttle = throttle(50)
	}

  onSelection = (records) => {
    console.log("RecordsPanel.onSelection: ", { records: records })
    if (window._graph) {
      window._graph.select(entities)
    }
    metricsStore.find({ records: records })
    /*this.throttle(() => {

    })

    */
  }

  getRootStyle() {

    const stats = projectStore.getStats()

    if (stats.records && uiStore.section === 'project' && uiStore.list === 'records') {
      if (uiStore.filters === 'show') {
        return uiStore.effect === 'blur' ? withFilterBlur : withFilter
      } else {
        return uiStore.effect === 'blur' ? noFilterBlur   : noFilter
      }
    }
    return hidden
  }

	render() {
    const recordTypes = searchStore.records
    const records     = recordTypes.keys().sort().map(type => recordTypes.get(type)).slice(0, 1)
    console.log('RECORDS: ', {
      recordTypes, records
    })
    return (
      <div style={this.getRootStyle()}>
        <RecordDialog ref={dialog => { this.dialog = dialog }} />
        {records.map((props, i) =>
          <Collection
            key={i}
            {...props}
            hash={searchStore.recordsHash}
            width={500}
            height={window.innerHeight - 100}
            onSelection={this.onSelection}
            onOpen={row => this.dialog.openDialog(row)}
          />
        )}
		</div>
    )
	}
}

export default RecordsPanel;
