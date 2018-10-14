'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

const DepthHandle = props => {
  const style = Object.assign({ left: `${props.offset}%` }, styles.handle);
  return (
    <div style={style}>{props.value}</div>
  );
};
DepthHandle.propTypes = {
  value: PropTypes.any,
  offset: PropTypes.number,
};

export default DepthHandle
