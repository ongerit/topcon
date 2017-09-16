'use strict';

$(document).ready(function() {
	var $window = $(window);
	var $component = $('.nyl-breaker');
	var parallax;

	function initialize() {
		parallax = new NYLParallax({
			component: '.nyl-breaker',
			imageToParallax: '.nyl-breaker__picture',
			scrollRatio: 3
		});

		// Create parallax effect
		$window.on('load', function() {
			parallax.create();
		});
	}

	// INIT - test to ensure component exists
	if($component.length && !$('body').hasClass('edit-mode')) {
		initialize();
	}
});
