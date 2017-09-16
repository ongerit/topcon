'use strict';

$(document).ready(function() {
	var $component = $('.nyl-newsroom-hero');

	function initialize() {
		setTimeout(addLoadedClassAnimationHook, 300);
	}

	function addLoadedClassAnimationHook() {
		var $body = $('body');
		// adding this to the body because, on the home page, this triggers animations elsewhere.
		$body.addClass('nyl-hero--loaded');
	}

	// INIT - test to ensure component exists
	if ($component.length) {
		initialize();
	}
});
