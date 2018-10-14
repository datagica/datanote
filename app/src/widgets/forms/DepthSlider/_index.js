'use strict'

import 'rc-slider/assets/index.css'

import React from 'react'

import Slider from 'rc-slider'

import TimeHandle from './TimeHandle'

const marks = {
  0: (<strong>0°C</strong>),
  26: '26°C',
  37: '37°C',
  50: '50°C',
  100: {
    style: {
      color: 'red',
    },
    label: (<strong>100°C</strong>),
  },
};


const TimeSlider = (
  /*
  <Slider
    allowCross={false}
    min={0}
    marks={marks}
    included={false}
    defaultValue={20}
    handle={<TimeHandle />}
  />
  */
  <Slider
    allowCross={false}
    min={0}
    included={false}
    defaultValue={20}
  />
);

export default TimeSlider;
