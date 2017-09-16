'use strict';

$(document).ready(function() {

    var $component = $('.nyl-static-forms-gap-calculator');

    function initialize(){
        $('#error').hide();
        initConditionals();
        initFormValidation();
    }

    function initConditionals(){

        $component.find('#question9').change(function() {
            if ($(this).val() === 'yes') {
                // [EC] jQuery.show() assumes input forms should be inline style, but we need block.
                $component.find('.nyl-static-forms-gap-calculator__conditional-section--q9-follow-up').addClass('show');
            } else {
                $component.find('.nyl-static-forms-gap-calculator__conditional-section--q9-follow-up').removeClass('show');
            }
        });

        $component.find('#question12').change(function() {
            if ($(this).val() === 'yes') {
                $component.find('.nyl-static-forms-gap-calculator__conditional-section--q12-follow-up').addClass('show');
            } else {
                $component.find('.nyl-static-forms-gap-calculator__conditional-section--q12-follow-up').removeClass('show');
            }
        });

    }

    function calculate(){

        var inflation = [
            '1.0000','2.0220','3.0665','4.1339','5.2249','6.3398','7.4793','8.6439','9.8340',
            '11.0504','12.2935','13.5639','14.8623','16.1893','17.5455','18.9315','20.3480',
            '21.7956','23.2751','24.7872','26.3325','27.9118','29.5259','31.1755','32.8613',
            '34.5843','36.3451','38.1447','39.9839','41.8635','43.7845','45.7478','47.7542',
            '49.8048','51.9005','54.0424','56.2313','58.4684','60.7547','63.0913','65.4793',
            '67.9198','70.4141','72.9632','75.5684','78.2309','80.9520','83.7329','86.5750',
            '89.4797','92.4482','95.4821','98.5827','101.7515','104.9900','108.2998','111.6824',
            '115.1394','118.6725','122.2833','125.9735','129.7450','133.5993','137.5385',
            '141.5644','145.6788','149.8837','154.1812','158.5732','163.0618','167.6491',
            '172.3374','177.1288','182.0257','187.0302','192.1449','197.3721','202.7143',
            '208.1740','213.7538'
        ];

        var question1 = $('#question1').val();
        var question2 = $('#question2').val();
        var question3 = $('#question3').val();
        var question4 = $('#question4').val();
        var question5 = $('#question5').val();
        var question6 = $('#question6').val();
        var question7 = $('#question7').val();
        var question8 = $('#question8').val();
        var question9 = $('#question9').val();
        var question10 = $('#question10').val();
        var question11 = $('#question11').val();
        var question13 = $('#question13').val();

        var gap = 0;
        var statedNeeds = 0;
        var totalCoverage = 0;
        var incomeReplacementNeed = 0;
        var collegeExpenses = 0;
        var collegeExpensePercentage = 0;
        var nylInflationRate = inflation[parseInt(question3) - 1];

        totalCoverage = parseInt(question1) + parseInt(question2);

        if (question5 === 'yes') {
            incomeReplacementNeed = parseInt(question4) * nylInflationRate;
        } else {
            incomeReplacementNeed = parseInt(question3) * parseInt(question4);
        }

        if (question9 === 'yes') {
            collegeExpensePercentage = parseInt(question11) / 100;
            collegeExpenses = parseInt(question10) * 150000 * collegeExpensePercentage;
        }

        statedNeeds = incomeReplacementNeed + parseInt(question6) + parseInt(question7) + parseInt(question8) + collegeExpenses + (parseInt(question13) || 0);

        if  (statedNeeds === 0){
            statedNeeds = 1;
        }

        gap = Math.round((totalCoverage / statedNeeds) * 100);

        if ( $.isNumeric(gap) ) {
            submitForm(gap);
        }

    }

    function initFormValidation(){

        $component.validate({
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
            },
            rules: {
                question1 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question2 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question3 : {
                    required : true,
                    integer : true,
                    min: 0,
                },
                question4 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question5 : {
                    required : true,
                },
                question6 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question7 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question8 : {
                    required : true,
                    number : true,
                    min : 0,
                },
                question9 : {
                    required : true,
                },
                question10 : {
                    required : true,
                    integer : true,
                    min: 0,
                },
                question11 : {
                    required : true,
                    number : true,
                    range : [0,100],
                },
                question12 : {
                    required : true,
                },
                question13 : {
                    required : true,
                    number : true,
                    min : 0,
                },
            },
            submitHandler : calculate,
        });

    }

    function submitForm(gap){
        var code;
        var destinations = [
            '/resources/calculators/0-coverage',
            '/resources/calculators/1-24-coverage',
            '/resources/calculators/25-49-coverage',
            '/learn-and-plan/50-99-coverage',
            '/resources/calculators/100-coverage'
        ];
        var form = $component[0];

        if (gap === 0) {
            code = 0;
        } else if (gap >= 1 && gap <= 24) {
            code = 1;
        } else if (gap >= 25 && gap <= 49) {
            code = 2;
        } else if (gap >= 50 && gap <= 99) {
            code = 3;
        } else {
            code = 4;
        }

        // Tealium success event on form complete
        NYLAnalytics.trackComplete(form);

        window.location.href = destinations[code];
    }

    initialize();

});
