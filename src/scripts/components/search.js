'use strict';

$(document).ready(function() {
	var SERVICE_PATH = NYLApi.getApiPath() + 'search?q=';
	var $body = $('html, body');
	var $component = $('.nyl-search');
	var $queryInput = $component.find('.nyl-search__hero-input');
	var $clearBtn = $component.find('.nyl-search__hero-clear');
	var $submitBtn = $component.find('.nyl-search__hero-button');
	var $resultsContainer = $component.find('.nyl-search__container');

	function initialize() {
		initSearchQuery();
		initResults();
	}

	function initSearchQuery() {
		$queryInput.on('keyup', function(e) {
			if ($(this).val()) {
				$clearBtn.addClass('nyl-search__hero-clear--active');
				$submitBtn.prop('disabled', false);
				return;
			}

			$clearBtn.removeClass('nyl-search__hero-clear--active');
			$submitBtn.prop('disabled', true);
		});

		$clearBtn.on('click', function() {
			$queryInput.val('').focus();
			$clearBtn.removeClass('nyl-search__hero-clear--active');
			$submitBtn.prop('disabled', true);
		});
	}

	function initResults() {
		var queryParams = window.location.search;
		var rawSearchQuery = queryParams.split('&')[0];
		if (rawSearchQuery.length === 0){
			return;
		}
		var searchParamString = rawSearchQuery.split('=')[1];
		var cleanedSearchQuery = decodeURIComponent(searchParamString.replace(/\+/g, ' '));

		if (/query/.exec(window.location.search) && /query/.exec(window.location.search).length) {
			$queryInput.val(cleanedSearchQuery);
			$clearBtn.addClass('nyl-search__hero-clear--active');
			$submitBtn.prop('disabled', false);

			_fetchData(SERVICE_PATH + cleanedSearchQuery);
		}
	}

	function initPagination() {
		var $pagination = $component.find('.nyl-search__pagination');
		var selectedPaginationIndex = $pagination.find('.nyl-search__pagination-list-item--selected').index();

		// Intercept pagination event and make ajax call
		$pagination.find('a').click(function(e) {
			var servicePath = $(this).attr('href');
			_fetchData(servicePath);
            e.preventDefault();
		});

		// Enable mobile navigation
		$pagination.find('.nyl-search__pagination-list-item').each(function() {
			if ($(this).index() > selectedPaginationIndex + 2 || $(this).index() < selectedPaginationIndex) {
				$(this).addClass('nyl-search__pagination-list-item--mobile-hidden');
				return;
			}

			$(this).removeClass('nyl-search__pagination-list-item--mobile-hidden');
		});
	}

	// PRIVATE METHODS

    function _appendResults(searchResults) {
        $resultsContainer.empty();
        $resultsContainer.append(searchResults);

		initPagination();
    }

	function _fetchData(url) {
		$.ajax({
			method: 'GET',
			dataType: 'html',
			url: url,
			success: function(result) {
				var form = $component.find('form')[0];
				_appendResults(result);
				_scrollToTopOfPage();

				// Tealium success event on search form complete
				NYLAnalytics.trackComplete(form);
			},
			error: function(errorResult) {
				console.warn('Failed to get search data from service');
			}
		});
	}

	function _scrollToTopOfPage() {
		$body.animate({scrollTop: 0}, 500);
	}

	// INIT
	if ($component.length) {
		initialize();
	}
});
