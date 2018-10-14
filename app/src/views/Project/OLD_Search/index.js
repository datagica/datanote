'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {toJS} from 'mobx'
import {observer} from 'mobx-react'

import search      from '~/stores/search'

import Filters      from './Filters'

import Graph        from '~/widgets/Graph'

@observer
class Search extends Component {

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

  constructor(props){
		super(props)
		this.state = {
		  //	data: []
		}
	}

	render() {
		return (
		<div style={{height: '100%'}}>
			<Filters />
			<div>
				<Graph data={toJS(results.graph)} style={{height: '100%'}} />
			</div>
		</div>
		)
	}
}

export default Search
