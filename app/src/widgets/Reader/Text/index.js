'use strict'

import React, {Component, Children } from 'react'
import PropTypes from 'prop-types'
import cancelable from '~/utils/misc/cancelable'
import { load, replace } from '../utils'

import styles from './styles'

export default class Text extends Component {

  static defaultProps = {
    height:   '100%',
    src:      "",
    entities: []
  }

  static propTypes = {
    height:   PropTypes.number,
    src:      PropTypes.string,
    entities: PropTypes.array
  }

  constructor(props){
    super(props)
    this.state = {
      raw: "",
      data: []
    }
  }

  componentWillMount(){
    console.log("Text.componentWillMount")
    this.loadAll(this.props.src, this.props.entities)
  }

  loadAll(uri, entities){
    console.log("Text.loadAll")
    if (!uri) {
      console.log("Text.uri is empty")
      return;
    }
    if (this._loading) {
      this._loading.cancel()
    }
    this._loading = cancelable(
      load(uri).then(data => {
        console.log("load uri then data: ", data)
        return replace({
        entities: entities,
        content: data,
        textGetter: (input) => (input)
      })
    })
    );
    this._loading.promise
      .then(data => this.setState({ data: data }) )
      .catch(err => {
      console.error("got error: ", err)
    })
  }

  loadEntities(data, entities){
    console.log("Text.loadEntities")
    if (this._loading) {
      this._loading.cancel()
    }
    console.log("loaded entities")
    this._loading = cancelable(
      replace({
        entities: entities,
        content: data,
        textGetter: (input) => (input)
      })
    )
    this._loading.promise
    .then(data => this.setState({ data: data }))
    .catch(err => {
      console.error("got error: ", err)
    })
  }

  componentWillUnmount(){
    console.log("Text.componentWillUnmount")
    if (this._loading) {
      this._loading.cancel()
    }
  }
  componentWillUpdate(nextProps, nextState) {
    console.log("Text.componentWillUpdate")
    // optimization:
    // instead of reloading the whole file, just re-annotate on the cached raw data
    //if (this.state.raw !== "" && nextProps.entities !== this.props.entities) {
    //  return this.loadEntities(this.state.raw, nextProps.entities)
    //}
    //if (nextProps.src !== this.props.src) {
    //  return this.loadAll(nextProps.src, nextProps.entities)
    //}
    if (nextProps.src !== this.props.src || nextProps.entities !== this.props.entities) {
      return this.loadAll(nextProps.src, nextProps.entities)
    }
  }

  render() {
    const containerStyle = Object.assign({}, styles.container, {
      height: this.props.height
    })
    return (
      <div style={containerStyle}>
        <p style={styles.paragraph}>
          {this.state.data.map(item => (
           item === '\n'     ? <br   key={item.key} />
  : typeof item === 'string' ? <span key={item.key}>{item}</span>
                             : <a    key={item.key}
                                     href="#"
                                     style={Object.assign({}, styles.linkStyle)}
                              >{item.position.ngram}</a>
          ))}
        </p>
      </div>
    )
  }
}
