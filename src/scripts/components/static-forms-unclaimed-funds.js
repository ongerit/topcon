'use strict';

$(document).ready(function() {
    var $component = $('.nyl-static-forms-unclaimed-funds');
    var stateRedirect = $component.find('.nyl-static-forms-unclaimed-funds__state-redirect').get(0);
    var validator;
    var modal;

    function initialize() {
        formValidation();
        initInputMasking();
        initStateRedirect(stateRedirect, $component);
    }

    function formValidation() {
        validator = $component.find('form').validate({
            submitHandler: function(form) {
                var data = $component.find('form').serializeArray();
                _postFormData(data);
            },
            onfocusout: function(element) {
                $(element).valid();
            },
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
            },
            rules: {
                lastName: {
                    required: {
                        depends: function() {
                            return !_areAtLeastTwoFieldsFilledIn();
                        }
                    }
                },
                city: {
                    required: {
                        depends: function() {
                            return (!_areAtLeastTwoFieldsFilledIn() && !$('.nyl-static-forms-unclaimed-funds__last-name').val()) ? true : false;
                        }
                    }
                },
                zip: {
                    required: {
                        depends: function() {
                            return (!_areAtLeastTwoFieldsFilledIn() && !$('.nyl-static-forms-unclaimed-funds__last-name').val()) ? true : false;
                        }
                    }
                },
                state: {
                    required: {
                        depends: function() {
                            return (!_areAtLeastTwoFieldsFilledIn() && !$('.nyl-static-forms-unclaimed-funds__last-name').val()) ? true : false;
                        }
                    }
                }
            },
            messages: {
                lastName: {
                    required: 'Last name or a combination of city, state, and or zip is required'
                },
                city: {
                    required: 'Last name or a combination of city, state, and or zip is required'
                },
                state: {
                    required: 'Last name or a combination of city, state, and or zip is required'
                },
                zip: {
                    required: 'Last name or a combination of city, state, and or zip is required'
                }
            }
        });

        _checkAndRevalidateInputFields();
    }

    function initInputMasking() {
        $('.nyl-static-forms-unclaimed-funds__zip').mask('99999');
    }

    function initStateRedirect(select, $component) {
        var $select = $(select);

        $select.change(function(e) {
            var $this = $(this);
            var dest = $this.val();

            $('.nyl-static-forms-unclaimed-funds__state-redirect-link-wrapper').remove();

            if (dest === 'default'){
                return;
            }

            window.open( dest, '_blank');

            var markup = [
                '<div class="nyl-static-forms-unclaimed-funds__state-redirect-link-wrapper">',
                '<p class="nyl-static-forms-unclaimed-funds__state-redirect-link-label small-description">Your state\'s website should have opened up in a new tab or window. If it hasn\'t, you can click the link below to go there manually.</p>',
                '<a class="nyl-static-forms-unclaimed-funds__state-redirect-link nyl-arrow-wrap" href="' + dest + '" target="_blank">Go to state website',
                '<span class="nyl-icon-arrow-short-right"></span>',
                '</a>',
                '</div>'
            ];

            $component.append( markup.join('\r\n') );
        });
    }

    // PRIVATE METHODS

    function _postFormData(formData) {
        NYL.forms.createSpinner();
        $.ajax({
            method: 'GET',
            dataType: 'json',
            data: formData,
			traditional: true,
            url: NYLApi.getApiPath() + 'unclaimedFunds',
            success: function(result) {
                if (result.status === 'OK') {
                    // Tealium success event on form complete
                    var form = $component.find('form')[0];
                    NYLAnalytics.trackComplete(form);
                    $component.prepend('<h1 class="nyl-static-forms-unclaimed-funds__header nyl-static-forms-unclaimed-funds__header--list">Unclaimed Funds Finder Success</h1>');
                    _buildPersonList(result.data);
                    NYL.forms.destroySpinner(true);
                    // Scroll to where the results are
                    var targetY = $('.nyl-static-forms-unclaimed-funds__header').offset().top;
                    targetY -= 30;

                    $('html, body').animate({
                        scrollTop: targetY
                    }, 400);
                    return;
                }

                var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('static-forms-unclaimed-funds', 'error', errorCode);
            },
            error: function(errorResult) {
                console.warn('Failed to post Static Forms Unclaimed Funds data to service');
            }
        });
    }

    function _buildModal(formName, status, code) {
        // Check DAM message config and display appropriate messaging
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: NYLApi.getMessagePath() + 'funds-service-messages/_jcr_content.list.json',
            success: function(result) {
                var message;

                // Set message based on error code
                if (code) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].value === code) {
                            message = result[i].text;
                        }
                    }
                }

                if (status === 'success') {
                    NYL.forms.destroySpinner();
                    return;
                }

                // If message does not exist: error
                if (_.isEmpty(message)) {
                    for (var k = 0; k < result.length; k++) {
                        if (result[k].value === 'unclaimedFundsRequest.general.error') {
                            message = result[k].text;
                        }
                    }
                }

                modal = new NYLModal({
                    'type': 'error',
                    'message': message,
                    'buttonTitle': 'Close'
                });
                modal.create();
                NYL.forms.destroySpinner();
            },
            error: function(errorResult) {
                console.warn('Failed to get messages from json configuration file');
            }
        });
    }

    function _buildPersonList(people) {
        // Remove form
        $component.find('.nyl-static-forms-unclaimed-funds__form').remove();

        if (people.length) {
            people.forEach(function(person) {
                var personDisplay = '<p class="nyl-static-forms-unclaimed-funds__list-item">' + _.get(person, 'fullName') + ' ' + _.get(person, 'address') + ' ' + _.get(person, 'city') + ' ' + _.get(person, 'state') + ' ' + _.get(person, 'zip') + '</p>';
                $component.find('.nyl-static-forms-unclaimed-funds__header--list').after(personDisplay);
            });

            return;
        }

        $component.find('.nyl-static-forms-unclaimed-funds__header--list').after('<p class="nyl-static-forms-unclaimed-funds__list-item">No results found</p>');
    }

    function _areAtLeastTwoFieldsFilledIn() {
        var $inputs = $('.nyl-static-forms-unclaimed-funds__secondary');
        var areFieldsFilledIn = true;
        var errorCount = 0;

        $inputs.each(function(index) {
            if (!$(this).val()) {
                errorCount++;
            }

            if (errorCount >= 2 && ($inputs.length - 1) === index) {
                areFieldsFilledIn = false;
            }
        });

        return areFieldsFilledIn;
    }

    function _checkAndRevalidateInputFields() {
        $('.nyl-static-forms-unclaimed-funds__input, .nyl-static-forms-unclaimed-funds__select').change(function() {
            validator.form();
        });
    }

    // INIT
    if ($component.length) {
        initialize();
    }
});
