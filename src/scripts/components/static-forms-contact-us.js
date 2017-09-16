'use strict';

$(document).ready(function() {
    var $component = $('.nyl-static-forms-contact-us');
    var validator;
    var modal;

    function initialize() {
        formValidation();
        initInputMasking();
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
                 email: {
                     email: true
                 }
             }
        });
    }

    function initInputMasking() {
        $('#phoneNumber').mask('999-999-9999');
        $('#birthDate').mask('99-99-9999');
    }

    // PRIVATE METHODS

    function _postFormData(formData) {
        var postData = {
            component: 'static-forms-contact-us',
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
                    _buildModal('static-forms-contact-us', 'success');
                    // Tealium success event on form complete
                    var form = $component.find('form')[0];
                    NYLAnalytics.trackComplete(form);
                    return;
                }

                var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('static-forms-contact-us', 'error', errorCode);
            },
            error: function(errorResult) {
                console.warn('Failed to post Static Forms Contact Us data to service');
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

    // INIT
    if ($component.length) {
        initialize();
    }
});
