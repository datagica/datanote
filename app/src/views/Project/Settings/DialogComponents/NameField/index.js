'use strict'

import React, {Component} from 'react'

import TextField from 'material-ui/TextField'

export default class NameField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errorText: '',
      value: props.value
    }
  }
  onTextFieldChange = (event) => {
    const value = event.target.value.trim().toLowerCase();
    if (value.length > 0 && value.match(/[a-z]+/)) {
      this.setState({
        errorText: '',
        value: value
      })
      this.props.onChange(value)
    } else {
      this.setState({
        errorText: 'Invalid name'
      })
    }
  }
  render() {
    return (
      <TextField
        name="name"
        hintText="enter unique name.."
        floatingLabelText="Name"
         defaultValue={this.props.value}
        errorText={this.state.errorText}
        onChange={this.onTextFieldChange}
      />
    )
  }
}
