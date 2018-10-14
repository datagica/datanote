'use strict'

import isTouchScreen from '~/utils/misc/isTouchScreen'

export const UI_WIDTH_FILTERS = isTouchScreen ? 170 : 155
export const SLIDER_WIDTH_FILTERS = isTouchScreen ? 170 : 155

export const UI_WIDTH_LISTS = 520

export const TAB_NETWORK   = 0
export const TAB_LOCATIONS = 1
export const TAB_METRICS   = 2
