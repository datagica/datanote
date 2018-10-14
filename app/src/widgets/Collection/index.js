'use strict'

import Immutable from 'immutable'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import autobind from 'autobind-decorator'

import IconButton       from 'material-ui/IconButton'
import FontIcon         from 'material-ui/FontIcon'
import ActionVisibility from 'material-ui/svg-icons/action/visibility'
import Chip             from 'material-ui/Chip'

import {
  AutoSizer, VirtualScroll,
  Table, Column,
  SortDirection, SortIndicator
} from 'react-virtualized'

import shallowCompare from 'react-addons-shallow-compare'

import pickRGB       from '~/core/pickRGB'

import getId         from '~/utils/getters/getId'
import getLabel      from '~/utils/getters/getLabel'
import getType       from '~/utils/getters/getType'
import changeOpacity from '~/utils/colors/changeOpacity'

import RankItem from '~/widgets/Ranking/Item'

import 'react-virtualized/styles.css'
import './hacks.css'
import styles from './styles'

@autobind
class Collection extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      disableHeader: false,
      headerHeight: 45,
      hideIndexRow: false,
      overscanRowCount: 20,
      rowHeight: 50,
      scrollToIndex: undefined,
      sortBy: 'rank',
      sortDirection: SortDirection.DESC,
      useDynamicRowHeight: false,
      selection: Immutable.Map(),
      sortedList: Immutable.List(),
      columns: [],
      hash: null,
    };
  }

  static propTypes = {
    hash       : PropTypes.string,
    columns    : PropTypes.array.isRequired,
    rows       : PropTypes.array.isRequired,
    height     : PropTypes.number.isRequired,
    width      : PropTypes.number.isRequired,
    onSelection: PropTypes.func,
    onOpen     : PropTypes.func
  }

  onClickOpen (rowData) {
    if (this.props.onOpen) this.props.onOpen(rowData);
  }

  componentWillMount () {
    this.setupTable(this.props)
  }
  componentWillReceiveProps (nextProps) {
    this.setupTable(nextProps)
  }
  setupTable (props) {

    const { sortBy, sortDirection } = this.state;

    const { hash, boundaries, onOpen, rows } = props;

    const filtered = props.columns.filter(x => typeof x !== 'undefined' && x);

    const columns = onOpen
      ? filtered.concat([{ label: '', dataKey: '_open', width: 48 }])
      : filtered;

    const sortedList = Immutable.List(rows)
      .sortBy(x => x[sortBy])
      .update(list => sortDirection === SortDirection.DESC ? list.reverse() : list);

    this.setState({
      hash,
      columns,
      boundaries,
      sortedList
    })
  }

  // okay this is some old code, in conflict with rowStyle
  _rowClassName ({ index }) {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  rowStyle({ index }) {
    // header
    if (index < 0) return {};

    const isSelected = this.state.selection.get(index, false);

    return this.state.selection.size
      ? (isSelected ? styles.rowSelected : styles.rowUnselected)
      : styles.row;
  }

  _rowGetter ({index}) {
    return this.state.sortedList.get(index)
  };

  render(){

    const {
      disableHeader,
      headerHeight,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      scrollToIndex,
      sortBy,
      sortDirection,
      useDynamicRowHeight
    } = this.state;

    // initial state
    const width  = this.props.width;
    const height = this.props.height;

    return <Table
        ref='collectionTable'

        className="collectionTable"
        width={width}
        height={height}

        hash={this.state.hash}

        headerClassName="collectionTableHeader"
        headerHeight={headerHeight}
        disableHeader={disableHeader}

        rowClassName="collectionTableRow"
        rowStyle={this.rowStyle}
        rowHeight={this._getRowHeight}
        rowGetter={this._rowGetter}
        onRowClick={this._onRowClick}

        noRowsRenderer={this._noRowsRenderer}

        overscanRowCount={overscanRowCount}
        rowCount={this.state.sortedList.size}

        sort={this._sort}
        sortBy={sortBy}
        sortDirection={sortDirection}

        scrollToIndex={scrollToIndex}
      >
      {this.state.columns.map(column =>
        <Column
          label={column.label}
          dataKey={column.dataKey}
          key={column.dataKey}
          disableSort={false}
          headerRenderer={this._headerRenderer}
          cellRenderer={opts => this._cellRenderer(column, opts)}
          width={column.width}
        />)}
    </Table>
    }

/*
    shouldComponentUpdate (nextProps, nextState) {
      console.log("shouldComponentUpdate: ", {
        nextProps: nextProps,
        nextState: nextState
      })
      return shallowCompare(this, nextProps.rows, nextState.rows)
    }
    */

   // TODO use this for variable row height (eg. when expanding an item)
   _getRowHeight ({ index }) {
     const { rows } = this.props
     // dynamic height:
     //return this._getDatum(list, index).size

     // static
     return this.state.rowHeight
   }

   _headerRenderer ({
     columnData,
     dataKey,
     disableSort,
     label,
     sortBy,
     sortDirection
   }) {
     return (
       <div>
         {label}
         {sortBy === dataKey &&
           <SortIndicator sortDirection={sortDirection} />
         }
       </div>
     )
   }

   _cellRenderer (column, {
     columnIndex, // Horizontal (column) index of cell
     isScrolling, // The Grid is currently being scrolled
     key,         // Unique key within array of cells
     rowIndex,    // Vertical (row) index of cell
     style        // Style object to be applied to cell
   }) {

     const row = this.state.sortedList.get(rowIndex)
     const rowData = (row && row.value ? row.value : row)
     const dataKey = column.dataKey
     const cellData = rowData[dataKey]

     //console.log("visual.data._cellRenderer: rowIndex: "+rowIndex+", isSelected: "+isSelected);

     if (dataKey === '_open') {
       return (<div
         key={dataKey}
         style={style} >
        <IconButton onClick={() => { this.onClickOpen(row) }}><ActionVisibility /></IconButton>
        </div>)
     }


     if (Array.isArray(cellData)) {
       // we have to do a pre-truncate here, if roughly more than 40 characters
       // for the moment we have no way of giving priority to some items in the
       // array and not other, but eventually this will be a feature
       const truncated = cellData
         .filter(item => `${item}`.length > 0)
         .reduce((acc, word) => {
         acc.count += word.length;
         if (acc.count < 37) {
           acc.list.push(word);
         }
         return acc;
       }, {list: [], count: 0}).list;
       return (<div
         key={dataKey}
         style={Object.assign({}, style, styles.cellArray)}>
         {truncated.map(item =>
           <div
             key={`${item}`}
             style={styles.cellArrayItem}
             >{`${item}`}</div>
         )}{
           (cellData.length > truncated.length)
           ? <div key='ellipsis' style={styles.cellArrayItemEllipsis}>...</div>
           : null
         }
       </div>);

      // string-like structure
     } else if (typeof cellData !== 'undefined' && `${cellData}`.length > 0) {
       if (dataKey === 'label' || dataKey === 'name' || dataKey === 'title') {
         return (<div
           key={dataKey}
           style={Object.assign({}, style, styles.cellSingleItemLabel)}
           >{getLabel(rowData, 'en', 'Untitled')}</div>)
       } else if (dataKey === 'date' || dataKey === 'datetime' || dataKey === 'time') {
         return (<div
           key={dataKey}
           style={Object.assign({}, style, styles.cellSingleItemLabel)}
           >
             {moment(cellData).format('YYYY-MM-DD')}<br/>
             {moment(cellData).format('hh:mm')}
           </div>)
       } else if (dataKey === 'type') {
         const baseColor       = pickRGB(cellData)
         const backgroundColor = changeOpacity(baseColor, 0.1)
         return (<div
           key={dataKey}
           style={Object.assign({}, style, styles.cellSingleItem, {
             color: baseColor,
             background: backgroundColor
           })}
           >{cellData}</div>)
       } else if (dataKey === 'rank' || dataKey === 'ranking' || dataKey === 'score') {
         const maxRank = this.state.boundaries[dataKey] ? this.state.boundaries[dataKey].max : 1000;
         return (<div
           key={dataKey}
           ><RankItem
              rank={cellData}
              ratio={(cellData / maxRank) * 100}
              height={45}
           /></div>)
       } else {
         return (<div
           key={dataKey}
           style={Object.assign({}, style, styles.cellSingleItemLabel)}
           >{cellData}</div>)
       }
     } else {
       return (<div
         key={dataKey}
         style={Object.assign({}, style, styles.cellSingleItemLabel)}
         >{cellData}</div>)
     }
     return null;
   }


   _noRowsRenderer () {
     return <div className={styles.noRows}>No data</div>
   }

   _onRowClick({ index }) {
     const isSelected = this.state.selection.get(index, false)
     const selection = isSelected
       ? this.state.selection.delete(index)
       : this.state.selection.set(index, true)

     this.setState({ selection: selection })

     if (this.props.onSelection) {
       const ids = Array
         .from(selection.keys())
         .map(rowIndex => this.state.sortedList.get(rowIndex))
         .map(row => row && row.id)
         .filter(row => row)
       this.props.onSelection(ids)
     }
   }


   _sort (opts) {
     this.setState(opts)
     this.setupTable(this.props)
   }

  }

  export default Collection;
