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

class SourceCard extends Component {

  edit = () => {
		console.log("cannot edit a source yet")
    // TODO: open the popin
  }

  onToggle = () => {

    const { bundleId, templateId, sourceId, sourceName, isActive, settings } = this.props;
    console.log("updating source toggle state..")

    project.updateSource({
      sourceId   : sourceId,
      bundleId   : bundleId,
      templateId : templateId,
      sourceName : sourceName,
      isActive   : (!isActive),
      settings   : settings
    }).then(_ => {
      console.log("SourceCard: updated source")
      // apprently the state isn't automatically updated,
      // which is weird
      console.log("SourceCard: forcing update")
      this.forceUpdate()
    }).catch(err => {
      console.error("couldn't update source: ", err)
    })
  }

  onRemove = () => {
    console.log("SourceCard: removing source..")
    project.deleteSource(this.props.sourceId).then(_ => {
      console.log("SourceCard: removed source")
      // apprently the state isn't automatically updated,
      // which is weird
      console.log("SourceCard: forcing update")
      this.forceUpdate()
    }).catch(err => {
      console.error("couldn't remove source: ", err)
    })
  }

  render () {
		const { bundleId, templateId, sourceId, sourceName, isActive, settings } = this.props;

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
      titleStyle={styles.sourceCategory}
      subtitle={`${capitalize(sourceName)}`}
      subtitleStyle={styles.cardHeaderSubtitle}
      actAsExpander={false}
      expandable={false}
      showExpandableButton={false}
    />
    <IconButton
      className="hovertrick"
      tooltip="Remove Source"
      onClick={this.onRemove}
      style={styles.deleteButton}>
      <NavigationClose />
    </IconButton>
  </Card>
  )
  }
}

export default SourceCard
