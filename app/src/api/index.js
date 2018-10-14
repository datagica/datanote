'use strict'

import getType from '~/utils/getters/getType'

import LocalAPI from '~/api/local'

// remote API is experimental and is disabled
// import RemoteAPI  from '~/api/remote'

class Api {

  constructor () {
    this.local  = new LocalAPI()

    // remote API is experimental and is disabled
    // this.remote = new RemoteAPI()

    this._projectId = ""
  }

  async _init (cb) {
    console.log("[api.init] initializing api..")
    try {
      await this.local.init()
      console.log("[api.init] success")
      cb(true)
    } catch (exc) {
      console.error("[api.init] error:", exc)
      cb(false)
    }
  }

  init (cb) {
    console.log("[api.init] will initialize api in 0.5 seconds..")
    setTimeout(() => { this._init(cb) }, 500)
  }

  projectId (projectId) {
    if (typeof projectId === 'string' && projectId.length > 0) {
      this._projectId = projectId
    }
    return this._projectId
  }

  /**
   * Create a project, setting the project id at the same time
   */
  async newProject (projectId) {
    return await this.local.newProject(this.projectId(projectId))
  }

  /**
   * Load an existing project, setting the project id at the same time
   */
  async loadProject (projectId) {
    return await this.local.loadProject(this.projectId(projectId))
  }

  /**
   * Delete an arbitrary project
   */
  async deleteProject (projectId) {
    if (this.projectId() === projectId) {
      this._projectId = ""
    }
    return await this.local.deleteProject(projectId)
  }

  /**
   * Return the list of all projects
   */
  async getProjectList () {
    return await this.local.getProjectList()
  }
  async getSourceTemplateBundles () {
    return await this.local.getSourceTemplateBundles()
  }
  async getSourceList () {
    return await this.local.getSourceList(this.projectId())
  }
  async newSource (sourceConfig) {
    // console.log("index.js: newSource: ", sourceConfig)
    return await this.local.newSource(this.projectId(), sourceConfig)
  }
  async updateSource (sourceConfig) {
    return await this.local.updateSource(this.projectId(), sourceConfig)
  }
  async deleteSource (sourceId) {
    return await this.local.deleteSource(this.projectId(), sourceId)
  }
  async types () {
    return await this.local.types(this.projectId())
  }


  /**
   * Find and generate all in the database
   *
   *
   */
  async find (query) {
    console.log("[api/index.find] query=", query)
    return await this.local.find(this.projectId(), query)
  }

  /**
   * Find all entities related to specific entities
   *
   * The nature and the strength of the relationship are parameters
   * (well right now it is hardcoded since the feature is a work in progress)
   */
  async findRelated (query) {
    console.log("[api/index.findRelated] query=", query)
    return await this.local.findRelated(this.projectId(), query)
  }

  /**
   * Find only collections in the database
   *
   *
   */
  async findCollections (query) {
    console.log("[api/index.findCollections] query=", query)
    return await this.local.findCollections(this.projectId(), query)
  }

  async getEntity (entityType, entityId) {
    return await this.local.entity(this.projectId(), {
      entityType: entityType,
      entityId:   entityId
    })
  }

  /**
  Compute affinities for a given entityType and an optional entityId
  */
  async affinities (innerQuery, outerQuery) {
    console.log("API.affinities: ", { innerQuery: innerQuery, outerQuery: outerQuery })
    try {
      const results = await this.local.affinities(this.projectId(), innerQuery, outerQuery)
      console.log("API.affinities: got some affinities: ", results)
      const types = {}
      results.forEach(item => {
        item.type = getType(item.id)
        if (!types[item.type]) {
          types[item.type] = {
            data: [],
            maxRank: 0
          }
        }
        types[item.type].data.push(item);
        if (item.rank > types[item.type].maxRank) {
          types[item.type].maxRank = item.rank;
        }
      })
      return types
    } catch (exc) {
      return {}
    }
  }


  /**
   * OK - STILL USED
   * Return entities of a given record
   */
  async recordEntities (recordId) {
    console.log("API.entities: calling api.recordEntities "+recordId+")")
    try {
      return await this.local.recordEntities(this.projectId(), recordId)
    } catch (exc) {
      console.error("couldn't get record entities: ", exc)
      return []
    }
  }

  /*
  topEntitiesByLinkType (projectId, opts) {
    return this.local.topEntitiesByLinkType(this.projectId(), opts).catch(err =>
      console.error("couldn't get top entities by link type: ", err), Promise.resolve([])
    )
  }
  */

  async getEntitiesByLink (opts) {
    try {
      return await this.local.getEntitiesByLink(this.projectId(), opts)
    } catch (exc) {
      console.error("couldn't get entities by link: ", exc)
      return []
    }
  }

  async getRecordTypes () {
    try {
      return await this.local.getRecordTypes(this.projectId())
    } catch (exc) {
      console.error("couldn't get record  types: ", exc)
      return {}
    }
  }

  async suggest (value) {
    return await this.local.suggest(this.projectId(), value)
  }

  /**
   * Open a file using the browser's FileReader API
   */
   /*
   disabled - now we only do that in the backend

  openFile(file){
    console.log("API.openFile:", file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let error;
      reader.onloadend = () => {
        if (typeof error !== 'undefined') {
          reject(error);
        } else {
          resolve({
            isBase64Encoded: true,
            data: window.btoa(reader.result),
            filename: file.name
          })
        }
      }
      reader.onerror = (err) => {
        console.error(`error while reading the file: ${err}`);
        // we do not all reject(the error is taken care of asynchronoulsy
        error = err;
      };
      reader.readAsBinaryString(file);
    })
  }
  */

}

const API = new Api()

// FOR DEBUG ONLY
if (window && window.datanote) { window.datanote.api = API }

export default API
