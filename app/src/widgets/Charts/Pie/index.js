import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsivePie } from '@nivo/pie'
import styles from '~/widgets/Charts/styles'
import capitalize from '~/utils/formatters/capitalize'


const Pie = ({ label, data }) =>
<div style={styles.chartSize}>
  <ResponsivePie
    data={Object.keys(data).map((key, i) => ({
      id: key,
      label: capitalize(key),
      value: data[key],
      /*
      problem of this approach, colors are not opposed..
      color: `hsl(${Math.round(
        i * (255 / Object.keys(data).length)
      )}, 70%, 50%)`
      */

    }))}

    margin={{
        "top": 15,
        "right": 40,
        "bottom": 30,
        "left": 40
    }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    colors="d320c"
    colorBy="id"
    borderColor="inherit:darker(0.6)"
    radialLabelsSkipAngle={10}
    radialLabelsTextXOffset={6}
    radialLabelsTextColor="#333333"
    radialLabelsLinkOffset={0}
    radialLabelsLinkDiagonalLength={16}
    radialLabelsLinkHorizontalLength={24}
    radialLabelsLinkStrokeWidth={1}
    radialLabelsLinkColor="inherit"
    slicesLabelsSkipAngle={10}
    slicesLabelsTextColor="#333333"
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    legends={[
      {
        anchor: "bottom",
        direction: "row",
        translateY: 56,
        itemWidth: 80,
        itemHeight: 12,
        symbolSize: 12,
        symbolShape: "circle"
      }
    ]}
  />
  </div>

export default Pie
