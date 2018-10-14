module.exports = {

  content: {

    // laternative style: background: 'rgba(255, 255, 255, 0.82)'
    background: 'rgba(0,0,0,0)', // rgba(237, 238, 240, 0.89)'
  },
  title: {
    margin: '0',
    padding: '0',
    background: 'rgba(0,0,0,0)'
    //transform: 'translate(0px, 0px)',
  },
  body: {
    background: 'rgba(0,0,0,0)', //rgba(237, 238, 240, 0.89)', // '#f1f1f1',
    padding: '0px',
    boxShadow: 'black 0px 4px 6px -5px inset',
    overflow: 'hidden',

    // tried, but it isn't "stable" I don't know why
    //backdropFilter: 'blur(8px)',
    //'-webkit-backdrop-filter': 'blur(8px)'
  },
  customTitle: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    margin: '0px 0px -1px',
    padding: '0px',
    height: '75px',
    background: 'rgba(0,0,0,0)',//'#fbfbfb',
    lineHeight: '25px'
    //boxShadow: 'inset 0px 1px 8px -4px black',
    //borderBottom: '1px solid rgb(224, 224, 224)',
  },
  headerLeft: {
    display: 'inline-block',
    float: 'left',
    margin: '0px 0px 0px 0px',
    padding: '0px 0px 0px 0px',
    width: 'auto'
  },
  titleLabel: {
    display: 'block',
    margin: '0',
    padding: '5px 0px 0px 20px',
    color: 'rgb(38, 68, 131)',
    textShadow: '0px 0px 1px #ffffffcf',
    fontSize: '23px',
    textTransform: 'capitalize',
    lineHeight: '25px',
    fontWeight: '300',
    fontFamily: 'Roboto',
  },
  titleId: {
    padding: '5px 0px 0px 20px',
    margin: '0'
  },
  titleIdLabel: {
    display: 'inline-block',
    margin: '0px',
    padding: '0px',
    //textShadow: 'rgb(255, 255, 255) 0px 0px 2px',
    //color: 'rgba(11, 63, 115, 0.8)',
    textShadow: 'rgba(255, 255, 255, 0.29) 0px 0px 2px',
    color: 'rgba(0, 0, 0, 0.71)',
    lineHeight: '12px',
    fontFamily: 'Roboto',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    fontSize: '10.5px',
    fontWeight: '500',
  },
  titleIdSeparator: {
    display: 'inline-block',
    margin: '0px 0px 0px 0px',
    padding: '0px 3px 0px 3px',
    color: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'Open Sans',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    fontSize: '11.4px',
    fontWeight: '700',
  },
  /*
  disabled:

  <div style={styles.headerRight}>
    <span style={styles.rightLabel}></span>
  </div>

  headerRight: {
    display: 'inline-block',
    float: 'right',
    margin: '0px 0px 0px 0px',
    padding: '0px 0px 0px 0px',
    width: '150px',
    height: '80px',
    lineHeight: '80px',
  },
  rightLabel: {
    margin: '0px 0px 0px 0px',
    padding: '0px 0px 0px 0px',
    textShadow: '0px 0px 1px rgba(255, 255, 255, 1)',
    color: 'rgba(0, 0, 0, 0.60)',
    fontSize: '17px',
    lineHeight: '20px',
    fontWeight: '400',
    fontFamily: 'Roboto',
  }
  */
}
