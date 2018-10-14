
import { observable, runInAction } from 'mobx'

import API from '~/api/index'

import processSearchResults from '~/core/processSearchResults'

class Queries {

  @observable history = []

  async ask (input) {
    console.log(`[Queries.ask] input:`, input)

    input = `${input}`.trim()

    // Nothing to do.
    if (input.length == 0) {
      return;
    }
    // Let's be courteous, and add ? to real questions
    if (input[input.length - 1] !== '?' && input.match(/^(?:when|what|which|how|who|why|quand|quoi|qui|que|quell?e?s?|comment|pourquoi)/i)) {
      input = `${input}?`
    }

    // also don't forget the capital, we are not writing a SMS.
    input = input.charAt(0).toUpperCase() + input.slice(1);

    console.log(`[Queries.ask] this.history:`, this.history)

    const query = {
      query: input,
      minWeight: 0,
      maxLinks: 2000,
      maxDistance: 5
    }

    console.log("[Queries.ask]: calling API.find with", query)

    runInAction(() => {
      this.history.push({
        sender: 'human',
        type: 'plain',
        data: input
      })

      this.history.push({
        sender: 'bot',
        type: 'loading',
        data: '..'
      })
    })

    try {

      const results = await processSearchResults(API.find(query))
      console.log("[Queries.ask] got result from API.find:", results)

      runInAction(() => {

      this.history.pop()

        const entityTypes = Object.keys(results.entities)

        if (entityTypes.length == 0) {
          return this.history.push({
            sender: 'bot',
            data: 'No result.'
          })
        }

        entityTypes.map(entityType => {

          // note: we could also display some stats, or update the stats
          const entityList = results.entities[entityType].rows;

          this.history.push({
            sender: 'bot',
            type: 'ranking',
            data: {
              title: entityType,
              data: entityList.map(row => ({
                id    : row.id,
                label : row.label,
                rank  : row.rank
              }))
            }
          })
        })

      })

    } catch (exc) {
      console.error("stores.queries.find: failed to find:", exc)
      runInAction(() => {
        this.history.pop()
        this.history.push({
          sender: 'bot',
          type: 'error',
          data: exc
        })
      })
    }
  }
}

var singleton = new Queries()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.queries = singleton // FOR DEBUG ONLY
}
export default singleton
