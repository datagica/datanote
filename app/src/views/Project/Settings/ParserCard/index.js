'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from '~/utils/formatters/capitalize'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import Toggle     from 'material-ui/Toggle'

import { NavigationClose } from '~/themes/icons'

import project from '~/stores/project'

import styles from './styles.js'

class ParserCard extends Component {

  edit = () => {
		console.log("cannot edit a parser yet")
    // TODO: open the popin
  }

  onToggle = () => {

    const { bundleId, templateId, parserId, parserName, isActive, settings } = this.props;
    console.log("updating parser toggle state..")

    project.updateParser({
      parserId   : parserId,
      bundleId   : bundleId,
      templateId : templateId,
      parserName : parserName,
      isActive   : (!isActive),
      settings   : settings
    }).then(_ => {
      console.log("updated parser") // mobx will redraw the card
    }).catch(err => {
      console.error("couldn't update parser: ", err)
    })
  }

  onRemove = () => {
    console.log("removing parser..")
    project.deleteParser(this.props.parserId).then(_ => {
      console.log("removed parser") // mobx will destroy the card
    }).catch(err => {
      console.error("couldn't remove parser: ", err)
    })
  }

  render () {
		const { bundleId, templateId, parserId, parserName, isActive, settings } = this.props;

    return (
  <Card
		expanded={false}
		style={styles.cardStyle}
		containerStyle={styles.cardContainer}>
    <Toggle
      style={styles.toggle}
      thumbStyle={styles.thumbOff}
      trackStyle={styles.trackOff}
      thumbSwitchedStyle={styles.thumbSwitched}
      trackSwitchedStyle={styles.trackSwitched}
      onToggle={this.onToggle}
      toggled={isActive}
    />
    <CardHeader
      style={styles.cardHeader}
      title={`${bundleId.toUpperCase()} / ${templateId.toUpperCase()}`}
      titleStyle={styles.parserCategory}
      subtitle={`${capitalize(parserName)}`}
      subtitleStyle={styles.cardHeaderSubtitle}
      actAsExpander={false}
      expandable={false}
      showExpandableButton={false}
    />
    <IconButton className="hovertrick" tooltip="Remove Parser" onClick={this.onRemove} style={styles.deleteButton}>
      <NavigationClose />
    </IconButton>
  </Card>
  )
  }
};

export default ParserCard;
