
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'rc-slider/assets/index.css'

import Rcslider from 'rc-slider'

import TimeHandle from './TimeHandle'

class TimeSlider extends Component {

  render(){
    // see `.rc-slider-step` in themes/global.scss for styling the horizontal bar
  return (<Rcslider
    allowCross={false}
    min={0}
    max={1024}
    defaultValue={20}
    included={false}
    handle={<TimeHandle />}
  />)
  }
}

export default TimeSlider;
