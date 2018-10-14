'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles'

const TimeHandle = props => {
  const style = Object.assign({ left: `${props.offset}%` }, styles.handle);
  return (
    <div style={style}>val: {props.value}</div>
  );
};
TimeHandle.propTypes = {
  value: PropTypes.any,
  offset: PropTypes.number,
};

export default TimeHandle
