import $ from 'jquery'

import './../styles/text_layer_builder.css'

var pdfjsLib = require('pdfjs-dist');

var pdfPath = './test.pdf';

// Setting worker path to worker bundle.
pdfjsLib.PDFJS.workerSrc = 'build/pdf.worker.bundle.js';

// It is also possible to disable workers via `PDFJS.disableWorker = true`,
// however that might degrade the UI performance in web browsers.

// Loading a document.
var loadingTask = pdfjsLib.getDocument(pdfPath);
loadingTask.promise.then(function (pdfDocument) {

  var container = document.getElementById("container");
  // Request a first page
  return pdfDocument.getPage(1).then(function (page) {
    // Display page on the existing canvas with 100% scale.
    var scale = 1;
    var viewport = page.getViewport(scale);
    var div = document.createElement("div");

    // Set id attribute with page-#{pdf_page_number} format
    div.setAttribute("id", "page-" + (page.pageIndex + 1));

    // This will keep positions of child elements as per our needs
    div.setAttribute("style", "position: relative");

    // Append div within div#container
    container.appendChild(div);

    // Create a new Canvas element
    var canvas = document.createElement("canvas");

    // Append Canvas within div#page-#{pdf_page_number}
    div.appendChild(canvas);

    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };

    // Render PDF page
    page.render(renderContext).then(function() {
      // Get text-fragments
      return page.getTextContent();
    })
    .then(function(textContent) {
      // Create div which will hold text-fragments
      var textLayerDiv = document.createElement("div");

      // Set it's class to textLayer which have required CSS styles
      textLayerDiv.setAttribute("class", "textLayer");

      // Append newly created div in `div#page-#{pdf_page_number}`
      div.appendChild(textLayerDiv);

      // Create new instance of TextLayerBuilder class
      var textLayer = new TextLayerBuilder({
        textLayerDiv: textLayerDiv,
        pageIndex: page.pageIndex,
        viewport: viewport
      });

      // Set text-fragments
      textLayer.setTextContent(textContent);

      // Render text-fragments
      textLayer.render();
    });
  });
}).catch(function (reason) {
  console.error('Error: ' + reason);
});
