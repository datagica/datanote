
import { processPool } from '~/utils/electron/process-pool'

// note: empty project id is valid, and not an error. It just means there is
// no opened project yet
const noProjectId = (projectId) => (typeof projectId !== 'string' || projectId.length < 1)

class LocalAPI {

  constructor (){
    this.isReady = false
    this.client = function(){ return Promise.reject(new Error(`not ready yet`)) }
    // this.client = processPool();
    //this.worker = processPool();
  }

  async init () {
    console.log("[local.js] initializing process pool..")
    try {
      this.client = processPool()
      console.log("[local.js] calling client..")
      const status = await this.client("init", "worker")
      console.log("[local.js] worker is ready: "+status)
      this.isReady = true
      return status
    } catch (exc) {
      console.error("[local.js] worker couldn't start: "+exc)
      throw new Error("[local.js] worker couldn't start: "+exc)
    }
  }

  record (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("record", projectId, opts)
  }

  records (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("records", projectId, opts)
  }

  entity (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("entity", projectId, opts)
  }

  entities (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("entities", projectId, opts)
  }

  recordEntities (projectId, recordId) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("recordEntities", projectId, recordId)
  }

  metrics (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("metrics", projectId, opts)
  }

  getProjectList () {
    return this.client("getProjectList")
  }
  getSourceTemplateBundles()  {
    return this.client("getSourceTemplateBundles")
  }
  newProject (projectId) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("newProject", projectId)
  }

  loadProject (projectId) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("loadProject", projectId)
  }

  deleteProject (projectId) {
    if (noProjectId(projectId)) { return Promise.resolve(null) }
    return this.client("deleteProject", projectId)
  }

/*
  topEntitiesByLinkType (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client.call('Backend', "topEntitiesByLinkType", [projectId, opts])
  }
  */

  getEntitiesByLink (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("getEntitiesByLink", projectId, opts)
  }

  getRecordTypes (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("getRecordTypes", projectId, opts)
  }

  affinities (projectId, innerOpts, outerOpts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("affinities", projectId, innerOpts, outerOpts)
  }

  find (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    return this.client("find", projectId, opts)
  }
  findRelated (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    return this.client("findRelated", projectId, opts)
  }
  findCollections (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    return this.client("findCollections", projectId, opts)
  }
  suggest (projectId, opts) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("suggest", projectId, opts)
  }
  getSourceList (projectId) {
    if (noProjectId(projectId)) { return Promise.resolve([]) }
    return this.client("getSourceList", projectId)
  }
  newSource (projectId, sourceConfig) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    console.log("local.js: newSource: ", sourceConfig)
    return this.client("newSource", projectId, sourceConfig)
  }
  updateSource (projectId, sourceConfig) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    return this.client("updateSource", projectId, sourceConfig)
  }
  deleteSource (projectId, sourceId) {
    if (noProjectId(projectId)) { return Promise.resolve({}) }
    return this.client("deleteSource", projectId, sourceId)
  }
}

export default LocalAPI
