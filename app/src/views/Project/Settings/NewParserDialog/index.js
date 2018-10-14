'use strict'

import React, {Component} from 'react'

import Dialog from 'material-ui/Dialog'

import ContentAdd from 'material-ui/svg-icons/content/add'

import FlatButton           from 'material-ui/FlatButton'
import RaisedButton         from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton'

import project from '~/stores/project'

import ParserSetup from './ParserSetup'

import styles from './styles'

/**
 * Edit new parser settings
 */
export default class NewParserDialog extends Component {

  constructor (props) {
    super(props)
    this.state = {
      open: false,
      data: {}
    };
  }

  handleOpen = () => {
    project.getParserTemplateBundles().then(data => {
      this.setState({
        open: true,
        data: data
      })
    }).catch(err => {
      console.error("couldn't call project.getParserTemplateBundles: ", err)
      this.setState({
        open: true,
        data: data,
      })
    })
  };

  handleClose = () => {
    this.setState({open: false});
  };


  blurBackground (applyBlur) {
    const myDrop = document.getElementsByClassName('myDrop')[0];
    if (applyBlur) {
      myDrop.classList.add('blur');
    } else {
      myDrop.classList.remove('blur');
    }
  }

  render () {
    this.blurBackground(this.state.open)
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    return (
      <div style={styles.root}>
        <FloatingActionButton
          onTouchTap={this.handleOpen}
          style={styles.floatingAddActionButton}
          iconStyle={styles.floatingAddActionButtonIcon}
          zDepth={2}>
          <ContentAdd />
        </FloatingActionButton>
        <Dialog
          title={`New Parser`}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          bodyStyle={styles.body}
          titleStyle={styles.title}
          contentStyle={styles.content}
        >
          <ParserSetup data={this.state.data} onRequestClose={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}
