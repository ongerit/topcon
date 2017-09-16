'use strict';

var jQuery = jQuery || {};

(function($){

    function initValidation($component){
        var validationRules = {
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
            },
            rules:{
                payCustom: {
                    required: {
                        depends: function(){
                            var frequency = $('#payFreq').val();
                            if (frequency === 'custom'){
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                },
                deductionAmount:{
                    pattern: /[0-9]{1,3}/
                },
                birthDate: {
                    required: true,
                    pattern: /^\d\d?-\d\d?-\d\d\d\d$/,
                },
                policyDate: {
                    required: true,
                    pattern: /^\d\d?-\d\d?-\d\d\d\d$/,
                },
            },
            messages: {
                deductionAmount: 'Enter a dollar amount, from one to three digits',
                payCustom: 'You must enter a number of payroll deductions you\'d want in a year, or select from the list.',
                birthDate: 'Please enter your birth date in the format: MM-DD-YYYY (including the dashes)',
                policyDate: 'Please enter your policy date in the format: MM-DD-YYYY (including the dashes)',
            },
            submitHandler: getResult,
        };
        $component.find('form.nyl-highcharts-whole-life-calc__form').validate(validationRules);
    }

    function initConditionals($component){

        // [EC] var relationships defines which conditional fields attach to which triggers, and why.
        // structured as..
        // triggerID : {
        //      id: conditionalFieldID,
        //      showOn: [value, array, goes, here]
        // }
        var relationships = {
            policy: {
                id: 'ridersField',
                showOn: ['gi']
            },
            payFreq: {
                id: 'payCustom',
                showOn: ['custom']
            }
        };

        $component.find('.nyl-highcharts-whole-life-calc__select--conditional-trigger').each(function(){
            var $this = $(this);
            $this.change({rel: relationships}, conditionalChange);
            $this.trigger('change'); // ensures initial state is correct
        });
    }

    function conditionalChange(event){
        var $field = $(event.target);
        var id = $field.attr('id');
        var value = $field.val();
        var rel = event.data.rel[id];
        var $condField = $('#' + rel.id).closest('.nyl-highcharts-whole-life-calc__conditional-field');

        if (rel.showOn.indexOf(value) !== -1){
            $condField.show();
        }
        else {
            $condField.hide();
        }
    }

    function getResult(form){
        // Need to be sure jQuery UI has loaded before this does anything..
        window.jqUiPromise.done(function(){
            var $form = $(form);
            var data = initHighcharts($form, data);
            var result = calculate(data);

            // Tealium success event on calculator complete
            NYLAnalytics.trackComplete(form);

            $('#chartContainer').highcharts().series[0].setData(result);
        });
    }

    function initHighcharts($form){
        var data = {
            gi:{
                premiumBase: [0.49192,0.49984,0.51392,0.52888,0.54384,0.55968,0.57728,0.59576,0.61336,0.63272,0.63448,0.65648,0.67848,0.70048,0.72512,0.74888,0.77352,0.79728,0.79904,0.8316,0.85976,0.88528,0.9108,0.9372,0.96536,0.99792,1.00056,1.00496,1.04544,1.08856,1.13696,1.18536,1.23728,1.29448,1.35344,1.41416,1.47664,1.54352,1.6148,1.69136,1.76704,1.86648,1.96328,2.0636,2.1604,2.25896,2.36456,2.4684,2.57136,2.67784,2.77992,2.94272,3.10288,3.26304,3.4232,3.58424,3.7708,3.98816,4.21432,4.4572,4.71768,4.99488,5.2712,5.5484,5.82472,6.10192,6.46712,6.864,7.27936,7.72992,8.1928,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumADB: [0.06776,0.0704,0.0704,0.0704,0.0704,0.07128,0.07128,0.07128,0.07216,0.07216,0.07304,0.0748,0.07568,0.07656,0.07744,0.07744,0.07744,0.07832,0.0836,0.08272,0.08096,0.08008,0.0792,0.07832,0.07744,0.07656,0.07656,0.07656,0.07656,0.07656,0.07656,0.07656,0.07744,0.07744,0.07832,0.07832,0.0792,0.07832,0.08008,0.08096,0.08096,0.08184,0.08272,0.08448,0.08448,0.08536,0.08624,0.08712,0.088,0.08888,0.08976,0.09328,0.09504,0.09592,0.09768,0.09944,0.10384,0.10736,0.11088,0.11616,0.12056,0.12496,0.12936,0.13552,0.13992,0.14432,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumWP: [0.0226,0.024,0.024,0.024,0.024,0.024,0.024,0.0248,0.0248,0.0248,0.0248,0.0248,0.0248,0.0251,0.0251,0.0251,0.0251,0.0251,0.0405,0.0405,0.043,0.043,0.043,0.0434,0.0434,0.0434,0.0452,0.0452,0.0477,0.0477,0.0488,0.0488,0.0493,0.0493,0.0498,0.0516,0.0538,0.0538,0.0538,0.0563,0.0581,0.0594,0.0635,0.0649,0.0672,0.0691,0.0735,0.079,0.0801,0.0842,0.0842,0.0842,0.0846,0.0872,0.091,0.0925,0.0941,0.0941,0.0941,0.0941,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                faceMin:5000,
                faceMax:100000
            },
            si:{
                premiumBase: [0.49192,0.49984,0.51392,0.52888,0.54384,0.55968,0.57728,0.59576,0.61336,0.63272,0.63448,0.65648,0.67848,0.70048,0.72512,0.74888,0.77352,0.79728,0.72776,0.75768,0.78760,0.80784,0.81576,0.82104,0.83160,0.84656,0.85008,0.85800,0.89056,0.92312,0.95656,0.99440,1.03312,1.07448,1.11848,1.17568,1.17656,1.22232,1.27600,1.32792,1.37984,1.45552,1.53824,1.62360,1.70632,1.79080,1.88848,1.98440,2.08120,2.17712,2.27392,2.42352,2.57312,2.72360,2.87232,3.02280,3.20408,3.40384,3.61504,3.84472,4.10344,4.34896,4.59624,4.84176,5.08816,5.33456,5.67424,6.02888,6.40024,6.79184,7.19928,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumADB: [0.06776,0.0704,0.0704,0.0704,0.0704,0.07128,0.07128,0.07128,0.07216,0.07216,0.07304,0.0748,0.07568,0.07656,0.07744,0.07744,0.07744,0.07832,0.07656,0.0748,0.07304,0.07304,0.07216,0.07128,0.06952,0.06952,0.06864,0.06864,0.06952,0.06864,0.06952,0.06952,0.0704,0.0704,0.07128,0.07128,0.07128,0.07128,0.07216,0.07304,0.07392,0.0748,0.07568,0.07568,0.07656,0.07744,0.07832,0.0792,0.08008,0.08096,0.08184,0.08448,0.08536,0.08712,0.08888,0.08976,0.09328,0.09768,0.10032,0.1056,0.11,0.1144,0.11792,0.12408,0.12672,0.13112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumWP: [0.0226,0.024,0.024,0.024,0.024,0.024,0.024,0.0248,0.0248,0.0248,0.0248,0.0248,0.0248,0.0251,0.0251,0.0251,0.0251,0.0251,0.0266,0.0266,0.0269,0.0273,0.0273,0.0305,0.0305,0.0305,0.032,0.032,0.0334,0.0334,0.0353,0.0353,0.0358,0.0358,0.0366,0.0378,0.0397,0.0397,0.0403,0.0422,0.0441,0.0451,0.048,0.0496,0.0511,0.0525,0.0556,0.0598,0.0604,0.0636,0.0636,0.0636,0.0645,0.067,0.0696,0.0702,0.071,0.071,0.071,0.071,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                faceMin:5000,
                faceMax:150000
            },
            sis:{
                premiumBase: [0.49192,0.49984,0.51392,0.52888,0.54384,0.55968,0.57728,0.59576,0.61336,0.63272,0.63448,0.65648,0.67848,0.70048,0.72512,0.74888,0.77352,0.79728,0.79904,0.8316,0.85976,0.88528,0.9108,0.9372,0.96536,0.99792,1.00056,1.00496,1.04544,1.08856,1.13696,1.18536,1.23728,1.29448,1.35344,1.41416,1.47664,1.54352,1.6148,1.69136,1.76704,1.86648,1.96328,2.0636,2.1604,2.25896,2.36456,2.4684,2.57136,2.67784,2.77992,2.94272,3.10288,3.26304,3.4232,3.58424,3.7708,3.98816,4.21432,4.4572,4.71768,4.99488,5.2712,5.5484,5.82472,6.10192,6.46712,6.864,7.27936,7.72992,8.1928,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumADB: [0.06776,0.0704,0.0704,0.0704,0.0704,0.07128,0.07128,0.07128,0.07216,0.07216,0.07304,0.0748,0.07568,0.07656,0.07744,0.07744,0.07744,0.07832,0.07656,0.0748,0.07304,0.07304,0.07216,0.07128,0.06952,0.06952,0.06864,0.06864,0.06952,0.06864,0.06952,0.06952,0.0704,0.0704,0.07128,0.07128,0.07128,0.07128,0.07216,0.07304,0.07392,0.0748,0.07568,0.07568,0.07656,0.07744,0.07832,0.0792,0.08008,0.08096,0.08184,0.08448,0.08536,0.08712,0.08888,0.08976,0.09328,0.09768,0.10032,0.1056,0.11,0.1144,0.11792,0.12408,0.12672,0.13112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumWP: [0.0226,0.024,0.024,0.024,0.024,0.024,0.024,0.0248,0.0248,0.0248,0.0248,0.0248,0.0248,0.0251,0.0251,0.0251,0.0251,0.0251,0.0266,0.0266,0.0269,0.0273,0.0273,0.0305,0.0305,0.0305,0.032,0.032,0.0334,0.0334,0.0353,0.0353,0.0358,0.0358,0.0366,0.0378,0.0397,0.0397,0.0403,0.0422,0.0441,0.0451,0.048,0.0496,0.0511,0.0525,0.0556,0.0598,0.0604,0.0636,0.0636,0.0636,0.0645,0.067,0.0696,0.0702,0.071,0.071,0.071,0.071,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                faceMin:5000,
                faceMax:150000
            },
            jgi:{
                premiumBase: [0.49192,0.49984,0.51392,0.52888,0.54384,0.55968,0.57728,0.59576,0.61336,0.63272,0.63448,0.65648,0.67848,0.70048,0.72512,0.74888,0.77352,0.79728,0.79904,0.8316,0.85976,0.88528,0.9108,0.9372,0.96536,0.99792,1.00056,1.00496,1.04544,1.08856,1.13696,1.18536,1.23728,1.29448,1.35344,1.41416,1.47664,1.54352,1.6148,1.69136,1.76704,1.86648,1.96328,2.0636,2.1604,2.25896,2.36456,2.4684,2.57136,2.67784,2.77992,2.94272,3.10288,3.26304,3.4232,3.58424,3.7708,3.98816,4.21432,4.4572,4.71768,4.99488,5.2712,5.5484,5.82472,6.10192,6.46712,6.864,7.27936,7.72992,8.1928,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumADB: [0.06776,0.0704,0.0704,0.0704,0.0704,0.07128,0.07128,0.07128,0.07216,0.07216,0.07304,0.0748,0.07568,0.07656,0.07744,0.07744,0.07744,0.07832,0.0836,0.08272,0.08096,0.08008,0.0792,0.07832,0.07744,0.07656,0.07656,0.07656,0.07656,0.07656,0.07656,0.07656,0.07744,0.07744,0.07832,0.07832,0.0792,0.07832,0.08008,0.08096,0.08096,0.08184,0.08272,0.08448,0.08448,0.08536,0.08624,0.08712,0.088,0.08888,0.08976,0.09328,0.09504,0.09592,0.09768,0.09944,0.10384,0.10736,0.11088,0.11616,0.12056,0.12496,0.12936,0.13552,0.13992,0.14432,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumWP: [0.0226,0.024,0.024,0.024,0.024,0.024,0.024,0.0248,0.0248,0.0248,0.0248,0.0248,0.0248,0.0251,0.0251,0.0251,0.0251,0.0251,0.0405,0.0405,0.043,0.043,0.043,0.0434,0.0434,0.0434,0.0452,0.0452,0.0477,0.0477,0.0488,0.0488,0.0493,0.0493,0.0498,0.0516,0.0538,0.0538,0.0538,0.0563,0.0581,0.0594,0.0635,0.0649,0.0672,0.0691,0.0735,0.079,0.0801,0.0842,0.0842,0.0842,0.0846,0.0872,0.091,0.0925,0.0941,0.0941,0.0941,0.0941,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                faceMin:5000,
                faceMax:25000
            },
            jsi:{
                premiumBase: [0.49192,0.49984,0.51392,0.52888,0.54384,0.55968,0.57728,0.59576,0.61336,0.63272,0.63448,0.65648,0.67848,0.70048,0.72512,0.74888,0.77352,0.79728,0.79904,0.8316,0.85976,0.88528,0.9108,0.9372,0.96536,0.99792,1.00056,1.00496,1.04544,1.08856,1.13696,1.18536,1.23728,1.29448,1.35344,1.41416,1.47664,1.54352,1.6148,1.69136,1.76704,1.86648,1.96328,2.0636,2.1604,2.25896,2.36456,2.4684,2.57136,2.67784,2.77992,2.94272,3.10288,3.26304,3.4232,3.58424,3.7708,3.98816,4.21432,4.4572,4.71768,4.99488,5.2712,5.5484,5.82472,6.10192,6.46712,6.864,7.27936,7.72992,8.1928,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumADB: [0.06776,0.0704,0.0704,0.0704,0.0704,0.07128,0.07128,0.07128,0.07216,0.07216,0.07304,0.0748,0.07568,0.07656,0.07744,0.07744,0.07744,0.07832,0.07656,0.0748,0.07304,0.07304,0.07216,0.07128,0.06952,0.06952,0.06864,0.06864,0.06952,0.06864,0.06952,0.06952,0.0704,0.0704,0.07128,0.07128,0.07128,0.07128,0.07216,0.07304,0.07392,0.0748,0.07568,0.07568,0.07656,0.07744,0.07832,0.0792,0.08008,0.08096,0.08184,0.08448,0.08536,0.08712,0.08888,0.08976,0.09328,0.09768,0.10032,0.1056,0.11,0.1144,0.11792,0.12408,0.12672,0.13112,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                premiumWP: [0.0226,0.024,0.024,0.024,0.024,0.024,0.024,0.0248,0.0248,0.0248,0.0248,0.0248,0.0248,0.0251,0.0251,0.0251,0.0251,0.0251,0.0266,0.0266,0.0269,0.0273,0.0273,0.0305,0.0305,0.0305,0.032,0.032,0.0334,0.0334,0.0353,0.0353,0.0358,0.0358,0.0366,0.0378,0.0397,0.0397,0.0403,0.0422,0.0441,0.0451,0.048,0.0496,0.0511,0.0525,0.0556,0.0598,0.0604,0.0636,0.0636,0.0636,0.0645,0.067,0.0696,0.0702,0.071,0.071,0.071,0.071,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                faceMin:5000,
                faceMax:25000
            },
            policy:'',
            riders:'',
            payFreq:0,
            premiumBase:0,
            premiumADB:0,
            premiumWP:0,
            deduction:0,
            deductionMin:0,
            deductionMax:0,
            age:0
        };

        var highchartsConfig = {
            credits:false,
            chart: {
                type: 'column'
            },
            title: {
                style: {
                    fontSize: '26px',
                    fontFamily: 'Alda OT',
                    color: '#1d5e75'
                },
                text: 'Face Amount'
            },
            tooltip: {
                pointFormat: '$<b>{point.y:,.0f}</b>',
                headerFormat: ''
            },
            legend:{
                enabled:false
            },
            xAxis: {
                labels:{
                    enabled: true,
                    style:{
                            fontSize: 16,
                            color:'#1d5e75'
                    }
                },
                categories:['No Riders','Accidental Death Benefit','Disability Waiver of Premium','Both'],
                enabled:false
            },
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        formatter: function(){
                            if (this.y !== 0){
                                return '$' + (Math.round(this.y)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            }
                            else {
                                return 'n/a';
                            }
                        }
                    }
                }
            },
            colors:['#1d5e75','#ccd3e0','#a49a00','#66a5be','#e7eff6'],
            series:[
                {
                    name: 'Face Amounts',
                    data: [
                        ['No Riders', 0.0],
                        ['Accidental', 0.0],
                        ['Disability', 0.0],
                        ['Both', 0.0]
                    ],
                    dataLabels:{
                        pointFormat: '${y}',
                        style:{
                            fontSize: 12,
                            color:'#1d5e75',
                            textShadow:'0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF, 0 0 8px #FFFFFF'
                        }
                    }
                }
            ]
        };
        $('#outputTabs').show();
        $('#chartContainer').highcharts(highchartsConfig);

        /* jshint ignore:start */
        // legacy code
        if($('#payFreq').val() === 'custom') {
            data.payFreq = parseFloat($('#payCustom').val());
        }
        else {
            data.payFreq = parseFloat($('#payFreq').val());
        }
        data.policy = $('#policy').val();
        data.riders = $('#riders').val();
        data.age = getInsuranceAge();

        data.premiumBase = data[data.policy].premiumBase[data.age];
        data.premiumADB = data[data.policy].premiumADB[data.age];
        data.premiumWP = data[data.policy].premiumWP[data.age];
        data.faceMin = data[data.policy].faceMin;
        data.faceMax = data[data.policy].faceMax;

        if (data.policy === 'jgi' || data.policy === 'jsi') data.deductionMin = Math.ceil((((data.faceMin / 1000) * (data.premiumBase + data.premiumADB + data.premiumWP)) + 3.75 ) * 12 / data.payFreq);
        else data.deductionMin = Math.ceil(180 / data.payFreq);
        data.deductionMax = Math.ceil((((data.faceMax / 1000) * (data.premiumBase + data.premiumADB + data.premiumWP)) + 3.75 ) * 12 / data.payFreq);
        data.deduction = $('#deductionAmount').val();
        if(!data.deduction) data.deduction = Math.round(data.deductionMax * .50);
        if(data.deduction > data.deductionMax) data.deduction = data.deductionMax;
        if(data.deduction < data.deductionMin) data.deduction = data.deductionMin;

        var title = '';
        if(data.policy == 'gi') title += 'Guaranteed Issue, Age ' + data.age;
        if(data.policy == 'si') title += 'Simplified Issue Non-Smoker, Age ' + data.age;
        if(data.policy == 'sis') title += 'Simplified Issue Standard, Age ' + data.age;
        if(data.policy == 'jgi') title += 'Juvenile Guaranteed Issue, Age ' + data.age;
        if(data.policy == 'jsi') title += 'Juvenile Simplified Issue, Age ' + data.age;

        $('#title').text(title);

        var subtitle = data.payFreq + ' Payroll Deductions Per Year';
        $('#subtitle').text(subtitle);

        $("#faceAmount").html("$" + data.deduction);

        $('#outputSlider').slider({
            min:data.deductionMin,
            max:data.deductionMax,
            step:1,
            value:data.deduction,
            slide:function(event, ui){
                $("#faceAmount").html("$" + ui.value);
                data.deduction = ui.value;
                var result = calculate(data);
                $("#chartContainer").highcharts().series[0].setData(result);
            }
        });

        $('#outputSlider').draggable();
        $(window).resize();
        /* jshint ignore:end */
        return data;
    }

    /* jshint ignore:start */
    // legacy code, apparently not used anymore?
    function getInsuranceAge(){
        var age;
        var birthDate = $('#birthDate').val().split('-');
        var policyDate = $('#policyDate').val().split('-');
        for(var i = 0; i < birthDate.length; i++){
            birthDate[i] = parseInt(birthDate[i]);
            policyDate[i] = parseInt(policyDate[i]);
        }

        policyDate[0] += 6;
        if(policyDate[0] > 12){
            var months = policyDate[0] - 12;
            policyDate[2] += 1;
            policyDate[0] = months;
        }

        age = policyDate[2] - birthDate[2];
        if(policyDate[0] < birthDate[0]) { age -= 1; }
        if(policyDate[0] === birthDate[0] && policyDate[1] < birthDate[1]) { age -= 1; }

        return age;
    }
    /* jshint ignore:end */

    /* jshint ignore:start */
    // legacy code, apparently no longer used
    function format(cellData, cellFormat){
        var output = '';
        if (cellFormat === '%') {
            output += Math.round(cellData*1000)/10 + '%';
        }
        if (cellFormat === '$') {
            output += '$' + Math.round(cellData).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        if (cellFormat === '#') {
            output += cellData;
        }
        return output;
    }
    /* jshint ignore:end */

    function calculate(data){
        /* jshint ignore:start */
        // legacy code
        var faceBase = Math.floor((Math.round(data.deduction * data.payFreq / 12 * 100)/100 - 3.75) / (data.premiumBase) * 1000);
        var faceADB = Math.floor((Math.round(data.deduction * data.payFreq / 12 * 100)/100 - 3.75) / (data.premiumBase + data.premiumADB) * 1000);
        var faceWP = 1000 * Math.floor(Math.round((Math.round(data.deduction*(data.payFreq/12)*100)/100-(3.75*(1+data.premiumWP)))/(1+data.premiumWP)*100)/100*(1+data.premiumWP)/(data.premiumBase*(1+data.premiumWP))*1000)/1000;
        var faceBoth = 1000 * Math.floor(Math.round((Math.round(data.deduction*(data.payFreq/12)*100)/100-(3.75*(1+data.premiumWP)))/(1+data.premiumWP)*100)/100*(1+data.premiumWP)/(data.premiumBase*(1+data.premiumWP)+data.premiumADB)*1000)/1000;

        if(data.age > 59) {faceWP = 0;}
        if(data.age > 59) {faceBoth = 0;}
        if(data.age > 65) {faceADB = 0;}

        if (faceBase > data.faceMax || faceBase < data.faceMin || (data.policy === 'gi' && data.riders !== 'none')) {faceBase = 0;}
        if (faceADB > data.faceMax  || faceADB < data.faceMin  || (data.policy === 'gi' && data.riders !== 'adb')) {faceADB = 0;}
        if (faceWP > data.faceMax   || faceWP < data.faceMin   || (data.policy === 'gi' && data.riders !== 'wp')) {faceWP = 0;}
        if (faceBoth > data.faceMax || faceBoth < data.faceMin || (data.policy === 'gi' && data.riders !== 'both')) {faceBoth = 0;}

        return [
            ['No Riders', faceBase],
            ['Accidental Death Benefit', faceADB],
            ['Disability Waiver of Premium', faceWP],
            ['Both', faceBoth]
        ];
        /* jshint ignore:end */
    }


    function initialize($component){
        window.jqUiPromise = $.when($.getScript('https://code.jquery.com/ui/1.12.0/jquery-ui.min.js'), $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'));
        initValidation($component);
        initConditionals($component);
    }

    $(document).ready(function(e){

        var $component = $('div.nyl-highcharts-whole-life-calc');
        if ($component.length > 0){
            initialize($component);
        }

    });

})(jQuery);
