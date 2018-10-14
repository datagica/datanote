// REACT
import React, { Component }        from 'react'
import PropTypes                   from 'prop-types'
import {toJS, action, runInAction} from 'mobx'
import {observer}                  from 'mobx-react'

import { UI_WIDTH_FILTERS, SLIDER_WIDTH_FILTERS } from '~/config/constants'

import uiStore       from '~/stores/ui'
import filterStore   from '~/stores/filters'
import searchStore   from '~/stores/search'
import projectStore  from '~/stores/project'

import throttle      from '~/utils/misc/throttle'
import isTouchScreen from '~/utils/misc/isTouchScreen'

//import Dropzone from 'react-dropzone'

import {Link, hashHistory, withRouter} from 'react-router'

import Avatar     from 'material-ui/Avatar'
import Slider     from 'material-ui/Slider'
import {ListItem} from 'material-ui/List'
import Checkbox   from 'material-ui/Checkbox'
import TextField  from 'material-ui/TextField'

import SelectableList from "./SelectableList"
import RightIcon      from "./RightIcon"
import styles         from './styles'

const normalFilterStyle = {
  position: 'fixed',
  margin: '0px',
  padding: '0px 0px 0px 20px',
  left: '18px',
  top: '90px',
  width: `${UI_WIDTH_FILTERS}px`,
  transition: 'all 0.4s ease, opacity 0.2s ease',
  border: '1px solid rgba(255, 255, 255, 0)',
  background: 'rgba(237, 235, 241, 0.74)',
  backdropFilter: 'blur(16px)',
  opacity: 1
}

const hiddenFilterStyle = Object.assign({}, normalFilterStyle, {
  transform: 'translate(-200px, 0px)',
  pointerEvents: 'none',
  opacity: 0
})

const hoverFilterStyle = Object.assign({}, normalFilterStyle, {
  //backdropFilter: 'blur(16px)',
});

const animStates = {
  normal: normalFilterStyle,
  hidden: hiddenFilterStyle,
  hover: hoverFilterStyle
}


// we want to disable the Ripple because of an interference with the backdrop-filter
// (yes we priorize the fanciness of the backdrop over the fanciness of the ripple)
const SubMenuListItem = ({ item, checked, onCheck, onTouchTap }) => {

  // increase the size on tablets
  const sizeFactor = isTouchScreen ? 1.5 : 1.0

  const innerDivStyle = Object.assign({}, styles.nestedItemInnerDivMulti, {
    fontSize: `${13.5 * sizeFactor}px`
  })

  const nestedCheckboxStyle = Object.assign({}, styles.nestedItemCheckboxMulti, {
   // TODO make checkbox bigger
  })

  const listItemStyle = checked ? { fontWeight: 600, color: 'black'} : {}

  const liteItemRankStyle = {
    color: 'rgba(31, 30, 33, 0.54)',
    fontSize: `${12 * sizeFactor}px`
  }

  const hoverColor = 'rgba(0,0,0,0)'

  const commonProps = {
    disableTouchRipple: true,
    disableFocusRipple: true
  }

  return (
    <ListItem
      key={item.id}
      value={item.id}
    	primaryText={<div>
        <span style={listItemStyle}>{item.label.en}</span>
        <span style={liteItemRankStyle}> ({item.rank})</span>
      </div>}
      style={styles.nestedListItem}
      className="nestedItemInnerDivMulti"
    	innerDivStyle={innerDivStyle}
      onTouchTap={onTouchTap}
      hoverColor={hoverColor}
      {...commonProps}
        leftIcon={<Checkbox
        style={nestedCheckboxStyle}
        onCheck={onCheck}
        label=""
        {...commonProps}
        checked={checked}
      />}
    />
  )
}

const MenuListItem = ({ value, label, nestedItems }) =>	(
	<ListItem
    key={value}
    value={value}
		primaryText={label}
		innerDivStyle={styles.innerDiv}
		nestedListStyle={styles.nestedList}
		style={styles.listItem}
		nestedItems={nestedItems}
    hoverColor={'rgba(0,0,0,0)'}
    autoGenerateNestedIndicator={false}
    disableTouchRipple={true}
    disableFocusRipple={true}
    initiallyOpen={true}
	/>
)


@observer
class FilterPanel extends Component {

