
import {observable, action, toJS} from 'mobx'

import searchStore from '~/stores/search'
import uiStore from '~/stores/ui'
import delay from '~/utils/misc/delay'
import API from '~/api/index'

class Project {

  // global list of project - maybe should be put somewhere else
  @observable projects = []

  @observable project = {
    projectId: ""
  }

  @observable isNew = false

  @observable logo = "images/demo-avatar-nucleus.jpg"
  @observable team = "Hooli"

  @observable records  = []
  @observable entities = []
  @observable links    = []
  @observable sources  = []
  @observable parsers  = []

  @observable selection = {
    type: "",
    id: "",
    label: ""
  }

  init() {
    this.poll().then(() => {}).catch(exc => {})
  }

  async poll() {
    try { await this.sync() } catch (exc) {}
    setTimeout(async () => { await this.poll() }, 3000)
  }

  getStats() {
    return (this.project && this.project.stats) || {
      entities: 0,
      records: 0,
      size: 0
    }
  }

  getProjectId() {
    return (this.project && this.project.projectId) || ""
  }

  async newProject (opts) {

    if (typeof opts.projectId !== 'string' || opts.projectId.length < 1) {
      throw new Error(`projecId shouldn't be empty`)
    }

    // todo - experimental code - this is an independent task
    //setTimeout(() => {
    //  API.remote.newProject(Object.assign({}, opts, { createdAt: +(new Date()) }))
    //}, 10)

    const project = await API.newProject(opts.projectId)
    runInAction(() => { this.project = project })
    await this.sync()
    return project
  }

  // TODO should also receive push notifications from the server eg. LiveQuery
  async loadProject (projectId) {
    // console.log(`Project(${projectId}).loadProject`, projectId);

    if (typeof projectId !== 'string' && projectId.length < 1) {
      throw new Error(`project id shouldn't be empty`)
    }

    const project = await API.loadProject(projectId)
    this.project = project
    return this.sync()
  }

  async getSourceTemplateBundles () {
    return await API.getSourceTemplateBundles()
  }


  async syncProjectMetaData() {

    // FETCH LIST OF POPULAR RECORDS
    //.getLinkOrigins({ linkType: 'link:instanceof', limit: 100 })
    //.catch(err  => Promise.resolve([]))
    //.then(types => promiseAction(() => this.entities.replace(types)))

    // FETCH LIST OF POPULAR PARENT ENTITIES
    let types = []
    try {
      types = await API.getEntitiesByLink({ linkType: 'link:instanceof', limit: 100, direction: 'in' })
      if (!Array.isArray(types)) {
        throw new Error(`API.getEntitiesByLink failed, returned`, types)
      }
    } catch (exc) {
      console.error('syncProjectMetaData: API.getEntitiesByLink() failed: ', exc)
      types = []
    }

    // console.log("checking types.", types)
    // important: here we use id for change detection
    const sortedTypes = types.sort((a, b) => a.id.localeCompare(b.id))

    // only update if data is different
    if (JSON.stringify(toJS(this.entities)) !== JSON.stringify(sortedTypes)) {
      // console.log("replacing our array with: ", types)
      runInAction(() => {
        // important: but here we want to keep the server-provider order
        this.entities.replace(types)

        // update filters
        filterStore.entities.forEach((value, id) => {
          if (!this.entities.find(candidate => candidate.id === id)) {
            filterStore.entities.delete(id)
          }
        })
      })
    }

    // FETCH SOURCES
    let sources = []
    try {
      sources = await API.getSourceList()
      if (!Array.isArray(sources)) {
        throw new Error(`API.getSourceList failed, returned`, sources)
      }
    } catch (exc) {
      console.error('syncProjectMetaData: API.getSourceList() failed: ', exc)
      sources = []
    }

    // console.log("checking sources.", sources)
    const sortedSources = sources.sort((a, b) => a.sourceId.localeCompare(b.sourceId))

    // only update if data is different
    if (JSON.stringify(toJS(this.sources)) !== JSON.stringify(sortedSources)) {
      runInAction(() => this.sources.replace(sortedSources))
    }
    
    // FETCH LIST OF POPULAR RECORD TYPES
    types = {}
    try {
      types = await API.getRecordTypes()
    } catch (exc) {
      console.error('syncProjectMetaData: API.getRecordTypes() failed: ', exc)
    }

    if (!types || !Object.keys(types).length) { return true }

    const sortedRecords = Object.keys(types.templateId).map(templateId => ({
       id: templateId,
      label: { en: templateId },
       rank: types.templateId[templateId]
     })).sort((a, b) => (b.rank - a.rank))

    /*
     at first we merged bundle ids and template ids, bu tin the end we don't
    really care about the name of the plugin container

    const bundleIds = Object.keys(types.bundleId).map(bundleId => ({
      id: bundleId,
      label: { en: bundleId },
      rank: types.bundleId[bundleId]
    }))
    const sortedRecords = bundleIds.concat(templateIds).sort((a, b) => (b.rank - a.rank))
    */

    // only update if data is different
    if (JSON.stringify(toJS(this.records)) !== JSON.stringify(sortedRecords)) {
      runInAction(() => {
        this.records.replace(sortedRecords)

        filterStore.records.forEach((value, id) => {
          const existing = this.records.find(candidate => candidate.id === id)
          if (!existing) {
            filterStore.records.delete(id)
          }
        })
      })
    }

    return true
  }


