'use strict'

import getGeoJSON           from '~/core/getGeoJSON'
import compute              from '~/core/compute'

async function processSearchResults (resultPromise, useWeight) {

  let results = {
    records     : {},
    recordsHash : null,
    entities    : {},
    entitiesHash: null,
    graph       : {},
    affinities  : {},
    locations   : {}
  }

  try {
    const found = await resultPromise

    // console.log("[processSearchResults] found: ", found)

    if (typeof found !== 'object') {
      console.error("[processSearchResults] invalid result: ", found)
      return results
    }

    // TODO: do not recompute frontend stuff if hash has not changed, or if
    // results are in cache somewhere
    if (found.recordsHash) {
      results = { ...results, recordsHash: found.recordsHash }
    }
    if (found.entitiesHash) {
      results = { ...results, entitiesHash: found.entitiesHash }
    }
    if (found.graph) {
      results = { ...results, graph: found.graph }
    }
    if (found.records) {
      try {
        results = { ...results, records: compute(found.records, useWeight) }
      } catch (exc) {
        console.error(`failed to compute records: `, exc)
      }
    }
    if (found.entities) {
      try {
        results = { ...results, entities: compute(found.entities,  useWeight) }
        try {
          results = { ...results, locations: await getGeoJSON(found.entities) }
        } catch (exc) {
          console.error(`failed to get locations: `, exc)
        }
      } catch (exc) {
        console.error(`failed to compute entities: `, exc)
      }
    }
  } catch (exc) {
    console.error("[processSearchResults] error: ", exc)
  }
  return results
}

export default processSearchResults