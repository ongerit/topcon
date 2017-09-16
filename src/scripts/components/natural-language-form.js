'use strict';

$(document).ready(function() {
    var $component = $('.nyl-natural-language-form');
    var $ageInput = $component.find('.nyl-natural-language-form__age');
    var $wantSelect = $component.find('.nyl-natural-language-form__want');

    function initialize() {
        setDefaultFormValues();
        initFormSubmission();
        enableAgeWatch();
        enableValidation();

        $(window).resize(function() {
            _resizeSelect();
        });
    }

    function enableAgeWatch() {
        $ageInput.keypress(_validateNumber);
        $ageInput.on('keyup', _.debounce(function() {
            if (!_isAgeValid()) {
                $ageInput[0].setCustomValidity($ageInput.attr('title'));
                return;
            }

            $ageInput[0].setCustomValidity('');
        }, 1000));
    }

    function enableValidation() {
        $component.find('form').validate({
            errorClass: 'nyl-form-error--nlf',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').before(error);
            },
        });
    }

    function setDefaultFormValues() {
        var cookieData = NYLCookies.getCookie('natural-language-form');

        if (!_.isEmpty(cookieData)) {
            $ageInput.val(cookieData.age);
            $wantSelect.val(cookieData.want);
        }
        else{
            $ageInput.val(35);
            $ageInput.on('focus', initialAgeInputFocus);
        }

        setTimeout(function(){
            _resizeSelect();
            _resizeSelectOnChange();
        }, 150);
    }

    function initialAgeInputFocus(){
        $ageInput.val('');
        $ageInput.off('focus', initialAgeInputFocus);
    }

    function initFormSubmission() {
        var formData;
        var ageObj;
        var wantObj;
        var cookieData;

        $component.find('form').validate({
            submitHandler: function(form) {
                formData = $component.find('form').serializeArray();
                ageObj = _.find(formData, function(data) { return data.name === 'age'; });
                wantObj = _.find(formData, function(data) { return data.name === 'want'; });
                cookieData = JSON.stringify({'age': _.get(formData[0], 'value'), 'want': _.get(formData[1], 'value')});

                NYLCookies.setCookie('natural-language-form', cookieData, 5);

                // Tealium success event on form validation
                NYLAnalytics.trackComplete(form);

                // Redirect user to service
                window.location.href = NYLApi.getApiPath() + 'natural-language-form?age=' + ageObj.value  + '&want=' + wantObj.value;
            },
            errorClass: 'nyl-form-error--nlf',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
                element.focus(); // prevents the element from losing focus, so hitting backspace doesn't send the user to the previous page
            }
        });
    }

    // PRIVATE METHODS

    function _setSelectSize(select) {
        var selectedWidth;
        var offset = 0;
        var selectedText = $(select).children('option:selected').text();
        var $hiddenSelect = $('<select class="nyl-select nyl-select--primary nyl-select--hidden"><option>' + selectedText + '</option></select>');

        // Chome version 53.0 introduced a new way of handline selects
        // To fix the custom select style we are introducing an offset
        if (/Chrome/i.test(navigator.userAgent)) {
            offset = 15;
        }

        // Add hidden select to page, get width, remove from page
        $hiddenSelect.insertAfter(select);
        selectedWidth = $('.nyl-select--hidden').outerWidth() + offset;
        $('.nyl-select--hidden').remove();

        // Set width of select
        $(select).css({width: selectedWidth});
    }

    function _resizeSelect() {
        $component.find('.nyl-select').each(function(index, value) {
            _setSelectSize(this);
        });
    }

    function _resizeSelectOnChange() {
        $component.find('.nyl-select').change(function() {
            _setSelectSize(this);
        });
    }

    function _isAgeValid() {
        var inputVal = parseInt($ageInput.val());
        var inputMin = parseInt($ageInput.attr('min'));
        var inputMax = parseInt($ageInput.attr('max'));

        // Check validity of input value
        if (inputVal < inputMin || inputVal > inputMax || inputVal === '') {
            return false;
        }

        return true;
    }

    function _validateNumber(event) {
        var key = window.event ? event.keyCode : event.which;

        if (event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 37 || event.keyCode === 39) {
            return true;
        }
        else if ( key < 48 || key > 57 ) {
            return false;
        }
        else {
            return true;
        }
    }

    // INIT
    if ($component.length) {
        initialize();
    }
});
