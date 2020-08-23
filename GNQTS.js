var FUNDS = 10000000;
var DAYNUMBER;
var STOCKNUMBER = 10;
var RUNTIMES;
var DELTA;
var COMPANYNUMBER;
var company_name = [];
var s_company = [];
var data;

$(function () { //tab
    var $li = $('ul.tab-title li');
    $($li.eq(0).addClass('active').find('a').attr('href')).siblings('.tab-inner').hide();

    $li.click(function () {
        $($(this).find('a').attr('href')).show().siblings('.tab-inner').hide();
        $(this).addClass('active').siblings('.active').removeClass('active');

    });
});
$(function () { //datepicker
    //var parseIn;
    var year;
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "2009:2019",
        showButtonPanel: true, // 顯示介面
        showMonthAfterYear: true, // 月份顯示在年後面
        dateFormat: 'yy-mm',
        showButtonPanel: true,
        monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        currentText: "本月", // 本月按鈕
        closeText: "送出",
        onClose: function (dateText, inst) {
            var month = $("#ui-datepicker-div .ui-datepicker-month option:selected").val(); //得到選則的月份值
            //增加0判斷
            var parseIntok = parseInt(month) + 1;
            /*if (parseIntok < 10) {
                parseIn = '0' + parseIntok;
            } else {
                parseIn = parseIntok;
            }*/
            year = $("#ui-datepicker-div .ui-datepicker-year option:selected").val(); //得到選則的年份值
            $('#datepicker').val(year + '-' + parseIntok); //给input赋值，其中要對月值加1才是實際的月份
            console.log(year, parseIntok);
            countFunds(year, parseIntok);
        }
    });
});

