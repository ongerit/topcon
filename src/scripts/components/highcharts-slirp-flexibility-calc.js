'use strict';
var jQuery = jQuery || {};
var Highcharts = Highcharts || {};

(function($, Highcharts){

    function initSLIRPCalc($component){

        var $form = $component.find('.nyl-highcharts-slirp-flexibility-calc__form');

        window.jqUiPromise = window.jqUiPromise || $.when($.getScript('https://code.jquery.com/ui/1.12.0/jquery-ui.min.js'), $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js'));

        initMobileNav($component);
        $component.on('click', '.nyl-highcharts-slirp-flexibility-calc__print-button', window.printContents);

        var validationRules = {
            errorClass: 'nyl-form-error',
            errorPlacement: function(error, element) {
                element.wrap('<div class="nyl-form-error-wrapper" />').after(error);
            },
            rules: {
                years: {
                    required: true,
                    number:true,
                },
                balance: {
                    required: true,
                    number: true,
                },
                withdrawal: {
                    required: true,
                    number: true,
                }
            },
            messages: {
            },
            submitHandler: getResult
        };

        $form.validate( validationRules );

    }

    function initMobileNav($component){
        $component.on('change', '.nyl-highcharts-slirp-flexibility-calc__output-nav--mobile', function(e){
            var $this = $(this);
            var targetTab = $this.val();
            $this.parent().siblings('.nyl-highcharts-slirp-flexibility-calc__output-nav').find('a[href="' + targetTab + '"]').trigger('click');
        });
    }

    function getResult(form){

        var jqUI = window.jqUiPromise;
        jqUI.done(function(){

            // Tealium success event on calculator complete
            NYLAnalytics.trackComplete(form);


            /* jshint ignore:start */
            var $form = $(form);

            // Legacy code

            //Collect initial data
            var data = {
                years: parseFloat($form.find('#years').val()),
                stocks: parseFloat($form.find('#portfolioBlend').val()),
                bonds: 1 - (parseFloat($form.find('#portfolioBlend').val())),
                balance: parseFloat($form.find('#balance').val().replace(/,/g,'')),
                withdrawal: parseFloat($form.find('#withdrawal').val().replace(/,/g,'')),
                stockReturn: [0.3250,-0.0492,0.2155,0.2256,0.0627,0.3173,0.1867,0.0525,0.1661,0.3169,-0.0310,0.3047,0.0762,0.1008,0.0132,0.3758,0.2296,0.3336,0.2858,0.2104,-0.0910,-0.1189,-0.2210,0.2686,0.1088,0.0491,0.1579,0.0549,-0.3700,0.2646,0.1506,0.0211,0.1600,0.3239,0.1369],
                bondReturn: [0.0271,0.0626,0.3265,0.0819,0.1515,0.2213,0.1530,0.0275,0.0789,0.1453,0.0896,0.1600,0.0740,0.0975,-0.0292,0.1846,0.0364,0.0964,0.0870,-0.0082,0.1163,0.0843,0.1026,0.0410,0.0434,0.0243,0.0433,0.0697,0.0524,0.0593,0.0654,0.0784,0.0422,-0.0202,0.0598]
            };
            data.startYear = 1;
            data.endIndex = data.stockReturn.length;
            data.startIndex = data.endIndex - data.years;

            //Calculate Series A (no life insurance)
            var seriesA = {
                age:[],
                balance:[],
                withdrawal:[],
                postWithdrawal:[],
                stockReturn:[],
                bondReturn:[],
                performance:[],
                totalPerformance:[],
                year:[],
                endOfYear:[]
            }

            for(var i = 0; i < data.years; i++){
                seriesA.age[i] = data.age + i;
                if(i == 0) seriesA.balance[i] = data.balance;
                else seriesA.balance[i] = seriesA.endOfYear[i-1];
                if (seriesA.balance[i] - data.withdrawal < 0) seriesA.withdrawal[i] = seriesA.balance[i];
                else seriesA.withdrawal[i] = data.withdrawal;
                seriesA.postWithdrawal[i] = seriesA.balance[i] - seriesA.withdrawal[i];
                seriesA.stockReturn[i] = data.stockReturn[data.startIndex + i];
                seriesA.bondReturn[i] = data.bondReturn[data.startIndex + i];
                seriesA.performance[i] = ((seriesA.postWithdrawal[i] * data.stocks) * data.stockReturn[data.startIndex + i]) + ((seriesA.postWithdrawal[i] * data.bonds) * data.bondReturn[data.startIndex + i]);
                seriesA.totalPerformance[i] = (data.stocks * data.stockReturn[data.startIndex + i]) + (data.bonds * data.bondReturn[data.startIndex + i]);
                seriesA.year[i] = data.startYear + i;
                seriesA.endOfYear[i] = seriesA.postWithdrawal[i] + seriesA.performance[i];
            }

            //Calculate Series B (with life insurance)
            var seriesB = {
                age:[],
                balance:[],
                withdrawal:[],
                postWithdrawal:[],
                stockReturn:[],
                bondReturn:[],
                performance:[],
                totalPerformance:[],
                year:[],
                endOfYear:[]
            }

            for(var i = 0; i < data.years; i++){
                seriesB.age[i] = data.age + i;
                if(i == 0) seriesB.balance[i] = data.balance;
                else seriesB.balance[i] = seriesB.endOfYear[i-1];
                if (seriesB.balance[i] - data.withdrawal < 0) seriesB.withdrawal[i] = seriesB.balance[i];
                else if(seriesB.performance[i-1] < 0) seriesB.withdrawal[i] = 0;
                else seriesB.withdrawal[i] = data.withdrawal;
                seriesB.postWithdrawal[i] = seriesB.balance[i] - seriesB.withdrawal[i];
                seriesB.stockReturn[i] = data.stockReturn[data.startIndex + i];
                seriesB.bondReturn[i] = data.bondReturn[data.startIndex + i];
                seriesB.performance[i] = ((seriesB.postWithdrawal[i] * data.stocks) * data.stockReturn[data.startIndex + i]) + ((seriesB.postWithdrawal[i] * data.bonds) * data.bondReturn[data.startIndex + i]);
                seriesB.totalPerformance[i] = (data.stocks * data.stockReturn[data.startIndex + i]) + (data.bonds * data.bondReturn[data.startIndex + i]);
                seriesB.year[i] = data.startYear + i;
                seriesB.endOfYear[i] = seriesB.postWithdrawal[i] + seriesB.performance[i];
            }

            var seriesDifference = Math.round(seriesB.endOfYear[data.years - 1] - seriesA.endOfYear[data.years - 1]);
            seriesDifference = seriesDifference.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            if(seriesDifference == 0) alert('Based on the information you entered the portfolio has run out of money.');

            //Lay out tabbed windows
            $('#outputTabs').empty();

            var output = '';
            output += '<ul class="nyl-highcharts-slirp-flexibility-calc__output-nav">';
            output += '<li><a href="#tabs-1">Balance</a></li>';
            output += '<li><a href="#tabs-2">Performance</a></li>';
            output += '<li><a href="#tabs-3">Data</a></li>';
            output += '<li><a href="#tabs-4">Data w/ Insurance</a></li>';
            output += '</ul>';
            output += '<div class="nyl-highcharts-slirp-flexibility-calc__output-nav--wrapper">';
            output += '<select class="nyl-highcharts-slirp-flexibility-calc__output-nav--mobile">';
            output += '<option value="#tabs-1">Balance</option>';
            output += '<option value="#tabs-2">Performance</option>';
            output += '<option value="#tabs-3" selected>Data</option>';
            output += '<option value="#tabs-4">Data w/ Insurance</option>';
            output += '</select>';
            output += '</div>';
            output += '<span id="printableArea">';
            output += '<div class="outputWindow"><div id="chartContainer3"></div></div>';
            output += '<div class="outputWindow" id="tabs-1"><div id="chartContainer1" class="newpage"></div></div>';
            output += '<div class="outputWindow" id="tabs-2"><div id="chartContainer2"></div></div>';
            output += '<div class="outputWindow" id="tabs-3"><h2 class="newpage">Data for Account Alone</h2><div class="dataOverflow" id="tableContainer1"></div></div>';
            output += '<div class="outputWindow" id="tabs-4"><h2>Data for Account with Insurance</h2><div class="dataOverflow" id="tableContainer2"></div></div>';
            output += '</span>';
            output += '<div class="field submit"><button type="button" class="nyl-highcharts-slirp-flexibility-calc__print-button">Print</button></div>';
            $('#outputTabs').append(output).show();

            var formatCell = function(cellData, cellFormat){
                var output = '';
                if (cellData < 0) output += '<td class="negative">';
                else output += '<td>';
                if (cellFormat == '%') output += Math.round((cellData + 0.00001) * 10000)/100 + '%';
                if (cellFormat == '$') output += '$' + (Math.round(cellData)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                if (cellFormat == '#') output += cellData;
                output += '</td>'
                return output;
            };

            //Table A
            output = '';
            output += '<table class="dataTable">';
            output += '<tr>';
            output += '<th>Year</th>';
            output += '<th>S&P 500 Return</th>';
            output += '<th>Barclays Bond Index Return</th>';
            output += '<th>Beginning of Year Balance</th>';
            output += '<th>Annual Withdrawal</th>';
            output += '<th>Post-Withdrawal Balance</th>';
            output += '<th>Portfolio Performance</th>';
            output += '<th>Total % Return</th>';
            output += '<th>End of Year Balance</th>';
            output += '</tr>';
            for(var i = 0; i < data.years; i++){
                output += '<tr>';
                output += formatCell(seriesA.year[i],'#');
                output += formatCell(data.stockReturn[data.startIndex + i],'%');
                output += formatCell(data.bondReturn[data.startIndex + i],'%');
                output += formatCell(seriesA.balance[i],'$');
                output += formatCell(seriesA.withdrawal[i],'$');
                output += formatCell(seriesA.postWithdrawal[i],'$');
                output += formatCell(seriesA.performance[i],'$');
                output += formatCell(seriesA.totalPerformance[i],'%');
                output += formatCell(seriesA.endOfYear[i],'$');
                output += '</tr>';
            }
            output += '</table>';
            output += '';
            $('#tableContainer1').append(output);

            //Table B
            output = '';
            output += '<table class="dataTable">';
            output += '<tr>';
            output += '<th>Year</th>';
            output += '<th>S&P 500 Return</th>';
            output += '<th>Barclays Bond Index Return</th>';
            output += '<th>Beginning of Year Balance</th>';
            output += '<th>Annual Withdrawal</th>';
            output += '<th>Post-Withdrawal Balance</th>';
            output += '<th>Portfolio Performance</th>';
            output += '<th>Total % Return</th>';
            output += '<th>End of Year Balance</th>';
            output += '</tr>';
            for(var i = 0; i < data.years; i++){
                output += '<tr>';
                output += formatCell(seriesB.year[i],'#');
                output += formatCell(data.stockReturn[data.startIndex + i],'%');
                output += formatCell(data.bondReturn[data.startIndex + i],'%');
                output += formatCell(seriesB.balance[i],'$');
                output += formatCell(seriesB.withdrawal[i],'$');
                output += formatCell(seriesB.postWithdrawal[i],'$');
                output += formatCell(seriesB.performance[i],'$');
                output += formatCell(seriesB.totalPerformance[i],'%');
                output += formatCell(seriesB.endOfYear[i],'$');
                output += '</tr>';
            }
            output += '</table>';
            output += '';
            $('#tableContainer2').append(output);


            Highcharts.setOptions({
                lang: {
                    thousandsSep: ','
                }
            });


            $('#chartContainer1').highcharts({
                credits:false,
                chart: {
                    type: 'line'
                },
                title: {
                    style: {
                        fontSize: '26px',
                        fontFamily: 'alda-web-nyl',
                        color: '#1d5e75'
                    },
                    text: 'End of Year Balance With and Without Life Insurance'
                },
                tooltip: {
                    formatter: function() {
                        return 'Year ' + this.x + '<br/><b> $' + Math.round(this.y).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                },
                xAxis: {
                    categories: seriesA.year
                },
                colors:['#1d5e75','#66a5be','#a49a00','#e7eff6','#ccd3e0','#edebcc'],
                series:[
                    {
                        name:'Account without Insurance',
                        data: seriesA.endOfYear
                    },
                    {
                        name:'Account with Insurance',
                        data: seriesB.endOfYear
                    }
                ]
            });

            $('#chartContainer2').highcharts({
                credits:false,
                chart: {
                    type: 'line'
                },
                title: {
                    style: {
                        fontSize: '26px',
                        fontFamily: 'alda-web-nyl',
                        color: '#1d5e75'
                    },
                    text: 'Portfolio Performance'
                },
                tooltip: {
                    formatter: function() {
                        return 'Year ' + this.x + '<br/><b>' + Math.round(this.y*1000)/10 + '%';
                    }
                },
                xAxis: {
                    categories: seriesA.year
                },
                colors:['#1d5e75','#66a5be','#a49a00','#e7eff6','#ccd3e0','#edebcc'],
                series:[
                    {
                        name:'S&P 500',
                        data: seriesA.stockReturn
                    },
                    {
                        name:'Barclays Agg. Bond Index',
                        data: seriesA.bondReturn
                    },
                    {
                        name:'Portfolio Performance',
                        data: seriesA.totalPerformance
                    }
                ]
            });

            $('#chartContainer3').highcharts({
                credits:false,
                chart: {
                    type: 'pie'
                },
                title: {
                    style: {
                        fontSize: '16px',
                        fontFamily: 'alda-web-nyl',
                        color: '#7d7d7d',
                    },
                    text: 'Based on the historical data, over the past <strong>' + data.years + ' years</strong> your portfolio would have <strong>$' + seriesDifference + '</strong> more if you had used cash value from life insurance to supplement your income in years after a market decline. Of course, accessing cash value reduces cash value and death benefit and accrues interest.',
                },
                subtitle: {
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: 'alda-web-nyl',
                        color: '#7d7d7d',
                        width: '100%'
                    },
                    text: 'Returns based on a portfolio of '+ Math.round(data.stocks*100) +'% stocks, '+ Math.round(data.bonds*100) +'% bonds.',
                },
                tooltip: {
                    enabled:true,
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>';
                    }
                },
                plotOptions:{
                    pie:{
                        dataLabels:{
                            enabled:false
                        }
                    }
                },
                colors:['#1d5e75','#ccd3e0','#a49a00','#edebcc','#66a5be','#e7eff6'],
                series: [
                    {
                        name:'Portfolio',
                        data:[{
                            name:'Stocks',
                            y:data.stocks
                        },
                        {
                            name:'Bonds',
                            y:data.bonds
                        }]
                    }
                ]
            });

            try {
                $('#outputTabs').tabs('destroy');
            } catch (exception) {}
            $('#outputTabs').tabs({active:2});
            $(window).resize();
            /* jshint ignore:end */
        });
    }


    // legacy code
    window.printContents = function(){
        /* jshint ignore:start */
        var title = $('#infoArea').html();
        var disclaimer = $('#disclaimerArea').html();
        var address = $('#addressArea').html();
        var output = '';
        output += '<style>';
        output += 'body{color:#1d5e75; font-family:segoe ui, sans-serif;}';
        output += 'h2{font-family:Alda OT; font-weight:100; text-align:center;}';
        output += 'td{padding:5px;}';
        output += '@media print {.newpage    {page-break-before: always;}}';
        output += '</style>';
        if (title){
            output += title;
        }
        if (disclaimer){
            output += disclaimer;
        }
        output += '<hr />';
        output += '<strong>Portfolio Blend:</strong> ' + $('#portfolioBlend option:selected').text() + '<br />';
        output += '<strong>Years:</strong> ' + $('#years').val() + '<br />';
        output += '<strong>Beginning of Year Balance:</strong> ' + $('#balance').val().replace(/,/g,'') + '<br />';
        output += '<strong>Annual Withdrawal:</strong> ' + $('#withdrawal').val().replace(/,/g,'') + '<br /><br />';
        output += '<div class="content">';
        output += $('#printableArea').html();
        output += '<hr />';
        if (address){
            output += address;
        }
        output += '</div>';

        var w = window.open();
        w.document.write(output);
        w.document.close();
        w.print();
        w.close();
        /* jshint ignore:end */
    };

    $(document).ready(function(){
        var $component = $('div.nyl-highcharts-slirp-flexibility-calc');
        if ($component.length > 0){
            $component.each(function(){
                var $this = $(this);
                initSLIRPCalc($this);
            });
        }
    });

})(jQuery, Highcharts);
