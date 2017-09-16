'use strict';

$(document).ready(function() {
  var $window = $(window);
  var $component = $('.nyl-sub-navigation');
  var $arrow = $('.nyl-sub-navigation__arrow');

  function initialize() {
    $window.on('load', function() {
      _loadMoreSubLinks()
    });
  }

  function  _loadMoreSubLinks(){
    $arrow.on('click', function(){

      if($component.hasClass('nyl-sub-navigation--toggle')){
        $component.removeClass('nyl-sub-navigation--toggle');
        return
      }

      $component.addClass('nyl-sub-navigation--toggle');
    });
  };

  if ($component.length) {
    initialize();
  }

});
