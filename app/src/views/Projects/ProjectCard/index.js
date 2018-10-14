'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import capitalize from '~/utils/formatters/capitalize'

import {fileSize} from 'humanize-plus'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'

import Aquarelle from '~/widgets/Aquarelle'

import { NavigationClose } from '~/themes/icons'

import styles from './styles'

class ProjectCard extends Component {

  COLOR_WORKING = 'rgb(63, 199, 250)'
  COLOR_SUCCESS = 'rgb(133, 210, 98)'

  static propTypes = {
    deleteProject: PropTypes.func.isRequired,
    openProject: PropTypes.func.isRequired
  }

  render(){
    const size = fileSize(this.props.stats.size).split(' ')
    const sizeValue = size.slice(0, size.length - 1).join(' ')
    const sizeUnit = size[size.length - 1]

    // for the moment, we cannot show a spinner because we need two things:
    // - a smart component to handle the animation, and completely remove the
    //   component once the animation is finished
    // - a condition to detect when we are loading the first time
    const isLoading = false
    const isUpdating = false

    console.log('RENDERING STATS: ', this.props.stats)

    return (
  <Card
		key={this.props.projectId}
		expanded={true}
		style={styles.card}
      onClick={() => this.props.openProject(this.props.projectId)}
		containerStyle={styles.cardContainer}>
    <CardHeader
      title={capitalize(this.props.projectId)}
      titleStyle={styles.cardHeaderTitle}
      subtitle={<IconButton
            className="hovertrick"
            tooltip="Delete Project"
            onClick={() => this.props.deleteProject(this.props.projectId)}
            style={styles.deleteButton}
          >
            <NavigationClose />
          </IconButton>}
      subtitleStyle={styles.cardHeaderSubtitle}
      actAsExpander={true}
      showExpandableButton={false}
    />
    <CardText style={styles.cardText}>
      <div style={styles.cardTextRow}>
        <span style={styles.cardTextRowValue}>{this.props.stats.records}</span>
        <span style={styles.cardTextLabel}>records</span>
      </div>
      <div style={styles.cardTextRow}>
        <span style={styles.cardTextRowValue}>{this.props.stats.entities}</span>
        <span style={styles.cardTextLabel}>entities</span>
      </div>
      </CardText>
  </Card>
  )
  }
};

export default ProjectCard;
