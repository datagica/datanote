const styles = {
  card: {
    // should use flexbox instead
    margin: '2%',
    //width: '44%',
    width: '29%',
    height: '100px',
    display: 'inline-block',
    transition: 'all 0.3s ease',
    overflow: 'hidden'
  },
  cardUnselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    boxShadow: 'rgba(115, 115, 115, 0.1) 0px 3px 13px, rgba(98, 102, 147, 0.06) 0px 1px 4px'
  },
  cardSelected: {
    backgroundColor: 'rgb(255, 255, 255)',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 23px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
  },
  cardContainer: {
    //width: 280
  },
  cardHeader: {
    paddingRight: '0px'
  },
  cardHeaderTitle: {
    fontSize: '15px',
    fontWeight: '500',
    textTransform: 'uppercase',
    padding: '2px 0px 10px 0px',
  },
  cardHeaderTitleUnselected: {
    color: 'rgba(0, 0, 0, 0.66)',
  },
  cardHeaderTitleSelected: {
    color: 'rgba(28, 61, 115, 0.83)'
  },
  cardHeaderSubtitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '14px',
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
    fontSize: '14px',
    padding: '0px 5px'
  },
  cardTextRowValue: {
    fontSize: '12px',
    padding: '0px 5px'
  },
  cardActions: {
    padding: 0
  },
};

export default styles;
