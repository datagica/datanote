'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { toJS } from 'mobx'

import uiStore from '~/stores/ui'

import 'font-awesome/css/font-awesome.css'

import vis from 'vis'
import 'vis/dist/vis.css'
import './custom-vis.css'

import getIcon       from '~/core/getIcon'
import mixRGB        from '~/core/mixRGB'
import throttle      from '~/utils/misc/throttle'
import changeOpacity from '~/utils/colors/changeOpacity'
import parseColor    from '~/utils/colors/parseColor'
import WordWrap      from '~/utils/formatters/wordwrap'
import safeFilename  from '~/utils/formatters/safeFilename'
import toGexf        from '~/utils/exporters/toGexf'
import toCsv         from '~/utils/exporters/toCsv'

// some polyfills to download content of a canvas
import '~/utils/polyfills/blob'
import '~/utils/polyfills/canvasToBlob'
import { saveAs } from '~/utils/polyfills/FileSaver'

import styles from './styles'

import defaultSettings from './settings'

const wordwrap = WordWrap(14)
function wordWrap (text) {
  const wrapped = wordwrap(text)
  const lines = wrapped.split('\n').length
  return new Array(1 + lines).join('\n') + wrapped
}


function processArray(items, proc, delay = 20) {
  var queue = items.concat();
  setTimeout(function() {
    proc(queue.shift());
    if (queue.length <= 0) return;
    setTimeout(arguments.callee, delay);
  }, delay);
}

function makeEmptyGraph(){
  return {
    hash: "",
    nbNodes: 0,
    nbEdges: 0,
    minNodeRank: 0,
    maxNodeRank: 0,
    minNodeWeight: 0,
    maxNodeWeight: 0,
    minEdgeWeight: 0,
    maxEdgeWeight: 0,
    nodes: [],
    edges: []
  }
}

function projection(value, valueRange, targetRange) {

  valueRange = (valueRange.min > valueRange.max)
    ? { max: valueRange.min, min: valueRange.max }
    : valueRange;

  value = (value < valueRange.min)
    ? valueRange.min
    : (value > valueRange.max) ? valueRange.max : value;

  const r = ((valueRange.max - valueRange.min) == 0)
    ? 1.0
    : ((value-valueRange.min) / (valueRange.max-valueRange.min));

  return (targetRange.min > targetRange.max)
    ? (targetRange.max - ((targetRange.max - targetRange.min) * r))
    : (targetRange.min + ((targetRange.max - targetRange.min) * r))
}

const cache = {}
const cacheFifo = []

export default class Graph extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  constructor(props, context){
    super(props, context)
    this.state = {
      hideSingleNodes: true
    }
    this.settings = defaultSettings;
    this.current = {
      nodes: new vis.DataSet(),
      edges: new vis.DataSet(),
      graph: makeEmptyGraph(),
      settings: Object.assign({}, this.settings)
    }
    this.throttle = throttle(500)

