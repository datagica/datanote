'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {action, toJS, runInAction} from 'mobx'
import {observer}     from 'mobx-react'

import { Tab, Tabs } from '~/widgets/Tabs'
import Aquarelle     from '~/widgets/Aquarelle'
import Toolbar       from '~/views/Project/Toolbar'
import LeftTabs      from '~/views/Project/LeftTabs'
import RightTabs     from '~/views/Project/RightTabs'
import FilterPanel   from '~/views/Project/FilterPanel'
import EntitiesPanel from '~/views/Project/EntitiesPanel'
import RecordsPanel  from '~/views/Project/RecordsPanel'
import ExportMenu    from '~/views/Project/ExportMenu'

import uiStore      from '~/stores/ui'
import searchStore  from '~/stores/search'
import metricsStore from '~/stores/metrics'

import styles from './styles'

@observer
class TopTabs extends Component {

  constructor(props) {
    super(props)
    const tabs = this.projectsToTabs(props.projects)
    const tab  = this.tabIndexOfProject(tabs, props.project)
    this.state = {
      tab:  tab,
      tabs: tabs,
      edit: false
    }
  }

  static propTypes = {
    project:  PropTypes.object,
    projects: PropTypes.array,
    onChange: PropTypes.func,
    onAdd:    PropTypes.func,
  }

  static defaultProps = {
    tab: 0,
    projects: [],
  }

  projectToKey({ projectId }) {
    return `project-tab-${projectId.toLowerCase()}`
  }
  projectToTitle({ projectId }) {
    return projectId
  }

  projectsToTabs(projects) {
    return (
      projects

        // okay so right now, we only show one tab (the current project)
        .filter(project => {
          return project && this.props.project && project.projectId === this.props.project.projectId
        })

        .map(project => ({
        projectId: project.projectId,
        key      : this.projectToKey(project),
        title    : this.projectToTitle(project),
        showClose: true
      }))
    )
  }

  tabIndexOfProject(tabs, project) {
    if (!project) return -1
    const key = this.projectToKey(project)
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].key === key) {
        return i
      }
    }
    return -1
  }

  switchInArray(arr, a, b) {
    arr = arr.slice();
    let c = arr[a];
    arr[a] = arr[b];
    arr[b] = c;
    return arr;
  }

  componentWillReceiveProps(props) {
    const tabs = this.projectsToTabs(props.projects)
    const tab  = this.tabIndexOfProject(tabs, props.project)
    this.setState({
      tabs: tabs,
      tab: tab
    })
  }

  onTabSwitch = (tab) => {
    console.log("onTabSwitch: ", tab)
    this.setState({ tab: tab });
    if (this.props.onChange) this.props.onChange(this.state.tabs[tab]);
  }

  onTabPositionChange = (a, b) => {
    const tabs = this.switchInArray(this.state.tabs, a, b);
    if (this.state.tab == a) {
    	this.setState({ tabs: tabs, tab: b });
    } else if (this.state.tab == b) {
    	this.setState({ tabs: tabs, tab: a });
    } else {
      this.setState({ tabs: tabs });
    }
  }

  onTabAdd = () => {
    console.log("onTabAdd")
    if (this.props.onAdd) this.props.onAdd();
  }

  onTabClose = () => {
    console.log("onTabClose")
    if (this.props.onAdd) this.props.onAdd();
  }

  /*
  This is the original tab delete, to be used for actual tab delete.
  So right now, this is disabled, because we have a single tab, and the close
  button will make us go back tot he project list.
  This is intended, this is the first release.
  Later if we get a real tab management system, we can add more tabs.

  onTabClose = (index) => {
    const tabs = this.state.tabs.slice(index, 1);
    if(this.state.tab >= this.state.tabs.length) {
    	this.setState({
        tabs: tabs,
        tab: this.state.tabs.length - 1
       })
    } else {
      this.setState({
        tabs: tabs
      })
    }
  }
  */


  render() {
    const containerStyle = Object.assign({}, styles.container,
      uiStore.section === 'settings'
        ? {
         transform: `translateY(90vh)`,
         pointerEvents: 'none',
         opacity: 0
       }
       : {
        transform: `translateY(0vh)`,
        opacity: 1
      })

    return (
      <div style={containerStyle}>

        <div style={styles.tabContainer}>
          <Tabs
            style={styles.tabs}
            active={this.state.tab}
            onTabSwitch={this.onTabSwitch}
            onTabPositionChange={this.onTabPositionChange}
            onTabClose={this.onTabClose}
            onTabAdd={this.onTabAdd}
            showAdd={false}
            draggable={false}>
            {this.state.tabs.map(tab => <Tab {...tab} />)}
          </Tabs>
        </div>
        <div style={styles.viewContainer}>
          <div style={styles.exportMenu}><ExportMenu /></div>
          <Toolbar />
          <LeftTabs />
          <RightTabs />
          <FilterPanel />
          <RecordsPanel />
          <EntitiesPanel />
          <Aquarelle isVisible={uiStore.isLoading}/>
        </div>
      </div>
    )
  }
}

export default TopTabs;
