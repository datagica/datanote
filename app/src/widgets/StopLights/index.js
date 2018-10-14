'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

class StopLights extends Component {

  constructor(props) {
    super(props)
    if (window.node instanceof Object && window.node.ipc instanceof Object) {
      this.ipc = window.node.ipc
    }
  }

  handleClose = () => {
    this.ipc.send('close')
  }
  handleFullScreen = () => {
    this.ipc.send('fullscreen')
  }
  handleMinimize = () => {
    this.ipc.send('minimize')
  }

  render() {
    return (
    <div className="titlebar" {...this.props}>
    	<div className="titlebar-stoplight">
    		<div className="titlebar-close" onClick={this.handleClose}>
    			<svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
    				<polygon fill="#4d0000" points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"></polygon>
    			</svg>
    		</div>
    		<div className="titlebar-minimize" onClick={this.handleMinimize}>
    			<svg x="0px" y="0px" viewBox="0 0 8 1.1">
    				<rect fill="#995700" width="8" height="1.1"></rect>
    			</svg>
    		</div>
    		<div className="titlebar-fullscreen" onClick={this.handleFullScreen}>
    			<svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 5.9">
    				<path fill="#006400" d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z"></path>
    				<path fill="#006400" d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z"></path>
    			</svg>
    			<svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
    				<polygon fill="#006400" points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"></polygon>
    			</svg>
    		</div>
    	</div>
    </div>
    )
  }
}

export default StopLights
