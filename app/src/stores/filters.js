// import Immutable from 'immutable'

import {observable} from 'mobx'

class Filters {
  @observable records  = new Map()
  @observable entities = new Map()
  @observable links    = new Map()
}

var singleton = new Filters()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.filters = singleton // FOR DEBUG ONLY
}
export default singleton
