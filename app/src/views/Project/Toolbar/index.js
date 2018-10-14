
'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {action, toJS, runInAction} from 'mobx'

import searchStore  from '~/stores/search'

import SpeechField  from '~/widgets/SpeechField'

import IconMenu   from 'material-ui/IconMenu'
import MenuItem   from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import FontIcon   from 'material-ui/FontIcon'

import ExportMenu from '~/views/Project/ExportMenu'

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'

import styles from './styles'

class ProjectToolbar extends Component {


  render() {
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup firstChild={true}>
          <SpeechField
            style={styles.speechField}
            onSubmit={value => {
              console.log("search input: " + value)
              searchStore.ask(value)
            }}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default ProjectToolbar
