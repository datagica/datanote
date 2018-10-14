'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from "./styles.js"

import odf from './webodf'
console.log("odf: ", odf)
const OdfCanvas = odf.OdfCanvas;

export default class Odf extends Component {

  constructor (props) {
    super(props)
    this.state = {
      height: 400
    }
  }

  handleResize(e) {
     this.setState({ height: window.innerHeight - 100 });
   }

   componentDidMount() {
     window.addEventListener('resize', this.handleResize);

    var odfElement = this.refs.odf;
    var odfCanvas = new OdfCanvas(odfElement);
    odfCanvas.load(this.props.src);
   }

   componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
   }

  render(){

    const style = Object.assign({}, styles, { height: this.state.height + 'px' });
    return (
      <div style={style}>
        <div ref="odf"></div>
      </div>
    )
  }
}
