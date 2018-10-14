import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

import 'rc-slider/assets/index.css'

import Rcslider from 'rc-slider'

import DepthHandle from './DepthHandle'

@autobind
@observer
class DepthSlider extends Component {

  render(){
    // see `.rc-slider-step` in themes/global.scss for styling the horizontal bar
  return (<Rcslider
    allowCross={false}
    min={1}
    max={500}
    defaultValue={20}
    included={false}
    vertical={true}
    handle={<DepthHandle />}
  />)
  }
}

export default DepthSlider;
