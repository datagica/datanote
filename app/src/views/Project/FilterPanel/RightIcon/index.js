import React, { Component } from 'react'
import PropTypes from 'prop-types'
const RightIcon =	(<button
		tabIndex="0"
		type="button"
		style={{
			border: '10px',
			boxSizing: 'border-box',
			display: 'block',
			fontFamily: 'Roboto, sans-serif',
			WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
			cursor: 'pointer',
			textDecorationLine: 'none',
			margin: '0px',
			padding: '12px',
			outline: 'none',
			fontSize: '0px',
			fontWeight: 'inherit',
			transform: 'translate(0px, 0px)',
			position: 'absolute',
			overflow: 'visible',
			transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
			width: '48px',
			height: '48px',
			top: '-6px',
			right: '4px',
			background: 'none'
		}}>
		<div>
			<span
				style={{
					height: '100%',
					width: '100%',
					position: 'absolute',
					top: '0px',
					left: '0px',
					overflow: 'hidden'
				}}>
			</span>
			<svg
				viewBox="0 0 24 24"
				style={{
					display: 'inline-block',
					color: 'rgba(255, 255, 255, 0.74)',
					fill: 'currentcolor',
					height: '24px',
					width: '24px',
					transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
					WebkitUserSelect: 'none'
				}}
				strokeWidth="0.7"
				strokeMiterlimit="10"
				stroke="rgba(0,0,0,0.5)"
				>
					<path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
			</svg>
		</div>
	</button>
)

export default RightIcon;
