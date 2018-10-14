
import { observable, action, runInAction } from 'mobx'

import API from '~/api/index'

import processSearchResults from '~/core/processSearchResults'

import isNotEmpty from '~/utils/validators/isNotEmpty'
import isDefined  from '~/utils/validators/isDefined'

class MetricsStore {

  @observable entities = {}

  constructor() {
    this.query = {
      entities   : {},
      maxLinks   : 3500,
      minWeight  : 0,
      maxDistance: 15,
      query      : ''
    }
  }

  async find (opts) {
    console.log("[stores/metrics.find] opts: ", opts)
    runInAction(() => { this.query.entities = opts.entities })

    console.log("[stores/metrics.find] this.query: ", this.query)

    // if we selected some entities, we use each entity weight to ponderate
    // the metrics
    // why do we do this? let's take a simple example:
    // you have a room of 10 friends, and pick two: Tom and Sam
    // they will both know everybody, however their connection to the rest of
    // the people will be different: ex Tom will be 40% closer to males,
    // Sam 60% closer to female
    const useWeight = Object.keys(this.query.entities).length > 0

    try {
      const results = await processSearchResults(API.findRelated(this.query), useWeight)
      console.log('[stores/metrics.find] results from processSearchResults: ', results)
      if (!results || typeof results.entities !== 'object') {
        throw new Error(`invalid results: `, results)
      }
      runInAction(() => {
        console.log("[stores/metrics.find] updating this.entities")
        this.entities = results.entities
      })
    } catch (exc) {
      console.error("[stores/metrics.find] failed to find:", exc)
      this.clear()
    }
  }

  @action clear () {
    this.entities = {}
    // this.entities.clear()
  }
}

var singleton = new MetricsStore()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.metrics = singleton // FOR DEBUG ONLY
}
export default singleton
