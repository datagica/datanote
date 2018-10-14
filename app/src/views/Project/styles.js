const styles = {
  container: {
    width: '100vw',
    height: '100vh'
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
    zIndex: 2,
    transition: 'all 0.3s ease',
  },
  backdrop: {
    display: 'block',
    position: 'fixed',
    left: '0px',
    right: '0px',
    top: '0px',
    width: '100%',
    height: '90px', // height: '45px',
    transition: 'all 0.3s ease',
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