	constructor(props, context) {
		super(props, context)
    this.state = {
      counter: 0,
      linkMinWeight: 0, // SLIDER_WIDTH_FILTERS,

      // default value is slider at 90px (max value is 120px)
      // this means the query value will be roughly 0.73
      linkMaxDistance: 90,
    }
    this.throttle = throttle(50)
	}


  handleLinkMaxDistanceChange = (event, value) => {
    this.setState({ linkMaxDistance: value });
  };

  handleLinkVariableChangeStop = () => {
    searchStore.find(Object.assign({}, this.getSlidersValues(), {
      // basically, convert checked items from filters.entities to a map of key => empty list
      entities   : Array.from(filterStore.entities.keys()).reduce((x, y) => (x[y] = [], x), {})
    }))
  }

  getSlidersValues() {
    return {
      minWeight  : this.getMinWeight(),
      maxDistance: this.getMaxDistance()
    }
  }
  // return a number between 0.2 and 1
  getMaxDistance(min = 0.33) {
    return min + (1-min) * (this.state.linkMaxDistance / SLIDER_WIDTH_FILTERS);
  }

  handleLinkMinWeightChange = (event, value) => {
    this.setState({ linkMinWeight: value });
  };

  getMinWeight() {
    return this.state.linkMinWeight / SLIDER_WIDTH_FILTERS;
  }

  onTapRecord(evt, record) {
    evt.preventDefault()
    evt.stopPropagation()
    this.throttle(() => {
      //console.log("FilterPanel.onTapRecord: ", { record: record })
      runInAction("FilterPanel.onTapRecord", () => {
        filterStore.records.clear()
        filterStore.records.set(record.id, record)

        const query = Object.assign({}, this.getSlidersValues(), {
          records  : {}
        })
        query.records[record.id] = []

        //console.log("FilterPanel.onTapRecord: query: ", query)

        searchStore.find(query)
        this.forceUpdate()
      })
    })
  }

  onCheckRecord(evt, checked, record) {
    // do not put any preventDefault / stopPropagation here!
    this.throttle(() => {
      //console.log("FilterPanel.onCheckRecord: ", { record: record, checked: checked })

      runInAction("FilterPanel.onCheckRecord", () => {
        if (checked) {
          filterStore.records.set(record.id, record)
        } else {
          filterStore.records.delete(record.id)
        }
        const recordTypes = Array.from(filterStore.records.keys())

        if (recordTypes.length) {
          searchStore.find(Object.assign({}, this.getSlidersValues(), {
            // basically, convert checked items from filterStore.records to a map of key => empty list
            records    : recordTypes.reduce((x, y) => (x[y] = [], x), {}),
          }))
        } else {
          searchStore.clear()
        }
        this.forceUpdate()
      })
    })
  }

  onTapEntity(evt, entity) {
    evt.preventDefault()
    evt.stopPropagation()
    this.throttle(() => {
      //console.log("FilterPanel.onTapEntity: ", { entity: entity })
      runInAction("FilterPanel.onTapEntity", () => {

        filterStore.entities.clear()
        filterStore.entities.set(entity.id, entity)

        const query = Object.assign({}, this.getSlidersValues(), {
          entities   : {}
        });
        query.entities[entity.id] = []

        //console.log("FilterPanel.onTapEntity: query: ", query)

        searchStore.find(query)
        this.forceUpdate()
      })
    })
  }

  onCheckEntity(evt, checked, entity) {
    // do not put any preventDefault / stopPropagation here!
    this.throttle(() => {
      //console.log("Sections.onCheckEntity: ", { entity: entity, checked: checked })
      runInAction("Sections.onCheckEntity: ", () => {
        if (checked) {
          //console.log("setting entity to TOGGLED ON")
          filterStore.entities.set(entity.id, entity)
        } else {
          //console.log("setting entity to TOGGLED OFF")
          filterStore.entities.delete(entity.id)
        }
        const entityTypes = Array.from(filterStore.entities.keys())

        if (entityTypes.length) {
          searchStore.find(Object.assign({}, this.getSlidersValues(), {
            // basically, convert checked items from filterStore.entities to a map of key => empty list
            entities   : entityTypes.reduce((x, y) => (x[y] = [], x), {})
          }))
        } else {
          searchStore.clear()
        }
        this.forceUpdate()
      })
    })
  }


