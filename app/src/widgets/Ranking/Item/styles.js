module.exports = {
  itemLabel: {
    alignSelf: 'flex-start',
    width: '160px',
    padding: '0px',
    fontFamily: 'Open Sans',
    fontSize: '11.6px',
    fontWeight: '600',
    letterSpacing: '0.2px',
    color: 'rgba(34, 32, 62, 0.760784)',
    textTransform: 'capitalize',
    textShadow: '0px 0px 1px #ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  itemProgressBg: {
      width: '50px',
      flexGrow: '1',
      height: '12px',
      borderRadius: '5px',
      background: 'linear-gradient(rgba(255, 255, 255, 0.32) 0%, rgba(234, 234, 234, 0.12) 9%, rgba(218, 218, 218, 0.34) 100%)',
      boxShadow: 'rgba(0, 0, 0, 0.26) 0px 1px 3px -1px inset',
      padding: '0',
      margin: '0',
      overflow: 'hidden'
    },
    itemProgressFg: {
      height: '13px',
      padding: '0',
      margin: '0',
      borderRadius: '2px', // a bit more straight to make it look more "accurate"
      background: 'linear-gradient(rgb(192, 194, 208) 0%, rgb(149, 138, 208) 100%)',
      //background: 'linear-gradient(rgb(136, 140, 212) 0%, rgb(161, 136, 193) 100%)',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 1px 0px 0px',
    },

    itemProgressRank: {
      width: '20px',
      padding: '0px 0px 0px 10px',
      margin: '-1px 0px 0px 0px',
      fontFamily: 'Open Sans',
      fontSize: '11.6px',
      fontWeight: '600',
      letterSpacing: '0.2px',
      color: 'rgba(34, 32, 62, 0.760784)',
      textTransform: 'capitalize',
      textShadow: '0px 0px 1px #ffffff',
    }
}
