'use strict'

// also do special support for Electron: disable pinch-zoom to fee more native
if (window.node && window.node.electron && window.node.electron.webFrame) {
  window.node.electron.webFrame.setVisualZoomLevelLimits(1, 1)
}