function STOCK() {
    this.data = [];
    this.investment_number = [];
    this.company_name = "",
        this.totalMoney = [];
    this.fs = [];
    this.locate = [];
    this.dMoney = 0;
    this.myMoney = 0;
    this.counter = 0;
    this.mx = 0;
    this.my = 1;
    this.m = 0;
    this.daily_risk = 0;
    this.trend = 0;
    this.day = 0;
    this.Y = 0;
    this.y_line = [];
    this.Y_line = function () {
        this.Y = this.m * this.day + FUNDS;
        this.y_line.push(this.Y);
    };
    this.init = function () {
        for (var j = 0; j < this.counter; j++) {
            this.fs[j] = [];
        }
        for (var j = 0; j < DAYNUMBER; j++) {
            this.totalMoney[j] = 0;
        }
    }
};
function countTrend(stock) {
    for (var j = 0; j < stock.length; j++) {
        if (stock[j].counter != 0) {
            stock[j].dMoney = Math.floor(FUNDS / stock[j].counter);
            stock[j].myMoney += FUNDS % stock[j].counter;
        }
        for (var k = 0; k < stock[j].counter; k++) {
            stock[j].investment_number[k] = Math.floor(stock[j].dMoney / parseFloat(data[1][s_company[stock[j].locate[k]]]));
            stock[j].myMoney += stock[j].dMoney - (stock[j].investment_number[k] * parseFloat(data[1][s_company[stock[j].locate[k]]]));
            stock[j].fs[k][0] = stock[j].investment_number[k] * parseFloat(data[1][s_company[stock[j].locate[k]]]);
        }
        stock[j].totalMoney[0] = FUNDS;
    }
    for (var j = 0; j < DAYNUMBER - 1; j++) {
        for (var k = 0; k < stock.length; k++) {
            for (var h = 0; h < stock[k].counter; h++) {
                stock[k].totalMoney[j + 1] += stock[k].investment_number[h] * parseFloat(data[j + 2][s_company[stock[k].locate[h]]]);
                stock[k].fs[h][j + 1] = stock[k].investment_number[h] * parseFloat(data[j + 2][s_company[stock[k].locate[h]]]);
            }
            stock[k].totalMoney[j + 1] += stock[k].myMoney;
            stock[k].mx += (j + 2) * (stock[k].totalMoney[j + 1] - FUNDS);
            stock[k].my += (j + 2) * (j + 2);
        }
    }
    for (var j = 0; j < stock.length; j++) {
        if (stock[j].counter != 0) {
            stock[j].m = stock[j].mx / stock[j].my;
        }
        for (var k = 0; k < DAYNUMBER; k++) {
            stock[j].day = k + 1;
            stock[j].Y_line();
            stock[j].daily_risk += (stock[j].totalMoney[k] - stock[j].Y) * (stock[j].totalMoney[k] - stock[j].Y);
        }
        stock[j].daily_risk = Math.sqrt(stock[j].daily_risk / DAYNUMBER);
        if (stock[j].m < 0) {
            stock[j].trend = stock[j].m * stock[j].daily_risk;
        } else {
            stock[j].trend = stock[j].m / stock[j].daily_risk;
        }
    }
    return stock;
}
function countFunds(year, month) {
    QTSTYPE = document.getElementById("qts_list").value;
    console.log(QTSTYPE);
    switch (QTSTYPE){
        case "QTS":
            document.getElementById("tab_f").innerHTML="QTS";
            break;
        case "GQTS":
            document.getElementById("tab_f").innerHTML="GQTS";
            break;
        case "GNQTS":
            document.getElementById("tab_f").innerHTML="GNQTS";
            break;
    }
    TRAINTYPE = document.getElementById("train_list").value;
    console.log(TRAINTYPE);
    console.log(month);
    switch (TRAINTYPE) {
        case "Y2Y":
            var csv = 'DJI_30/Y2Y/train_' + year + '(' + year + ' Q1).csv';
            break;
    
        case "Q2Q":
            if(month == 1 || month == 2 || month == 3){ //Q1
                console.log("Q1");
                var csv = 'DJI_30/Q2Q/train_' + year +'_Q1'+ '(' + year + ' Q1).csv';
            }else if(month == 4 || month == 5 || month == 6){ //Q2
                console.log("Q2");
                var csv = 'DJI_30/Q2Q/train_' + year +'_Q2'+ '(' + year + ' Q1).csv';
            }else if(month == 7 || month == 8 || month == 9){ //Q3
                console.log("Q3");
                var csv = 'DJI_30/Q2Q/train_' + year +'_Q3'+ '(' + year + ' Q1).csv';
            }else{ //Q4
                console.log("Q4");
                var csv = 'DJI_30/Q2Q/train_' + year +'_Q4'+ '(' + year + ' Q1).csv';
            }
            break;
        case "M2M":
            if (month < 10) {
                month = '0' + month;
            }
            var csv = 'DJI_30/M2M/train_' + year + '_' + month + '(' + year + ' Q1).csv';
            break;
    }

    DELTA = 0.0004;
    RUNTIMES = 10000;
    var c = 30;
    s_company = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    COMPANYNUMBER = c;
    d3.csv(csv, function (d) {
        data = d;
        console.log(d);
        DAYNUMBER = data.length - 1;

        var stock = [];

        for (var j = 0; j < COMPANYNUMBER; j++) {
            company_name[j] = data[0][s_company[j]];
        }
        for (var j = 0; j < COMPANYNUMBER; j++) {
            stock[j] = new STOCK();
            for (var k = 0; k < COMPANYNUMBER; k++) {
                if (k != j) {
                    stock[j].data[k] = 0;
                } else {
                    if (stock[j].counter != 0) {
                        stock[j].company_name += ", ";
                    }
                    stock[j].data[k] = 1;
                    stock[j].company_name += company_name[k];
                    stock[j].locate[stock[j].counter] = k;
                    stock[j].counter++;
                }
            }
            stock[j].init();
        }
        stock = countTrend(stock);
        var best_answer = new STOCK();
        var worst_answer = new STOCK();
        best_answer.trend = 0;
        for (var j = 0; j < COMPANYNUMBER; j++) {
            best_answer.data[j] = 0;
        }
        worst_answer.trend = 10000;

        var change_number = [];
        for (var j = 0; j < COMPANYNUMBER; j++) {
            change_number[j] = 0.5;
        }

        for (var i = 0; i < RUNTIMES; i++) {
            for (var j = 0; j < COMPANYNUMBER; j++) {
                change_number[j] = Math.floor(change_number[j] * 1000) / 1000;
            }
            var r_stock = [];
            for (var j = 0; j < STOCKNUMBER; j++) {
                r_stock[j] = new STOCK();
                for (var k = 0; k < DAYNUMBER; k++) {
                    r_stock[j].totalMoney[k] = 0;
                }
                for (var k = 0; k < COMPANYNUMBER; k++) {
                    var r = Math.random();

                    if (r > change_number[k]) {
                        r_stock[j].data[k] = 0;
                    } else {
                        r_stock[j].data[k] = 1;
                        if (r_stock[j].counter != 0) {
                            r_stock[j].company_name += ", ";
                        }
                        r_stock[j].company_name += company_name[k];
                        r_stock[j].locate[r_stock[j].counter] = k;
                        r_stock[j].counter++;
                    }
                }
                r_stock[j].init();
            }

            r_stock = countTrend(r_stock);
            var good_answer = r_stock[0];
            var bad_answer = r_stock[r_stock.length - 1];
            for (var j = 0; j < STOCKNUMBER; j++) {
                if (good_answer.trend < r_stock[j].trend) {
                    good_answer = r_stock[j];
                } else if (bad_answer > r_stock[j].trend) {
                    bad_answer = r_stock[j];
                }
            }
            if (best_answer.trend < good_answer.trend) {
                best_answer = good_answer;
                //console.log("i=", i);
                //console.log(best_answer.counter);
                //console.log(best_answer.trend);
            }

            if (worst_answer.trend > bad_answer.trend) {
                worst_answer = bad_answer;
            }

            for (var j = 0; j < COMPANYNUMBER; j++) {
                switch (QTSTYPE) {
                    case "QTS":
                        if (good_answer.data[j] > bad_answer.data[j]) {
                            change_number[j] += DELTA;
                        } else if (good_answer.data[j] < bad_answer.data[j]) {
                            change_number[j] -= DELTA;
                        }
                        break;

                    case "GQTS":
                        if (best_answer.data[j] > bad_answer.data[j]) {
                            change_number[j] += DELTA;
                        } else if (best_answer.data[j] < bad_answer.data[j]) {
                            change_number[j] -= DELTA;
                        }
                        break;

                    case "GNQTS":
                        if (best_answer.data[j] > bad_answer.data[j]) {
                            if (change_number[j] < 0.5) {
                                change_number[j] = 1 - change_number[j];
                            }
                            change_number[j] += DELTA;
                        } else if (best_answer.data[j] < bad_answer.data[j]) {
                            if (change_number[j] > 0.5) {
                                change_number[j] = 1 - change_number[j];
                            }
                            change_number[j] -= DELTA;
                        }
                        break;
                }
            }
        }


        //console.log(best_answer.counter);
        var best_name = "";
        for (var j = 0; j < best_answer.counter; j++) {
            best_name += company_name[best_answer.locate[j]];
            best_name += ", ";
        }
        var day_label = [];
        for (var j = 0; j < DAYNUMBER; j++) {
            day_label.push("day " + (j + 1));
        }

        //==============draw

        var dataset = [];  //30檔資金水位
        for (var j = 0; j < COMPANYNUMBER; j++) {
            dataset.push({
                label: stock[j].company_name,
                lineTension: 0,
                backgroundColor: getbgcolor(),
                borderColor: getbdcolor(),
                borderWidth: 2,
                data: stock[j].totalMoney,
                fill: false,
            });
        }
        dataset.push({
            label: "best : " + best_answer.company_name,
            lineTension: 0,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 5,
            data: best_answer.totalMoney,
            fill: false,
        });
        dataset.push({
            label: "趨勢線",
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 5,
            borderDash: [5, 5],
            data: best_answer.y_line,
            fill: false,
        });

        var lineChartData = {
            labels: day_label,
            datasets: dataset,
        }
        $('#myChart').remove();
        $('#tab01').append('<canvas id="myChart" width="40vh" height="20vh"></canvas>');
        var ctx = document.getElementById('myChart');
        line_chart = new Chart(ctx, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                legend: {
                    display: true,
                },
                tooltips: {
                    enabled: true
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true
                    }]
                }, 
                title: {
                    display: true,
                    text: '資金水位',
                    fontSize:16
                },
            }
        });
        stock = quickSort(stock);
        stock.reverse();
        var neg_stock = [];

        for (var j = 0; j < COMPANYNUMBER; j++) {
            if (stock[stock.length - 1].trend < 0) {
                neg_stock.push(stock.pop());
            }
        }

        neg_stock.reverse();

        var dataset2 = [];  //趨勢值正排序
        dataset2.push({
            label: "best : " + best_answer.company_name,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: [best_answer.trend],
        });
        var rank = 1;
        for (var j = 0; j < stock.length; j++) { //趨勢值正
            dataset2.push({
                label: stock[j].company_name,
                backgroundColor: getbdcolor(),
                borderColor: getbdcolor(),
                borderWidth: 1,
                data: [stock[j].trend],
            });
        }
        var dataset2_1 = []; //趨勢值負排序
        for (var j = 0; j < neg_stock.length; j++) { // 趨勢值負
            dataset2_1.push({
                label: neg_stock[j].company_name,
                backgroundColor: getbgcolor(),
                borderColor: getbdcolor(),
                borderWidth: 1,
                data: [neg_stock[j].trend],
            });
        }




        var barChartData2 = {   //趨勢值正
            datasets: dataset2,
        };
        $('#myChart1').remove();
        $('#myChart1-1').remove();
        $('#tab02').append('<canvas id="myChart1" width="20vh" height="20vh"></canvas><canvas id="myChart1-1" width="20vh" height="20vh"></canvas>');

        var ctx1 = document.getElementById('myChart1');
        bar_chart = new Chart(ctx1, {
            type: 'bar',
            data: barChartData2,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                    }]
                },
                title: {
                    display: true,
                    text: '趨勢值正',
                    fontSize:16
                },
            }
        });

        var barChartData2_1 = {   //趨勢值負
            datasets: dataset2_1,
        };

        var ctx1_1 = document.getElementById('myChart1-1');
        bar_chart = new Chart(ctx1_1, {
            type: 'bar',
            data: barChartData2_1,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                    }]
                },
                title: {
                    display: true,
                    text: '趨勢值負',
                    fontSize:16
                },
            }
        });

        var dataset3 = []; //GNQTS

        for (var j = 0; j < best_answer.counter; j++) {
            dataset3.push({
                label: company_name[best_answer.locate[j]],
                lineTension: 0,
                backgroundColor: getbgcolor(),
                borderColor: getbdcolor(),
                borderWidth: 2,
                data: best_answer.fs[j],
                fill: false,
                yAxisID: 'y-axis-1',
            });
        }

        dataset3.push({
            label: "best : " + best_answer.company_name,
            lineTension: 0.4,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 5,
            data: best_answer.totalMoney,
            fill: false,
            yAxisID: 'y-axis-2',
        });

        var bestLineChartData = {
            labels: day_label,
            datasets: dataset3,
        }

        dataset3.push({
            label: "趨勢線",
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 5,
            borderDash: [5, 5],
            data: best_answer.y_line,
            fill: false,
            yAxisID: 'y-axis-2',
        });
        $('#myChart2').remove();
        $('#tab03').append('<canvas id="myChart2" width="40vh" height="20vh"></canvas>');
        var ctx2 = document.getElementById('myChart2');
        var best_line_chart = new Chart(ctx2, {
            type: 'line',
            data: bestLineChartData,
            options: {
                responsive: true,
                legend: {
                    display: true,
                },
                tooltips: {
                    enabled: true
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        type: 'linear',
                        display: true,
                        position: 'left',
                        id: 'y-axis-1',
                    }, {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        id: 'y-axis-2',

                        // grid line settings
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    }]
                },
                title: {
                    display: true,
                    text: QTSTYPE,
                    fontSize:16
                },
            }
        });





    });
}

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const less = [];
    const greater = [];
    const pivot = arr[arr.length - 1];
    for (let i = 0; i < arr.length - 1; ++i) {
        const num = arr[i];
        if (num.trend < pivot.trend) {
            less.push(num);
        } else {
            greater.push(num);
        }
    }
    return [...quickSort(less), pivot, ...quickSort(greater)];
}
function getbgcolor() {
    var numone = parseInt(Math.random() * (255 + 1), 10);
    var numtwo = parseInt(Math.random() * (255 + 1), 10);
    var numthree = parseInt(Math.random() * (255 + 1), 10);

    color = "rgba(" + numone + "," + numtwo + "," + numthree + ",0.2)";
    return color;
}
function getbdcolor() {
    var numone = parseInt(Math.random() * (255 + 1), 10);
    var numtwo = parseInt(Math.random() * (255 + 1), 10);
    var numthree = parseInt(Math.random() * (255 + 1), 10);

    color = "rgba(" + numone + "," + numtwo + "," + numthree + ",0.8)";
    return color;
}