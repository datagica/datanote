'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'

import { observer } from 'mobx-react'

import {Flex, Box} from 'reflexbox'

import queries  from '~/stores/queries'

import Finder   from '~/widgets/Finder'
import Ranking  from '~/widgets/Ranking'

import styles from './styles.js'

const getBubble = (type, data) => {
  // console.log("getBubble: ", { type: type, data: data })
  switch (type) {

    case 'error':
      return (
        typeof data === 'string'
        ? <p style={styles.error}>{data}</p>
        : <p style={styles.error}>{JSON.stringify(data, null, 2)}</p>
      )

    case 'typing':
    case 'loading':
    case 'loader':
      return (
        <p style={styles.loading}>...</p>
      )

    case 'ranking':
      return (
        <Ranking
          title={data.title}
          data={data.data}
          maxRank={100}
        />
      )

    case 'text':
    case 'plain':
    default:
      return (
        typeof data === 'string'
          ? <p>{data}</p>
          : <p>{JSON.stringify(data, null, 2)}</p>
      )
  }
}


const Message = ({ sender, type, data }) => (
  <div style={styles.row}>
    <div style={Object.assign(
        {},
        styles.bubble,
        sender === 'bot' ? styles.bot      : styles.human,

        // nice "neutral" default colors for humans: violet1 or petroleum1
        sender === 'bot' ? styles.softgray : styles.violet1
       )}>
      {getBubble(type, data)}
    </div>
  </div>
)

@observer
class Queries extends Component {
  render(){
    console.log(`[Queries.render] queries.history:`)
    return (
      <div style={styles.root}>
        <div style={styles.rows}>
        {toJS(queries.history).map(props => <Message {...props } /> )}
        </div>
        <div style={styles.footer}>
          <Finder onSubmit={(opts) => queries.ask(opts)} />
        </div>
      </div>
    )
  }
}

export default Queries;
