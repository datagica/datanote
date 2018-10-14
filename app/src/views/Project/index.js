'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import {action, toJS, runInAction} from 'mobx'
import {observer}     from 'mobx-react'


import API from '~/api/index'

import projectStore from '~/stores/project'
import searchStore  from '~/stores/search'
import uiStore      from '~/stores/ui'

import {Tab, Tabs} from 'material-ui/Tabs'

import TopTabs  from '~/views/Project/TopTabs'
import Settings from '~/views/Project/Settings'

import NewSourceDialog from '~/views/Project/Settings/NewSourceDialog'

import {
  Search    as SearchIcon,
  ArrowBack as ArrowBackIcon
 } from '~/themes/icons'

import styles from './styles'

// due to a bug in the backdrop filter of WebKit, rendering a shadow while doing
// a backdrop with increase the height of the element, so we have to render the
// shadow in an external DOM node
const Backdrop = () => <div style={styles.backdrop} />;
const Shadow   = () => <div style={styles.dropShadow} />;

@withRouter
@observer
class Project extends Component {

  constructor(props) {
    super(props)
  }

	static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
	}

  onProjectTabChange = async ({ projectId }) => {
    // these three calls would be, in Redux, in a middleware
    // in MobX however, I think it is ok to have this kind of stuff in an Action
    console.log("Project.onProjectTabChange: ", projectId)
    try {
      await projectStore.switchProject(projectId)
     console.log("Project.onProjectTabChange: switched project")
    // TODO: should restore tab data (ie. filterStore + searchStore)
    } catch (exc) {
      console.log("failed to switch project: ", exc)
    }
  }

  onProjectTabAdd = () => {
    // these three calls would be, in Redux, in a middleware
    // in MobX however, I think it is ok to have this kind of stuff in an Action
    console.log("Project.onProjectTabAdd: ")
    runInAction(() => { uiStore.section = 'intro' })
    this.props.history.push('/projects')
  }

  render() {
    /*
    <Backdrop />
    <Shadow />
    */
  return (
    <div className="top-tabs" style={styles.container}>
      <Settings />
      <TopTabs
        projects={projectStore.projects.peek()}
        project={projectStore.project}
        records={projectStore.records}
        sources={projectStore.sources}
        onChange={this.onProjectTabChange}
        onAdd={this.onProjectTabAdd}
      />
      <NewSourceDialog />
    </div>
    )
  }
}

export default Project;
