const styles = {
  container: {
    /*
    display: 'inline-block',
    width: '250px',
    height: '45px',
    margin: '5px 0px 0px 15px',
    */
    position: 'absolute',
    left: '290px',
    top: '-3px',
  },
  tabContent: {
    width: '100%',
    height: '100vh',
    padding: '0px 0px 0px 155px'
  },
  tabs: {
    width: '250px',
    height: '45px',
    background: 'transparent',
    boxShadow: 'transparent',
  },
  inkBar: { display: 'none' },
  tab: {
    textShadow: '0px 0px 2px white',
    fontSize: '18px',
    fontWeight: 300,
    color: 'rgba(55, 51, 66, 0.63)',
    fontFamily: 'Roboto',
    width: 'auto',
    padding: '0px 5px',
    textTransform: 'capitalize',
    height: '45px',
    letterSpacing: '0.2px',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    fontWeight: 400,
    color: 'rgba(103, 101, 101, 0.901961)',
    // textShadow: 'rgba(0, 0, 0, 0.06) 0px 0px 2px',
  },
  tabContent: {
    padding: '0px',
  },
  rippleOpacity: 0.1
};

export default styles;
