'use strict';

$(document).ready(function() {
	var $component;
	var $formInstance;
	var modal;
	var validator;
	var formId;
	var redirectURL;
	var initCount = 0;


	function initialize() {
		addCustomValidationMethods();
		getFormData();
		initInputMasking();
	}

	function addCustomValidationMethods() {
		var fromDate = '01-01-1901';
		var datetime = new Date();
		var month = datetime.getMonth() + 1;
		var day = datetime.getDate();
		var formattedDate = (month < 10 ? '0' : '') + month +
							'-' + (day < 10 ? '0' : '') + day +
							'-' + datetime.getFullYear();

		// Ensure date falls within specified range
		$.validator.addMethod('isDateValid', function(value, element, params) {
		    var splitFromDate = fromDate.split('-');
			var splitToDate = formattedDate.split('-');
			var splitCheckDate = value.split('-');
			var from = new Date(splitFromDate[2], parseInt(splitFromDate[1])-1, splitFromDate[0]);  // -1 because months are from 0 to 11
			var to = new Date(splitToDate[2], parseInt(splitToDate[1])-1, splitToDate[0]);
			var check = new Date(splitCheckDate[2], parseInt(splitCheckDate[1])-1, splitCheckDate[0]);

			// If value is empty allow it to pass
			if (_.isEmpty(value)) {
				return true;
			}

			return (check >= from && check <= to);
		}, 'You must enter a valid Date of Birth in the format \'mm-dd-yyyy\' between \'01-01-1901\' and \'' + formattedDate + '\'');
	}

	function getFormData() {
		$.ajax({
			method: 'GET',
			dataType: 'json',
			url: NYLApi.getApiPath() + 'leadForm?cellTrackerId=' + formId,
			success: function(result) {
				var decodedFormData;
				var marketerNumber;

				if (result.status !== 'OK') {
					console.warn('Failed to get Contact An Agent form from service');
					return;
				}

				// Add form to page
				decodedFormData = atob(result.data);
				_addFormToPage(decodedFormData);
				$component.addClass('nyl-contact-an-agent--loaded');

				// Check for existence of marketing number and fill in hidden input
				marketerNumber = NYLCookies.getCookie('marketerNumber');

				if (!_.isEmpty(marketerNumber)) {
					$('input[name="marketerNumber"]').val(marketerNumber);
				}

				// [MD] 09-14-2016 Hack: to remove HTML5 validation
				// Without the input pattern regex overrides our custom isDateValid rule
				$('#birthDate').attr('title', '');
				$('#birthDate').attr('pattern', '');
    		},
			error: function(errorResult) {
				console.warn('Failed to get Contact An Agent form from service');
			}
		});
	}

	function formValidation() {
        validator = $formInstance.find('form').validate({
			submitHandler: function(form) {
                var data = $formInstance.find('form').serializeArray();
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
                emailAddress: {
                    email: true
                },
				phoneNumber: {
                    phoneUS: true
                },
				birthDate: {
					isDateValid: true
				}
            }
        });
    }

	function initInputMasking() {
		$('.dob_mask').mask('99-99-9999');
		$('.dob_mask_slashes').mask('99/99/9999');
		$('.phone_mask').mask('999-999-9999');
		$('.ss_mask').mask('999-99-9999');
		$('.input_zip').mask('99999');
    }

	// PRIVATE METHODS

	function _addFormToPage(form) {
		$formInstance.append(form);

		// This fires after ajax form return
		formValidation();

		NYLAnalytics.bindGlobalFormEvents();
	}

	function _postFormData(formData) {
        NYL.forms.createSpinner();
        $.ajax({
            method: 'POST',
            dataType: 'json',
            data: formData,
			traditional: true,
            url: NYLApi.getApiPath() + 'lead',
            success: function(result) {
                if (result.status === 'OK') {
					/*
					* [NMM] Tealium success event here.
					* Params to pass: result.data.leadId | result.data.leadId
					* https://codeandtheory.atlassian.net/wiki/pages/viewpage.action?pageId=66715864
					*/

					// Check if we should redirect the user vs. show modal
					if (_.get(result, 'data.direct')) {

						//[NMM] Tealium success event for redirect to express
						if (typeof utag !== 'undefined') {
							utag.link({'event_name': 'milestone',
									   'user_source_code': result.data.sourceCode,
									   'user_transaction_id': result.data.leadId,
									   'conversion_flow_type': 'agent-lead',
	                                   'conversion_flow_name': 'contact-an-agent',
									   'conversion_flow_milestone': 'redirect-to-express'});
						}

						// redirect to express
						window.location.assign(redirectURL + '?LeadID=' + _.get(result, 'data.leadId'));
					}
					else {

						// [NMM] Tealium success event for lead form complete
						if (typeof utag !== 'undefined') {
							utag.link({'event_name': 'milestone',
									   'user_source_code': result.data.sourceCode,
									   'user_transaction_id': result.data.leadId,
									   'conversion_flow_type': 'agent-lead',
	                                   'conversion_flow_name': 'contact-an-agent',
									   'conversion_flow_milestone': 'lead-form-complete'});
						}

						// build modal
						_buildModal('contact-an-agent', 'success', _.get(result, 'data.confirmationPageText', null), 'Continue Reading');
					}

                    return;
                }

				var errorCode = _.get(_.head(result.apiErrorList), 'code');
                _buildModal('contact-an-agent', 'error', errorCode, 'Close');
            },
            error: function(errorResult) {
                console.warn('Failed to post Contact An Agent form data to service');
            }
        });
    }

	function _buildModal(formName, status, msgCode, buttonTitle) {
		// Use the message passed through via the endpoint
		if (status === 'success' && msgCode !== 'null' && !_.isNull(msgCode)) {
			modal = new NYLModal({
	            'type': 'success',
	            'message': msgCode,
	            'buttonTitle': buttonTitle
	        });

			// Create modal, reset validation, reset form values
	        modal.create();
	        validator.resetForm();
            NYL.forms.destroySpinner();
	        $formInstance.find('form').get(0).reset();
			return;
		}

		// Check DAM message config and display appropriate messaging
        $.ajax({
            method: 'GET',
            dataType: 'json',
            url: NYLApi.getMessagePath() + 'leads-service-messages/_jcr_content.list.json',
            success: function(result) {
                var message;

				// Set message based on code
                if (msgCode) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].value === msgCode) {
                            message = result[i].text;
                        }
                    }
                }

				if (status === 'success') {
					// If message does not exist: success
	                if (_.isEmpty(message)) {
	                    for (var k = 0; k < result.length; k++) {
	                        if (result[k].value === 'leadRequest.general.success') {
	                            message = result[k].text;
	                        }
	                    }
	                }

	                modal = new NYLModal({
	                    'type': 'success',
	                    'message': message,
	                    'buttonTitle': 'Continue Reading'
	                });
					validator.resetForm();
			        $formInstance.find('form').get(0).reset();
					modal.create();
                    NYL.forms.destroySpinner();
				}
				else {
					// If message does not exist: error
	                if (_.isEmpty(message)) {
	                    for (var h = 0; h < result.length; h++) {
	                        if (result[h].value === 'leadRequest.general.error') {
	                            message = result[h].text;
	                        }
	                    }
	                }

	                modal = new NYLModal({
	                    'type': 'error',
	                    'message': message,
	                    'buttonTitle': 'Continue Reading'
	                });
					modal.create();
                    NYL.forms.destroySpinner();
				}
            },
            error: function(errorResult) {
                console.warn('Failed to get messages from json configuration file');
            }
        });
    }

	// Init: Check for existence
	// Hack: Constantly watch to ensure init is called when form is loaded
	// Ensures component does not initialize as a hidden element
	window.setInterval(function() {
		$component = $('.nyl-contact-an-agent').not('.nyl-hidden-content .nyl-contact-an-agent');

		if (!$component.length) {
			initCount = 0;
			return;
		}

		if(initCount === 0) {
			initCount++;

			$formInstance = $component;
			formId = $component.attr('form-id');
			redirectURL = $component.find('.nyl-contact-an-agent__redirect').text();
			$component.find('.nyl-contact-an-agent__redirect').remove();
			initialize();
		}
	}, 200);
});
