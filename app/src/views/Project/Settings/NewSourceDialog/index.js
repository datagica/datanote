'use strict'

import React, {Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'

import ContentAdd from 'material-ui/svg-icons/content/add'

import FlatButton           from 'material-ui/FlatButton'
import RaisedButton         from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import {toJS, runInAction} from 'mobx'

import projectStore from '~/stores/project'
import uiStore      from '~/stores/ui'

import SourceSetup from './SourceSetup'

import styles from './styles'

/**
 * Edit new source settings
 */
export default class NewSourceDialog extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      data: {}
    }
  }

  static defaultProps = {
    isOpen: false
  }

  static propTypes = {
    isOpen: PropTypes.bool
  }

  // handle requested state initialization
  componentDidMount() {
    if (this.props.isOpen) {
      this.handleOpen()
    }
  }

  handleOpen = async () => {
    console.log("calling projectStore.getSourceTemplateBundles()")
    try {
      const data = await projectStore.getSourceTemplateBundles()
      console.log("  result of call to getSourceTemplateBundles: ", data);
      this.setState({
        isOpen: true,
        data: data
      })
    } catch(err) {
      console.error("couldn't call projectStore.getSourceTemplateBundles: ", err)
      this.setState({
        isOpen: true,
        data: data,
      })
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }


  // not really used for now
  blurBackground (applyBlur) {
    const myDrop = document.getElementsByClassName('myDrop')[0]
    if (!myDrop) { return }
    if (applyBlur) {
      myDrop.classList.add('blur')
    } else {
      myDrop.classList.remove('blur')
    }
  }

  getRootStyle() {
    if (uiStore.section === 'project') {
     return {...styles.root, opacity: 0, transform: 'scale(0)' }
    }
    return styles.root
  }

  render () {
    //this.blurBackground(this.state.open)
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];


    return (
      <div style={this.getRootStyle()}>
        <FloatingActionButton
          onTouchTap={this.handleOpen}
          style={styles.floatingAddActionButton}
          iconStyle={styles.floatingAddActionButtonIcon}
          zDepth={2}
          >
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title={`Add new data or notes`}
          modal={false}
          open={this.state.isOpen}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          bodyStyle={styles.body}
          titleStyle={styles.title}
          contentStyle={styles.content}
        >
          <SourceSetup
            data={this.state.data}
            onRequestClose={this.handleClose}
          />
        </Dialog>
      </div>
    );
  }
}
