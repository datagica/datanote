'use strict'

import PDFJS from 'pdfjs-dist'
window.PDFJS = PDFJS

import React, { Component } from 'react'
import PropTypes     from 'prop-types'
import pickRGB       from '~/core/pickRGB'

import getType       from '~/utils/getters/getType'
import changeOpacity from '~/utils/colors/changeOpacity'
import fuzzyFind     from '~/utils/analysis/fuzzyFind'

import styles from './styles'

class Page extends Component {

  constructor (props) {
    super(props)
    //console.log("PDFView.Page()");
    this.state = {
      status: 'NA',
      page: null,
      width: 0,
      height: 0
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return this.context.pdf != nextContext.pdf || this.state.status !== nextState.status
  }

  componentDidUpdate (nextProps, nextState, nextContext) {
    this._update(nextContext)
  }

  componentDidMount () {
    this._update(this.context)
  }

  _update (context) {
    //console.log("PDFView.Page._update: ", context.pdf);
    if (context.pdf) {
      this._loadPage(context)
    } else {
      this.setState({ status: 'loading' })
    }
  }

  _loadPage (context) {
    //console.log("PDFView.Page._loadPage: ", context.pdf);
    if (this.state.status === 'rendering' || this.state.page != null) return;
    context.pdf.getPage(this.props.index).then(page => this._renderPage(page))
    this.setState({ status: 'rendering' })
  }

  _renderPage (page) {
    //console.log("PDFView.Page._renderPage: ", page);

    const { scale } = this.context

    //console.log("  - entities:", this.props.entities)

    const viewport = page.getViewport(scale)
    const width    = viewport.width / 2
    const height   = viewport.height / 2

    const canvas = this.refs.canvas
    const context = canvas.getContext('2d')

    //console.log(viewport.height, viewport.width)
    canvas.width        = viewport.width // '100%' // width
    canvas.height       = viewport.height // '100%' // height
    canvas.style.width  = width + "px"
    canvas.style.height = height + "px"
    //canvas.getContext('2d').scale(2,2);
    page.render({
      canvasContext: context,
      viewport
    })

    const entitiesLayer   = this.refs.entities
    const entitiesContext = entitiesLayer.getContext('2d')

    entitiesLayer.width          = viewport.width // '100%' // width
    entitiesLayer.height         = viewport.height // '100%' // height
    entitiesLayer.style.width    = width + "px"
    entitiesLayer.style.height   = height + "px"
    entitiesLayer.style.top      = "0px"
    entitiesLayer.style.position = "absolute"
    entitiesLayer.style.left     = "0px"

    const paint = (chunk, color, leftRatio, widthRatio) => {

      const transform = chunk.transform

      const x = transform[4]
      const y = transform[5]

      const rectParams = [
        x * scale + leftRatio * chunk.width * scale,
        canvas.height - (y + chunk.height) * scale,
        chunk.width * widthRatio * scale,
        chunk.height * scale
      ]

      entitiesContext.fillStyle = color

      entitiesContext.fillRect(...rectParams)
    }

    // now in this.pages there is an array contening the length of previous
    // pages, in number of characters.

    const previousPagesLength = this.props.pages
      .slice(this.props.index - 1)
      .reduce((len, p) => len + p.len, 0)
    //console.log("this.props.pages: ", this.props.pages)
    //console.log("previousPagesLength: ", previousPagesLength)

    const highlight = this.props.highlight;

    page.getTextContent().then(textContents => {
      //console.log("- textContents:", textContents);

      for (let i = 0; i < textContents.items.length; i++) {
        const currentChunk = textContents.items[i];

        if (currentChunk.str.length === 0) continue;

        const currentChunkCursor = highlight.chunkCursor

        highlight.chunkCursor += currentChunk.str.length

        let counter = 0;

        const checkStatus = () => {
          /*
          console.log("checkStatus: ", {
            "highlight.entities.length": highlight.entities.length,
            counter: counter
          })
          */
          return highlight.entities.length && counter++ < 10
        }
        while (checkStatus()) {
          const chunkBegin = currentChunkCursor
          const chunkEnd   = chunkBegin + currentChunk.str.length

          const currentEntity = highlight.entities[0]

          const predictedBegin = currentEntity.properties.begin
          const predictedEnd   = currentEntity.properties.end


          // TODO we should search in the previous, current and next chunk
          // to get a more accurate position

          if (chunkEnd < (predictedBegin - highlight.errorDelta)) {
            //console.log("nothing in this chunk, switching to next one")
            break;
          }

          highlight.entities.shift(); // take out the first entity of the queue

          if ((predictedEnd - highlight.errorDelta) < chunkBegin) {
            console.log("entity lost: ", currentEntity)
            continue;
          }

          const found = fuzzyFind(currentEntity.properties.ngram, currentChunk.str)

          if (!found) {
            console.log("entity not found: ", {
              chunk: currentChunk,
              "chunk length": currentChunk.str.length,
              chunkBegin: chunkBegin,
              chunkEnd: chunkEnd,
              currentEntity: currentEntity,
              errorDelta: highlight.errorDelta
            })

            // this can happen if a sentence is split into many small chunk


            continue;
          }

          const leftRatio = found.left
          const widthRatio = found.width

          highlight.errorDelta = (chunkBegin + found.begin) - predictedBegin

          const color = changeOpacity(pickRGB(getType(currentEntity.id)), 0.15)

          /*
          console.log("calling paint job: ", {
            found: found,
            errorDelta: highlight.errorDelta,
            //left: left,
          //  right: right,
            //width: width,
            leftRatio: leftRatio,
            widthRatio: widthRatio,
            // color: color
          })
          */

          paint(
            currentChunk,
            color,
            leftRatio,
            widthRatio
          )
        }
      }

    })

    this.setState({ status: 'rendered', page, width, height })
  }


    OBSOLETE___renderPage (page) {
      //console.log("PDFView.Page._renderPage: ", page);

      const { scale } = this.context

      console.log("  - entities:", this.props.entities)

      const viewport = page.getViewport(scale)
      const width    = viewport.width / 2
      const height   = viewport.height / 2

      const canvas = this.refs.canvas
      const context = canvas.getContext('2d')

      console.log(viewport.height, viewport.width)
      canvas.width        = viewport.width // '100%' // width
      canvas.height       = viewport.height // '100%' // height
      canvas.style.width  = width + "px"
      canvas.style.height = height + "px"
      //canvas.getContext('2d').scale(2,2);
      page.render({
        canvasContext: context,
        viewport
      })

      const entitiesLayer   = this.refs.entities
      const entitiesContext = entitiesLayer.getContext('2d')

      entitiesLayer.width          = viewport.width // '100%' // width
      entitiesLayer.height         = viewport.height // '100%' // height
      entitiesLayer.style.width    = width + "px"
      entitiesLayer.style.height   = height + "px"
      entitiesLayer.style.top      = "0px"
      entitiesLayer.style.position = "absolute"
      entitiesLayer.style.left     = "0px"

      // now in this.pages there is an array contening the length of previous
      // pages, in number of characters.

      const previousPagesLength = this.props.pages
        .slice(this.props.index - 1)
        .reduce((len, p) => len + p.len, 0)
      console.log("this.props.pages: ", this.props.pages)
      console.log("previousPagesLength: ", previousPagesLength)

      const highlight = this.props.highlight;

      page.getTextContent().then(textContents => {
        //console.log("- textContents:", textContents);

        for (let i = 0; i < textContents.items.length && highlight.entities.length; i++) {

          const currentChunk  = textContents.items[i]
          const currentEntity = highlight.entities[0]

          highlight.index += currentChunk.str.length
          console.log("INDEX: "+highlight.index)

          //const index = tem.str.indexOf(currentEntity.properties.ngram)
          //const distance = levenshtein(item.str, currentEntity.properties.ngram)
          const found = fuzzyFind(currentEntity.properties.ngram, currentChunk.str)
          if (!found) continue
          /*
          console.log(` found: `, {
            item: item,
            currentEntity: currentEntity.properties,
            found: found
            //index: index,
            // distance: distance
          })
          */

          const transform = currentChunk.transform;
          const x = transform[4];
          const y = transform[5];

          const padding = 0.25;
          const rectParams = [
            x * scale + found.left * currentChunk.width * scale,
            canvas.height - (y + currentChunk.height) * scale,
            currentChunk.width * found.width * scale,
            currentChunk.height * scale
          ];
          console.log("DEBUG ", {
            currentEntity: currentEntity,
            currentChunk : currentChunk,
            id           : currentEntity.id,
            rectParams   : rectParams
          })
          entitiesContext.fillStyle = changeOpacity(pickRGB(getType(currentEntity.id)), 0.3)

          entitiesContext.fillRect(...rectParams);

          highlight.entities.shift();
        }

      })

      this.setState({ status: 'rendered', page, width, height })
    }

  render () {
    const { width, height, status } = this.state
    // console.log("PDFView.Page.render: ",  { width, height, status });
    const style = Object.assign({}, styles, { width, height });
    return (
      <div
        className={`pdf-page ${status}`}
        style={style}>
        <canvas ref='canvas' />
        <canvas ref='entities' />
      </div>
    )
  }
}

Page.propTypes = {
  index: PropTypes.number.isRequired,
  pages: PropTypes.array.isRequired,
  entities: PropTypes.array.isRequired,
}
Page.contextTypes = {
  pdf: PropTypes.object,
  scale: PropTypes.number,
}

export default Page
