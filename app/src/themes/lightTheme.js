
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import {
  indigo50, indigo100, indigo500, indigo700,
  indigoA200,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'

import typography from 'material-ui/styles/typography'


// note that:
//    import roboto from "roboto-fontface";
// also works, but Jest prefer the explicit form
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'opensans-npm-webfont/style.css'
import 'ionicons/dist/scss/ionicons.scss'

// see this for reference: https://github.com/callemall/material-ui/blob/master/src/styles/getMuiTheme.js
// const primary1Color = 'rgb(77, 113, 175)'
const primary1Color = 'rgb(130, 131, 173)'
const alternateTextColor = '#f3f3f3'
const accent1Color = '#410f5f'
const accent2Color =  'rgb(189, 191, 218)' // '#aaa5bf'
const primary3Color = '#ebedf7'
// and this for colors: http://www.material-ui.com/#/customization/colors


const palette = {
  primary1Color: primary1Color,
  primary2Color: indigo700,
  primary3Color: primary3Color,
  accent1Color: accent1Color,
  accent2Color: accent2Color,
  accent3Color: grey500,
  textColor: 'rgb(133, 119, 140)',
  alternateTextColor: alternateTextColor,
  canvasColor: white,
  borderColor: grey300,
  disabledColor: fade(darkBlack, 0.3),
  pickerHeaderColor: indigo500,
  clockCircleColor: fade(darkBlack, 0.07),
  shadowColor: fullBlack,
}

const lightTheme = getMuiTheme({
  spacing: spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: palette,
  flatButton: {
    //color: transparent,
    //buttonFilterColor: '#999999',
    //disabledTextColor: fade(palette.textColor, 0.3),
    //textColor: palette.textColor,
    //primaryTextColor: palette.primary1Color,
    //secondaryTextColor: palette.accent1Color,
    fontSize: 13, // typography.fontStyleButtonFontSize,
    fontWeight: typography.fontWeightNormal,
  },
  raisedButton: {
     // color: palette.alternateTextColor,
     //textColor: palette.textColor,
     //primaryColor: palette.primary1Color,
     //primaryTextColor: palette.alternateTextColor,
     //secondaryColor: palette.accent1Color,
     //secondaryTextColor: palette.alternateTextColor,
     //disabledColor: darken(palette.alternateTextColor, 0.1),
     //disabledTextColor: fade(palette.textColor, 0.3),
     fontSize: 13, // typography.fontStyleButtonFontSize,
     fontWeight: typography.fontWeightNormal, // typography.fontWeightMedium,
   },
   tabs: {
     // padding: '0px',
     //backgroundColor: '#f1eeee',
     /*
     backgroundColor: palette.alternateTextColor,
     */
     // textColor: palette.textColor,
     textColor: 'rgba(8, 15, 54, 0.74)',
     selectedTextColor: "rgba(77, 23, 143, 0.95)",
     //selectedTextColor: palette.primary1Color,
   },
   inkBar: {
     height: '1px',
     marginTop: '-2px',
     boxShadow: '0px 0px 7px 1px rgba(147, 59, 244, 0.25)',
     transition: 'left 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
     backgroundColor: 'rgb(87, 135, 177)' // 'rgb(140, 115, 162)'
   },
   paper: {
     backgroundColor: 'rgba(255, 255, 255, 0.95)' // 0.8
   }

})

export default lightTheme
