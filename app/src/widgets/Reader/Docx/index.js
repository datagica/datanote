'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from "./styles.js"

import docx from './docx'
console.log("docx: ", docx)

export default class Docx extends Component {

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

     /*

     document.getElementById('files').addEventListener('change', function(e){
     var reader = new FileReader();
         reader.onload = function(ev) {
             var docObject = docx.read(ev.target.result); // accepts ArrayBuffers
             document.getElementById("center").appendChild(docObject.DOM);
         };
         reader.readAsArrayBuffer(e.target.files[0]);
     }, false);

     */
   }

   componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
   }

  render(){

    const style = Object.assign({}, styles, { height: this.state.height + 'px' });
    return (
      <div style={style}>
        <div ref="docx"></div>
      </div>
    )
  }
}
