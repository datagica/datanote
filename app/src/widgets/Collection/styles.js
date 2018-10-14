const styles = {
  row: {
    //opacity: 1.0,
    //filter: 'grayscale(0.0)',
    //transition: 'all 0.3s ease'
  },
  rowSelected: {
    //opacity: 1.0,
    //filter: 'grayscale(0.0)',
    //transition: 'all 0.3s ease'
  },
  rowUnselected: {
    opacity: 0.5,
    filter: 'grayscale(0.7)',
    //transition: 'all 0.3s ease'
  },
  cellArray: {
    display: 'inline-block'
    //whiteSpace: 'normal',
    //overflow: 'hidden',
    //textOverflow: 'ellipsis',
  },
  /*
  cellArrayItem: {
    display: 'inline-block',
    fontSize: '10.5px',
    letterSpacing: '0.3px',
    fontFamily: 'Roboto',
    fontWeight: '600',
    margin: '1px 3px 1px 3px',
    padding: '3px 7px 4px 8px',
    color: 'rgba(34, 32, 62, 0.639216)',
    textTransform: 'capitalize',
    background: 'rgba(114, 114, 134, 0.11)',
    textShadow: '0px 0px 1px white',
    borderRadius: '2px'
  },
  */
  cellArrayItem: {
    display: 'inline-block',
    fontSize: '9.9px',
    letterSpacing: '0.2px',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    margin: '1px 3px',
    padding: '3px 7px 4px 8px',
    color: 'rgba(34, 32, 62, 0.66)',

    textTransform: 'capitalize',
    textShadow: 'white 0px 0px 1px',
    borderRadius: '2px',

    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',

    // FOR HOVER ONLY
    background: 'rgba(114, 114, 134, 0.07)',

    // FIXME this cannot work with our current build workflow
    ':hover': {
      'background': 'rgba(34, 32, 62, 0.69)'
    },

    userSelect: 'text'
  },
  cellArrayItemEllipsis: {
    display: 'inline-block',
    fontSize: '10.5px',
    letterSpacing: '0.3px',
    fontFamily: 'Roboto',
    fontWeight: '600',
    margin: '1px 3px 1px 3px',
    padding: '3px 5px 4px 5px',
    color: 'rgba(34, 32, 62, 0.639216)',
    textTransform: 'capitalize',
    //background: 'rgba(114, 114, 134, 0.11)',
    textShadow: '0px 0px 1px white',
    borderRadius: '2px',

    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  /*
  cellSingleItem: {
    display: 'inline-block',
    fontSize: '10.5px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    fontFamily: 'Roboto',
    paddingLeft: '5px',
    color: 'rgba(0, 0, 0, 0.78)',
    textTransform: 'capitalize'
  },
  */
  cellSingleItem: {
    display: 'inline-block',
    fontSize: '10.9px',
    letterSpacing: '0.2px',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    margin: '1px 3px',
    padding: '3px 7px 4px 8px',
    color: 'rgba(34, 32, 62, 0.66)',
    textTransform: 'capitalize',
    textShadow: 'white 0px 0px 1px',
    borderRadius: '2px',
    // FOR HOVER ONLY
    background: 'rgba(114, 114, 134, 0.07)',

    userSelect: 'text',

    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cellSingleItemLabel: {
    /*
    fontFamily: 'Open Sans',
    fontSize: '12.5px',
    fontWeight: '400',
    letterSpacing: '0.2px',

    color: 'rgba(34, 32, 62, 0.639216)',
    textTransform: 'capitalize'
    */
    display: 'inline-block',
    fontFamily: 'Open Sans',
    fontSize: '11.6px',
    fontWeight: '600',
    lineHeight: '17px',
    letterSpacing: '0.2px',
    color: 'rgba(34, 32, 62, 0.76)',
    textTransform: 'capitalize',
    userSelect: 'text',

    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cellSelectTrue: {
    background: 'linear-gradient(rgb(175, 168, 183) 0%, rgb(199, 185, 241) 100%)',
    height: '45px',
    width: '5px',
    display: 'inline-block',
    margin: '-23px 0px 0px -10px',
    position: 'absolute',
    //borderLeft: 'solid 1px rgba(149, 114, 160, 0.12)'
  },
  cellSelectFalse: {
    background: 'linear-gradient(to bottom, rgba(175, 168, 183, 0) 0%, rgba(199, 185, 241, 0) 100%)',
    height: '45px',
    width: '5px',
    display: 'inline-block',
    margin: '-23px 0px 0px -10px',
    position: 'absolute',
    //borderLeft: 'solid 1px rgba(149, 114, 160, 0)'
  },
  chip: {
    margin: 4
  },
  chipLabel: {

  },
  headerRow: {
    borderBottom: '1px solid #e0e0e0',
  },
  evenRow: {
    borderBottom: '1px solid #e0e0e0',
  },
  oddRow: {
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fafafa'
  },
  noRows: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1em',
    color: '#bdbdbd'
  }
};

export default styles;
