'use strict'

import React, { Component, cloneElement} from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

import PDFJS from 'pdfjs-dist'
PDFJS.workerSrc = 'out/pdf.worker.bundle.js'
window.PDFJS = PDFJS

import Page from './Page'

import { countPagesLength } from './utils'

import styles from './styles'

@autobind
class Pdf extends Component {

  constructor (props) {
    super(props)
    this.state = {
      pdf: null,
      scale: 3.0, // 2 // 1.2
      pages: [],
      height: window.innerHeight  - 300
    }
  }

  getChildContext () {
    return {
      pdf: this.state.pdf,
      scale: this.state.scale,
    }
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize);
    console.log("Pdf.componentDidMount: ", {
      "this.props.src": this.props.src
    })
    PDFJS.getDocument(this.props.src).then(pdf =>
      countPagesLength(pdf)
        .then(pages => {
          console.log("Pdf.componentDidMount: yay, got pdf and pages! ", pages);
          this.setState({ pdf: pdf, pages: pages })
        })
        .catch(err => {
          console.error(`Pdf.componentDidMount: couldn't count pages len`, err)
          this.setState({ pdf: pdf })
        })
    )
  }

  handleResize(e) {
     this.setState({ height: window.innerHeight - 100 });
   }

   componentWillUnmount() {
     window.removeEventListener('resize', this.handleResize);
   }

  render () {
    const fingerprint = this.state.pdf ? this.state.pdf.pdfInfo.fingerprint : 'none'
    const style = Object.assign({}, styles, { height: this.state.height + 'px' })

    const pages = this.state.pages

     // create a new copy for this rendering pass
    const highlight = {
      entityCursor: 0,
      chunkCursor: 0,
      errorDelta: 0,
      entities: this.props.entities.slice()
    }

    console.log("Pdf.render", pages);
    return (
      <div style={style}>
        {pages.map(page => <Page key={`${fingerprint}-${page.i}`} index={page.index} pages={pages} highlight={highlight} />)}
      </div>
    )
  }
}

Pdf.propTypes = {
  src:     PropTypes.string.isRequired,
  entities: PropTypes.array.isRequired
}

Pdf.childContextTypes = {
  pdf:   PropTypes.object,
  scale: PropTypes.number,
}

export default Pdf
