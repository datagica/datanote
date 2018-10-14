// REACT
import React, { Component } from 'react'
import PropTypes from 'prop-types'
// DECORATORS
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

import search from '~/stores/search'

import SvgIcon from 'material-ui/SvgIcon'

import SpeechField from '~/widgets/forms/SpeechField'

import styles from './styles.js'

const SearchIcon = (props) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
  <path d="M448.3,424.7L335,311.3c20.8-26,33.3-59.1,33.3-95.1c0-84.1-68.1-152.2-152-152.2c-84,0-152,68.2-152,152.2
    s68.1,152.2,152,152.2c36.2,0,69.4-12.7,95.5-33.8L425,448L448.3,424.7z M120.1,312.6c-25.7-25.7-39.8-59.9-39.8-96.3
    s14.2-70.6,39.8-96.3S180,80,216.3,80c36.3,0,70.5,14.2,96.2,39.9s39.8,59.9,39.8,96.3s-14.2,70.6-39.8,96.3
    c-25.7,25.7-59.9,39.9-96.2,39.9C180,352.5,145.8,338.3,120.1,312.6z"/>
  </SvgIcon>
);

@autobind
@observer
class Finder extends Component {

  onChange(event){
    console.log("onChange: ", event);
  }
  onEnd(event){
    console.log("onEnd: ", event);
  }
  onKeyDown(event){
    if (event.keyCode === 13) {
      search.findAsync(event.target.value);
    }
  }

  render() {
    return (
      <div style={styles.finder}>
        <SearchIcon
          style={styles.searchIcon}
          color={styles.searchIconColor} />
        <SpeechField
          onChange={this.onChange}
          onEnd={this.onEnd}
          onKeyDown={this.onKeyDown} />
      </div>
    )
  }
}

export default Finder;
