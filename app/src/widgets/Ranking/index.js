'use strict'

import React, { Component } from 'react'
import PropTypes  from 'prop-types'
import boundaries from '~/utils/analysis/boundaries'

import Item from './Item'

import styles from './styles'

class Ranking extends Component {

  static counter = 0;

  static propTypes = {
    title:          PropTypes.string,
    data:           PropTypes.array,
    maxRank:        PropTypes.number,
    shownItems:     PropTypes.number,
    itemHeight:     PropTypes.number,
    fixHeight:      PropTypes.bool,
    scrollable:     PropTypes.bool,
    normalize:      PropTypes.bool,
    containerStyle: PropTypes.object,
    contentStyle:   PropTypes.object,
  }

  static get defaultProps(){
    return {
      title: "",
      data: [],
      maxRank: null,
      shownItems: 0,
      itemHeight: 35,
      fixHeight: false,
      scrollable: false,
      normalize: true,
      containerStyle: {},
      contentStyle: {}
    }
  }

  render() {

    const MAX_RANK = 1e6;
    let data = this.props.data;

    data.sort((a, b) => (b.rank - a.rank));

    // normally, we only show the first N items, and let the user scroll if
    // there is too many items. However, the user can also choose to disable
    // scroll. In that case, we optimize by cutting the rest of the array.
    if (this.props.shownItems && this.props.shownItems < data.length && !this.props.scrollable) {
      //console.log("slicing to "+this.shownItems)
      data = data.slice(0, this.shownItems)
    }

    let maxRank = !isNaN(this.props.maxRank) && isFinite(this.props.maxRank) ? this.props.maxRank : 100;
    //console.log("maxRank: ", maxRank)
    //console.log("normalize: ", this.props.normalize)
    if (this.props.normalize) {
      //console.log("DATA: "+JSON.stringify(data))
      maxRank = Math.min(Math.max(1, boundaries(data, item => item.rank).max), MAX_RANK);
      //console.log("boundaries: ", boundaries(data, item => item.rank))
    }

    const style = Object.assign({}, styles.ranking, {
      height: (this.props.fixHeight && this.props.shownItems)
        ? (this.props.itemHeight * this.props.shownItems + 10 + 25 )
        : 'auto',
      overflowY: this.props.scrollable ? 'auto' : 'hidden'
    })

    return (
      <div>
        <div style={Object.assign({}, styles.containerStyle, this.props.containerStyle)}>
          <h3 style={styles.title}>{this.props.title}</h3>
          <div style={Object.assign({}, styles.contentStyle, this.props.contentStyle)}>
          {data.map(item =>
            <Item
              key={item.id}
              label={item.label}
              rank={item.rank}
              ratio={(item.rank / maxRank) * 100}
              height={this.props.itemHeight}
            />
          )}
        </div>
      </div>
    </div>
     )
  }
}

export default Ranking;
