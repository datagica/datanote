'use strict'

const isTouchScreen = (
  'ontouchstart' in window ||   // works on most browsers
  navigator.maxTouchPoints   // works on IE10/11 and Surface
)

export default isTouchScreen
