'use strict';

var jQuery = jQuery || {};
var NYL = NYL || {};

(function($, vsc){
    var $component = $('.nyl-static-forms-lost-policy-finder');
    var validator;
    var modal;

    function initialize() {
        initInputMasking();
        linkSegmentedFields();
        formValidation();
    }

    function initInputMasking() {
        $('.zip-mask').mask('99999');
    }

    function linkSegmentedFields(){
        var $dobFields = $component.find('.nyl-static-forms-lost-policy-finder__input--dob-month, .nyl-static-forms-lost-policy-finder__input--dob-day, .nyl-static-forms-lost-policy-finder__input--dob-year');
        vsc.initSegmentedFields($dobFields);

        var $dodFields = $component.find('.nyl-static-forms-lost-policy-finder__input--dod-month, .nyl-static-forms-lost-policy-finder__input--dod-day, .nyl-static-forms-lost-policy-finder__input--dod-year');
        vsc.initSegmentedFields($dodFields);

        var $ssnFields = $component.find('.nyl-static-forms-lost-policy-finder__input--ssn-1, .nyl-static-forms-lost-policy-finder__input--ssn-2, .nyl-static-forms-lost-policy-finder__input--ssn-3');
        vsc.initSegmentedFields($ssnFields);

        var $phoneFields = $component.find('.nyl-static-forms-lost-policy-finder__input--phone-area-code, .nyl-static-forms-lost-policy-finder__input--phone-first-3, .nyl-static-forms-lost-policy-finder__input--phone-last-4');
        vsc.initSegmentedFields($phoneFields);
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
                var fieldName = element.attr('name');
                var segmentArray = ['dobMM', 'dobDD', 'dobYYYY', 'dodMM', 'dodDD', 'dodYYYY', 'ssn1', 'ssn2', 'ssn3', 'contact_phone1', 'contact_phone2', 'contact_phone3' ];

                if ($.inArray(fieldName, segmentArray) !== -1 || element.is(':radio')) {
                    var x = '<span class="nyl-form-error--x"></span>';
                    element.parent().addClass(this.errorClass).wrap('<div class="nyl-form-error-wrapper" />').append(x, error);
                }
                else {
                    element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
                }
            },
            groups: {
                usAddressGroup: 'usaddress',
                dobGroup: 'dobMM dobDD dobYYYY',
                dodGroup: 'dodMM dodDD dodYYYY',
                ssnGroup: 'ssn1 ssn2 ssn3',
                contactPhoneGroup: 'contact_phone1 contact_phone2 contact_phone3'
            },
            rules: {
                dobMM: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2],
                    range: [1, 12]
                },
                dobDD: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2],
                    range: [1, 31]
                },
                dobYYYY: {
                    required: true,
                    integer: true,
                    rangelength: [4, 4],
                    range: [1900, 2016]
                },
                dodMM: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2],
                    range: [1, 12]
                },
                dodDD: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2],
                    range: [1, 31]
                },
                dodYYYY: {
                    required: true,
                    integer: true,
                    rangelength: [4, 4],
                    range: [1900, 2016]
                },
                zip: {
                    zipcodeUS: true
                },
                contact_zip: {
                    zipcodeUS: true
                },
                ssn1: {
                    required: true,
                    integer: true,
                    rangelength: [3, 3]
                },
                ssn2: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2]
                },
                ssn3: {
                    required: true,
                    integer: true,
                    rangelength: [4, 4]
                },
                email: {
                    required: true,
                    // pattern will check for .com or the like, unlike standard email rule
                    pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                },
                contact_phone1:{
                    integer: true,
                    rangelength: [3, 3],
                    range: [0, 999]
                },
                contact_phone2:{
                    integer: true,
                    rangelength: [3, 3],
                    range: [0, 999]
                },
                contact_phone3:{
                    integer: true,
                    rangelength: [4, 4],
                    range: [0, 9999]
                }
            },
            messages:{
                dobMM: {
                    required: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid month',
                },
                dobDD: {
                    required: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid date',
                },
                dobYYYY: {
                    required: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter your birthday in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid year',
                },
                dodMM: {
                    required: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid month',
                },
                dodDD: {
                    required: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid date',
                },
                dodYYYY: {
                    required: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    integer: 'Please enter a number',
                    rangelength: 'Please enter the date of death in the following format: MM/DD/YYYY',
                    range: 'Please enter a valid year',
                },
                zip: 'Please enter a valid zip code',
                contact_zip: 'Please enter a valid zip code',
                ssn1: 'Please enter a valid social security number',
                ssn2: 'Please enter a valid social security number',
                ssn3: 'Please enter a valid social security number',
                contact_phone1: 'Please enter a valid phone number',
                contact_phone2: 'Please enter a valid phone number',
                contact_phone3: 'Please enter a valid phone number'
            }
        });
    }

    // PRIVATE METHODS

    function _postFormData(formData) {
        var postData = {
            component: 'static-forms-lost-policy-finder',
            options: formData
        };

        NYL.forms.createSpinner();

        $.ajax({
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(postData),
            url: NYLApi.getApiPath() + 'contactUs',
            success: function(result) {
                if (result.status === 'OK') {
                    _buildModal('static-forms-lost-policy-finder', 'success');
                    // Tealium success event on form complete
                    var form = $component.find('form')[0];
                    NYLAnalytics.trackComplete(form);
                    return;
                }

                var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('static-forms-lost-policy-finder', 'error', errorCode);
            },
            error: function(errorResult) {
                console.warn('Failed to post Static Forms Lost Policy Finder data to service');
            }
        });
    }

    function _buildModal(formName, status, code) {
        // Check DAM message config and display appropriate messaging
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: NYLApi.getMessagePath() + 'contact-form-messages/_jcr_content.list.json',
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
                    // If message does not exist: success
                    if (_.isEmpty(message)) {
                        for (var j = 0; j < result.length; j++) {
                            if (result[j].value === 'contactForm.general.success') {
                                message = result[j].text;
                            }
                        }
                    }

        			modal = new NYLModal({
        	            'type': 'success',
        	            'message': message,
        	            'buttonTitle': 'Close'
        	        });

        			// Create modal, reset validation, reset form values
        	        modal.create();
        	        validator.resetForm();
                    NYL.forms.destroySpinner();
        	        $component.find('form').get(0).reset();
        			return;
        		}

                // If message does not exist: error
                if (_.isEmpty(message)) {
                    for (var k = 0; k < result.length; k++) {
                        if (result[k].value === 'contactForm.general.error') {
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

    $(document).ready(function() {
        // INIT
        if ($component.length) {
            initialize();
        }
    });
})(jQuery, NYL.vscLegacy);
