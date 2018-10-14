
import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {withRouter}  from 'react-router'
import {runInAction} from 'mobx'
import {observer}    from 'mobx-react'

import uiStore      from '~/stores/ui'
import searchStore  from '~/stores/search'
import projectStore from '~/stores/project'

import {IntlProvider} from 'react-intl'
import Dropzone       from 'react-dropzone'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import StopLights from '~/widgets/StopLights'

import lightTheme from '~/themes/lightTheme'
import styles     from './styles'

@withRouter
@observer
class Index extends Component {

  handleDropDown = (acceptedFiles, rejectedFiles) => {
    const source = {
      bundleId  : "file", // eg. "filesystem"
      templateId: "local", // eg. "local"

      // need a better way to generate the name:
      // for instance, we could take the containing folder name
      sourceName: `Untitled ${Math.round(Math.random() * 99999)}`,

      isActive  : true,

      settings  : {
        parameters: {
          label: {
            en: "Settings",
            fr: "Paramètres"
          },
          type: "group",
          value: {
            files: {
              label: {
                en: "Files",
                fr: "Fichiers"
              },
              type: "filelist",
              value: acceptedFiles.map(({ path }) => path)
            }
          }
        }
      }
    }

    console.log("Index.handleDropDown: ", source)

    // create a new project using the source name
    projectStore
      .getOrMake(source.sourceName)
      .then(_ => projectStore.newSource(source))
      .then(_ => {
          console.log("Index.handleDropDown: created new source")
          this.props.history.push('/project')
      }).catch(err => {
        console.error("Index.handleDropDown: ", err)
      })
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={uiStore.muiTheme}>
        <IntlProvider locale={uiStore.locale}>
          <Dropzone
            className="myDrop"
            activeClassName="myDropActive"
            onDrop={this.handleDropDown}
            style={{ transition: 'all 0.3s ease' }}
            disableClick >
            <div style={{
              width: '100vw',
              height: '100vh',
              // backgroundColor: `hsla(220, 3%, 93%, ${uiStore.section === 'intro' ? 0 : 0.91})`,
              backgroundColor: `rgba(237, 235, 241, ${uiStore.section === 'intro' ? 0 : 1})`,
              transition: `background-color .5s ease-in-out`
            }}>
              <StopLights style={{
                position: 'fixed',
                top: '9px',
                left: '2px',
                zIndex: '999',
              }}/>
              <div style={styles.content}>
                {this.props.children}
              </div>
            </div>
          </Dropzone>
        </IntlProvider>
      </MuiThemeProvider>
    )
  }
}

export default Index;
