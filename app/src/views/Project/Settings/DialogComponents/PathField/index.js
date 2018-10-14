'use strict'

import React, {Component} from 'react'

import Dialog     from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

export default class PathField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: []
    }
  }

  // for electron we can get full filesystem paths!
  handleOpenFilesystem = () => {
    console.log("PathField.handleOpenFilesystem");

    // obviously this won't work if we create a cloud-hosted version one day
    const dialog = window.node.electron.remote.dialog;

    const value = dialog.showOpenDialog({
      properties: [
        'openFile',
        'openDirectory',
        'multiSelections'
      ]
    });
    this.setState({ value: value })
    this.props.onChange(null, value)
  }

  render() {
    return (
      <FlatButton label="Click to select folder.." onClick={this.handleOpenFilesystem} />
    )
  }
}
