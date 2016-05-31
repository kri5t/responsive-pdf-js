import React, { Component } from 'react';
import { render } from 'react-dom';

import './../styles/text_layer_builder.css'

import Document from './app/Document.js'

const pages = Array(12).fill().map((_, i) => {
  return {
    id: i,
    uri: `./pdfpages/${i}.pdf`
  }
});

render(
  <Document pages={pages} />,
  document.getElementById('app-container')
);
