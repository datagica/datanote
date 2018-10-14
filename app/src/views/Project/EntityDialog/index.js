'use strict'

import React, { Component } from 'react'
import PropTypes    from 'prop-types'
import autobind     from 'autobind-decorator'
import {observer}   from 'mobx-react'
import cancelable   from '~/utils/misc/cancelable'

import API          from '~/api/index'

import ItemDialog   from '~/widgets/ItemDialog'

import FlatButton   from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import styles       from './styles'

import Charts       from '~/widgets/Charts'
import Ranking      from '~/widgets/Ranking'
import Mapbox       from '~/widgets/Mapbox'

const defaultEntity = {
  id: '',
  type: '',
  label: {
    en: ''
  },
  value: {}
};

const PropertyField = ({ type, key, value }) => {
  if (value === null || typeof value === 'undefined' || value === '' || isNaN(value)) {
    return null
  } else if (typeof value === 'string') {
    return <span>{value}</span>
  } else if (typeof value === 'number') {
    return <span>{`${value}`}</span>
  } else if (Array.isArray(value) && value.length > 0) {
    return <span>{value.map(i => `${i}`).join(', ')}</span>
  } else {
    return <span>{JSON.stringify(value)}</span>
  }
}

@autobind
@observer
class EntityDialog extends Component {

  state = {
    open: false,
    entity: defaultEntity,
    affinities: {},
    locations: {},
    innerTabHeight: window.innerHeight - 200
  };

  openDialog (entity) {
    console.log("[EntityDialog.openDialog]", {
      entities: entity
    })
    const innerQuery = {
      entities: {
        '*': [ entity.id ]
      },
      links: {
        'link:mention': []
      }
    }
    const outerQuery = {
      exclude: [ entity.id ]
    }

    console.log("[EntityDialog.openDialog] API.affinities(innerQuery, outerQuery): ", {
      innerQuery: innerQuery,
      outerQuery: outerQuery
    })

    if (this._affinities) {
      this._affinities.cancel();
    }

    this._affinities = cancelable(API.affinities(innerQuery, outerQuery))
    this._affinities.promise
    .then(affinities => {
      console.log("[EntityDialog.openDialog] got affinities: ", affinities)

      this.setState({
        open: true,
        entity: entity,
        affinities: affinities,
        locations: {}
      });

    }).catch(err => {
      console.error("[EntityDialog.openDialog] couldn't get affinities: ", err)
      if (err.isCanceled) {
        return console.log("promise canceled")
      }
      this.setState({
        open: false,
        entity: defaultEntity,
        affinities: {},
        locations: {}
      });
    })
  };

  closeDialog () {
    this.setState({open: false});
  };

  componentDidMount() { window.addEventListener('resize', this.handleResize) }
	componentWillUnmount() {
    if (this._affinities) this._affinities.cancel();
    window.removeEventListener('resize', this.handleResize)
  }
	handleResize(e) { this.setState({ innerTabHeight: window.innerHeight - 200}) }

  getMap() {
    /*
    <div>
      <Mapbox data={this.state.locations} containerStyle={styles.mapboxContainer} />
    </div>
    */
    return null;
  }

  render() {
    /*
    Disabled because these features are not ready yet
    const actions = [
      <FlatButton label="Print"  primary={true} onTouchTap={this.closeDialog} />,
      <FlatButton label="Export" primary={true} onTouchTap={this.closeDialog} />,
      <FlatButton label="Close"  primary={true} onTouchTap={this.closeDialog} />
    ];
    */

    const actions = [
      <FlatButton label="Close" primary={true} onTouchTap={this.closeDialog} />
    ];

    const properties = [];

    // properties we do not want to display because these are already shown
    // somewhere else or are used internally
    const propertyBlacklist = new Set([
      'aliases',
      'description',
      'id',
      'label',
      'type'
    ]);

    if (this.state.entity.value) {
      const obj = this.state.entity.value;
      Object.keys(obj).map(key => {
        if (propertyBlacklist.has(key.toLowerCase())) return;
        let value = obj[key];

        // TODO replace this later by a proper internationalization function
        if (typeof value.en === 'string') {
          value = value.en;
        }

        properties.push({
          key: key,
          type: 'string', // TODO even if json objects are not typed at least this should be guessed
          value: value
        })
      })
    }

    if (this.state.entity.value && this.state.entity.value.description && this.state.entity.value.description.en) {
      properties.push({
        key: 'description',
        type: 'paragraph',
        value: `${this.state.entity.value.description.en}`
      })
    }

    console.log("going to render ItemDialog");
    return (
      <ItemDialog
        entity={this.state.entity}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        contentStyle={styles.dialogContent}
        >
          <div style={Object.assign({}, styles.dialogBody, { height: `${this.state.innerTabHeight}px` })}>
            {this.getMap()}
            <div style={styles.propertyContainer}>
            {properties.map(property =>
              <div style={property.type === 'paragraph' ? styles.propertyParagraphBlock : styles.propertyInlineBlock}>
                <label style={styles.propertyKey}>{property.key}</label>
                <div style={styles.propertyValue}>
                  <PropertyField value={property.value} />
                </div>
              </div>
            )}
          </div>
          <div style={styles.affinitiesContainer}>
            {Object.keys(this.state.affinities).map(type => {
              return (
              <Ranking
                key={type}
                title={`Related ${type}`}
                data={this.state.affinities[type].data}
                maxRank={this.state.affinities[type].maxRank}
                scrollable={false}
                fixHeight={true}
                shownItems={10}
                itemHeight={35}
                containerStyle={{}}
                contentStyle={{}}
                />)
              }
            )}
          </div>
        </div>
      </ItemDialog>
    );
  }
}

export default EntityDialog;
