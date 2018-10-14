'use strict'

import React, {Component} from 'react'

import TextField from 'material-ui/TextField'

import styles from './styles'

export default ({ name, hint, label, type, onChange }) => <TextField
  name={name}
  hintText={hint}
  floatingLabelText={label}
  floatingLabelFixed={true}
  floatingLabelStyle={styles.formFloatingLabel}
  inputStyle={styles.formInput}
  hintStyle={styles.formInputHint}
  onChange={onChange}
  errorText={""}
  type={"password"}
/>