    // @deprecated - avoid using this please, this is for debug / hacks
    window._graph = this;
  }

  handleResize = (e) => {
    // console.log("Graph.handleResize: graph resize event detected!");
    if (this.network && this.network.setSize) {
      this.network.setSize(window.innerWidth, window.innerHeight);
    }
  }

  saveToPng (fileName="Untitled") {
    if (!this.container) {
      console.log("cannot convert graph to PNG: no container")
      return
    }
    const canvas = this.container.querySelector('canvas')
    if (!canvas) {
      console.log("cannot convert graph to PNG: no canvas")
    }

    canvas.toBlob(blob => {
      saveAs(
        blob,
        `${safeFilename(fileName)}.png`
      )
    }, "image/png")
  }

  saveToGexf (fileName="Untitled") {
    if (!this.current || !this.current.graph.nodes || !this.network) {
      console.log("cannot convert graph to Gexf: no graph")
      return
    }

    // to build the gexf we need the edges, node color info and coordinates
    const iterableEdges = toJS(this.current.graph.edges)
    const nodePositions = this.network.getPositions()
    const nodeMeta      = this.current.nodes._data

    const nodes = {}

    const edges = iterableEdges.map(
      ({
        distance,
        source,
        target,
        occurrences,
        weight
      }, edgeId) => {

      // source
      nodes[source.id] = {
        id      : source.id,
        label   : source.label.en,
        position: nodePositions[source.id],
        color   : parseColor(nodeMeta[source.id].icon.color),
        weight  : source.weight,
        rank    : source.rank,
      }

      // target
      nodes[target.id] = {
        id      : target.id,
        label   : target.label.en,
        position: nodePositions[target.id],
        color   : parseColor(nodeMeta[target.id].icon.color),
        weight  : target.weight,
        rank    : target.rank,
      }

      return {
        id    : edgeId,
        source: source.id,
        target: target.id,
        weight: weight,
      }
    })
    const gexf = toGexf(
      "this graph was generated using Datanote",
      Object.keys(nodes).map(id => nodes[id]),
      edges
    )
    saveAs(
      new Blob([ gexf ],
      { type: 'application/xml' }),
      `${safeFilename(fileName)}.gexf`
    )
  }

  saveToCsv (fileName="Untitled") {
    if (!this.current || !this.current.graph.nodes || !this.network) {
      console.log("cannot convert graph to CSV: no graph")
      return
    }

    // to build the gexf we need the edges, node color info and coordinates
    const iterableEdges = toJS(this.current.graph.edges)
    const nodePositions = this.network.getPositions()
    const nodeMeta      = this.current.nodes._data

    const nodes = {}

    iterableEdges.map(
      ({
        distance,
        source,
        target,
        occurrences,
        weight
      }, edgeId) => {

      // source
      nodes[source.id] = {
        id      : source.id,
        label   : source.label.en,
        position: nodePositions[source.id],
        color   : parseColor(nodeMeta[source.id].icon.color),
        weight  : source.weight,
        rank    : source.rank,
      }

      // target
      nodes[target.id] = {
        id      : target.id,
        label   : target.label.en,
        position: nodePositions[target.id],
        color   : parseColor(nodeMeta[target.id].icon.color),
        weight  : target.weight,
        rank    : target.rank,
      }

      return {
        id    : edgeId,
        source: source.id,
        target: target.id,
        weight: weight,
      }
    })
    const csv = toCsv(
      Object.keys(nodes).map(id => nodes[id])
    )
    saveAs(
      new Blob([ csv ],
      { type: 'text/csv' }),
      `${safeFilename(fileName)}.csv`
    )
  }

  saveToJson (fileName="Untitled") {
    if (!this.current || !this.current.graph.nodes || !this.network) {
      console.log("cannot convert graph to JSON: no graph")
      return
    }


    // to build the gexf we need the edges, node color info and coordinates
    const iterableEdges = toJS(this.current.graph.edges)
    const nodePositions = this.network.getPositions()
    const nodeMeta      = this.current.nodes._data

    const nodes = {}

    const edges = toJS(this.current.graph.edges).map(
      ({
        distance,
        source,
        target,
        occurrences,
        weight
      }, edgeId) => {

      // source
      nodes[source.id] = {
        id      : source.id,
        label   : source.label.en,
        position: nodePositions[source.id],
        color   : nodeMeta[source.id].icon.color
      }

      // target
      nodes[target.id] = {
        id      : target.id,
        label   : target.label.en,
        position: nodePositions[target.id],
        color   : nodeMeta[target.id].icon.color
      }

      return {
        from: source.id,
        to:   target.id
      }
    })

    const graph = {
      "nodes": Object.keys(nodes).map(id => nodes[id]),
      "edges": edges
    }

    saveAs(
      new Blob([ JSON.stringify(graph, null, 2) ],
      { type: 'application/json' }),
      `${safeFilename(fileName)}.json`
    )
  }

  reposition() {

    if (!this.container ||!this.props.isVisible || !this.network) return;
    // console.log("reposition necessary")

    let filterWidth = 0
    if (uiStore.filters !== 'hide') { filterWidth += 155 }
    if (uiStore.list    !== 'hide') { filterWidth += 520 }

    // const smallest = window.innerHeight / window.innerHeight window.innerHeight / window.innerHeight)

    const wScale = Math.max(0.10, (window.innerWidth - filterWidth) / window.innerWidth)

    const scale = wScale

    const x = window.innerWidth * scale - window.innerWidth

    /*
    console.log("debug", {
      innerWidth: window.innerWidth,
      filterWidth: filterWidth,
      scale: scale,
      x: x
    });
    */

    this.network.moveTo({
      position: { x:  x, y: 0 },
      scale: scale,
      animation: {
        duration: 1000,
        easingFunction: 'easeInOutCubic'
      }
    })
  }

  componentDidMount() {
    // console.log("Graph.componentDidMount, calling this.build()");
    window.addEventListener('resize', this.handleResize);
    /*
    setTimeout(() => {
      console.log("componentDidMount: re-trying to update the graph")
      this.build(this.props.data);
      // this.network.setSize(window.innerWidth, window.innerHeight);
    }, 1000)
    */
  }

  componentWillUnmount() {
    //console.log("Graph.componentWillUnmount");
    window.removeEventListener('resize', this.handleResize);
    if (this.network === 'undefined') {
      this.network.stopSimulation()
      this.network.destroy()
    }
    delete this.network;
  }

  /*
  hasGraph() {
    return this.container && this.network
  }
  */

  /**
   * Determine if we should render the component or not
   */
  shouldComponentUpdate(nextProps, nextState) {

    const graphHasChanged = !this.props.data || (this.props.data.hash !== nextProps.data.hash);

    /*
    console.log("shouldComponentUpdate:", {
      nextProps: nextProps,
      nextState: nextState,
      graphHasChanged: graphHasChanged
    })
    */

    // never update if not in the right tab
    if (!nextProps.isVisible) {
      // console.log("shouldComponentUpdate: tab is not visible, no need to re-render")
      if (this.network) this.network.stopSimulation()
      return false
    }

    if (!this.container) {
      // console.log("shouldComponentUpdate: no container, need to render")
      return true
    }
    if (!this.network) {
      // console.log("shouldComponentUpdate: network needs to be created")
      this.build(nextProps.data)
      return false
    }

    if (graphHasChanged) {
      // console.log("shouldComponentUpdate: network has changed")
      this.build(nextProps.data)
      // no return here, we need to restart the sim and not re-render
    }

    this.network.startSimulation()
    
    if (graphHasChanged) {
      setTimeout(() => {
        this.reposition()
      }, 10)
    }
    return false
  }

  componentDidUpdate (prevProps) {
    /*
    console.log("Graph.componentDidUpdate", {
      prevProps: prevProps,
      props: this.props
    });
    */
  }

  select (ids) {
    if (!this.network || !this.current || !this.current.nodes) {
      return
    }
    try {
      this.network.selectNodes(ids)
    } catch(err) {
      console.log("some ids have not been found: "+err, ids)
    }
  }

  addNode (nodes, item, size, useShadow) {

    const id = item.id;

    if (typeof this.settings.groups[item.type] === 'undefined') {
      //console.log("item.type: "+item.type)
      //this.settings.groups[item.type] = {
      //  shape: 'icon',
      //  icon: getIcon(item.type, size * 50)
      //};
    }
    /*
    console.log('addNode: ', {
      item, size
    })
    */

    if (nodes.get(id)) {
      //console.log(`node ${id} is already in the graph`);
    } else {
      // this.addNode(item)
      //console.log(`node ${id} isn't already in the graph, adding it, with size ${size}`);
      const wrappedLabel = wordWrap(item.label.en);
      nodes.add({
        id: id,
        label: wrappedLabel,

        //group: item.type,
        // value: size,
         // TODO: use "title" with an html element, or write main html
         //         <p>${id}</p>
         // downside: not converted during the canvas to png export..
        title: `
          <h4>${wrappedLabel}</h4>
        `,


        entityId: item.id,
        entityType: item.type,
        shape: 'icon',
        icon: getIcon(item.type, size * 50),
        /*
        scaling: {
          label: {
            enabled: true,
            // size can be 0.25, 0.5 etc..
            //min: 3,
            //max: size * 68,
            //maxVisible: size * 68,
            //drawThreshold: 40 - size * 68
          }
        },*/
        shadow: {
          enabled: useShadow,
        }

      })
    }
  }

  /**
   * Clear the graph
   */
  clear() {
    // console.log("Graph.clear()")
    delete this.current.graph.hash
    this.build()
  }

  build (graph) {
    // console.log("Graph.build(graph)", graph)

    if (graph && this.current.graph.hash === graph.hash) {
      // console.log(`graph hash didn't change (${graph.hash}) so nothing to rebuild`)
      return;
    }

    if (!graph) {
      graph = makeEmptyGraph()
    }

    /*
    const cached = cache[graph.hash];
    if (cached) {
      this.renderGraph(cached)
      return;
    }
    */

    this.current = {
      graph: graph,
      nodes: new vis.DataSet(),
      edges: new vis.DataSet(),
      settings: Object.assign({}, this.settings, {
        edges: Object.assign({}, this.settings.edges, {

          // only enable smooth edges when there aren't too many
          smooth: graph.nbEdges < 400
        })
      })
    }

    /*
    cache[graph.hash] = this.current;

    // store no more than the the last 20 graphs in cache
    cacheFifo.push(graph.hash)
    if (cacheFifo.length > 20) cacheFifo.shift()
    */

    const useShadow = graph.nbNodes < 350;

    // console.log("going to draw "+graph.nbEdges+" edges and "+graph.nbNodes+" nodes, hang on..")
    for (let i = 0; i < graph.nbEdges; i++) {

      const edge = graph.edges[i];

      // TODO use the node rank instead (this is not available right now..)
      // const size  = projection(edge.distance, { min: minRanking, max: maxRanking }, { min: 0.20, max: 1 });
      /*
      console.log('--> ', {
        edge,
        sourceWeight: edge.source.weight,
        targetWeight: edge.target.weight,
        sourceRank: edge.source.rank,
        targetRank: edge.target.rank, 
      })
      */

      /*
      const sourceWeight = projection(
        edge.source.weight,
        { min: graph.minNodeWeight, max: graph.maxNodeWeight },
        { min: 0.25, max: 0.5 }
      )

      const targetWeight = projection(
        edge.target.weight,
        { min: graph.minNodeWeight, max: graph.maxNodeWeight },
        { min: 0.25, max: 0.5 }
      )
      */

      // TODO OPTIMIZATION: this could be done in the backend
      const sourceRank = projection(
        edge.source.rank,
        { min: graph.minNodeRank, max: graph.maxNodeRank },
        { min: 0.25, max: 0.5 }
      )

      // TODO OPTIMIZATION: this could be done in the backend
      const targetRank = projection(
        edge.target.rank,
        { min: graph.minNodeRank, max: graph.maxNodeRank },
        { min: 0.25, max: 0.5 }
      )

      /*
      const opacity  = projection(edge.link.weight,
        { min: graph.minEdgeWeight, max: graph.maxEdgeWeight },
        { min: 0.1, max: 0.7 }
      )
      */

      const edgeWidth = projection(edge.link.weight,
        { min: graph.minEdgeWeight, max: graph.maxEdgeWeight },
        { min: 0.1, max: 1 }
        // { min: 0.003, max: 0.02 }
      )

      // console.log(`${edge.source.weight} ==(${strength})=> ${edge.target.weight}`)

      // unfortunately, vis.js doesn't support RGBA, only RGB + one-time opacity setting
      //const color = changeOpacity(mixRGB(edge.source.type, edge.target.type), opacity);
      const color = mixRGB(edge.source.type, edge.target.type)

      /*console.log("debug source:", {
        "edge.source.weight": edge.source.weight,
        "graph.minNodeWeight": graph.minNodeWeight,
        "graph.maxNodeWeight": graph.maxNodeWeight
      })*/
      this.addNode(
        this.current.nodes,
        edge.source,
        sourceRank,
        useShadow
      )

      this.addNode(
        this.current.nodes,
        edge.target,
        targetRank,
        useShadow
      )

      const isAffinity = edge.link.id === 'link:affinity'

      /*
      console.log("debug: ", {
        edge: edge,
        sourceWeight: sourceWeight,
        targetWeight: targetWeight,
        color: color,
        edgeWidth: edgeWidth
      })
      */

      // create an edge
      // if the tw nodes are of a different type, we alter the edge by using
      this.current.edges.add({
        from : edge.source.id,
        to   : edge.target.id,

        label: isAffinity ? '' : edge.link.label.en,

        font: {
          opacity: isAffinity ? 0.4 : 0.9,
          size:  isAffinity ? 9 : 10,
        },

        // WARNING do not use dashes. they render poorly,
        // especially when there are too many edges
        // dashes: edge.link.id === 'link:affinity',

        color: {

          opacity: isAffinity ? 0.2 : 0.7

          /*
          color: color,

          opacity: (
            // note: here "type" is the family (eg. virus, location..)
            edge.source.type !== edge.target.type
            ? 0.1 + opacity * 0.3
            : opacity
          )
          */

        },

        // dashes are disabled for now, they reveal tricky to use:
        // - they add even more visual information to digest by the user
        // - they can slow the rendering engine if there are too many
        //dashes: edge.source.type !== edge.target.type

        value: edgeWidth,

      });
    }
    // console.log("Graph.build: calling this.renderGraph()")
    this.renderGraph(this.current)
  }

  renderGraph(graph) {
    //console.log("Graph.renderGraph: creating a new vis.Network inside this.container");

    if (this.network) {
      // console.log("Graph.renderGraph: this.network already exists! stopping and destroying previous this.network..")
      this.network.stopSimulation()
      this.network.destroy()
      delete this.network
    }

    if (this.container == null) { return }
    if (this.settings  == null) { return }

    this.network = new vis.Network(
      this.container, {
        nodes: graph.nodes,
        edges: graph.edges
      },
      graph.settings
    )

    this.network.setSize(window.innerWidth, window.innerHeight)
    this.network.fit() // <- this is the problem maybe?
    this.network.redraw()
  }

  render() {
    return (
      <div style={this.props.style}>
        <div ref={container => (this.container = container)} style={styles.network} />
      </div>
    )
  }
}
