import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';

import { debounce } from 'lodash'

import PDFPage from './PDFPage'

import pdfjsLib from 'pdfjs-dist'
pdfjsLib.PDFJS.workerSrc = 'build/pdf.worker.bundle.js';

export default class Document extends Component {

  constructor(props) {
    super(props)
    this.handleScroll = debounce(this.handleScroll.bind(this), 100)
    this.state = {
      maxLoadedPage: 2
    }
  }

  handleScroll(e) {
    const pageHeight = 874
    let visiblePageNum = Math.round(window.scrollY / 842) + 1
    let threshold = (this.state.maxLoadedPage-1.5) * pageHeight
    if (threshold < window.scrollY) {
      this.setState({
        maxLoadedPage: this.state.maxLoadedPage+1
      })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const pages = this.props.pages.slice(0, Math.min(this.state.maxLoadedPage, this.props.pages.length))
    const style = {
      width: 595,
      margin: "0 auto",
      position: "relative"
    }
    return (
      <div style={style}>
        { pages.map(page => <PDFPage key={page.uri} data={page} /> )}
      </div>
    )
  }
}

Document.propTypes = {
  pages: PropTypes.array
}
