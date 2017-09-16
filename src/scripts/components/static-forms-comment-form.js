'use strict';

var jQuery = jQuery || {};
var NYL = NYL || {};

(function($, vsc){
    var validator;
    var initSegmentedFields = vsc.initSegmentedFields;

    function initialize($component){
        var $checkPolicyForm = $component.find('.nyl-form-comment-form__form--check-policy');
        var $commentForm = $component.find('.nyl-form-comment-form__form');

        initCheckPolicyForm($checkPolicyForm);
        initForm($commentForm);

        $component.find('a.nyl-form-comment-form__backtoform').click(vsc.showFullForm);
    }

    function changeUSorOther(event){
        var $target = $(event.target);
        var $section = $target.closest('.nyl-form-comment-form__fieldset--personal-info');

        if ($target.val().toLowerCase() === 'other'){
            $section.find('.nyl-form-comment-form__fieldset--other-country').show();
            $section.find('.nyl-form-comment-form__fieldset--united-states').hide();
        }
        else {
            $section.find('.nyl-form-comment-form__fieldset--other-country').hide();
            $section.find('.nyl-form-comment-form__fieldset--united-states').show();
        }
    }

    function initCheckPolicyForm($form){
        // fires getPolicy on successful validation
        var validateRules = {
            submitHandler: vsc.getPolicy,
            onfocusout: function(element) {
                $(element).valid();
            },
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
            },
            rules: {
                check_policy1: {
                    required: true,
                    pattern: /^[a-zA-Z0-9]+$/,
                    minlength: 8
                },
                check_policy2: {
                    pattern: /^[a-zA-Z0-9]+$/,
                    minlength: 8
                },
                check_policy3: {
                    pattern: /^[a-zA-Z0-9]+$/,
                    minlength: 8
                },
            },
            messages: {
                check_policy1: {
                    required: 'Enter a policy number, or if you do not have one, fill out the rest of the form below.',
                    minlength: 'Please enter a valid policy number of at least 8 characters',
                    pattern: 'Policy numbers do not contain symbols and should contain at least 8 characters, please re-enter a policy number containing numbers or a combination of letters and numbers containing at least 8 characters.'
                },
                check_policy2: {
                    minlength: 'Please enter a valid policy number of at least 8 characters',
                    pattern: 'Policy numbers do not contain symbols and should contain at least 8 characters, please re-enter a policy number containing numbers or a combination of letters and numbers containing at least 8 characters.'
                },
                check_policy3: {
                    minlength: 'Please enter a valid policy number of at least 8 characters',
                    pattern: 'Policy numbers do not contain symbols and should contain at least 8 characters, please re-enter a policy number containing numbers or a combination of letters and numbers containing at least 8 characters.'
                },
            }
        };

        $form.validate(validateRules);
    }

    function initForm($form){

        // Set up segmented fields

        var $personalInfoSection = $form.find('.nyl-form-comment-form__fieldset--personal-info');

        var $dobFields = $form.find('.nyl-form-comment-form__input--dob-month, .nyl-form-comment-form__input--dob-day, .nyl-form-comment-form__input--dob-year');
        initSegmentedFields($dobFields);

        var $ssnFields = $form.find('.nyl-form-comment-form__input--ssn-1, .nyl-form-comment-form__input--ssn-2, .nyl-form-comment-form__input--ssn-3');
        initSegmentedFields($ssnFields);

        var $zipFields = $personalInfoSection.find('.nyl-form-comment-form__input--zip, .nyl-form-comment-form__input--zip-ext');
        initSegmentedFields($zipFields);

        var $phoneFields = $personalInfoSection.find('.nyl-form-comment-form__input--phone-area-code, .nyl-form-comment-form__input--phone-first-3, .nyl-form-comment-form__input--phone-last-4');
        initSegmentedFields($phoneFields);

        // Set up conditional sections

        $form.find('select[name="state"], select[name="change_state"]').change(changeUSorOther);

        var validationRules = {
            submitHandler: processForm,
            onfocusout: function(element) {
                $(element).valid();
            },
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                var fieldName = element.attr('name');
                var segmentArray = ['dobMM', 'dobDD', 'dobYYYY', 'SSN1', 'SSN2', 'SSN3', 'phAreaCode', 'phPrefix', 'phNumber', 'newPhAreaCode', 'newPhPrefix', 'newPhNum', 'newFaxAreaCode', 'newFaxPrefix', 'newFaxNum', 'zip_first', 'zip_ext', 'change_zip_first', 'change_zip_ext'];
                if ( $.inArray(fieldName, segmentArray) !== -1 || element.is(':radio') ){
                    var x = '<span class="nyl-form-error--x"></span>';
                    element.parent().addClass(this.errorClass).wrap('<div class="nyl-form-error-wrapper" />').append(x, error);
                }
                else {
                    element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
                }
            },
            rules: {
                first_name: {
                    required: true
                },
                last_name: {
                    required: true
                },
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
                SSN1: {
                    required: true,
                    integer: true,
                    rangelength: [3, 3]
                },
                SSN2: {
                    required: true,
                    integer: true,
                    rangelength: [2, 2]
                },
                SSN3: {
                    required: true,
                    integer: true,
                    rangelength: [4, 4]
                },
                email: {
                    required: true,
                    // pattern will check for .com or the like, unlike standard email rule
                    pattern: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                },
                address1: {
                    required: true
                },
                city: {
                    required: true
                },
                state: {
                    required: true
                },
                zip_first: {
                    required: true,
                    integer: true,
                    rangelength: [5, 5]
                },
                zip_ext: {
                    integer: true,
                    rangelength: [4, 4]
                },
                phAreaCode:{
                    integer: true,
                    rangelength: [3, 3],
                    range:[0, 999]
                },
                phPrefix:{
                    integer: true,
                    rangelength: [3, 3],
                    range:[0, 999]
                },
                phPhNum:{
                    integer: true,
                    rangelength: [4, 4],
                    range:[0, 9999]
                }
            },
            groups: {
                dob: 'dobMM dobDD dobYYYY',
                ssn: 'SSN1 SSN2 SSN3',
                phone: 'phAreaCode phPrefix phNumber',
                zip: 'zip_first zip_ext',
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
                SSN1: 'Please enter a valid social security number',
                SSN2: 'Please enter a valid social security number',
                SSN3: 'Please enter a valid social security number',
                zip_first: 'Please enter a valid zip code',
                zip_ext: 'Zip extensions should be four digits',
                phAreaCode: 'Please enter a valid phone number',
                phPrefix: 'Please enter a valid phone number',
                phNumber: 'Please enter a valid phone number'
            }
        };

        validator = $form.validate(validationRules);
    }

    function processForm(form){
        form = vsc.processFormData(form);
        _postFormData(form);
    }

    function _postFormData(form) {
        var $form = $(form);
        var formData = $form.serializeArray();
        var postData = {
            component: 'static-forms-comment-form',
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
                    _buildModal('static-forms-comment-form', 'success', false, $form);
                    // Tealium success event on form complete
                    NYLAnalytics.trackComplete(form);
                    return;
                }

                var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('static-forms-comment-form', 'error', errorCode, $form);
            },
            error: function(errorResult) {
                console.warn('Failed to post Static Forms Comment Form data to service');
            }
        });
    }

    function _buildModal(formName, status, code, $form) {
        // Check DAM message config and display appropriate messaging
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: NYLApi.getMessagePath() + 'contact-form-messages/_jcr_content.list.json',
            success: function(result) {
                var message;
                var modal;

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
                    $form.get(0).reset();
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

    $(document).ready(function(){

        var $component = $('.nyl-form-comment-form');

        if ($component.length > 0){
            initialize($component);
        }

    });

})(jQuery, NYL.vscLegacy);
