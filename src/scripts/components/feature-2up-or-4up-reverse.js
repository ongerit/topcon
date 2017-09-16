'use strict';

$(document).ready(function() {
	var $window = $(window);
	var $component = $('.nyl-feature-2up-or-4up-reverse');
	var parallax;

	function initialize() {
		parallax = new NYLParallax({
			component: '.nyl-feature-2up-or-4up-reverse',
			imageToParallax: '.nyl-feature-2up-or-4up-reverse__picture',
			scrollRatio: 5
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
