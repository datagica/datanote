import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Link } from 'react-router-dom'

import '~/boot'

import '~/themes/global.scss'

import api from '~/api/index'

import projectStore from '~/stores/project'

// import '~/stores/ui'

import Index from '~/views/index'
import Projects from '~/views/Projects'
import Project from '~/views/Project'

window.main = () => {
  console.log("[app.js] initializing api..")
  api.init(status => {
    console.log("[app.js] api is ready: "+status)

    console.log("[app.js] starting project watcher..")
    projectStore.init()

    setTimeout(() => {
      console.log("[app.js] rendering view..")
      // TODO display a "auto login" component on /


      ReactDOM.render(
        <HashRouter>
          <Index>
            <Route exact path='/'                 component={Projects} />
            <Route exact path='/projects'         component={Projects} />
            <Route exact path='/project'          component={Project}  />
            <Route exact path='/project/settings' component={Project}  />
          </Index>
        </HashRouter>,
        document.querySelector('#main')
      );
    }, 2000)
  })
}
