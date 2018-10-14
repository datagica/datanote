'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMapboxGl, { GeoJSONLayer, ScaleControl, ZoomControl } from 'react-mapbox-gl'

import './mapbox.css'

/*
For an example see https://medium.com/@alex_picprod/an-efficient-webgl-map-with-mapbox-gl-js-and-react-mapbox-gl-4ac7f3d41570#.v0rv09h4b
*/

export default class Mapbox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      popup: null,
      center: this.props.center
    }

    // "ReactMapboxGl is a factory function" huh..okay? :/
    this.Map = ReactMapboxGl({
      accessToken: props.token
    })
  }

  static propTypes = {
    theme: PropTypes.string,
    token: PropTypes.string,
    data: PropTypes.object,
    center: PropTypes.array,
    containerStyle: PropTypes.object,
  };

  static get defaultProps(){
    return {
      token: `pk.eyJ1IjoiamJpbGNrZSIsImEiOiJjaXUxMHFxZGgwMDAzMnptcHFoZWFwdjFxIn0.B081FuWmdxhsTU0YH5421A`,
      theme: `mapbox://styles/mapbox/light-v9`,
      data: {},
      containerStyle: {
        height: "100vh",
        width: "100%"
      }
    }
  }

  // hack to fix the mapbxo internal elements
  hack(){
    const zoom = document.getElementsByClassName('mapboxgl-map');
    if (zoom && zoom[0] && zoom[0].children && zoom[0].children[1]) {
      zoom[0].children[1].style.top = "60px"
    }

    const attrib = document.getElementsByClassName('mapboxgl-ctrl-attrib');
    if (attrib && attrib[0] && attrib[0].style) {
      attrib[0].style.display = "none"
    }
  }

  componentDidMount() {
    this.hack();
  }

  componentDidUpdate() {
    this.hack();
  }

  render() {
    const symbolLayout = {
      "text-field": "{place}",
      "text-font": [
        "Open Sans Semibold",
        "Arial Unicode MS Bold"
      ],
      "text-offset": [0, 0.6],
      "text-anchor": "top"
    };

    // TODO use the centroid of the dataset as a center, else use current user
    // latitude and longitude, if available
    const center = this.props.center ? this.props.center : [ -77.01239, 38.91275 ];

    const geojson = (this.props.data && this.props.data.features)
      ? this.props.data
      : { type: "FeatureCollection", features: [] };

    const Map = this.Map;

    return (
      <Map
        style={this.props.theme}
        center={this.state.center}
        movingMethod="jumpTo"
        containerStyle={this.props.containerStyle}>
        <ScaleControl/>
        <ZoomControl/>
        <GeoJSONLayer
          data={geojson}
          symbolLayout={symbolLayout} />
      </Map>
    );
  }
}
