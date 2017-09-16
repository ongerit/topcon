'use strict';

$(document).ready(function() {
    var $component = $('.nyl-grid__two-columns .nyl-grid__col2 .nyl-sidebar-cta-custom');
    var $parentColumn = $('.nyl-grid__two-columns .nyl-grid__col2');
    var $sidebar;

    function initialize() {
        sidebarSetup();
        modalInit();

        // [MD] Ensure sticky is not fired in edit-mode
        if (!$('body').hasClass('edit-mode')) {
            stickyFill();
            $(window).on('resize', stickyFill);
        }
    }

    function sidebarSetup() {
        // if it's a Sidebar, wrap it (mainly for stickyfill)
        $component.addClass('nyl-sidebar-cta-custom--sidebar');
        $parentColumn.wrapInner('<div class="nyl-cta-sidebar"/>');

        // if there's more than one CTA Block in the sidebar
        if ($component.length > 1) {
            $component.addClass('nyl-sidebar-cta-custom--sidebar-2up');

            $('.nyl-sidebar-cta-custom--sidebar-2up').eq(1).addClass('nyl-sidebar-cta-custom--light');

        }
    }

    function modalInit() {
        $component.each(function() {
            var modal;
            var $localizedButton = $(this).find('.nyl-sidebar-cta-custom__button');

            if (!$localizedButton.attr('modal-content-container')) {
                return;
            }

            // [MD] Create new modal
            modal = new NYLModal({
                'type': 'content',
                'contentContainer': $localizedButton.attr('modal-content-container'),
                'buttonTitle': 'Continue Reading'
            });

            // [MD] When CTA is clicked show modal
            $localizedButton.on('click', function(e) {
                modal.create();
                e.preventDefault();
            });
        });
    }

    function stickyFill() {
        $sidebar = $component.closest('.nyl-cta-sidebar');

        if ($parentColumn.length && window.innerWidth >= 960) {
            Stickyfill.add($sidebar[0]);
        }
        else {
            Stickyfill.remove($sidebar[0]);
        }
    }

    // INIT - test to ensure component exists
    if ($component.length) {
        initialize();
    }
});
