'use strict';

$(document).ready(function() {
  var $window = $(window);
  var $component = $('.nyl-filter-drawer');
  var $category = $('.nyl-filter-drawer__categories');
  var $backward = $('.nyl-pagination__backward');
  var $label = $('.nyl-filter-drawer__drawer label');
  var $filterAppliedContainer = $('.nyl-filter-drawer__filters-applied ul');
  var $seeMoreButton= $('.nyl-filter-drawer__more');
  var $clearFilter = $('.filters-clear');

  $clearFilter.on('click', function() {
    _clearFilteredItems();
  });

  function initialize() {
    $window.on('load', function() {
      _activeCategory();
      _addFilterItem();
      _checkForFilterItems();
      _seeMore();
    });
  }

  function _activeCategory() {
    $category.on('click', function() {
      var $this = $(this);
      var fieldsetName = $this[0].innerText.toLocaleLowerCase().split(' ').join('');

      if (fieldsetName != undefined) {
        _showFieldset(fieldsetName);
      }

      _removeActiveState($this);

      $this.addClass('nyl-filter-drawer__categories--active');
      $component.addClass('nyl-filter-drawer__open');
    });
  }

  function _showFieldset(el) {
    var allFieldsets = $('.nyl-filter-drawer__show');
    var $drawer = $('.nyl-filter-drawer__drawer');
    var $fieldset = $('.'+ el);

    if($drawer.hasClass('nyl-filter-drawer__more--show')){


      $drawer.removeClass('nyl-filter-drawer__more--show');
    }

    allFieldsets.each(function() {
      var $this = $(this);
      $this.removeClass('nyl-filter-drawer__show');
    });

    $fieldset.addClass('nyl-filter-drawer__show');

    if($fieldset.children().length > 3) {
      $seeMoreButton.show();
    } else {
      $seeMoreButton.hide();
    }
  }

  function _removeActiveState(el) {


    if (el.hasClass('nyl-filter-drawer__categories--active')) {
        setTimeout(function() {
          el.removeClass('nyl-filter-drawer__categories--active');
          $component.removeClass('nyl-filter-drawer__open');
        }, 10);
      return
    }

    _collapseDrawer();
  }

  function _collapseDrawer(){
    $category.each(function() {
      var $this = $(this);
      $this.removeClass('nyl-filter-drawer__categories--active');
    })
  }

  function _addFilterItem() {

    $label.on('click', function() {
      var $this = $(this);
      var $input = $this.find('input');
      var $span = $this.find('span');
      var inputName = $span.text();
      var inputId = $input.attr('id');

      var insertItem = '<li data-value="' + inputId + '" class="nyl-button nyl-filter-drawer__applied-button nyl-icon-exit">' + inputName + '</li>';

      if ($span.hasClass('nyl-filter-drawer__button--active') || $span.hasClass('nyl-filter-drawer__button--disable')) {
        return;
      }

      $span.addClass('nyl-filter-drawer__button--active');
      $(insertItem).appendTo($filterAppliedContainer);
      _removeFilteredItem();

    })
  }

  function _removeFilteredItem() {
    var $appliedButton = $('.nyl-filter-drawer__applied-button');
    var $appliedButtonLength = $('.nyl-filter-drawer__applied-button').length;

    $appliedButton.last().on('click', function(){
      var $this = $(this);
      var inputId = $this.data().value;
      var $label = $("label[for='"+inputId+"']");
      var $input = $label.find('input');
      var $span = $label.find('span');

      $input.prop('checked', false);
      $span.removeClass('nyl-filter-drawer__button--active').removeClass('nyl-filter-drawer__button--disable');
      $this.remove();

      if($('.nyl-filter-drawer__applied-button').length == 0) {
        $clearFilter.hide();
      }
    })
  };

  function _checkForFilterItems() {

    $('fieldset input:checked').each(function() {
      var $this = $(this).parent();
      var $input = $this.find('input');
      var $span = $this.find('span');
      var inputName = $span.text();
      var inputId = $input.attr('id');

      var insertItem = '<li data-value="' + inputId + '" class="nyl-button nyl-filter-drawer__applied-button nyl-icon-exit">' + inputName + '</li>';

      if ($span.hasClass('nyl-filter-drawer__button--active') || $span.hasClass('nyl-filter-drawer__button--disabled')) {
        return
      }

      $span.addClass('nyl-filter-drawer__button--disable');
      $(insertItem).appendTo($filterAppliedContainer);
      _removeFilteredItem();
      $clearFilter.show();
    })
  }

  function _clearFilteredItems() {
    var $appliedButton = $('.nyl-filter-drawer__applied-button');
    var $appliedButtonLength = $('.nyl-filter-drawer__applied-button');

    $appliedButton.each(function(){
      var $this = $(this);
      var inputId = $this.data().value;
      var $label = $("label[for='"+inputId+"']");
      var $input = $label.find('input');
      var $span = $label.find('span');

      $input.prop('checked', false);
      $span.removeClass('nyl-filter-drawer__button--active').removeClass('nyl-filter-drawer__button--disable');
      $this.remove();
      $clearFilter.hide();
    })
  };

  function _seeMore() {
    var $drawer = $('.nyl-filter-drawer__drawer');

    $seeMoreButton.on('click', function(){

      $drawer.addClass('nyl-filter-drawer__more--show');
      $(this).hide();

    });
  };

  if ($component.length) {
    initialize();
  }

});
