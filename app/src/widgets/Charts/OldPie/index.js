'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Charts from '~/widgets/Charts'
import styles from '~/widgets/Charts/styles'
import capitalize from '~/utils/formatters/capitalize'

const Pie = ({ label, data }) => (
  <Charts
    key={label.toLowerCase()}
    style={ styles.chart }
    size={ styles.chartSize }
    donut={{
      title: capitalize(label),
      width: 42
    }}
    data={{
      type: 'donut',
      json: [ data ],
      keys: {
        value: Object.keys(data)
      },
      onclick: (d, element) => {
        console.log("Clicked on donut: ", { d: d, element: element })
      }
    }}
  />
)

export default Pie
