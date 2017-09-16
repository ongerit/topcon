'use strict';

$(document).ready(function() {
    var $component = $('.nyl-static-forms-report-a-death');

    function initialize() {
        initInputMasking();
        initLegacyJS();
    }

    function initInputMasking() {
        $('.dob_mask').mask('99-99-9999');
        $('.dob_mask_slashes').mask('99/99/9999');
        $('.phone_mask').mask('999-999-9999');
        $('.ss_mask').mask('999-99-9999');
        $('#contactZip, #funeralZip').mask('99999');
    }

    function initLegacyJS() {
        // jshint ignore: start
        var modal;
        var policyNumber;
        var policyNumbersEntered;
        var policyNumberServiceableMessage;
        var policyNumberSpecialCharErrorMessage;
        var policyNumberLengthErrorMessage;

        $('#contactRelationshipToDeceased').change(function () {
            if ($('#contactRelationshipToDeceased').val() === 'Agent') {
                $('#agentToggle').show();
            } else {
                $('#agentToggle').hide();
            }
        });

        $('input[name=contactCountry]').change(function () {
            if ($('input[name=contactCountry]:checked').val() === 'Other') {
                $('#contactOtherCountryToggle').show();
                $('#contactUnitedStatesCountryToggle').hide();
            } else {
                $('#contactOtherCountryToggle').hide();
                $('#contactUnitedStatesCountryToggle').show();
            }
        });

        $('input[name=funeralCountry]').change(function () {
            if ($('input[name=funeralCountry]:checked').val() === 'Other') {
                $('#funeralHomeOtherCountryToggle').show();
                $('#funeralHomeUnitedStatesCountryToggle').hide();
            } else {
                $('#funeralHomeOtherCountryToggle').hide();
                $('#funeralHomeUnitedStatesCountryToggle').show();
            }
        });

        $('input[name=contactBeneficiary]')
            .change(
                function () {
                    if ($('input[name=contactBeneficiary]:checked')
                        .val() === 'Not Sure' || $(
                            'input[name=contactBeneficiary]:checked')
                        .val() === 'No') {
                        $('#contactBeneficiaryToggle').show();
                    } else {
                        $('#contactBeneficiaryToggle').hide();
                    }
                });

        $('#checkPolicyButton').click(function () {
            //servicablePolicy = checkPolicy('Y');
            checkPolicy(false, true);
        });

        $component.find('form').submit(function(e) {
            e.preventDefault();

            // [MD] Make sure the forms are valid
            if (initiateRequestNextButton()) {
                return;
            }

            if (checkPolicy(true, false)) {
                NYL.forms.createSpinner();
                $
                    .ajax({
                        type: "GET",
                        url: NYLApi.getApiPath() + 'reportDeath',
                        dataType: "json",
                        data: $component.find('form').serialize(),
                        traditional: true,
                        success: function(result) {
                            if (result.status === 'OK') {
                                _buildModal('report-a-death', 'success');
                                // Tealium success event on form complete
                                var form = $component.find('form')[0];
                                NYLAnalytics.trackComplete(form);
                                return;
                            }

                            var errorCode = _.get(_.head(result.apiErrorList), 'code');
                            _buildModal('report-a-death', 'error', errorCode);

                            /* [MD] Legacy NYLIFE result handling
                            $('.fieldError').hide();
                            var firstField = '';
                            var initiateRequestError = false;
                            var contactInformationError = false;

                            $.each(result.reportDeathResponse.errorInfo, function (i, val) {
                                if (firstField === '') {
                                    firstField = val.fieldName;
                                }

                                $("#" + val.fieldName + "Error").show();

                                if ($("#" + val.fieldName + "Error").closest("#initiateRequest").length > 0) {
                                    initiateRequestError = true;
                                }

                                if ($("#" + val.fieldName + "Error").closest("#contactInformation").length > 0) {
                                    contactInformationError = true;
                                }

                            });

                            if (initiateRequestError) {
                                $('#initiateRequest .collapse').show();
                                $('#initiateRequest').addClass('sectionError sunset');
                                $('#initiateRequest').removeClass('sectionSuccess grass');
                            } else {
                                $('#initiateRequest .collapse').hide();
                                $('#initiateRequest').addClass('sectionSuccess grass');
                                $('#initiateRequest').removeClass('sectionError sunset');
                            }

                            if (contactInformationError) {
                                $('#contactInformation .collapse').show();
                                $('#contactInformation').addClass('sectionError sunset');
                                $('#contactInformation').removeClass('sectionSuccess grass');
                            } else {
                                $('#contactInformation .collapse').hide();
                                $('#contactInformation').addClass('sectionSuccess grass');
                                $('#contactInformation').removeClass('sectionError sunset');
                            }

                            // set field focus
                            $('#' + firstField).focus();
                            */

                        },
                        error: function (request, status, error) {
                            console.warn('Failed to post Report A Death data to service');
                        }
                    });
            } else {
                // DOM should be updated when "non-serviceable" input is submitted
                // alert('Policy Number(s) Entered are not Serviceable.');
                return false;
            }
        });

        function isValidDate2(dateString) {
            // First check for the pattern
            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
                return false;
            }

            // Parse the date parts to integers
            var parts = dateString.split("/");
            var day = parseInt(parts[1], 10);
            var month = parseInt(parts[0], 10);
            var year = parseInt(parts[2], 10);

            // Check the ranges of month and year
            if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                return false;
            }

            var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // Adjust for leap years
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                monthLength[1] = 29;
            }

            // Check the range of the day
            return day > 0 && day <= monthLength[month - 1];
        }

        function isValidZip(zip) {
            var zipRE = /^\d{5}$/;
            return zipRE.test(zip);
        }

        function isValidPhoneNumber(phoneNumber) {
            var phoneNumberRE = /^\d{3}\-\d{3}-\d{4}$/;
            return phoneNumberRE.test(phoneNumber);
        }

        function validateEmail(emailAddress) {
            var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailRegex.test(emailAddress);
        }

        function isPolicyNumberWellFormed(policyNumber) {
            var policyNumberRE = /^$|^[a-zA-Z0-9]{8,10}$/; // checks for blank or 8-10 alphanumeric
            return policyNumberRE.test(policyNumber);
        }

        function havePolicyNumber(policyNumbersEntered) {
            for (var i = 0; i < policyNumbersEntered.length; i++) {
                policyNumber = policyNumbersEntered[i];
                if (!isEmpty(policyNumber)) {
                    return true;
                }
            }
            return false;
        }

        function allPolicyNumbersProperLength(policyNumbersEntered) {
            var policyNumberRE = /.{8,9}/; // checks for 0 or 8-9 characters
            for (var i = 0; i < policyNumbersEntered.length; i++) {
                policyNumber = policyNumbersEntered[i];

                if (!policyNumberRE.test(policyNumber) && !isEmpty(policyNumber)) {
                    return false;
                    break
                }

            }
            return true; //return true if all policy numbers are of proper length
        }

        function allPolicyNumbersWellFormed(policyNumbersEntered) {
            for (var i = 0; i < policyNumbersEntered.length; i++) {
                policyNumber = policyNumbersEntered[i];
                if (!isPolicyNumberWellFormed(policyNumber)) {
                    return false;
                    break;
                }
            }
            return true;
        }

        var numberOfPolicyMessagesToDisplay = 0;
        var policyMessagesToDisplay = new Array();

        //create all JSON objects
        var policyMessages = [{
            'policyMessage': {
                'title': '',
                'product': '',
                'phone': '',
                'company': '',
                'address': '',
                'cityStateZip': '',
                'url': ''
            }
        }, {
            'policyMessage': {
                'title': '',
                'product': '',
                'phone': '',
                'company': '',
                'address': '',
                'cityStateZip': '',
                'url': ''
            }
        }, {
            'policyMessage': {
                'title': '',
                'product': '',
                'phone': '',
                'company': '',
                'address': '',
                'cityStateZip': '',
                'url': ''
            }
        }];

        var products = {
            'AARP': {
                'product': 'AARP',
                'phone': '800-695-5164',
                'company': 'NEW YORK LIFE INS CO',
                'address': 'PO BOX 30712',
                'cityStateZip': 'TAMPA, FL  33630-3712',
                'url': '<a href="http://www.nylaarp.newyorklife.com">www.nylaarp.newyorklife.com</a><br><br>'
            },
            'CIA': {
                'product': '&nbsp;',
                'phone': '800-628-5817',
                'company': 'Northern Trust',
                'address': 'PO BOX 75905',
                'cityStateZip': 'Chicago, IL 60675-5905',
                'url': '&nbsp;<br><br>'
            },
            'MAINSTAY': {
                'product': '&nbsp;',
                'phone': '800-762-6212',
                'company': 'Mainstay Annuities',
                'address': '51 Madison Ave. Room 652',
                'cityStateZip': 'New York, NY  10010',
                'url': '<a href="http://www.newyorklifeannuities.com">www.newyorklifeannuities.com</a><br><br>'
            },
            'GROUPANNUITY': {
                'product': '&nbsp;',
                'phone': '800-695-0462',
                'company': 'New York Life Group Annuities/Policies',
                'address': '169 Lackawanna Ave',
                'cityStateZip': 'Parsippany, NJ  07054',
                'url': '<a href="http://www.nylim.com/retirement">www.nylim.com/retirement</a><br><br>'
            },
            'NYLIFE': {
                'product': '&nbsp;',
                'phone': '800-695-4785',
                'company': 'NYLIFE Securities LLC',
                'address': '51 Madison Room 251',
                'cityStateZip': 'New York, NY  10010',
                'url': '<a href="http://www.nylifesecurities.com">www.nylifesecurities.com</a><br><br>'
            },
            'STRUCTURED': {
                'product': '&nbsp;',
                'phone': '&nbsp;',
                'company': '1-800-695-1314&nbsp;&nbsp;&nbsp;&nbsp;Dallas Service Center',
                'address': '1-800-695-9873&nbsp;&nbsp;&nbsp;&nbsp;Cleveland Service Center',
                'cityStateZip': '&nbsp;',
                'url': '&nbsp;<br><br>'
            },
            'PINACLE': {
                'product': '&nbsp;',
                'phone': '866-695-3289',
                'company': 'Advanced Market Network',
                'address': '51 Madison Ave, Room 652',
                'cityStateZip': 'New York, NY  10010',
                'url': '&nbsp;<br><br>'
            },
            'PRIVATEPLACEMENT': {
                'product': '&nbsp;',
                'phone': '866-695-3289',
                'company': 'Advanced Market Network',
                'address': '51 Madison Ave, Room 652',
                'cityStateZip': 'New York, NY  10010',
                'url': '&nbsp;<br><br>'
            }
        };

        function foundOneServiceablePolicy(policyNumbersEntered) {
            numberOfPolicyMessagesToDisplay = 0;

            for (var i = 0; i < policyNumbersEntered.length; i++) {
                var foundServiceablePolicy = 0;
                policyNumber = policyNumbersEntered[i];

                //Check all policy number inputs against non-serviceable rules
                if (isAARPPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.AARP);
                } else if (isCIAPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.CIA);
                } else if (isMainstayPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.MAINSTAY);
                } else if (isGroupAnnuityPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.GROUPANNUITY);
                } else if (isNylLifeSecuritiesPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.NYLIFE);
                } else if (isStructuredSettlements(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.STRUCTURED);
                } else if (isPinaclePolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.PINACLE);
                } else if (isPrivatePlacementPolicy(policyNumber)) {
                    numberOfPolicyMessagesToDisplay++;
                    setPolicyMessageText(numberOfPolicyMessagesToDisplay, i + 1, products.PRIVATEPLACEMENT);
                } else {
                    //policy number is not "serviceable" if it is empty even though it is allowed input from the UI
                    if (!isEmpty(policyNumber)) {
                        foundServiceablePolicy = 1;
                        break;
                    }
                }
            }
            if (foundServiceablePolicy === 1) {
                return true;
            } else {
                return false;
            }
        }

        function setPolicyMessageText(numberOfPolicyMessagesToDisplay, policyNumber, objPolicyMessageText) {
            policyMessageIndex = policyNumber - 1;
            policyMessages[policyMessageIndex].policyMessage.title = "Policy #" + policyNumber + ":";
            policyMessages[policyMessageIndex].policyMessage.product = objPolicyMessageText.product;
            policyMessages[policyMessageIndex].policyMessage.phone = objPolicyMessageText.phone;
            policyMessages[policyMessageIndex].policyMessage.company = objPolicyMessageText.company;
            policyMessages[policyMessageIndex].policyMessage.address = objPolicyMessageText.address;
            policyMessages[policyMessageIndex].policyMessage.cityStateZip = objPolicyMessageText.cityStateZip;
            policyMessages[policyMessageIndex].policyMessage.url = objPolicyMessageText.url;

            updateDOMPolicyMessages(numberOfPolicyMessagesToDisplay, policyMessageIndex)
        }

        function updateDOMPolicyMessages(numberOfPolicyMessagesToDisplay, policyMessageIndex) {
            if (numberOfPolicyMessagesToDisplay === 1) {
                $("#servicePolicyProductTitle1").html(policyMessages[policyMessageIndex].policyMessage.title);
                $("#servicePolicyProduct1").html(policyMessages[policyMessageIndex].policyMessage.product);
                $("#servicePolicyPhoneNumber1").html(policyMessages[policyMessageIndex].policyMessage.phone);
                $("#servicePolicyCompanyName1").html(policyMessages[policyMessageIndex].policyMessage.company);
                $("#servicePolicyAddress1").html(policyMessages[policyMessageIndex].policyMessage.address);
                $("#servicePolicyCityStateZip1").html(policyMessages[policyMessageIndex].policyMessage.cityStateZip);
                $("#servicePolicyURL1").html(policyMessages[policyMessageIndex].policyMessage.url);
            } else if (numberOfPolicyMessagesToDisplay === 2) {
                $("#servicePolicyProductTitle2").html(policyMessages[policyMessageIndex].policyMessage.title);
                $("#servicePolicyProduct2").html(policyMessages[policyMessageIndex].policyMessage.product);
                $("#servicePolicyPhoneNumber2").html(policyMessages[policyMessageIndex].policyMessage.phone);
                $("#servicePolicyCompanyName2").html(policyMessages[policyMessageIndex].policyMessage.company);
                $("#servicePolicyAddress2").html(policyMessages[policyMessageIndex].policyMessage.address);
                $("#servicePolicyCityStateZip2").html(policyMessages[policyMessageIndex].policyMessage.cityStateZip);
                $("#servicePolicyURL2").html(policyMessages[policyMessageIndex].policyMessage.url);
            } else if (numberOfPolicyMessagesToDisplay === 3) {
                $("#servicePolicyProductTitle3").html(policyMessages[policyMessageIndex].policyMessage.title);
                $("#servicePolicyProduct3").html(policyMessages[policyMessageIndex].policyMessage.product);
                $("#servicePolicyPhoneNumber3").html(policyMessages[policyMessageIndex].policyMessage.phone);
                $("#servicePolicyCompanyName3").html(policyMessages[policyMessageIndex].policyMessage.company);
                $("#servicePolicyAddress3").html(policyMessages[policyMessageIndex].policyMessage.address);
                $("#servicePolicyCityStateZip3").html(policyMessages[policyMessageIndex].policyMessage.cityStateZip);
                $("#servicePolicyURL3").html(policyMessages[policyMessageIndex].policyMessage.url);
            }

            if (numberOfPolicyMessagesToDisplay === 1) {
                $("#callPleasePolicy1").show();
            } else if (numberOfPolicyMessagesToDisplay === 2) {
                $("#callPleasePolicy1").show();
                $("#callPleasePolicy2").show();
            } else if (numberOfPolicyMessagesToDisplay === 3) {
                $("#callPleasePolicy1").show();
                $("#callPleasePolicy2").show();
                $("#callPleasePolicy3").show();
            }
        }

        function isEmpty(s) {
            return ((s === null) || (s.length === 0));
        }

        function showErrorMessage(errorMessage) {
            $("#errorMessage").html(errorMessage);
            $("#errorMessage").show();
        }

        function hideDOMMessages() {
            //hide all DOM Messages
            $("#callPleasePolicy1").hide();
            $("#callPleasePolicy2").hide();
            $("#callPleasePolicy3").hide();
            $("#errorMessage").hide();
        }

        function checkPolicy(isFormValidation, isPolicyButtonValidation) {
            //hide all DOM Messages
            hideDOMMessages();

            //create array to hold all input values
            policyNumbersEntered = new Array();

            //populate array with form input values
            policyNumbersEntered.push($('#policy1').val());
            policyNumbersEntered.push($('#policy2').val());
            policyNumbersEntered.push($('#policy3').val());

            //Get popup messages from DOM -- Customer has access to the message text outside of the script
            policyNumberServiceableMessage = $("#policyNumberServiceableMessage").text();
            policyNumberSpecialCharErrorMessage = $("#policyNumberSpecialCharErrorMessage").text();
            policyNumberLengthErrorMessage = $("#policyNumberLengthErrorMessage").text();

            //make sure that we have at least 1 value populated from the form in policy inputs
            if (havePolicyNumber(policyNumbersEntered)) {
                //if the validation is being trigged by form submission we just need to make sure
                //that the only policy value(s) entered is/are NOT serviceable
                if (isFormValidation) {
                    if (foundOneServiceablePolicy(policyNumbersEntered)) {
                        return true;
                    } else {
                        setPolicyMessageText;
                        return false;
                    }
                }

                if (allPolicyNumbersProperLength(policyNumbersEntered)) {
                    if (allPolicyNumbersWellFormed(policyNumbersEntered)) {
                        if (foundOneServiceablePolicy(policyNumbersEntered)) {
                            hideDOMMessages();
                            showErrorMessage(policyNumberServiceableMessage);
                            return true;
                        } else {
                            setPolicyMessageText;
                            return false;
                        }
                        // Tealium success event 
                        if (typeof utag !== 'undefined') {
                            utag.link({'event_name': 'milestone',
                                       'conversion_flow_milestone': 'check-policy'});
                        }
                    } else {
                        showErrorMessage(policyNumberSpecialCharErrorMessage);
                        return false;
                    }
                } else {
                    showErrorMessage(policyNumberLengthErrorMessage);
                    return false;
                }
            } else {
                hideDOMMessages();
                showErrorMessage(policyNumberServiceableMessage);
                return true;
            }
        }

        function isAARPPolicy(policyNumber) {
            var leftCharValue = policyNumber.substring(0, 1).toUpperCase();

            if (leftCharValue === "A" || leftCharValue === "R" || leftCharValue === "F") {
                var numericValue = parseInt(policyNumber.substring(1, policyNumber.length));

                if (isNaN(numericValue)) {
                    return false;
                } else {
                    if (leftCharValue === "A" && numericValue >= 1 && numericValue <= 4624048) {
                        //objPolicyMessageAARP.phone = "800-695-5164";
                        products.AARP.phone = "800-695-5164";
                        return true;
                    } else if (leftCharValue === "R") {
                        products.AARP.phone = "800-481-3414";
                        return true;
                    } else if (leftCharValue === "F") {
                        products.AARP.phone = "800-926-1468";
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        function isCIAPolicy(policyNumber) {
            var numericValue = parseInt(policyNumber.substring(0, policyNumber.length));

            if (numericValue >= 93700000 && numericValue <= 93899999) {
                return true;
            } else {
                return false;
            }
        }

        function isMainstayPolicy(policyNumber) {
            var numericValue = parseInt(policyNumber.substring(0, policyNumber.length));

            if (isNaN(numericValue)) {
                return false;
            } else {
                if ((numericValue >= 52000000 && numericValue <= 52799999) || (numericValue >= 54139000 && numericValue <= 54139200) || (numericValue >= 54180000 && numericValue <= 54180036) || (numericValue >= 59400000 && numericValue <= 59799999)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function isGroupAnnuityPolicy(policyNumber) {
            var twoLeftCharsValue = policyNumber.substring(0, 2).toUpperCase();

            if (twoLeftCharsValue === "GA") {
                return true;
            } else {
                return false;
            }
        }

        function isNylLifeSecuritiesPolicy(policyNumber) {
            var leftCharValue = policyNumber.substring(0, 1).toUpperCase();

            if (leftCharValue === "N") {
                var numericValue = parseInt(policyNumber.substring(1, policyNumber.length));

                if (isNaN(numericValue)) {
                    return false;
                } else {
                    if ((numericValue >= 22000000 && numericValue <= 27000000) || (numericValue >= 23000000 && numericValue <= 28000000) || (numericValue >= 24000000 && numericValue <= 60000000) || (numericValue >= 26000000 && numericValue <= 61000000)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        function isStructuredSettlements(policyNumber) {
            var twoLeftCharsValue = policyNumber.substring(0, 2).toUpperCase();

            if (twoLeftCharsValue === "FP") {
                var numericValue = parseInt(policyNumber.substring(2,
                    policyNumber.length));

                if (isNaN(numericValue)) {
                    return false;
                } else {
                    if (numericValue >= 200000 && numericValue <= 203999) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }

        function isPinaclePolicy(policyNumber) {
            var numericValue = parseInt(policyNumber.substring(0, policyNumber.length));

            if (isNaN(numericValue)) {
                return false;
            } else {
                if ((numericValue >= 56733500 && numericValue <= 56764999) || (numericValue >= 56768500 && numericValue <= 56799999) || (numericValue >= 56765000 && numericValue <= 56765999) || (numericValue >= 56800000 && numericValue <= 56800999)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        function isPrivatePlacementPolicy(policyNumber) {
            var numericValue = parseInt(policyNumber.substring(0, policyNumber.length));

            if (isNaN(numericValue)) {
                return false;
            } else {
                if ((numericValue >= 56803800 && numericValue <= 56808499) || (numericValue >= 56808800 && numericValue <= 56818800)) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        // [MD] Repurposed legacy event handlers

        function initiateRequestNextButton() {
            $('#initiateRequest .fieldError').hide();
            var error = false;
            var focusField = '';

            if ($.trim($('#deceasedFirstName').val()) === '' || !isAscii($.trim($('#deceasedFirstName').val()))) {
                $('#deceasedFirstNameError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'deceasedFirstName';
                }
            }

            if ($.trim($('#deceasedLastName').val()) === '' || !isAscii($.trim($('#deceasedLastName').val()))) {
                $('#deceasedLastNameError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'deceasedLastName';
                }
            }

            if (!isValidDate2($.trim($('#deceasedDateOfDeath').val()))) {
                $('#deceasedDateOfDeathError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'deceasedDateOfDeath';
                }
            }

            if ($('#deceasedCauseOfDeath').val() === '') {
                $('#deceasedCauseOfDeathError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'deceasedCauseOfDeath';
                }
            }

            if (error) {
                $('#' + focusField).focus();
            }

            // Contact validation
            $('#contactInformation .fieldError').hide();

            if ($('input[name=contactBeneficiary]:checked').length <= 0) {
                $('#contactBeneficiaryError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'contactBeneficiary';
                }
            }

            if ($('#contactRelationshipToDeceased').val() === '') {
                $('#contactRelationshipToDeceasedError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'contactRelationshipToDeceased';
                }
            }

            if ($('#contactRelationshipToDeceased').val() === 'Agent') {
                if ($('input[name=contactProvideForms]:checked').length <= 0) {
                    $('#contactProvideFormsError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactProvideForms';
                    }
                }

                if ($('input[name=contactDeliverProceeds]:checked').length <= 0) {
                    $('#contactDeliverProceedsError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactDeliverProceeds';
                    }
                }
            }

            if ($.trim($('#contactFirstName').val()) === '' || !isAscii($.trim($('#contactFirstName').val()))) {
                $('#contactFirstNameError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'contactFirstName';
                }
            }

            if ($.trim($('#contactLastName').val()) === '' || !isAscii($.trim($('#contactLastName').val()))) {
                $('#contactLastNameError').show();
                error = true;
                if (focusField === '') {
                    focusField = 'contactLastName';
                }
            }

            if ($('input[name=contactCountry]:checked').val() === 'United States') {
                if ($.trim($('#contactAddress1').val()) === '') {
                    $('#contactAddress1Error').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactCountry';
                    }
                }

                if ($.trim($('#contactCity').val()) === '') {
                    $('#contactCityError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactCity';
                    }
                }

                if ($('#contactState').val() === '') {
                    $('#contactStateError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactState';
                    }
                }

                if (!isValidZip($.trim($('#contactZip').val()))) {
                    $('#contactZipError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactZip';
                    }
                }

                if (!isValidPhoneNumber($.trim($('#contactPhoneNumber').val()))) {
                    $('#contactPhoneNumberError').show();
                    error = true;
                    if (focusField === '') {
                        focusField = 'contactPhoneNumber';
                    }
                }

                if (!validateEmail($.trim($('#contactEmail').val()))) {
                	$('#contactEmailError').show();
                	error = true;
                	if (focusField === '') {
            			focusField = 'contactEmail';
            		}
                }
            }

            if (error) {
                $('#' + focusField).focus();
            }

            // Return Boolean
            return error;
        }

        // PRIVATE METHODS

        function _buildModal(formName, status, code) {
            // Check DAM message config and display appropriate messaging
            $.ajax({
                method: 'GET',
                dataType: 'json',
                url: NYLApi.getMessagePath() + 'report-death-service-messages/_jcr_content.list.json',
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
                                if (result[j].value === 'reportADeath.general.success') {
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
            	        $('.fieldError').hide();
            	        $component.find('form').get(0).reset();
                        NYL.forms.destroySpinner();
                        refreshCaptcha();

            			return;
            		}

                    // If message does not exist: error
                    if (_.isEmpty(message)) {
                        for (var k = 0; k < result.length; k++) {
                            if (result[k].value === 'reportADeath.general.error') {
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
                    refreshCaptcha();
                },
                error: function(errorResult) {
                    console.warn('Failed to get messages from json configuration file');
                }
            });
        }

        function refreshCaptcha(){
            if (typeof(ACPuzzle)!== "undefined"){
                ACPuzzle.reload('');
            }
        }

        // Pulled from nylife.min.js

        function isAscii(b) {
            for (var a = 0; a < b.length; a++) {
                if ((b.charCodeAt(a) >= 48 && b.charCodeAt(a) <= 57) || (b.charCodeAt(a) >= 65 && b.charCodeAt(a) <= 90) || (b.charCodeAt(a) >= 97 && b.charCodeAt(a) <= 122) || b.charCodeAt(a) == 32 || b.charCodeAt(a) == 35 || b.charCodeAt(a) == 39 || b.charCodeAt(a) == 45 || b.charCodeAt(a) == 46 || b.charCodeAt(a) == 47) {} else {
                    return false
                }
            }
            return true
        }

        // jshint ignore: end
    }

    // INIT
    if ($component.length) {
        initialize();
    }
});