  /// to avoid calling sync in parallel, we use a single promise system
  async sync (proj) {
    if (this.syncInProgress) { return this.syncPromise }
    this.syncPromise = new Promise((resolve, reject) => {
      this._sync().then(result => {
        this.syncInProgress = false
        resolve(result) 
      }).catch(exc => {
        this.syncInProgress = false
        reject(exc) 
      })
    })
    this.syncInProgress = true
    return this.syncPromise
  }

    /**
   * Sync:
   * - the global list of projects
   * - the list of entities in the current project
   * - the list of sources in the current project
   *
   */
  async _sync (proj) {

    if (!API.local.isReady) {
      //console.log("[stores/project.sync] local api isn't ready")
      throw new Error(`[stores/project] not ready yet`)
    }

    //console.log("[stores/project.sync] local api is ready")
    let projects = []
    try {
      projects = await API.getProjectList()
      if (!Array.isArray(projects)) {
        throw new Error(`getProjectList failed, returned ${projects}`)
      }
    } catch (exc) {
      console.error(`getProjectList failed: ${exc}`)
      projects = []
    }

    const sortedProjects = (
      (typeof projects !== 'undefined' && projects.sort instanceof Function) ? projects : []
    ).sort((a, b) => a.projectId.localeCompare(b.projectId))

    if (JSON.stringify(sortedProjects) !== JSON.stringify(toJS(this.projects))) {
      runInAction(() => { this.projects.replace(sortedProjects) })
    }
  
    // TODO check if the project still exists in the list,
    // and delete it otherwise
    // also, project polling should be done in the "projects" poll
    if (this.project && this.project.projectId) {
      await this.syncProjectMetaData()
      return 
    }

    const foundCurrentProject = this.projects.find(project => project && this.project && (project.projectId === this.project.projectId))
    if (!foundCurrentProject && (this.project && this.project.projectId  !== "")) {
      // console.log("stores/project.doSync: couldn't find the current project, closing in..")
      await this.closeProject()
      return
    }

    await this.syncProjectMetaData()
  }

  /**
   * Close current project
   */
  async closeProject () {
    // console.log("project.js/closeProject")

    runInAction(() => {
      if (this.project) {
        this.project.projectId = ""
      } else {
        this.project = {
          projectId: ""
        }
      }

      this.records.replace([])
      this.entities.replace([])
      this.links.replace([])
      this.sources.replace([])

      searchStore.clear()

      // animate things
      uiStore.section = 'intro'
      uiStore.filters = 'hide'
      uiStore.list    = 'hide'
    })

    return await this.sync()
  }

 async switchProject (projectId) {
    await this.loadProject(projectId)
    searchStore.clear()
    return true
  }

  async deleteProject (projectId) {
    // TODO maybe system alert popups should be on top of everything, and triggered from the store?
    await API.deleteProject(projectId)
    return await this.sync()
  }

  async updateSource (source) {
    await API.updateSource(source)
    return await this.sync()
  }

  async deleteSource (sourceId) {
    await API.deleteSource(sourceId)
    return await this.sync()
  }

  // high-order function to get or create a project
  // this will also update the UI
  async getOrMake (projectId) {
    
    console.log("stores/project.getOrMake: "+projectId)
    runInAction(() => {
      uiStore.isLoading = true
    })

    await this.newProject({ projectId: projectId })
    await this.loadProject(projectId)
    
    console.log("stores/project.getOrMake: created and loaded a new project")
    await delay(2000)

    runInAction(() => {
      console.log("stores/project.getOrMake: updating uiStore..")
      uiStore.section = 'project'
      uiStore.filters = 'show'
      uiStore.effect  = 'normal'
      uiStore.list    = 'hide'
      uiStore.isLoading = false
    })
    console.log('stores/project.getOrMake: returning projectId')
    return projectId
  }

  async newSource (source) {
    return await API.newSource(source)
  }

  @action select (type, id, label) {
    if (typeof type === "string") {
      this.selection.type = type;
    }
    if (typeof id === "string") {
      this.selection.id = type;
      if (typeof label === "string") {
        this.selection.label = type;
      } else {
        this.selection.label = currentId;
      }
    } else {
      this.selection.id = ""
    }
  }
}

var singleton = new Project()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.project = singleton // FOR DEBUG ONLY
}
export default singleton
