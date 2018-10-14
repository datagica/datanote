module.exports = {
  container: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    height: '100vh',
    width: '100vw',
    transition: 'transform 0.25s ease, opacity 0.25s ease',
  },

  tabContainer: {
    display: 'block',
    width: '100vw',
    height: '40px',
    background: 'rgb(226, 227, 236)',
    boxShadow: 'rgba(0, 0, 0, 0.8) 0px -1px 8px -5px inset',
  },
  tabs: {
    height: '35px',
    padding: '5px 20px 0px 65px',
    overflow: 'hidden',
    width: '200px', // should depend on tab content
  },

  viewContainer: {
    height: '100%',
    width: '100vw',

    // like tab color
    background: 'rgb(237, 235, 241)', // same as tab color

    // a bit more whitey
    //background: 'rgb(243, 243, 245)', // brighter, we should use this soon

  },

  exportMenu: {
    position: 'absolute',
    top: '-2px',
    right: '30px',
  }
}