  onTapLink(evt, link) {
    evt.preventDefault()
    evt.stopPropagation()

    this.throttle(() => {
      //console.log("FilterPanel.onTapLink: ", { entity: link })
      runInAction(() => {

        filterStore.links.clear()
        filterStore.links.set(link.id, link)

        const query = Object.assign({}, this.getSlidersValues(), {
          links      : {}
        });
        query.links[link.id] = []

        //console.log("FilterPanel.onTapLink: query: ", query)

        searchStore.find(query)
        this.forceUpdate()
      })
    })
  }
  onCheckLink(evt, checked, link) {
    // do not put any preventDefault / stopPropagation here!
    this.throttle(() => {
      //console.log("FilterPanel.onCheckLink: ", { link: link, checked: checked })
      runInAction(() => {
        if (checked) {
          filterStore.links.set(link.id, entity)
        } else {
          filterStore.links.delete(link.id)
        }
        const linkTypes = Array.from(filterStore.links.keys())

        if (linkTypes.length) {
          searchStore.find(Object.assign({}, this.getSlidersValues(), {
            // basically, convert checked items from filterStore.links to a map of key => empty list
            links      : linkTypes.reduce((x, y) => (x[y] = [], x), {}),
          }))
        } else {
          searchStore.clear()
        }
        this.forceUpdate()
      })
    })
  }

  // don't need that anymore, react comes with its own
  /*
  forceUpdate() {
    this.setState({ counter: this.state.counter++ })
  }
  */

	render() {

    const byRecords = projectStore.records.map(record =>
      <SubMenuListItem
        key={record.id}
        item={record}
        checked={!!filterStore.records.get(record.id)}
        onCheck={(evt, checked) => this.onCheckRecord(evt, checked, record)}
        onTouchTap={(evt) => this.onTapRecord(evt, record)}
      />
    )
    const byEntities = projectStore.entities.map(entity =>
      <SubMenuListItem
        key={entity.id}
        item={entity}
        checked={!!filterStore.entities.get(entity.id)}
        onCheck={(evt, checked) => this.onCheckEntity(evt, checked, entity)}
        onTouchTap={(evt) => this.onTapEntity(evt, entity)}
      />
    )

    const byDistance = [
      <Slider
        key="slider-distance"
        min={0}
        max={SLIDER_WIDTH_FILTERS}
        step={1}
        defaultValue={1}
        value={this.state.linkMaxDistance}
        onChange={this.handleLinkMaxDistanceChange}
        onDragStop={this.handleLinkVariableChangeStop}
        axis='x'
        style={{
          width: '135px',
          padding: '0px 0px 0px 0px',
          margin: '0px 0px 0px 0px',
          userSelect: 'none',
        }}
        sliderStyle={{
          height: '33px',
          margin: '0px',
          padding: '0px',
          top: '5px',
          left: '-5px',
          userSelect: 'none',
        }}
      />
    ]

    const byRecurrence = [
      <Slider
        key="slider-recurrence"
        min={0}
        max={SLIDER_WIDTH_FILTERS}
        step={1}
        defaultValue={SLIDER_WIDTH_FILTERS}
        value={this.state.linkMinWeight}
        onChange={this.handleLinkMinWeightChange}
        onDragStop={this.handleLinkVariableChangeStop}
        axis='x'
        style={{
          padding: '0px 15px',
          height: '33px',
          marginTop: '-33px'
        }}
      />
    ]

    /*
    const byLabel = [
      <TextField
       name="label"
       hintText="label"
       floatingLabelText="label"
       floatingLabelFixed={true}
       errorText={""}
       type="text"
     />
    ]

      <MenuListItem value={0} label={`Filter`}     nestedItems={byLabel}      />,

      <MenuListItem value={4} label={`Recurrence`} nestedItems={byRecurrence} />
      */

    //
    const stats = projectStore.getStats()

    const rootStyle =
      (stats.entities && uiStore.filters === 'show' && uiStore.section === 'project')
        ? (uiStore.effect === 'normal' ? animStates.normal : animStates.hover)
        : animStates.hidden;

		return (
      <div style={rootStyle}>
        <SelectableList
  			  autoGenerateNestedIndicator={false}
  				defaultValue={0}
  			  style={styles.navigation}
          >
          <MenuListItem value={1} label={`Records`}   nestedItems={byRecords}  />
          <MenuListItem value={2} label={`Entities`}  nestedItems={byEntities} />
          <MenuListItem value={3} label={`Depth of Influence`} nestedItems={byDistance} />
  		  </SelectableList>
		</div>
    )
	}
}

export default FilterPanel;
