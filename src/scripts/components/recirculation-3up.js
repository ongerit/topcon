'use strict';

$(document).ready(function() {
	var $component = $('.nyl-recirculation');

	function initialize() {
        recirc3Up();
    }

	function recirc3Up() {
		$component.each(function() {
			var $that = $(this);
			var $contentWrapper = $that.find('.nyl-recirculation__wrap');
			var tag = $that.attr('data-tag');

			_truncateTitles();

			// Get article content
			if (!tag) {
				return;
			}

			$.ajax({
				method: 'GET',
				dataType: 'json',
				url: NYLApi.getApiPath() + 'recirculation-model?tag=' + tag + '&currentId=currentPage&count=3',
				success: function(result) {
					if (result.status !== 'OK') {
						console.warn('Failed to get Recirculation 3up data from service');
						return;
					}

					_buildContent(result.data, $that, $contentWrapper);
				},
				error: function(errorResult) {
					console.warn('Failed to get Recirculation 3up data from service');
				}
			});
		});

		// PRIVATE METHODS

		function _truncateTitles() {
			// Look for attr data-truncate
			$('[data-truncate]').each(function() {
				var originalTitle = $(this).text();
				var titleCharacterLength = originalTitle.length;
				var truncationLimit = $(this).attr('data-truncate');
				var truncatedTitle;

				if (titleCharacterLength >= truncationLimit) {
					truncatedTitle = originalTitle.substring(0, truncationLimit) + '...';

					$(this).text(truncatedTitle);

					return;
				}

				$(this).text(originalTitle);
			});
		}

		function _buildContent(content, component, contentWrapper) {
			var isImageryUsed = true;

			// Test if every article has isImagery
			content.forEach(function(article) {
				if (article.imagePaths.length === 0) {
					isImageryUsed = false;
					component.addClass('nyl-recirculation--no-imagery');
				}
			});

			// Append new content to DOM
			for (var i = 0; i < content.length; i++) {
				var articleComponent;

				if (isImageryUsed) {
					articleComponent = '<a href="' + content[i].url + '" title="' + content[i].title + '" class="nyl-recirculation__wrap__tout" data-track-click="true">' +
					'<p class="nyl-recirculation__wrap__tout-description" data-truncate="65">' + content[i].title + '</p>' +
					'<picture>' +
					'<source srcset="' + content[i].imagePaths[0].fulldesktop + ' 1x, ' + content[i].imagePaths[0].fulldesktop2x + ' 2x" media="(min-width: 1280px)">' +
					'<source srcset="' + content[i].imagePaths[0].smalldesktop + ' 1x, ' + content[i].imagePaths[0].smalldesktop2x + ' 2x" media="(min-width: 960px)">' +
					'<source srcset="' + content[i].imagePaths[0].tablet + ' 1x,' + content[i].imagePaths[0].tablet2x + ' 2x" media="(min-width: 540px)">' +
					'<img srcset="' + content[i].imagePaths[0].mobile + ' 1x, ' + content[i].imagePaths[0].mobile2x + ' 2x" alt="Recirculation Image">' +
					'</picture>';
				}
				else {
					articleComponent = '<a href="' + content[i].url + '" title="' + content[i].title + '" class="nyl-recirculation__wrap__tout" data-track-click="true"><p class="nyl-recirculation__wrap__tout-description" data-truncate="65">' + content[i].title + '</p></a>';
				}

				contentWrapper.append(articleComponent);
				_truncateTitles();
			}
		}
	}

	// INIT - test to ensure component exists
	if ($component.length) {
		initialize();
	}
});
