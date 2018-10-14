const styles = {
  container: {
    position: 'absolute',
    top: '-4px',
    right: '70px',
  },
  tabContentFullPage: {
    width: '100vw',
    height: '100vh'
  },
  tabContent: {
    // zIndex: 2,
    position: 'fixed',
    top: '40px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    transform: 'scale(0.8) blur(16px)',
    opacity: 0,
    transition: 'all 0.4s ease',
    pointerEvents: 'none'
  },
  tabContentActive: {
    opacity: 1,
    transform: 'scale(1) blur(0px)',
    pointerEvents: 'auto'
  },
  tabs: {
    width: '240px',
    height: '45px',

    background: 'transparent',
    boxShadow: 'transparent',
    //boxShadow: '0px 2px 6px -3px rgba(0, 0, 0, 0.29)',
    //zIndex: 2
  },
  inkBar: { display: 'none' },
  tab: {
    textShadow: '0px 0px 2px white',
    //fontSize: '20px',
    fontSize: '18px',
    fontWeight: 300,
    // color: 'rgba(31, 35, 53, 0.639216)',
    color: 'rgba(55, 51, 66, 0.63)',
    fontFamily: 'Roboto',
    width: 'auto',
    padding: '0px 5px',
    textTransform: 'capitalize',
    height: '45px',
    letterSpacing: '0.2px',
    transition: 'color 0.3s ease'

    // selected color should be:
    //       selectedTextColor="rgba(77, 23, 143, 0.95)"
  },
  activeTab: {
    fontWeight: 400,
    color: 'rgba(103, 101, 101, 0.901961)',
    // textShadow: 'rgba(0, 0, 0, 0.06) 0px 0px 2px',
  },
  dropShadow: {
    display: 'block',
    position: 'fixed',
    left: '0px',
    right: '0px',
    top: '90px', // top: '45px'
    width: '100%',
    height: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.22) 0px 8px 4px -8px inset',
    // boxShadow: 'inset rgba(0, 0, 0, 0.5) 0px 8px 4px -8px',
    zIndex: 2,
    transition: 'opacity 0.3s ease',
    //opacity: uiStore.presentationMode === 'intro' ? 0 : 1,
    //transform: uiStore.presentationMode === 'intro' ? 'translate(0px, -50px)' : 'translate(0px, 0px)',
  },
  backdrop: {
    display: 'block',
    position: 'fixed',
    left: '0px',
    right: '0px',
    top: '0px',
    width: '100%',
    height: '90px', // height: '45px',
    transition: 'opacity 0.3s ease',
    //background: 'linear-gradient(rgba(241, 241, 241, 0.65) 0%, rgba(255, 255, 255, 0.88) 100%)',
    // glass effect
    //background: 'rgba(241, 241, 241, 0.65)',
    background: 'rgba(204, 204, 204, 0.1)',
    backdropFilter: 'blur(16px)',
    zIndex: 1,
    //opacity: uiStore.presentationMode === 'intro' ? 0 : 1,
    //transform: uiStore.presentationMode === 'intro' ? 'translate(0px, -50px)' : 'translate(0px, 0px)',
  },
  rippleOpacity: 0.1
};

export default styles;
