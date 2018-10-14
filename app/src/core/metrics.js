'use strict'

import moment from 'moment'
import 'moment/min/locales.min'

import tryToGetNumber     from '~/utils/getters/tryToGetNumber'
import sortNumberOrString from '~/utils/misc/sortNumberOrString'
import isNotNull          from '~/utils/misc/isNotNull'

/**
 * Compute the metrics
 *
 */
export function computeMetrics(results, columns, useWeight) {
  return columns.filter(isNotNull).map(column => {
    // now let's try to guess the type of chart by looking at the data

    // used for testing: if you set to true, less charts will be show if the data
    // is not interesting
    const hideIfNotMeaningful = false

    let isTimeBased = false
    const stats = {}
    results.filter(isNotNull).forEach(row => {

      const weight = useWeight && typeof row.rank === 'number' ? row.rank : 1
      //console.log(`DEBUG -> weight = ${weight}`)

      //const entry = row.value[column.dataKey];
      const entry = row[column.dataKey]
      if (column.excludeTypes && column.excludeTypes[row.type]) {
        return
      }

      const values = Array.isArray(entry) ? entry : [ entry ];
      values.forEach(value => {
        if (Array.isArray(value)) {
          console.log(column.dataKey+" array values are not supported: ", value)
        } else {
          switch (column.type) {
            case 'datetime':
              const datetime = moment(value);
              if(datetime !== null && datetime.isValid()) {
                isTimeBased = true;
              }
              break;
            default:
          }

          // we don't know what's inside value, it may already be null/undefined
          // and serialized to string..
          const key = ''+value;

          // so no "typeof", we check this way
          if (key === '' || key === 'null' || key === 'undefined') { return }

          if (typeof stats[key] !== 'number') {
            stats[key] = 0
          }
          stats[key] = stats[key] + weight
        }
      });

    });

    // cleanup
    delete stats[''];
    delete stats['null'];
    delete stats['undefined'];
    delete stats['[object Object]'];

    const values = Object.keys(stats);

    // cleanup
    if (values.length === 0) {
      return;
    }
    

    // are all values numbers?
    const allNumbers = values.map(x => tryToGetNumber(x)).filter(isNotNull)
    const hasOnlyNumbers = values.length === allNumbers.length

    console.log('test: ', {
      allNumbers,
      hasOnlyNumbers
    })
    // donuts are nice when he have few different values
    // when dealing with continuous values, we prefer the plot,
    // but a piechart of two numeric values is fine, it shows the binary duality
    if (
      (  !hideIfNotMeaningful && hasOnlyNumbers && values.length <= 2 )
      ||
      ( !hideIfNotMeaningful && !hasOnlyNumbers && values.length <= 5 )
    ) {
      return {
        key: column.dataKey,
        label: column.label,
        type: 'pie',
        data: stats
      }
    }

    // are all values unique? the we should probably display a ranking instead!
    //const allUniques = values.reduce((acc, value) => (acc + stats[value]), 0) === values.length;

    let chartType = 'ranking'

    if (hasOnlyNumbers) {
      chartType = 'distribution'
    }

    // but it's more important to show a timeserie if there is one
    if (isTimeBased) {
      chartType = 'timeline'
      // TODO for the moment, we have no simple way to show
      // the timeline for a lot of years 
      // but the Nivo.rocks Calendar is nice
      return null
    }

    /*
    if there is only one date, perhaps we should display it in a more sexy way,
    eg. large font size
    if (values.length === 1) { return }
    */

    const data = values.sort(sortNumberOrString).map(item => {
      const value = stats[value]
      let x = item
      if (isTimeBased) {
        x = moment(item).toDate()
      } 
      /*else if (hasOnlyNumbers) {
        const test = Number(x)
        if (!isNaN(test) && isFinite(test)) {
          x = test
        } else {
          x = 0
        }
      }
      */
      return { x, value }
    })

    // if all the values in the ranking are unique (eg. phone numbers)
    // there is no point in showing a chart
    if (!hasOnlyNumbers && !isTimeBased && values.length > 1) {
      const reference = stats[values[0]]
      for (let i = 1; i < values.length; i++) {
        if (stats[values[i]] !== reference) {
          return;
        }
      }
    }

    return {
      key: column.dataKey,
      label: column.label,
      type: chartType,
      data: data
    }

  }).filter(isNotNull)
}
