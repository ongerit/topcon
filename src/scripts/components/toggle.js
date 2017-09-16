'use strict';

$(document).ready(function() {
    var $component = $('.nyl-toggle');

    function initialize() {
        enableToggle();
    }

    function enableToggle() {
        $component.each(function() {
            $(this).on('click', '.nyl-toggle__title', function() {
                $(this).toggleClass('nyl-toggle--open').next('.nyl-toggle__hideShow').slideToggle();
            });
        });
    }

    // INIT
	if ($component.length) {
		initialize();
	}
});
