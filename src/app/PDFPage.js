import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';

import pdfjsLib from 'pdfjs-dist'

export default class PDFPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  getDocument(uri) {
    return pdfjsLib.getDocument(uri)
  }

  loadPageData(pdf) {
    const DEFAULT_SCALE = 1;
    pdf.getPage(1).then(pdfPage => {
      let viewport = pdfPage.getViewport(DEFAULT_SCALE);
      this.setState({
        loaded: true,
        pdfPage,
        viewport
      })
      this.loadTextContent(pdfPage)
    })
  }

  loadTextContent(page) {
    page.getTextContent().then(textContent => this.setState({ textContent }))
  }

  componentDidMount() {
    const { getDocument, data } = this.props
    this.getDocument(data.uri).then(this.loadPageData.bind(this))
  }

  render() {
    const { data } = this.props
    if (!this.state.loaded) return null
    const style = {
      position: "relative",
      margin: "1em 0"
    }
    return (
      <div className="page pdfViewer" id={"page-" + data.id} style={style}>
        <CanvasLayer page={this.state.pdfPage} viewport={this.state.viewport} />
        { this.state.textContent && <TextLayer textContent={this.state.textContent} viewport={this.state.viewport} /> }
      </div>
    )
  }
}

export class CanvasLayer extends Component {

  componentDidMount() {
    const { page, viewport } = this.props
    let canvasContext = this.refs.canvas.getContext('2d');
    page.render({
      canvasContext,
      viewport
    });
  }

  render() {
    const { viewport } = this.props
    const style = {
      width: viewport.width,
      height: viewport.height
    }
    return (
      <div className="canvasWrapper" style={style}>
        <canvas ref="canvas" width={viewport.width} height={viewport.height}></canvas>
      </div>
    )
  }

}

export class TextLayer extends Component {

  componentDidMount() {
    const { textContent, viewport } = this.props
    const node = ReactDOM.findDOMNode(this)

    pdfjsLib.renderTextLayer({
      textContent,
      container: node,
      viewport,
      textDivs: []
    });
  }

  render() {
    const { viewport } = this.props
    const style = {
      width: viewport.width,
      height: viewport.height
    }
    return (
      <div className="textLayer" style={style}></div>
    )
  }
}
