import physics from '~/config/physics';

// see here for options: http://visjs.org/examples/network/other/configuration.html
const settings = {
  //autoResize: true,
  //height: '100%', // this will need to be update with some code
  //width: '100%', // this work

  // maybe we could exploit this parameter? we should read one day the vis.js doc about it
  locale: 'en',

  nodes: {
    borderWidthSelected: 1,
    color: {
      border: "rgba(0,0,0,1)",
      background: "rgba(255,247,247,1)",
      highlight: {
        border: "rgba(0,0,0,1)",
        background: "rgba(192,198,226,1)"
      },
      hover: {
        border: "rgba(0,0,0,0.69)",
        background: "rgba(231,234,255,1)"
      }
    },
    font: {
      //size: 12,
      background: "rgba(255,255,255,0)",

      strokeWidth: 0,
      // zooming into the graph produces ugly artefacts because of the
      // strokeWidth which isn't resized.. I opened a bug at Viz.js but it was dismissed
      // strokeWidth: 1,
      // strokeColor: "rgba(255,255,255,0.55)"
    },
    shadow: {
      enabled: true,
      color: "rgba(0,0,0,0.25)",
      size: 8,
      x: 3,
      y: 3
    },
    shapeProperties: {
      borderRadius: 7
    },
    scaling: {
      label: {
        enabled: true,
        min: 9,
        max: 48,
        maxVisible: 48,
        // drawThreshold: 9
      }
    },
  },

  edges: {
    dashes: false,
    arrowStrikethrough: false,
    color: {
      inherit: false,
      color: 'rgb(0, 0, 0)',
      //color: "rgb(71,71,71)",
      highlight: "rgb(25,25,25)",
      hover: "rgb(71,71,71)",
      opacity: 1.0,
    },
    font: {
      align: 'top', // 'middle',
      // inherit: false,
      color: 'rgb(0, 0, 0)',
      strokeWidth: 1,
      strokeColor: "rgba(255,255,255,0.54)"
    },
    scaling: {
      min: 0.2,
      max: 1.5,
      label: {
        enabled: true,
        min: 2,
        max: 14,
        maxVisible: 60,
        drawThreshold: 2
      }
    },
    shadow: {
      enabled: false, // shadow on edges is too slow
      color: "rgba(0,0,0,0.4)"
    },


    // smooth edges are much slower, however we can mitigate this by drawing
    // less edges, ie. fiing the duplicate edge bug
    smooth: true,

    //smooth: {
    //  forceDirection: "none"
    //}

  },

  interaction: {

    // does't help that much, since after a drag the view needs to run the layout and edges are visible again
    hideEdgesOnDrag: false,

    hover: true,
    multiselect: true
  },

  // cannot be used at the same time as physics
  layout: {
    improvedLayout: false
  },

  physics: physics,
  groups: {}
};

export default settings
