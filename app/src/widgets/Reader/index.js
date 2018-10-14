'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pdf      from './Pdf'
/*import Odf      from './Odf'
import Docx     from './Docx'
import Markdown from './Markdown'*/
import Text     from './Text'

function getFileReader(format){
  switch (format.trim().toLowerCase()) {
    case 'pdf':
      return Pdf

    /*case 'odt':
    case 'odf':
      return Odf

    case 'docx':
      return Docx

    case 'md':
    case 'markdown':
      return Markdown
      */

    default:
      return Text
  }
}

export default class Reader extends Component {

  static propTypes = {
    format:   PropTypes.string.isRequired,
    height:   PropTypes.number,
    src:      PropTypes.string,
    entities: PropTypes.array,
  }

  render(){
    const FileReader = getFileReader(this.props.format);
    return (
      <FileReader
        height={this.props.height}
        src={this.props.src}
        entities={this.props.entities}
      />
    )
  }
}
