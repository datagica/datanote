'use strict'

import React, {Component, Children } from 'react'
import PropTypes  from 'prop-types'
import Remarkable from 'remarkable'

import styles from './styles'

export default class Markdown extends Component {

  static defaultProps = {
    src:          "",
    entities:     [],
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // Autoconvert URL-like text to links

    // Enable some language-neutral replacement + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes:       '“”‘’',
  }

  static propTypes = {
    src:          PropTypes.string,
    entities:     PropTypes.array,
    html:         PropTypes.bool,
    xhtmlOut:     PropTypes.bool,
    breaks:       PropTypes.bool,
    langPrefix:   PropTypes.string,
    linkify:      PropTypes.bool,
    typographer:  PropTypes.bool,
    quotes:       PropTypes.string
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = new Remarkable(nextProps.options)
    }
  }

  markdownify(source) {
    this.md = this.md ? this.md : new Remarkable(this.props.options)
    return this.md.render(source)
  }

  content() {
    if (this.props.src) {
      return <span dangerouslySetInnerHTML={{ __html: this.markdownify(this.props.src) }} />
    }
    return Children.map(this.props.children, child => (
      typeof child === 'string'
        ? (<span dangerouslySetInnerHTML={{ __html: this.markdownify(child) }} />)
        : child
    ))
  }

  render() {
    return (
      <div style={styles.container}>
        {this.content()}
      </div>
    )
  }
}
