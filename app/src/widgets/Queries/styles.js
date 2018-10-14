module.exports = {

  root: {
    //padding: '60px 60px 0px 0px',
    height: '100vh',
    //position: 'absolute',
    //left: '0px',
    //right: '0px',

    // HUGE LEFT PADDING NOW DISABLED
    //paddingLeft: '200px',
    paddingLeft: '20px',

    overflowY: 'auto',
    overflowX: 'hidden',
  },

  // yeah, we should use Flexbox, I know..
  rows: {
    position: 'absolute',
    bottom: '65px',

    // HUGE LEFT PADDING NOW DISABLED
    //left: '250px',
    left: '40px',

    right: '40px',
  },

  row: {
    display: 'inline-block',
    width: '100%',
    transition: 'all 0.3s ease',
  },

  bubble: {
    display: 'inline-block',
    borderRadius: '15px',
    padding: '0px 20px',
    fontFamily: 'Open Sans',
    fontSize: '13px',
    fontWeight: 300,
    letterSpacing: '0.6px',
    transition: 'all 0.3s ease'
  },

  bot: {
    backgroundColor: 'rgba(240, 245, 255, 0.42)', // softgray
    color: 'rgb(124, 132, 155)',
    textShadow: '0px 0px 2px #ffffff',
    fontWeight: 400,
    float: 'right'
  },

  human: {
    color: 'rgb(247, 248, 252)',
    backgroundColor: 'rgba(80, 78, 156, 0.8)', // violet1
    textShadow: '0px 0px 2px #15151569',
    fontWeight: 300,
    float: 'left'
  },

  softgray:    { backgroundColor: 'rgba(240, 245, 255, 0.42)' },
  violet1:     { backgroundColor: 'rgba(80, 78, 156, 0.8)'    },
  violet2:     { backgroundColor: 'hsla(241, 92%, 35%, 0.58)' },
  indigo:      { backgroundColor: 'hsla(247, 71%, 37%, 0.59)' },
  petroleum1:  { backgroundColor: 'hsla(208, 64%, 35%, 0.75)' },
  petroleum2:  { backgroundColor: 'rgba(6, 103, 140, 0.77)'   },
  strawberry1: { backgroundColor: 'hsla(328, 95%, 34%, 0.69)' },
  strawberry2: { backgroundColor: 'hsla(317, 79%, 36%, 0.69)' },
  blue:        { backgroundColor: 'hsla(208, 92%, 35%, 0.79)' },
  turquoise:   { backgroundColor: 'hsla(197, 71%, 37%, 0.68)' },

  // yeah, we should use Flexbox, I know..
  footer: {
    position: 'absolute',
    bottom: '50px',
    left: '200px',
    right: '20px',
    //background: '#7e79a514',
    //borderRadius: '60px',
    paddingTop: '5px'
  },

  error: {
    color: 'red'
  },

  loading: {
    // color: 'red'
  }
}
