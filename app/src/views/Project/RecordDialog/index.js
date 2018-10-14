'use strict'

import React, { Component } from 'react'

import autobind     from 'autobind-decorator'
import {observer}   from 'mobx-react'
import cancelable   from '~/utils/misc/cancelable'
import { filename } from '~/utils/formatters/humanize'

import API          from '~/api/index'

import ItemDialog   from '~/widgets/ItemDialog'

import FlatButton   from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

import styles       from './styles.js'

import Charts       from '~/widgets/Charts'
import Ranking      from '~/widgets/Ranking'

import Reader       from '~/widgets/Reader'

const defaultRecord = {
  id: '',
  type: '',
  label: {
    en: ''
  },
  value: {}
};

@autobind
@observer
class RecordDialog extends Component {

  state = {
    open: false,
    record: defaultRecord,
    uri: '',
    format: 'txt',
    affinities: {},
    entities: [],
    innerTabHeight: window.innerHeight - 253
  };

  openDialog (record) {
    console.log("[RecordDialog.openDialog]", record)
    if (!record || !record.type || !record.id) {
      console.error(`invalid record, cannot open`)
      this.setState({
        open: false
      })
      return;
    }
    this.setState({
      open: true,
      record: Object.assign({}, record, { label: filename(record.label) }),
      uri: `${record.uri || ''}`,
      format: `${record.uri || ''}`.split('.').pop()
    });

    // since we don't need stats immediately let's give ourselves a break
    setTimeout(() => {
      console.log("calling fetchEntities")
      this.fetchEntities(record)
    }, 100)
    setTimeout(() => { this.fetchAffinities(record) }, 200)
  };

  fetchAffinities (record) {
    console.log("[RecordDialog.openDialog]", {
      record: record
    })
    const innerQuery = {
      records: {
        '*': [ record.id ]
      },
      links: {
        'link:mention': []
      }
    }
    const outerQuery = {
      exclude: [ record.id ]
    }

    console.log(`[RecordDialog.openDialog] API.affinities(innerQuery, outerQuery):`, {
      innerQuery: innerQuery,
      outerQuery: outerQuery
    })

    if (this._affinities) {
      this._affinities.cancel();
    }

    this._affinities = cancelable(API.affinities(innerQuery, outerQuery))
    this._affinities.promise
    .then(affinities => this.setState({ affinities: affinities }))
    .catch(err => {
      console.error(`[RecordDialog.fetchAffinities] couldn't get affinities:`, err)
      if (err.isCanceled) {
        return console.log("promise canceled")
      }
      this.setState({ affinities: {} });
    })
  }

  fetchEntities (record) {

    console.log("[RecordDialog.fetchEntities] fetchEntities")
    if (this._entities) {
      this._entities.cancel();
    }

    console.log("[RecordDialog.fetchEntities] calling API.recordEntities("+record.type+", "+record.id+")");
    this._entities = cancelable(API.recordEntities(record.id))

    this._entities.promise.then(entities => {
      console.log("[RecordDialog.fetchEntities] got entities", entities)
      this.setState({ entities: entities })
    }).catch(err => {
      console.error(`[RecordDialog.fetchEntities] couldn't get affinities:`, err)
      if (err.isCanceled) {
        return console.log("[RecordDialog.fetchEntities] promise canceled")
      }
      this.setState({ entities: [] });
    })
  }

  closeDialog () {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize)
  }

	componentWillUnmount() {
    if (this._affinities) this._affinities.cancel();
    if (this._entities)   this._entities.cancel();
    window.removeEventListener('resize', this.handleResize)
  }
	handleResize(e) { this.setState({ innerTabHeight: window.innerHeight - 203}) }

  render() {
    const actions = [
      /*
      <FlatButton
        label="Print"
        primary={true}
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="Export"
        primary={true}
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.closeDialog}
      />
      */
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

    if (this.state.record.value) {
      const obj = this.state.record.value;
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

    //console.log("DOCUMENT affinities: ", this.state.affinities);
    //console.log("DOC: ", this.state.record)

    return (
      <ItemDialog
        entity={this.state.record}
        actions={actions}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        bodyStyle={styles.body}
        contentStyle={styles.content}
        titleStyle={styles.title}
        >
        <div style={{
            height: '100%',
            padding: '0px',
            margin: '0px',
            width: '75%',
          }}>
          <Reader
            height={this.state.innerTabHeight}
            src={this.state.uri}
            format={this.state.format}
            entities={this.state.entities}
            />
        </div>
        <div style={{
          padding: '0px',
          margin: '0px',
          position: 'absolute',
          left: '75%',
          right: '0px',
          top: '75px',
          bottom: '0px',
          overflow: 'hidden'
        }}>
              <div style={{
                padding: '0',
                height: `${this.state.innerTabHeight}px`,
                overflowX: 'hidden',
                overflowY: 'auto',
                width: '100%',
                margin: '0'
                }}>
                {Object.keys(this.state.affinities).map(type =>
                  <Ranking
                    key={type}
                    title={`${type}`}
                    data={this.state.affinities[type].data}
                    maxRank={this.state.affinities[type].maxRank}
                    scrollable={false}
                    fixHeight={false}
                    shownItems={8}
                    itemHeight={35}
                    containerStyle={{
                      // margin: '5%',
                      // width: '80%',
                    }}
                    contentStyle={{
                      border: 'solid 0px #d4d4d4',
                      boxShadow: '0 1px 3px -1px rgba(0,0,0,0.42)',
                      background: '#f7f7f7',
                      // margin: '0px',
                      // padding: '5%',
                    }}
                  />
                )}
              </div>
        </div>
      </ItemDialog>
    );
  }
}

export default RecordDialog;
