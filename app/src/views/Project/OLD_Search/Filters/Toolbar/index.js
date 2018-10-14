

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import {observer} from 'mobx-react'

import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'

//import './style.css'

import DepthSlider from '~/widgets/forms/DepthSlider'

import styles from './styles'

@autobind
@observer
class _Toolbar extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      value: 2,
    }
  }

  handleChange(event, index, value){
    this.setState({value})
  }

  render(){
    return (
    <div style={styles.root}>
      <Toolbar style={styles.toolbar}>
       <ToolbarGroup firstChild={true}>
         <DropDownMenu
          value={this.state.value}
          onChange={this.handleChange}>
           <MenuItem value={1} primaryText="Show all" />
           <MenuItem value={2} primaryText="Show only active" />
           <MenuItem value={3} primaryText="Test Button" />
         </DropDownMenu>
       </ToolbarGroup>
       <ToolbarGroup>
         <FontIcon className="muidocs-icon-custom-sort" />
        <ToolbarSeparator />
        <FlatButton label="Foo" />
        <FlatButton label="Bar" />
       </ToolbarGroup>
       <ToolbarGroup>
         <ToolbarSeparator />
         <FlatButton label="New Item" />
         <IconMenu
           iconButtonElement={
             <IconButton touch={true}>
               <NavigationExpandMoreIcon />
             </IconButton>
           }
         >
           <MenuItem primaryText="Export CSV" />
           <MenuItem primaryText="Export XLSX" />
         </IconMenu>
       </ToolbarGroup>
     </Toolbar>
   </div>
    )
  }
}

export default _Toolbar
