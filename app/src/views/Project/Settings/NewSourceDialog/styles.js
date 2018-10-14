const styles = {

  root: {
     position: 'absolute',
     right: '25px',
     bottom: '25px',
     transition: 'all 0.2s ease-in-out',
  },
  body: {
    background: 'rgba(0,0,0,0)',
    overflowX: 'hidden'
  },
  title: {
    margin: '0px',
    padding: '20px 25px 15px',
    color: 'rgb(87, 50, 105)', // this is for the pink look:  'rgb(87, 50, 105)',
    fontSize: '22px',
    lineHeight: '22px',
    background: 'rgb(0,0,0,0)',
    borderBottom: '1px solid transparent', // '1px solid rgba(224, 224, 224, 0.21)',
  },
  content: {
    background: 'rgba(0,0,0,0)',
    //boxShadow: 'inset 0px 22px 19px -25px #00000042'
  },
  floatingAddActionButtonIcon: {
    zIndex: 0,
  },
  radioButton: {
    marginTop: 16,
  },
  formRow: {
    margin: '15px 0px'
  }
};

export default styles;
