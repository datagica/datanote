'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Charts from '~/widgets/Charts'
import styles from '~/widgets/Charts/styles'

// for distributions where X is continuous (eg. age distribution, hours etc..)
const Distribution = ({ label, data }) => (
  <Charts
    key={label.toLowerCase()}
    style={ styles.chart }
    size={ styles.chartSize }
    axis={{
      x: {
        // 'category' is for discrete data
        // type: 'category',
      },

      // For continuous values (distributions) we leave the default, as it is
      // a rather classic numerical chart.
      // rotated: false
    }}
    bar={{
      width: {
        ratio: 0.8
      }
    }}
    data={(console.log(data), {
      type: 'bar',
      json: data, // makeContinuous(data),
      keys: {
        x: 'x',
        value: [ 'value' ]
      },
      onclick: (d, element) => {
        console.log("Clicked on bar: ", { d: d, element: element })
      }
    })}
  />
)

export default Distribution
