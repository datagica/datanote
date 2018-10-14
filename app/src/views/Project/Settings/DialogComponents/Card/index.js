'use strict'

import React, {Component} from 'react'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'

import styles from './styles'

export default ({ key, isSelected, title, subtitle, onClick }) => {
  const cardStyle = Object.assign(
    {},
    styles.card,
    isSelected
      ? styles.cardSelected
      : styles.cardUnselected
  )
  const cardHeaderTitleStyle = Object.assign({}, styles.cardHeaderTitle,
    isSelected ? styles.cardHeaderTitleSelected : styles.cardHeaderTitleUnselected)
  return (
  <Card
    key={key}
    expanded={true}
    style={cardStyle}
    containerStyle={styles.cardContainer}
    onClick={onClick}
    >
    <CardHeader
      textStyle={styles.cardHeader}
      title={title}
      titleStyle={cardHeaderTitleStyle}
      subtitle={subtitle}
      subtitleStyle={styles.cardHeaderSubtitle}
      actAsExpander={true}
      showExpandableButton={false}
    />
  </Card>
  )
}
