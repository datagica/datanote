'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import {action, toJS, runInAction} from 'mobx'
import {observer} from 'mobx-react'

import uiStore      from '~/stores/ui'
import projectStore from '~/stores/project'

import NewParserDialog from './NewParserDialog'

import SourceCard from './SourceCard'
import ParserCard from './ParserCard'

import FlatButton from 'material-ui/FlatButton'
import { Settings as SettingsIcon } from '~/themes/icons'

import styles from './styles.js'

@withRouter
@observer
class Settings extends Component {

  render () {
    const sources = projectStore.sources
    const records = projectStore.records
	  return (
		<div style={{
         width: '100vw',
         height: '100vh',
         overflowX: 'hidden',
         overflowY: 'auto',
         background: 'rgb(226, 227, 236)',
      }}>
      <div style={{
        position: 'absolute',
        top: '2px',
        right: '0px', // 
        width: '40px',
        zIndex: 1,
      }}>
        <FlatButton
          icon={
            <SettingsIcon style={{
              fill: 'rgba(133, 119, 140, 0.74)',
              height: '18px',
              width: '18px',
              marginLeft: '-45px',
              transition: 'transform 0.15s ease',
              transform: `rotate(${uiStore.section === 'settings' ? '-90' : '0'}deg)`
            }}/>
          }
          onTouchTap={() => {
            runInAction("edit project", () => {
              uiStore.section = uiStore.section === 'settings' ? 'project' : 'settings'
            })
          }}
        />
      </div>
      <div style={styles.container}>
        <h2 style={styles.h2}>Data Sources</h2>
	      {sources.map(props =>
          <SourceCard key={props.sourceId} {...props} />
        )}
	    </div>
	  </div>
  )
  }
}

export default Settings
