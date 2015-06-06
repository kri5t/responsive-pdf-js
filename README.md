# responsive-pdf-js
A responsive implementation of the pdf.js library

This is an example of how to implement a responsive version of the [pdf.js](https://mozilla.github.io/pdf.js/) framework into your own page.

This example uses the arrow keys to navigate the pdf. If you are on a touch device [modernizr](http://modernizr.com/) is used to check for available touch events and if present hooks them up as navigation.

I use debounce from [lodash](https://lodash.com/) to make the resizing more friendly on the CPU.

The yellow box in the up right corner shows the interactions that is happening: right-, left-navigation and resizing.

The pdf used as an example is a printed PDF from this page: [jstherightway](http://jstherightway.org/)
