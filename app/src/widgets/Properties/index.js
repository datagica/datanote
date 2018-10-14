'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from '~/widgets/Charts/styles'

export default ({ data, style, isVisible }) => {
  const components = [];
  components.push(
  <div key={`Properties`} style={styles.typeContainer}>
    <h1 style={styles.h1}>{`Properties`}</h1>
    <h2 style={styles.h2}>{`Properties`}</h2>
    <p>Hello</p>
  </div>
  )
  return (
    <div style={style}>
      <div style={styles.root}>{components}</div>
    </div>
  )
}
