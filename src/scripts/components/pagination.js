'use strict';

$(document).ready(function() {
    var $window = $(window);
    var $component = $('.nyl-pagination');
    var $forward= $('.nyl-pagination__forward');
    var $backward = $('.nyl-pagination__backward');

    function initialize() {
        $window.on('load', function() {
            _activePage();
        });
    }

    function _removeActiveState() {
      var selected = $component.find('.nyl-pagination__active');
      selected.removeClass('nyl-pagination__active')
    }

    function _activePage() {
      var page = $component.find('li');

      page.on('click', function(){
        var $this = $(this);
        _removeActiveState();
        $this.addClass('nyl-pagination__active');
      })
    }

    if($component.length) {
        initialize();
    }
});
