'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {action, toJS} from 'mobx'
import {observer}     from 'mobx-react'

import projectStore   from '~/stores/project'
import searchStore    from '~/stores/search'
import metricsStore   from '~/stores/metrics'
import uiStore        from '~/stores/ui'

import {Tab, Tabs}    from 'material-ui/Tabs'

import Collection     from '~/widgets/Collection'
import Metrics        from '~/widgets/Metrics'
import Graph          from '~/widgets/Graph'
import Mapbox         from '~/widgets/Mapbox'

import {
  UI_WIDTH_FILTERS, UI_WIDTH_LISTS,
  TAB_NETWORK, TAB_LOCATIONS, TAB_METRICS
} from '~/config/constants'

import {
  Search    as SearchIcon,
  ArrowBack as ArrowBackIcon
 } from '~/themes/icons'

import styles from './styles'

@observer
class RightTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      innerWidth:  window.innerWidth,
      innerHeight: window.innerHeight
    }
  }

	onTabChange = (data) => {
    this.setState({ tabIndex: data.props.index })
  }

  getTabStyle = (index) => {
	  return Object.assign(
      {},
      styles.tab,
      index === this.state.tabIndex ? styles.activeTab : {}
    )
	}

  getContentStyle(index) {

    let filterWidth = 20
		if (uiStore.filters !== 'hide') { filterWidth += UI_WIDTH_FILTERS }
		if (uiStore.list    !== 'hide') { filterWidth += UI_WIDTH_LISTS   }

    return Object.assign(
      {},

      styles.tabContent,

      uiStore.section === 'project' && index === this.state.tabIndex ? styles.tabContentActive : {},

      index === TAB_METRICS ? { width: 'auto', left: filterWidth } : { width: '100vw' }
    )
	}

  componentDidMount() {
    // console.log("RightTabs: componentDidMount => update metrics in a few moments")
    setTimeout(() => {
      console.log("TODO: use entities from the search, not the global entities")
      // algorithm: if there are filters enabled, the metrics will use them,
      // otherwise, we take the full entities
      metricsStore.find({ entities: {} })
    }, 800)
  }

  render() {

    const tabProps = {
      focusRippleOpacity: styles.rippleOpacity,
      touchRippleOpacity: styles.rippleOpacity,
      onActive: this.onTabChange
    }

    const stats = projectStore.getStats()

    const section   = uiStore.section

    // show the tabs if we have data and we are not in the settings
    const isVisible = stats.entities && section !== 'settings'

    console.log(`should we display the toolbar?`, {
      stats,
      'stats.entities': !!stats.entitites,
      section,
      isVisible,
    })
    
    const style = Object.assign({}, styles.container, isVisible ? {} : { opacity: 0 });

    return (
    <div style={style}>
      <Tabs
        className="customTabs"
        tabItemContainerStyle={styles.tabs}
        inkBarStyle={styles.inkBar}
        initialSelectedIndex={this.state.tabIndex}
        >
        <Tab {...tabProps} label="Network" style={this.getTabStyle(TAB_NETWORK)} >
            <div style={this.getContentStyle(TAB_NETWORK)}>
            <Graph data={searchStore.graph} style={{}} isVisible={this.state.tabIndex === TAB_NETWORK} />
          </div>
        </Tab>
        <Tab {...tabProps} label="Locations" style={this.getTabStyle(TAB_LOCATIONS)} >
            <Mapbox data={searchStore.locations}
              containerStyle={this.getContentStyle(TAB_LOCATIONS)}
              isVisible={this.state.tabIndex === TAB_LOCATIONS}
            />
        </Tab>
        <Tab {...tabProps} label="Metrics"  style={this.getTabStyle(TAB_METRICS)} >
            <Metrics
              data={metricsStore.entities}
              style={this.getContentStyle(TAB_METRICS)}
              isVisible={this.state.tabIndex === TAB_METRICS}
            />
        </Tab>
      </Tabs>
    </div>
    )
  }
}

export default RightTabs;
