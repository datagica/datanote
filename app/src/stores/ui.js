'use strict'

import React, {Component} from 'react'
import {observable, computed} from 'mobx'
import {observer} from 'mobx-react'

// color scheme
import lightTheme from '~/themes/lightTheme'

import getLanguage from '~/utils/misc/getLanguage'

class UI {

  muiTheme = lightTheme

  @observable locale = 'en' // getLanguage()

  @observable enableMailPolling = false
  @observable lastMailUpdate    = 0

  @observable section   = 'intro'  // 'intro', 'settings' or 'project'
  @observable filters   = 'hide'   // 'show' or 'hide'
  @observable effect    = 'normal' // 'normal' or 'blur'
  @observable list      = 'hide'   // 'hide', 'records' or 'entities'
  @observable isLoading = false // true or false
}

var singleton = new UI()
if (window && window.datanote && window.datanote.stores) {
  window.datanote.stores.ui = singleton // FOR DEBUG ONLY
}
export default singleton
