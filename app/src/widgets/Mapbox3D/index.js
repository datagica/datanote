'use strict'

import React, { Component } from "react"
import PropTypes            from 'prop-types'
import MapGL                from 'react-map-gl'
import DeckGL, {LineLayer}  from 'deck.gl'

// Set your mapbox token here
const MAPBOX_TOKEN = `pk.eyJ1IjoiamJpbGNrZSIsImEiOiJjaXUxMHFxZGgwMDAzMnptcHFoZWFwdjFxIn0.B081FuWmdxhsTU0YH5421A`;

class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.785164,
        longitude: -122.41669,
        zoom: 16.140440,
        bearing: -20.55991,
        pitch: 60
      },
      width: 500,
      height: 500
    };
  }

  render() {
    const {viewport, width, height} = this.state;
    const lineLayer = {
      data: [{
        sourcePosition: [-122.41669, 37.7853],
        targetPosition: [-122.41669, 37.781]}
      ]
    }

    return (
      <MapGL
        {...viewport}
        width={width}
        height={height}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGL
          {...viewport}
          width={width}
          height={height}
          debug
          layers={[
            new LineLayer(lineLayer)
          ]} />
      </MapGL>
    );
  }
}
