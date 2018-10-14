
const styles = {

  micIcon: {
    // position: 'absolute',
    //margin: '12px -1px 0px'
  },
  micIconColor: 'rgba(21, 21, 21, 0.66)',

  // For this size and font-weight Open Sans has better readability and is
  // visually more pleasing than Roboto. It also works nice with other colors
  // eg. petroleum: rgb(60, 101, 111)
  // eg. deep purple: rgb(71, 30, 107)
  // middle grey: rgb(82, 71, 90)
  textFieldInput: {
    padding: '0px 0px 0px 20px',
    margin: '0px 0px 0px 0px',
    fontFamily: 'Open Sans',
    color: 'rgb(77, 66, 86)',
    fontWeight: '200',
    fontSize: '20px',
    letterSpacing: '0.2px',
  },
  textFieldHint: {
    padding: '0px 0px 0px 20px',
    margin: '0px 0px 0px 0px',
    fontFamily: 'Roboto',
    color: 'rgb(111, 107, 115)',
    fontWeight: '200',
    fontSize: '20px',
    letterSpacing: '0.2px'
  },

  textFieldUnderline: {
    bottom: '0px'
  },
  textFieldUnderlineDisabled: {
    borderBottomWidth: '1px',

    // UNDERLINE DISABLED
    //borderColor: 'rgba(159, 153, 162, 0.57)',
    //boxShadow: '0px 0px 2.4px 0px rgba(162, 93, 212, 0.3)',

    borderColor: 'rgba(159, 153, 162, 0)',
    boxShadow: '0px 0px 2.4px 0px rgba(162, 93, 212, 0)'
  },
  textFieldUnderlineFocus: {
    borderBottomWidth: '1px',

    // UNDERLINE DISABLED
    borderColor: 'rgba(104, 49, 177, 0.44)',
    boxShadow: 'rgba(162, 93, 212, 0.29) 0px 0px 2.4px 0px'

    //borderColor: 'rgba(104, 49, 177, 0)',
    //boxShadow: 'rgba(162, 93, 212, 0) 0px 0px 2.4px 0px'
  },
  menu: {
     width: '450px',
     // background: 'rgba(255, 255, 255, 0.85)'
  },
  list: {
    background: 'rgba(255, 255, 255, 0.85)'
  }
};

export default styles;
