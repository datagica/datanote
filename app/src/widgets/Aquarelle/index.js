import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './styles.css'

export default class Aquarelle extends Component {

  static propTypes = {
    isVisible: PropTypes.bool
	}

  static defaultProps = {
    isVisible: false
  }

  render () {

    return (
      <div>
        <svg>
          <defs>
            <filter id="aquarelle">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="aquarelle" />
  				  </filter>
  		    </defs>
       </svg>
       <div
         className="aquarelle-container aquarelle aquarelle-style3"
         style={{ opacity: this.props.isVisible ? 1.0 : 0.0 }}>
         <div/>
         <div/>
         <div/>
         <div/>
         <div/>
       </div>
     </div>
   )
  }
}
