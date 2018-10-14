'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog'

import styles from './styles'

class ItemDialog extends Component {

  static propTypes = {
    actions: PropTypes.array,
    entity: PropTypes.object,
    open: PropTypes.bool,
    onRequestClose: PropTypes.func,
    contentStyle: PropTypes.object,
    bodyStyle: PropTypes.object,
    titleStyle: PropTypes.object,
  };

  static defaultProps = {
    actions: [],
    entity: {
      id: '',
      type: '',
      label: {
        en: ''
      },
      value: {}
    },
    open: false,
    onRequestClose: () => {},
    contentStyle: {},
    bodyStyle: {},
    titleStyle: {}
  }


  /*
  blurBackground(applyBlur){
    const myDrop = document.getElementsByClassName('myDrop')[0];
    if (applyBlur) {
      myDrop.classList.add('blur');
    } else {
      myDrop.classList.remove('blur');
    }
  }
  */
  /*
  componentWillReceiveProps(nextProps) {
    this.blurBackground(nextProps.open)
  }
  */

  render(){
    //this.blurBackground(this.props.open)
    const metaTypeLabel = this.props.entity.id.split(':')[0]
    const typeLabel = this.props.entity.type
    const idLabel = this.props.entity.id
    const titleLabel = this.props.entity && this.props.entity.label ? this.props.entity.label.en : ''
    return (
    <Dialog
      title={<div style={styles.customTitle}>
        <div style={styles.headerLeft}>
          <div style={styles.titleId}>
            <span style={styles.titleIdLabel}>{metaTypeLabel}</span>
            <span style={styles.titleIdSeparator}>&#47;</span>
            <span style={styles.titleIdLabel}>{typeLabel}</span>
          </div>
          <h3 style={styles.titleLabel}>{titleLabel}</h3>
        </div>
      </div>}
      actions={this.props.actions}
      modal={false}
      open={this.props.open}
      onRequestClose={this.props.onRequestClose}
      autoScrollBodyContent={false}
      repositionOnUpdate={true}
      autoDetectWindowHeight={true}
      titleStyle={Object.assign({}, styles.title, this.props.titleStyle)}
      bodyStyle={Object.assign({}, styles.body, this.props.bodyStyle)}
      contentStyle={Object.assign({}, styles.content, this.props.contentStyle)}
      >
      {this.props.children}
    </Dialog>
    )
  }
}

export default ItemDialog;
