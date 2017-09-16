'use strict';

$(document).ready(function() {
    var $component = $('.nyl-static-forms-prospectus-request');
    var validator;
    var modal;

    function initialize() {
        formValidation();
    }

    function formValidation() {
        validator = $component.find('form').validate({
            submitHandler: function(form) {
                var checboxCSV = '';
                var data = $component.find('form').serializeArray();

                // If we have requ_info data doctor the data
                // Create CSV format
                if (_.findIndex(data, function(input) {return input.name === 'requ_info';}) !== -1 ) {
                    _.forEach(data, function(obj) {
                        if (obj.name === 'requ_info') {
                            checboxCSV = checboxCSV + obj.value + ', ';
                        }
                    });
                    // Remove last comma and space
                    checboxCSV = checboxCSV.slice(0, -2);

                    // Removes all requ_info checkbox data
                    data = _.reject(data, function(input) {
                        return input.name === 'requ_info';
                    });

                    // Add new csv formated data to the data array
                    data.push({
                        name: 'requ_info',
                        value: checboxCSV
                    });
                }

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
                zip: {
                    zipcodeUS: true
                },
                email: {
                    required: true,
                    email:true
                }
            }
        });
    }

    // PRIVATE METHODS

    function _postFormData(formData) {
        var postData = {
            component: 'static-forms-prospectus-request',
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
                    _buildModal('static-forms-prospectus-request', 'success');
                    // Tealium success event on form complete
                    var form = $component.find('form')[0];
                    NYLAnalytics.trackComplete(form);
                    return;
                }

                var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('static-forms-prospectus-request', 'error', errorCode);
            },
            error: function(errorResult) {
                console.warn('Failed to post Static Forms Prospectus Request data to service');
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
