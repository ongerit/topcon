'use strict';

$(document).ready(function() {
    var $component = $('.nyl-read-more');

    function initialize() {
        readMoreToggle();
    }

    function readMoreToggle() {
        $component.each(function() {
            var $caret = $(this).find('a.nyl-read-more__caret');
            var $click = $(this).find('a.nyl-read-more__click');
            var that = this;
            var isOpen = false;

            // Enable Stickyfill
            Stickyfill.add($caret.get(0));

            $(this).find('a.nyl-read-more__click, a.nyl-read-more__caret').on('click', function(e) {
                e.preventDefault();

                if (isOpen) {
                    isOpen = false;

                    $(this).find('.click , .caret').hide();
                    $click.html('READ MORE');

                    _anchorOnClose(this);
                }
                else {
                    isOpen = true;

                    $(this).find('.click , .caret').show();
                    $click.html('READ LESS');
                }

                $(that).find('.nyl-read-more__body-expanded').slideToggle('slow');
                $caret.toggleClass('nyl-read-more__caret--expand-state').find('.nyl-icon-caret').toggleClass('nyl-read-more__caret-icon--rotate');
            });
        });
    }

    // Private Method

    function _anchorOnClose(clickedElement){
        var targetY = $(clickedElement).parents('.nyl-read-more').find('.nyl-read-more__body-expanded').offset().top;
        targetY -= $('.nyl-navigation__main').height();
        targetY -= 30;

        $('html, body').animate({
            scrollTop: targetY
        }, 400);
    }

    // INIT
    if ($component.length) {
        initialize();
    }
});
