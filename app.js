/**
 * Created by kristian on 06/06/15.
 */
;(function(document, window, _, PDFJS){
	'use strict';

	var url = './test.pdf';

	var pdfFile,
		pageNum = 1,
		currentPage,
		pageRendering = false,
		pageNumPending = null,
		interaction = document.getElementById('interaction');

	function turnPageRight() {
		if (pageNum >= pdfFile.numPages) {
			return;
		}
		pageNum++;
		queueRenderPage(pageNum);
		interaction.textContent = "right";
	}

	function turnPageLeft() {
		if (pageNum <= 1) {
			return;
		}
		pageNum--;
		queueRenderPage(pageNum);
		interaction.textContent = "left";
	}

	function checkKey(e) {

		e = e || window.event;

		if (e.keyCode == '38') {
			//up
		}
		else if (e.keyCode == '40') {
			//down
		}
		else if (e.keyCode == '37') {
			turnPageLeft();
		}
		else if (e.keyCode == '39') {
			turnPageRight();
		}
	}

	PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
		pdfFile = pdf;
		changePage();
	});

	function queueRenderPage(num) {
		if (pageRendering) {
			pageNumPending = num;
		} else {
			pageNum = num;
			changePage();
		}
	}

	function changePage(){
		pdfFile.getPage(pageNum).then(function(page){
			currentPage = page;
			renderPage();
		});
	}

	function renderPage(){
		pageRendering = true;

		//
		// Prepare canvas using PDF page dimensions
		//
		var canvas = document.getElementById('reader');
		var context = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		var viewport = currentPage.getViewport(canvas.width / currentPage.getViewport(1.0).width);
		canvas.height = viewport.height;

		//
		// Render PDF page into canvas context
		//
		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		var renderTask = currentPage.render(renderContext);

		// Wait for rendering to finish
		renderTask.promise.then(function () {
			pageRendering = false;
			if (pageNumPending !== null) {
				// New page rendering is pending
				renderPage(pageNumPending);
				pageNumPending = null;
			}
		});
	}

	function attachSwipeEvents(){
		interaction.textContent = "Touch";
		document.addEventListener('touchstart', handleTouchStart, false);
		document.addEventListener('touchmove', handleTouchMove, false);

		var xDown = null;
		var yDown = null;

		function handleTouchStart(evt) {
			xDown = evt.touches[0].clientX;
			yDown = evt.touches[0].clientY;
		}

		function handleTouchMove(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}

			var xUp = evt.touches[0].clientX;
			var yUp = evt.touches[0].clientY;

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;

			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
				if ( xDiff > 0 ) {
					turnPageRight();
				} else {
					turnPageLeft();
				}
			} else {
				if ( yDiff > 0 ) {
					/* up swipe */
				} else {
					/* down swipe */
				}
			}
			/* reset values */
			xDown = null;
			yDown = null;
		}
	}

	if(Modernizr.touchevents){
		attachSwipeEvents();
	}

	document.onkeydown = checkKey;
	window.onresize = _.debounce(function(){
		interaction.textContent = "resize";
		renderPage();
	}, 500);

})(document, window, _, PDFJS);