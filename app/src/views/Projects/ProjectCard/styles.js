const styles = {
  card: {
    width: 230,
    height: 105,
    display: 'inline-block',
    margin: '25px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 22px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
    background: 'rgba(239, 236, 241, 0.92)'
  },
  cardContainer: {
    width: 230
  },
  cardHeaderTitle: {
    /*
    color: 'rgba(28, 61, 115, 0.83)',
    fontSize: '23px',
    fontWeight: '300'
    */
    color: 'rgb(53, 83, 156)',
    fontSize: '19px',
    fontWeight: 500,
    fontFamily: 'open sans'
  },
  cardHeaderSubtitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '15px',
    fontWeight: '400'
  },
  cardText: {
    padding: '5px 5px 10px 5px',
  },
  cardTextRow: {
    display: 'inline-block',
    padding: '5px 5px 10px 5px',
    //margin: '0px 10px'
  },
  cardTextRowLabel: {
    padding: '0px 0px 0px 15px',
    fontSize: '14px'
  },
  cardTextRowValue: {
    fontSize: '15px',
    padding: '0px 3px 0px 5px',
    fontWeight: '400'
  },
  deleteButton: {
    display: 'block',
    width: '32px',
    height: '32px',
    margin: '-31px 0px 0px 173px',
    padding: 0,
    opacity: 0.6,
    transform: 'scale(1.05, 1.05)',
    zIndex: 1 // necessary for tooltip and all
  },
  cardActions: {
    padding: 0
  }
};

export default styles;
