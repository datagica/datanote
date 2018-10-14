import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SvgIcon from 'material-ui/SvgIcon'

import NavigationCloseIcon from 'material-ui/svg-icons/navigation/close'

export const Search = (props) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
  <path d="M448.3,424.7L335,311.3c20.8-26,33.3-59.1,33.3-95.1c0-84.1-68.1-152.2-152-152.2c-84,0-152,68.2-152,152.2
    s68.1,152.2,152,152.2c36.2,0,69.4-12.7,95.5-33.8L425,448L448.3,424.7z M120.1,312.6c-25.7-25.7-39.8-59.9-39.8-96.3
    s14.2-70.6,39.8-96.3S180,80,216.3,80c36.3,0,70.5,14.2,96.2,39.9s39.8,59.9,39.8,96.3s-14.2,70.6-39.8,96.3
    c-25.7,25.7-59.9,39.9-96.2,39.9C180,352.5,145.8,338.3,120.1,312.6z"/>
  </SvgIcon>
);

/*
old style - was not very recognizable by users
export const Settings = (props) => (
  <SvgIcon viewBox="0 0 2048 2048" {...props}>
		<path d="M480 1408v128h-352v-128h352zm352-128q26 0 45 19t19 45v256q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-256q0-26 19-45t45-19h256zm160-384v128h-864v-128h864zm-640-512v128h-224v-128h224zm1312 1024v128h-736v-128h736zm-960-1152q26 0 45 19t19 45v256q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-256q0-26 19-45t45-19h256zm640 512q26 0 45 19t19 45v256q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-256q0-26 19-45t45-19h256zm320 128v128h-224v-128h224zm0-512v128h-864v-128h864z"/>
  </SvgIcon>
);
*/

export const Settings = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path clipRule="evenodd" d="M0 0h24v24H0z" fill="none"/>
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
  </SvgIcon>
);

export const Wand = (props) => (
    <SvgIcon viewBox="0 0 512 512" {...props}>
      <g>
      	<path d="M192.011,149.661l-34.043,34.041l256.097,256.096L448,405.757L192.011,149.661z M212.596,215.702l11.415-11.414
      		l201.468,201.469l-11.414,11.414L212.596,215.702z"/>
      	<rect x="184" y="64" width="16" height="40"/>
      	<rect x="184" y="268" width="16" height="40"/>
      	<rect x="280" y="176" width="40" height="16"/>
      	<rect x="64" y="176" width="40" height="16"/>
      	<rect x="111.875" y="94.077" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 285.3039 109.9734)" width="16" height="40"/>
      	<rect x="111.877" y="238.327" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 21.9762 525.7571)" width="15.998" height="40"/>
      	<rect x="256.126" y="94.077" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 370.226 381.506)" width="16" height="39.999"/>
      </g>
    </SvgIcon>
  );

export const ArrowBack = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </SvgIcon>
)

export const NavigationClose = NavigationCloseIcon;
