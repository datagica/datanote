'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Charts from '~/widgets/Charts'
import styles from '~/widgets/Charts/styles'

const Timeline = ({ label, data }) =>
  <Charts
    key={label.toLowerCase()}
    style={ styles.chart }
    size={ styles.wideChartSize }
    axis={{
      x: {
        type: 'timeseries',
        tick: { format: '%Y-%m-%d' }
        //tick: { format: '%Y-%m-%d %H:%M:%S' }
      }
    }}
    data={{
      type: 'bar', // type: 'area-spline',
      xFormat: '%Y-%m-%d %H:%M:%S',
      json: data.sort((a, b) => b.x.getTime() - a.x.getTime()),
      keys: {
        x: 'x',
        value: [ 'value' ]
      },
      onclick: (d, element) => {
        console.log("Clicked on timeserie value: ", { d: d, element: element })
      }
    }}
    bar={{
      width: {
        ratio: 0.2 // this makes bar width 20% of length between ticks
      }
    }}
  />

export default Timeline
