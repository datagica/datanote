'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Pie          from '~/widgets/Charts/Pie'
import Ranking      from '~/widgets/Charts/Ranking'
// import Distribution from '~/widgets/Charts/Distribution'
import Distribution from '~/widgets/Charts/OldDistribution'
import Timeline     from '~/widgets/Charts/Timeline'

import styles from './styles'

export default ({ data, style, isVisible }) => {
  const components = [];
  Object.keys(data).sort().forEach(type =>
    data[type].metrics.forEach(props =>
      components.push(
        <div key={`${type} > ${props.label}`} style={styles.typeContainer}>
          <h2 style={styles.h2}>{`${type} > ${props.label}`}</h2>
          <div style={styles.chartContainer}>
           {props.type === 'pie'          ? <Pie          {...props} /> :
            props.type === 'ranking'      ? <Ranking      {...props} /> :
            props.type === 'distribution' ? <Distribution {...props} /> :
            props.type === 'timeline'     ? <Timeline     {...props} /> :
            null}
          </div>
        </div>
      )
    )
  )
  return (
    <div style={style}>
      <div style={styles.root}>{components}</div>
    </div>
  )
}
