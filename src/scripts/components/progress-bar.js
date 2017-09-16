'use strict';

$(document).ready(function() {
    var $window = $(window);
    var $document = $(document);
    var $component = $('.nyl-progress');
    var $progress = $('.nyl-progress__progress');
    var $footnote = $('.nyl-foot-note');
    var $footer = $('.nyl-footer');
    var windowHeight;

    function initialize() {
        $window.on('load', function() {
            _calculateHeight();
            _attachInitialListener();
            _attachScrollListener();
            _attachHeightChangeListener();
        });
    }

    function _attachInitialListener() {
        $window.one('scroll', function() {
            $component.addClass('active');
        });
    }

    function _attachScrollListener() {

        var milestonesTracked = [{'milestone': 0.25, 'tracked':false},
                                 {'milestone': 0.5, 'tracked':false},
                                 {'milestone': 0.75, 'tracked':false},
                                 {'milestone': 1, 'tracked':false}];



        $window.on('scroll', function() {
            var scrollPercent = Math.floor((window.pageYOffset / windowHeight) * 100) + '%';
            $progress.css({'width': scrollPercent});

            for (var i = milestonesTracked.length - 1; i >= 0; i--) {
                var milestone = milestonesTracked[i].milestone;
                var tracked = milestonesTracked[i].tracked;

                if ((window.pageYOffset / windowHeight) >= milestone &&  !tracked) {
                    this.NYLAnalytics.trackScrollMilestone(milestone);
                    milestonesTracked[i].tracked = true;
                }
            }
        });
    }

    function _calculateHeight() {
        windowHeight = $document.height() - $window.height();
        if ($footnote.length) {
            windowHeight -= $footnote.height();
        }
        if ($footer.length) {
            windowHeight -= $footer.height();
        }
    }

    function _recalculateHeight() {
        _calculateHeight();
        $window.trigger('scroll');
    }

    function _attachHeightChangeListener() {
        _onElementHeightChange(document.body, function(){
            _recalculateHeight();
        });
    }

    function _onElementHeightChange(elm, callback){
        var lastHeight = elm.clientHeight, newHeight;
        (function run(){
            newHeight = elm.clientHeight;
            if( lastHeight !== newHeight ) {
                callback();
            }
            lastHeight = newHeight;

            if( elm.onElementHeightChangeTimer ) {
                clearTimeout(elm.onElementHeightChangeTimer);
            }

            elm.onElementHeightChangeTimer = setTimeout(run, 200);
        })();
    }

    if($component.length) {
        initialize();
    }
});

