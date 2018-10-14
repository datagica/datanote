'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.js'

import { Flex } from 'reflexbox'

class Item extends Component {

  static counter = 0;

  static propTypes = {
    label : PropTypes.object,
    rank  : PropTypes.number,
    ratio : PropTypes.number,
    height: PropTypes.number,
  };

  static get defaultProps(){
    return {
      rank  : 0,
      ratio : 0.5,
      height: 35
    }
  }

  render() {
    const label    = this.props.label;
    const height   = `${this.props.height}px`;
    const progress = `${this.props.ratio}%`;
    return (
      <Flex
        m={0} p={0}
        align='center'
        style={{ height: height }}>
        {(typeof label === 'undefined' || label === null) ? null :
          <div style={Object.assign({}, styles.itemLabel, { height: height, lineHeight: height })}>
          {(this.props.label && this.props.label.en) ? `${this.props.label.en}` : `${this.props.label}`}
        </div>}
        <div style={styles.itemProgressBg}>
          <div style={Object.assign({}, styles.itemProgressFg, { width: progress })}></div>
        </div>
        <div style={Object.assign({}, styles.itemProgressRank, { height: height, lineHeight: height })}>
          {this.props.rank}
        </div>
      </Flex>
    )
  }
}

export default Item
