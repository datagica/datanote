
'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {action, toJS, runInAction} from 'mobx'

import projectStore from '~/stores/project'

import IconMenu   from 'material-ui/IconMenu'
import MenuItem   from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FontIcon   from 'material-ui/FontIcon'

import FileDownload from 'material-ui/svg-icons/file/file-download'

/**
 * Export Menu
 *
 * For the moment pretty basic, there are no options.
 *
 * Later we might add a menu item "More options..".
 */
class ExportMenu extends Component {

  saveGraph = () => {
    if (window._graph) {
      window._graph.saveToGexf(projectStore.project.projectId)
    }
  }

  saveImage = () => {
    if (window._graph) {
      window._graph.saveToPng(projectStore.project.projectId)
    }
  }

  saveJson = () => {
    if (window._graph) {
      window._graph.saveToJson(projectStore.project.projectId)
    }
  }

  saveCsv = () => {
    if (window._graph) {
      window._graph.saveToCsv(projectStore.project.projectId)
    }
  }

  handleExcel = () => {
    // convert the table and metrics to excel
    /*
    <MenuItem
      primaryText="Get as Excel"
      onTouchTap={this.handleExcel}
    />
    */
  }

  render() {
    return (
      <IconMenu
        iconButtonElement={
          <IconButton touch={true}>
            <FileDownload style={{
              fill: 'rgba(133, 119, 140, 0.741176)'
            }}/>
          </IconButton>
        }
      >
        <MenuItem
          primaryText="Save Gexf"
          onTouchTap={this.saveGraph}
        />
        <MenuItem
        primaryText="Save Csv"
        onTouchTap={this.saveCsv}
      />
        <MenuItem
          primaryText="Save image"
          onTouchTap={this.saveImage}
        />
        <MenuItem
          primaryText="Save Json"
          onTouchTap={this.saveJson}
        />
      </IconMenu>
    )
  }
}

export default ExportMenu
