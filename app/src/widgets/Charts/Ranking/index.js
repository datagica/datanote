'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Charts from '~/widgets/Charts'
import styles from '~/widgets/Charts/styles'

const Ranking = ({ label, data }) => (
  <Charts
    key={label.toLowerCase()}
    style={ styles.chart }
    size={ styles.chartSize }
    axis={{
      x: {
        type: 'category',
      },
      // For discrete values (enumerations) we rotate to have horizontal bars and
      // sorted list, since there can be many values.
      rotated: true
    }}
    bar={{
      width: {
        ratio: 0.8
      }
    }}
    data={{
      type: 'bar',
      json: data
        .sort((a, b) => b.value - a.value)
        .slice(0, 15), // no scroll yet so we have to crop the data
      keys: {
        x: 'x',
        value: [ 'value' ]
      },
      onclick: (d, element) => {
        console.log("Clicked on bar: ", { d: d, element: element })
      }
    }}
  />
)

export default Ranking
