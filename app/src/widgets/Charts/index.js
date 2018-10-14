'use strict'

// fork from https://github.com/bcbcarl/react-c3js

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import c3 from 'c3'
import 'c3/c3.css'
import './custom-c3-style.css'

const emptyFunc = () => {};

class Charts extends Component {
  static displayName = 'Charts';
  static propTypes = {
    data:        PropTypes.object.isRequired,
    title:       PropTypes.object,
    size:        PropTypes.object,
    padding:     PropTypes.object,
    color:       PropTypes.object,
    interaction: PropTypes.object,
    transition:  PropTypes.object,
    oninit:      PropTypes.func,
    onrendered:  PropTypes.func,
    onmouseover: PropTypes.func,
    onmouseout:  PropTypes.func,
    onresize:    PropTypes.func,
    onresized:   PropTypes.func,
    axis:        PropTypes.object,
    grid:        PropTypes.object,
    regions:     PropTypes.array,
    legend:      PropTypes.object,
    tooltip:     PropTypes.object,
    subchart:    PropTypes.object,
    zoom:        PropTypes.object,
    point:       PropTypes.object,
    line:        PropTypes.object,
    area:        PropTypes.object,
    bar:         PropTypes.object,
    pie:         PropTypes.object,
    donut:       PropTypes.object,
    gauge:       PropTypes.object,
    className:   PropTypes.string,
    style:       PropTypes.object
  };
  static defaultProps = {
    // no default for data
    title: {},
    size: {},
    padding: {},
    color: {},
    interaction: {},
    transition: {},
    oninit: emptyFunc,
    onrendered: emptyFunc,
    onmouseover: emptyFunc,
    onmouseout: emptyFunc,
    onresize: emptyFunc,
    onresized: emptyFunc,
    axis: {},
    grid: {},
    regions: [],
    legend: {},
    tooltip: {},
    subchart: {},
    zoom: {},
    point: {},
    line: {},
    area: {},
    bar: {},
    pie: {},
    donut: {},
    gauge: {}
  };

  componentWillReceiveProps(newProps) { this.updateChart(newProps)   }
  componentWillUnmount()              { this.destroyChart()          }
  componentDidMount()                 { this.updateChart(this.props) }

  generateChart(mountNode, config) {
    return c3.generate(Object.assign({ bindto: mountNode }, config))
  }

  destroyChart() {
    try {
      this.chart = this.chart.destroy()
    } catch (err) {
      throw new Error('Internal C3 error', err)
    }
  }

  updateChart(config) {
    if (this.chart) this.destroyChart();
    this.chart = this.generateChart(findDOMNode(this), Object.assign({}, config))
  }

  render() {
    return <div className={ this.props.className ? ` ${this.props.className}` : '' }
                    style={ this.props.style     ? this.props.style           : {} } />;
  }
}

export default Charts
