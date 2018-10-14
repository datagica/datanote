'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import autobind       from 'autobind-decorator'
import {action, toJS} from 'mobx'
import {observer}     from 'mobx-react'
import cancelable     from '~/utils/misc/cancelable'

import uiStore        from '~/stores/ui'
import searchStore    from '~/stores/search'
import projectStore   from '~/stores/project'
import {Tab, Tabs}    from 'material-ui/Tabs'

import styles from './styles'

@autobind
@observer
class LeftTabs extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tabIndex: 0,
      innerWidth:  window.innerWidth,
      innerHeight: window.innerHeight
    }
    this._cancelable = null;
  }

	handleResize(e) {
    this.setState({
      innerWidth:  window.innerWidth,
      innerHeight: window.innerHeight
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
   }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

	@action onTabChange(data) {

    const sameButton = this.state.tabIndex === data.props.index
    if (!sameButton) this.setState({ tabIndex: data.props.index })

    if (data.props.index === 0) {
      uiStore.filters = sameButton && uiStore.filters === 'show'     ? 'hide' : 'show'
    } else if (data.props.index === 1) {
      uiStore.list    = sameButton && uiStore.list    === 'records'  ? 'hide' : 'records'
    } else if (data.props.index === 2) {
      uiStore.list    = sameButton && uiStore.list    === 'entities' ? 'hide' : 'entities'
    }

    // TODO use a store + observer instead 
    window._graph && window._graph.reposition()
	}

  getTabStyle(index) {
		let options = {};
     if (index === this.state.tabIndex) {
			return Object.assign({}, styles.tab, styles.activeTab, options)
		} else {
			return Object.assign({}, styles.tab, options)
		}
	}

  render() {

    const tabProps = {
      focusRippleOpacity: styles.rippleOpacity,
      touchRippleOpacity: styles.rippleOpacity,
      onActive: this.onTabChange
    }

    const stats = projectStore.getStats()

    return (
    <div style={uiStore.section === 'settings' ? { opacity: 0 } : styles.container}>
      <Tabs
        className="customTabs"
        tabItemContainerStyle={styles.tabs}
        inkBarStyle={styles.inkBar}
        initialSelectedIndex={this.state.tabIndex}
        >
        {(!stats.entities && !stats.records) ? null :
          <Tab {...tabProps} label="Filters" style={this.getTabStyle(0)} />}
        {!stats.records ? null :
          <Tab {...tabProps} label="Records" style={this.getTabStyle(1)} />}
        {!stats.entities ? null :
          <Tab {...tabProps} label="Entities" style={this.getTabStyle(2)} />}
      </Tabs>
    </div>
    )
  }
}

export default LeftTabs;
