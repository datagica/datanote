'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ResponsiveLine } from '@nivo/line'
import styles from '~/widgets/Charts/styles'

// for distributions where X is continuous (eg. age distribution, hours etc..)
const Distribution = ({ label, data }) =>
  <div style={styles.wideChartSize}>
    <ResponsiveLine
        data={[
          {
            id: "",
            color: "hsl(253, 70%, 50%)",
            data: (console.log(data), data.map(({ x, value }) => ({
              x: x,
              y: value,
              // color: "hsl(40, 70%, 50%)",
            })))
          }
        ]}
        margin={{
          top: 50,
          right: 110,
          bottom: 50,
          left: 60
        }}
        minY="auto"
        stacked={true}
        curve="natural"
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: label,
          legendOffset: 36,
          legendPosition: "center"
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "center"
        }}
        dotSize={9}
        dotColor="inherit:darker(0.3)"
        dotBorderWidth={2}
        dotBorderColor="#ffffff"
        enableDotLabel={false}
        dotLabel="y"
        dotLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.1}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 100,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: "circle"
          }
        ]}
    />
  </div>

export default Distribution
