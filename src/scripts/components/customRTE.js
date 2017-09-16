'use strict';

// This code is used for migrated data
// This will be thrown away once we no longer need migrated page data

// jshint ignore: start

(function () {

    if ($('.content-import .item .toggle-content').length) {
        $('.item .toggle-content').hide()

        // Learn More Toggle
        $('.item .additional-links a').on('click', function (e) {
            e.preventDefault();
            var answer = $(this).parent().next();
            var txt_default = $(this).attr('toggle-default');
            var txt_toggle = $(this).attr('toggle-text');
            $(this).text($(this).text() ===  txt_default ? txt_toggle : txt_default);
            answer.slideToggle();
        })    

        // Caret Toggle
        $('.toggle-container > .caret-toggle').on('click', function (e) {
            e.preventDefault()
            var answer = $(this).find('.toggle-content');
            var caret = $(this).find('.nyl-icon-caret');

            // /link/.exec($(e.target).find('img').attr('src')) !== null || /link/.exec($(e.target).find('img').attr('src')) === undefined ? answer.slideToggle() : null
            if (e.target.target === '_blank') {
                window.open(e.target.href)
            } else {
                answer.slideToggle();
                caret.toggleClass('open-caret');
            }
        })
    }

    if ($('.content-import').length) {

        // handle invalid html
        $('.content-import > ol > li > h4').css('marginTop', '-25px')

        // handle table greater than 100%
        $('.content-import table').toArray().forEach(function(table){
            $(table).width() > $('body').width() ? $(table).width('100%') : null;
        })

        // create caret toggle on certain pages.
        var $selector = $('.nyl-hero__content-area .large-title.nyl-hero__content')
            , arr = [
                'The New York Life Actuarial Program'
                , 'Supplier diversity'
                , 'The potential pitfalls of "buy term and invest the difference."'
                , 'New York Life\'s Summer Actuarial Internship Program'
            ]
        if (arr.indexOf($selector.text().trim()) + 1) {
            var icon = '<span class="nyl-icon-caret"></span>'
            $('.content-import .toggle-container .item').each(function(){
                if ($(this).find('.toggle-content').length) {
                    $(this).css('position','relative').prepend(icon)
                }
            })
        }

        // handle select menu change event
        $('.content-import select').css('opacity', '.3')
        $('.content-import select').on('change', function() {
            $(this).css('opacity', '1')
            window.open('http://www.newyorklife.com' + this.options[this.selectedIndex].value,'_blank')
        })

        $('h1.large-title.nyl-hero__content').addClass('imported-title-width')

        if ($('.content-import ul > strong') !== null) {
            var $affected = $('.content-import ul > strong')

            $affected.toArray().forEach(function(tag){
                $(tag).insertBefore($(tag).parent()).next().css('marginTop', '20px')
            })
        }
    }

    if ($('.customRTE').length){
        // handle CTA Text Links - requires additional markup to display correctly.
        var $ctaLinks = $('span.featured-cta');

        if ($ctaLinks.length){
            $ctaLinks.each(function(){
                var $this = $(this);
                var contents = $this.html();
                $this.parent('a').addClass('featured-cta-anchor');
                $this.html('<span class="featured-cta-text">' + contents + '</span>');
            });
        }
    }

})();

// jshint ignore: end
