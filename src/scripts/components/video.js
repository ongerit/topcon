'use strict';

$(document).ready(function() {
    var $components = $('.nyl-video:not(.loaded)');

    // INIT - test to ensure component exists
    if ($components.length) {
        $components.each(function(index) {
            var videoComponent = new NYLVideo({
                $component: $(this),
                type: $(this).data('type'),
                index: index
            });
            videoComponent.initialize();
        });
    }
});

