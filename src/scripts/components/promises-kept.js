'use strict';

$(document).ready(function() {
	var NAV_HEIGHT = 60;

	var promisesKeptUp;
	var promisesKeptDown;
	var tumblerOne;
	var tumblerTwo;
	var tumblerThree;
	var $component = $('.nyl-promises-kept');
	var $tumblerOne = $component.find('.nyl-promises-kept__fact').eq(0);
	var $tumblerTwo = $component.find('.nyl-promises-kept__fact').eq(1);
	var $tumblerThree = $component.find('.nyl-promises-kept__fact').eq(2);
	var rolodexFiller = {
		'intVals': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
		'alphaVals': ['a', 'c', 'b', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
		'charVals': ['$', '€', '£', '$', '€', '£'],
		'puncVals': ['.', '!', ':', '.', '!', ':'],
		'multiVals': ['yrs', 'hrs', 'min', 'sec']
	};

	function initialize() {
		createRolodex();

		$(window).on('load', configureWaypoints);
		$(window).on('resize', configureWaypoints);
	}

	function createRolodex() {
		// loop over each tumbler
		$component.find('.nyl-promises-kept__fact').each(function() {
			$(this).find('.nyl-promises-kept__tumbler').each(function(){
				var $displayElem = $(this).find('.nyl-promises-kept__tumbler-wrap').children('h3');
				var displayCharType = $(this).find('.nyl-promises-kept__tumbler-wrap').children('h3').attr('tumbler-type');

				_buildRolodex(displayCharType, $displayElem);
			});
		});
	}

	function configureWaypoints() {
		promisesKeptUp = new Waypoint({
			element: $component.find('.nyl-promises-kept__banner').get(0),
			handler: function(direction) {
				if (direction === 'up'){
					$component.find('.nyl-promises-kept__banner-picture').removeClass('nyl-promises-kept__banner-picture--fixed');
				}
				else if (direction === 'down'){
					$component.find('.nyl-promises-kept__banner-picture').addClass('nyl-promises-kept__banner-picture--fixed');
				}
			},
			offset: NAV_HEIGHT
		});

		promisesKeptDown = new Waypoint({
			element: $component.get(0),
			handler: function(direction) {
				if (direction === 'down'){
					$component.find('.nyl-promises-kept__banner-picture').removeClass('nyl-promises-kept__banner-picture--fixed');
				}
			},
			offset: - (($component.height() / 2) - 30)
		});

		// Create waypoints for all tumblers
		tumblerOne = new Waypoint({
			element: $tumblerOne.get(0),
			handler: function(direction) {
				if (direction !== 'down'){
					return;
				}

				$tumblerOne.addClass('nyl-promises-kept__fact--animate');
			},
			offset: 'bottom-in-view'
		});

		tumblerTwo = new Waypoint({
			element: $tumblerTwo.get(0),
			handler: function(direction) {
				if (direction !== 'down'){
					return;
				}

				$tumblerTwo.addClass('nyl-promises-kept__fact--animate');
			},
			offset: 'bottom-in-view'
		});

		tumblerThree = new Waypoint({
			element: $tumblerThree.get(0),
			handler: function(direction) {
				if (direction !== 'down'){
					return;
				}

				$tumblerThree.addClass('nyl-promises-kept__fact--animate');
			},
			offset: 'bottom-in-view'
		});
	}

	// Private Methods

	function _buildRolodex(type, $usersValueDomElem) {
		var domElem;
		var mixedArray;

		// Randomize fillers and construct html elem
		switch(type) {
			case 'integer':
				mixedArray = _shuffle(rolodexFiller.intVals);

				mixedArray.forEach(function(item) {
					domElem = '<h3 class="large-display-numerals--10">' + item + '</h3>';
					$usersValueDomElem.before(domElem);
				});
				break;
			case 'alpha':
				mixedArray = _shuffle(rolodexFiller.alphaVals);

				mixedArray.forEach(function(item) {
					domElem = '<h3 class="large-display-numerals nyl-promises-kept__fact-unit">' + item + '</h3>';
					$usersValueDomElem.before(domElem);
				});
				break;
			case 'char':
				mixedArray = _shuffle(rolodexFiller.charVals);

				mixedArray.forEach(function(item) {
					domElem = '<h3 class="large-display-numerals">' + item + '</h3>';
					$usersValueDomElem.before(domElem);
				});
				break;
			case 'punc':
				mixedArray = _shuffle(rolodexFiller.puncVals);

				mixedArray.forEach(function(item) {
					domElem = '<h3 class="large-display-numerals">' + item + '</h3>';
					$usersValueDomElem.before(domElem);
				});
				break;
			case 'multi':
				mixedArray = _shuffle(rolodexFiller.multiVals);

				mixedArray.forEach(function(item) {
					domElem = '<h3 class="yrs nyl-promises-kept__fact-unit">' + item + '</h3>';
					$usersValueDomElem.before(domElem);
				});
				break;
		}
	}

	function _shuffle(array) {
		var randomIndex;
		var temporaryValue;
		var currentIndex = array.length;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	// INIT - test to ensure component exists
	if($component.length && !$('body').hasClass('edit-mode')) {
		initialize();
	}
});
