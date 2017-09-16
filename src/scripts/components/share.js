'use strict';

$(document).ready(function() {
    var $components = $('.nyl-share:not(.loaded)');

    // INIT - test to ensure component exists
    if ($components.length) {
        $components.each(function(index) {
            var shareComponent = new NYLShare({
                $component: $(this),
                type: $(this).data('type'),
                shareUrl: $(this).data('share-url'),
                shareTitle: $(this).data('share-title')
            });
            shareComponent.initialize();
        });
    }
});


