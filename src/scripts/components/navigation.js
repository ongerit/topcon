'use strict';

$(document).ready(function() {
	var TRANSITION_TIME = 500; // [IM] must also be changed in navigation.scss
	var SMALL_DESKTOP_WIDTH = 960;

	var $component = $('.nyl-navigation');
	var $window = $(window);
	var $queryInput = $('.nyl-navigation__search-overlay-input');
	var $submitBtn = $('.nyl-navigation__search-overlay-button');
	var $primaryNavLinks = $component.find('.nyl-navigation__item-link--primary');
	var $menuDrawer = $component.next('.nyl-navigation-drawer');
	var position;
	var scroll;
	var direction;
	var iconAnimation;
	var animIconsArr;

    function initialize() {
        initPrimaryNavSubmenu();
        initIconAnimations();
		initSearchQuery();

		// [MD] If component has modifier of edit-mode prevent scroll
		// animations from firing
		if (!$('body').hasClass('edit-mode')) {
			$window.on('scroll', function(e) {
	            position = scroll ? scroll : $window.scrollTop();
	            onScroll(e, position);
	        });
		}

		// Live check for closing the overlay
		$('.nyl-navigation__search-overlay-close').on('click', function() {
			_closeSearchOverlay();

			// Only animate when not in desktop breakpoint
			if (!_isDesktop()) {
				iconAnimation = animIconsArr[1].bodymovinAnim;
				$('.nyl-navigation__item--search > a').removeClass('open');
				iconAnimation.setDirection(-1);
				iconAnimation.play();
			}
		});
    }

	function onScroll(e, position) {
		scroll = $window.scrollTop();
		direction = scroll >= position ? 'down' : 'up';

		if (scroll > 0) {
			$component.addClass('nyl-navigation--docked');
			$('body').addClass('navigation--docked');

			if (direction === 'down') {
				$component.addClass('nyl-navigation--scroll-down nyl-navigation--expose-tier-2-links');

                // closes all desktop sub navs
                $primaryNavLinks.removeClass('nyl-expanded-subnav');
                setTimeout(function() {
                    $primaryNavLinks.children('span').removeClass('nyl-icon-caret').addClass('nyl-icon-caron');
                    $component.removeClass('nyl-navigation__overflow-fix');
                    $component.find('.nyl-navigation-submenu').siblings('.nyl-navigation__item-link').removeClass('nyl-expanded-subnav--expose-links');
                    if ($component.hasClass('nyl-navigation--scroll-down')){
                        $component.addClass('nyl-navigation--hide-tier-1-links');
                    }
                }, TRANSITION_TIME);
			}
			else {
				$component.removeClass('nyl-navigation--scroll-down');
                $component.removeClass('nyl-navigation--hide-tier-1-links');
                setTimeout(function() {
                    if (!$component.hasClass('nyl-navigation--scroll-down')){
                        $component.removeClass('nyl-navigation--expose-tier-2-links');
                    }
                }, TRANSITION_TIME);
			}
		}
		else {
			$component.removeClass('nyl-navigation--docked nyl-navigation--scroll-down nyl-navigation--hide-tier-1-links');
			$('body').removeClass('navigation--docked');
		}
	}

    function initPrimaryNavSubmenu() {
        var $thisLink,
            $primaryNavSubmenu,
            $primaryNavToggle;

        $primaryNavLinks.on('click', function(e) {
            $thisLink = $(this);
            $primaryNavSubmenu = $thisLink.next('.nyl-navigation-submenu');
            $primaryNavToggle = $thisLink.children('span');

            if (!$primaryNavSubmenu.length) {
                return;
            }

            e.preventDefault();

            if (!$thisLink.hasClass('nyl-expanded-subnav')) {
                $component.addClass('nyl-navigation__overflow-fix');
                $thisLink.addClass('nyl-expanded-subnav nyl-expanded-subnav--expose-links');
                $primaryNavToggle.removeClass('nyl-icon-caron').addClass('nyl-icon-caret');
            }
            else {
                $thisLink.removeClass('nyl-expanded-subnav');
                $primaryNavToggle.removeClass('nyl-icon-caret').addClass('nyl-icon-caron');
                setTimeout(function() {
                    // if someone's rapid-clicking, we don't want to accidentally hide links on an open subnav
                    if (!$thisLink.hasClass('nyl-expanded-subnav')) {
                        $component.removeClass('nyl-navigation__overflow-fix');
                        $thisLink.removeClass('nyl-expanded-subnav--expose-links');
                    }
                }, TRANSITION_TIME);
            }
        });
    }

    function initIconAnimations() {
        // animation data is in libs/animations.js
        var elementsArr = Object.keys(nylIconAnimations);
        var $animatedIcons = $('.nyl-anim-icon');
		var $thisIcon;
        var bodymovinAnim;
        var iconName;
		animIconsArr = [];

        // Setup Icons
        for (var i = 0; i < elementsArr.length; i += 1) {
            var params = {
                container: $('.nyl-anim-icon__' + elementsArr[i])[0],
                name: elementsArr[i],
                autoplay: false,
                loop: false,
                animationData: nylIconAnimations[elementsArr[i]],
                renderer: 'svg'
            };

            bodymovinAnim = bodymovin.loadAnimation(params);

            animIconsArr.push({
                bodymovinAnim: bodymovinAnim
            });
        }

        // Click Handler
        $animatedIcons.closest('a').on('click', function(e) {
            $thisIcon = $(this);
            iconName = $thisIcon.find('.nyl-anim-icon').data('name');

			e.preventDefault();

            for (var i = 0; i < animIconsArr.length; i++) {
                animIconsArr.filter(function(el) {
                    if (el.bodymovinAnim.name === iconName) {
                        iconAnimation = el.bodymovinAnim;
                    }
                });
            }


			// User clicked on an already open icon
			if ($thisIcon.hasClass('open')) {
				$thisIcon.removeClass('open');
				iconAnimation.setDirection(-1);
				iconAnimation.play();

				_closeSearchOverlay();
				_closeMobileSubMenu();

				return;
			}

			// Nav is open and user clicked on search
			if (!$thisIcon.hasClass('open') && $('.nyl-navigation__item--menu > a').hasClass('open')) {
				_closeMobileSubMenu();
				_selectAndOpenOverlay('search');

				// Only animate when not in desktop breakpoint
				if (!_isDesktop()) {
					iconAnimation = animIconsArr[0].bodymovinAnim;
					$('.nyl-navigation__item--menu > a').removeClass('open');
					iconAnimation.setDirection(-1);
					iconAnimation.play();
				}

				return;
			}

			// Search is open and user clicked on nav
			if (!$thisIcon.hasClass('open') && $('.nyl-navigation__item--search > a').hasClass('open')) {
				_closeSearchOverlay();
				_selectAndOpenOverlay('menu');

				// Only animate when not in desktop breakpoint
				if (!_isDesktop()) {
					iconAnimation = animIconsArr[1].bodymovinAnim;
					$('.nyl-navigation__item--search > a').removeClass('open');
					iconAnimation.setDirection(-1);
					iconAnimation.play();
				}

				return;
			}

			// OPEN OVERLAY

			// Only animate when not in desktop breakpoint
				if (!_isDesktop()) {
				$thisIcon.addClass('open');
				iconAnimation.setDirection(1);
				iconAnimation.play();
			}

			// Test to see if we clicked on submenu or search and open the respective overlay
			if ($thisIcon.parent().hasClass('nyl-navigation__item--search')) {
				_openSearchOverlay();
			} else if ($thisIcon.parent().hasClass('nyl-navigation__item--menu')) {
				_openMobileSubMenu();
			}
        });
    }

	function initSearchQuery() {
		$queryInput.on('keyup', function(e) {
			if ($(this).val()) {
				$submitBtn.prop('disabled', false);
				return;
			}

			$submitBtn.prop('disabled', true);
		});
	}

	// PRIVATE METHODS

	function _selectAndOpenOverlay(overlayType) {
		if (overlayType === 'menu') {
			iconAnimation = animIconsArr[0].bodymovinAnim;
			$('.nyl-navigation__item--menu > a').addClass('open');
			_openMobileSubMenu();
		} else if (overlayType === 'search') {
			iconAnimation = animIconsArr[1].bodymovinAnim;
			$('.nyl-navigation__item--search > a').addClass('open');
			_openSearchOverlay();
		}

		// Only animate when not in desktop breakpoint
		if (!_isDesktop()) {
			iconAnimation.setDirection(1);
			iconAnimation.play();
		}
	}

	function _openSearchOverlay() {
		$('.nyl-navigation__search-overlay').addClass('nyl-navigation__search-overlay--open');
		$('.nyl-navigation__item--search').addClass('open');

		// Force focus onto search input
		window.setTimeout(function() {
			$('#nyl-navigation__search-overlay-input').focus();
		}, 100);

		_lockPageScroll();
	}

	function _closeSearchOverlay() {
		$('.nyl-navigation__search-overlay').removeClass('nyl-navigation__search-overlay--open');
		$('.nyl-navigation__item--search').removeClass('open');

		// Clear search input
		$queryInput.val('');

		_unlockPageScroll();
	}

	function _openMobileSubMenu() {
		$menuDrawer.addClass('nyl-navigation-drawer--expanded');

		_lockPageScroll();
		bouncefix.add('nyl-navigation-drawer');
	}

	function _closeMobileSubMenu() {
		$menuDrawer.removeClass('nyl-navigation-drawer--expanded');

		_unlockPageScroll();
		bouncefix.remove('nyl-navigation-drawer');
	}

	function _lockPageScroll() {
		$('body').css('overflow', 'hidden');
	}

	function _unlockPageScroll() {
		$('body').css('overflow', 'auto');
	}

	function _isDesktop() {
		return $window.width() >= SMALL_DESKTOP_WIDTH ? true : false;
	}

    // INIT - test to ensure component exists
    if ($component.length) {
        initialize();
    }
});
