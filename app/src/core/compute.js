
'use strict'

import { computeMetrics } from '~/core/metrics'
import getType  from '~/utils/getters/getType'

import { getTableColumns, getMetricsColumns } from '~/config/mappings/fields'

function extractFields (items) {

  if (!Array.isArray(items)) return {
		rows   : [],
		columns: []
	}

  const columnMap = {};

  const rows = items.map(item => {
    if (!item) return;
		const value = (item && item.value) ? item.value : item;
    if (!value) return;
		Object.keys(value).forEach(dataKey => (columnMap[dataKey] = true));
    return item;
  })

  return {
    columns: Object.keys(columnMap),
    rows: rows
  };
}

export function getBoundaries(columns, rows) {
  const stats = {}
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row === null || typeof row === 'undefined') continue;
    for (let j = 0; j < columns.length; j++) {
      const column = columns[j];
      if (isNaN(row[column]) || !isFinite(row[column])) continue;
      if (!stats[column]) {
        stats[column] = {
          min: row[column],
          max: row[column]
        }
      }
      if (row[column] > stats[column].max) { stats[column].max = row[column] }
      if (row[column] < stats[column].min) { stats[column].min = row[column] }
    }
  }
  return stats;
}

export default function compute (mixedItems, useWeight) {

  const byType = {}
  // console.log(`compute.js: compute for mixed items (useWeight? ${useWeight})`, mixedItems);

  if (!(mixedItems instanceof Object) || !mixedItems.length) {
    return byType
  }

  // a collection shows either records or entities as they have very different properties
  const collectionType = mixedItems.length > 0 && mixedItems[0] && typeof mixedItems[0].id === 'string'
    ? mixedItems[0].id.split(':')[0]
    : 'entity';

  for (let i = 0; i < mixedItems.length; i++) {
    const rawItem = mixedItems[i]
    //console.log(" - item", item)
    const item = Object.assign(
      {},
      rawItem.properties, // optional properties
      rawItem,            // mandatory common properties - have priority over options
      {
        type: collectionType === 'record'
          ? `${rawItem.bundleId}/${rawItem.templateId}`
          : getType(rawItem.id)
      }
    )

    if (!Array.isArray(byType[item.type])) {
      byType[item.type] = []
    }
    byType[item.type].push(item)
  }
  Object.keys(byType).map(type => {
    const { rows, columns } = extractFields(byType[type])
    byType[type] = {
      rows: rows,
      columns:    getTableColumns(columns, collectionType),
      boundaries: getBoundaries(columns, rows),
      metrics:    computeMetrics(rows, getMetricsColumns(columns, collectionType), useWeight)
    }
  })

  return byType
}
