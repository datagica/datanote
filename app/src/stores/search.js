// import Immutable from 'immutable'

import { observable, action, runInAction } from 'mobx'

import API from '~/api/index'

import processSearchResults from '~/core/processSearchResults'

import isNotEmpty from '~/utils/validators/isNotEmpty'
import isDefined  from '~/utils/validators/isDefined'

const getDefaults = () => ({
  entities    : {},
  maxLinks    : 3500,
  minWeight   : 0,
  maxDistance : 15,
  query       : ''
})

class Search {

  //@observable records    = {} // done later
  @observable recordsHash = null
  //@observable entities   = {} // done later
  @observable entitiesHash = null
  @observable affinities = {}
  @observable locations  = {}
  @observable graph      = {}

  constructor() {
    this.records    = observable.map({}, { deep: false })
    this.entities   = observable.map({}, { deep: false })
    //this.affinities = observable.map({}, { deep: false })
    //this.locations  = observable.map({}, { deep: false })
    //this.graph      = observable.map({}, { deep: false })

    // current search settings
    this.query = observable.map(getDefaults(), { deep: false })
  }

  async find (input) {
    console.log("[stores/search.find]", input)

    this.query.merge({
      entities   : isDefined(input.entities)              ? input.entities    : this.query.get('entities'),
      maxLinks   : typeof input.maxLinks    === 'number'  ? input.maxLinks    : this.query.get('maxLinks'),
      minWeight  : typeof input.minWeight   === 'number'  ? input.minWeight   : this.query.get('minWeight'),
      maxDistance: typeof input.maxDistance === 'number'  ? input.maxDistance : this.query.get('maxDistance'),
      query      : isNotEmpty(input.query)                ? input.query       : this.query.get('query')
    })
    console.log("[stores/search.find] this.query: ", this.query)
    const query = {
      entities   : this.query.get('entities'),
      maxLinks   : this.query.get('maxLinks'),
      minWeight  : this.query.get('minWeight'),
      maxDistance: this.query.get('maxDistance'),
      query      : this.query.get('query')
    }

    console.log("[stores/search.find] query: ", query)

    try {
      const results = await processSearchResults(API.find(query))
      console.log("[stores/search.find] updating observables with:", results)
      runInAction(() => {
        this.records.replace(results.records)
        this.recordsHash = results.recordsHash
        this.entities.replace(results.entities)
        this.entitiesHash = results.entitiesHash
        //this.affinities.replace(results.affinities)
        //this.locations.replace(results.locations)
        //this.graph.replace(results.graph)
        //this.records    = results.records
        //this.entities   = results.entities
        this.affinities = results.affinities
        this.locations  = results.locations
        this.graph      = results.graph
    
      })
    } catch (exc) {
      console.error("[stores/search.find] failed to find:", exc)
    }
  }

  ask (input) {
    console.log(`[stores/search.ask] input:`, input)
    if (typeof input !== 'string') { return this.find({ query: null }) }
    input = `${input}`.trim()
    if (input.length == 0) { return this.find({ query: null }) }

    // Let's be courteous, and add ? to real questions
    if (input[input.length - 1] !== '?' && input.match(/^(?:when|what|which|how|who|why|quand|quoi|qui|que|quell?e?s?|comment|pourquoi)/i)) {
      input = `${input}?`
    }
    return this.find({ query: input })
  }

  @action clear () {
    this.records.clear()
    this.recordsHash = null
    this.entities.clear()
    this.entitiesHash = null
    this.affinities = {}
    this.locations  = {}
    this.graph      = {}
    this.query.replace(getDefaults())

    // I think we don't need this anymore, if we do this.graph = {}
    // window._graph && window._graph.clear()
  }
}

var singleton = new Search()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.search = singleton // FOR DEBUG ONLY
}
export default singleton
