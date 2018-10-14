
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SpeechField from '~/widgets/SpeechField'

import styles from './styles'

import { Search as SearchIcon, Wand as WandIcon }  from '~/themes/icons'


// the icon can be put in front
//  <WandIcon style={styles.finderIcon} color={styles.finderIconColor} />

export default ({ style, onSubmit }) => (
  <div style={style}>
    <SpeechField onSubmit={onSubmit} />
  </div>
)
