'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import {toJS,runInAction} from 'mobx'
import {observer}  from 'mobx-react'

import projectStore from '~/stores/project'
import uiStore      from '~/stores/ui'
import searchStore  from '~/stores/search'

import ProjectCard     from '~/views/Projects/ProjectCard'

// TODO move this at the root
import NewSourceDialog from '~/views/Project/Settings/NewSourceDialog'

import styles from './styles.js'

@observer
@withRouter
class Projects extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  async componentWillMount () {
    // close projects everytime we go back here
    try {
      await projectStore.closeProject()
      console.log("Projects: project auto-closed")
    } catch (err) {
      // console.log(`[view/projects.componentDidMount] couldn't sync project`)
    }
  }

  openProject = (projectId) => {
    if (projectId === "") {
      console.log("Projects: nothing to open")
    }
    // these three calls would be, in Redux, in a middleware
    // in MobX however, I think it is ok to have this kind of stuff in an Action
    projectStore.loadProject(projectId).then(done => {
      console.log("Projects.openProject: loaded")
      setTimeout(() => {
        runInAction(() => {
          console.log("Projects.openProject: changing route..")
          uiStore.section = 'project'
          uiStore.filters = 'show'
          uiStore.effect  = 'normal'
          uiStore.list    = 'hide'
          this.props.history.push('/project')
        })
      }, 1100)
    }).catch(err => {
      console.log("Projects: failed to open project: ", err)
    })
  }

  deleteProject = (projectId) => {
    console.log("Projects.deleteProject: "+projectId)
    projectStore.deleteProject(projectId).then(done => {
      // nothing to do, card will self-destroy in a few seconds
      console.log("Projects: project deleted")
      this.forceUpdate()
    }).catch(err => {
      console.log("Projects: failed to delete project: ", err)
      this.forceUpdate()
    })
  }

  render() {
    console.log("render projects: ", projectStore.projects.peek())
    return (
    <div style={styles.container}>
      <div>
        {projectStore.projects.peek().map(props =>
          <ProjectCard
            key={props.projectId}
            openProject={this.openProject}
            deleteProject={this.deleteProject}
            {...props}
          />
        )}
      </div>
    <NewSourceDialog isOpen={false} />
    </div>
    )
  }
}

export default Projects
