'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind   from 'autobind-decorator'
import {observer} from 'mobx-react'

import styles     from './styles'

import Finder     from './Finder'
import Toolbar    from './Toolbar'

@autobind
@observer
class Filters extends Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	render() {
		return (
		<div style={styles.root}>
			<Finder />
			<Toolbar />
		</div>
		);
	}
}

export default Filters;
