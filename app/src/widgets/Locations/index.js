'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Mapbox   from '~/widgets/Mapbox'
//import Mapbox3D from '~/widgets/Mapbox3D'

// TODO load data from the this.prop.store instead
import data from './data'

import styles from './styles'

const Locations = () => <Mapbox data={data} containerStyle={styles.container} />;
//const Locations = () => <Mapbox3D />;

export default Locations;
