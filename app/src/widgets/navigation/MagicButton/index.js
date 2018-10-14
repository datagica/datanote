
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import autobind from 'autobind-decorator'
import {toJS} from 'mobx'
import {observer} from 'mobx-react'

import ReactDOM from "react-dom"

import {Menu, MainButton, ChildButton} from 'react-mfb'

// MFB
import './mfb/styles.scss'

// our style
import './styles.scss'

@autobind
@observer
class MagicButton extends Component {

  constructor(props){
    super(props)
    this.state = {
      currentGroup: 'profileList'
    }
  }

  render() {
    /*
    TODO this button should have hide/display sub-button

    */
    return (
       <Menu
         effect='zoomin'
         method='hover'
         position='br'
         style={{
           //backgroundColor: 'rgb(114, 118, 184)' // nice violet
           //backgroundColor: 'rgb(114, 184, 163)' // nice green

         }}
         className={this.state.currentGroup}
         >
         <MainButton
            iconResting="ion-briefcase"
            label="Candidate activity"
            iconActive="ion-person-stalker" />
            <ChildButton
               onClick={function(e){ console.log(e); e.preventDefault(); }}
               className="profileList"
               icon="ion-calendar"
               label="Interview"
               href="#" />
         <ChildButton
            onClick={function(e){ console.log(e); e.preventDefault(); }}
            className="profileList"
            icon="ion-calendar"
            label="Position"
            href="#" />
        <ChildButton
            icon="ion-chatbubbles"
            className="profileList"
            label="Message"
            href="#" />
          <ChildButton
            className="profileList"
            icon="ion-email"
            label="Candidate"
            href="#" />


         <ChildButton
            onClick={function(e){ console.log(e); e.preventDefault(); }}
            className="singleProfile"
            icon="ion-ios-box-outline"
            label="Archive"
            href="#" />
        <ChildButton
            icon="ion-ios-search"
            className="singleProfile"
            label="Similar.."
            href="#" />
        <ChildButton
            icon="ion-social-octocat"
            className="singleProfile"
            label="Assign"
            href="#" />
          <ChildButton
           icon="ion-ios-email-outline"
            className="singleProfile"
           label="Contact"
           href="#" />
         <ChildButton
           icon="ion-ios-eye"
           className="singleProfile"
           label="Resume"
           href="#" />


        <ChildButton
          onClick={function(e){ console.log(e); e.preventDefault(); }}
          className="jobList"
          icon="ion-ios-eye"
          label="New Job"
          href="#" />

   </Menu>
      )
    }
}

export default MagicButton;
