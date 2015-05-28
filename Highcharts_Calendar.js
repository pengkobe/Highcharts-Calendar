
//趋势线插件
(function ($) {
    $.fn.extend({
        CalendarPlugin: function (options) {

            var defaults = {
                Selector: "#HiCalendar",
                TitleSelector: "#HiCalendar_Title"
            };
            var rects = [];
            var month_relative = 0;
            var opts = $.extend({}, defaults, options);
            var Selector = opts.Selector;
            var TitleSelector = opts.TitleSelector;

            //render
            InitChart();
            //config tooltips
            setTooltips();
            //Initial events
            BindEvents();

            function InitChart() {
                
                (function (H) {
                    var wrap = H.wrap,
                        seriesTypes = H.seriesTypes;
                    H.wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function (proceed) {
                    });
                }(Highcharts));

                var Month = new Date().getMonth() + 1;
                var Year = new Date().getFullYear();

                //back button
                var str_before = '<button  id="dashBoarderCalendar_before" class="btn btn-link" type="button" style="color: #737373">';
                str_before += '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>';
                str_before += '</button>';
                //forward button
                var str_after = '';
                str_after += '<button id="DashBoarderCalendar_next"  class="btn btn-link" type="button"  style="color: #737373">';
                str_after += '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>';
                str_after += '</button>';
                $(Selector).highcharts({
                    chart: {
                        type: 'heatmap',
                        marginTop: 45,
                        marginBottom: 5,
                        borderWidth: 0,
                        events: {
                            redraw: function () {
                                for (var i = 0; i < rects.length; i++) {
                                    rects[i].destroy(); //destroy it when heatmap redraw
                                }
                                rects = [];
                                drawCalendarRec(rects, this);
                            }
                        }
                    },
                    title: {
                        text: str_before + '<a id="HiCalendar_Title" style="font-size:16px;cursor:pointer;color:#737373">' + Year + '/' + Month + '</a>' + str_after,
                        y: 10,
                        useHTML: true
                    },
                    xAxis: [{
                        categories: ['', '', '', '', '', '', ''],//week title
                        opposite: true,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        tickWidth: 0,
                        labels: {
                            useHTML: true
                        }
                    }],
                    yAxis: {
                        categories: ['1', '2', '3', '4', '5', '6'],
                        title: null,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        labels: {
                            enabled: false
                        }
                    },
                    colorAxis: {
                        min: 0,
                        minColor: '#232325',
                        maxColor: '#777777'
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        formatter: function () {
                            if (this.point.showinfo == '123') {
                                return false; //stop default events
                            } else { return '<b style="color:#FFFF00;font-family:Roboto-Regular;font-size:12px;z-index:10000">' + this.point.name + '</b>'; }
                        },
                        style: { color: '#191919' },
                        borderColor: '#C9CACA',
                        borderWidth: 0,
                        useHTML: true
                    },
                    point: {
                    },
                    series: []
                });
            }

            function drawCalendarRec(rects, chart) {
                if (chart.renderer.forExport) {
                    proceed.call(chart);
                } else {
                    if (chart.series.length == 0) {
                        return;
                    }
                    Highcharts.each(chart.series[0].data, function (point) {
                        //enmpty part
                        if (point != null && point.showinfo == '123') {
                            return; }
                        var plotY = point.plotY, shapeArgs;
                        if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
                            shapeArgs = point.shapeArgs;
                            if (point.isToday) { //show today
                                var rect = chart.renderer.rect(point.plotX - 10, point.plotY + 25, shapeArgs.width, shapeArgs.height, 0).attr({
                                    'stroke-width': 1,
                                    stroke: '#232325',
                                    fill: '#167870'
                                }).on('mouseover', function () {
                                    rect.animate({
                                        fill: '#ABAAAA'
                                    });
                                }).on('mouseout', function () {
                                    rect.animate({
                                        fill: '#167870'
                                    });
                                }).add();
                                rects.push(rect);
                            } else {
                                var rect = chart.renderer.rect(point.plotX - 10, point.plotY + 25, shapeArgs.width, shapeArgs.height, 0).attr({
                                    'stroke-width': 1,
                                    stroke: '#232325',
                                    fill: '#2d2d30'
                                }).on('mouseover', function () {
                                    rect.animate({
                                        fill: '#3a3a3b'
                                    });
                                }).on('mouseout', function () {
                                    rect.animate({
                                        fill: '#2d2d30'
                                    });
                                }).add();
                                rects.push(rect);
                            }
                        }
                    });
                }
            }

            function BindEvents() {
                $('#dashBoarderCalendar_before').on('click', function () {//before
                    changeMonth('B')
                });

                $('#DashBoarderCalendar_next').on('click', function () { //next
                    changeMonth('N')
                });

                $('#CalendarTitle_Dash').on('click', function () {
                    alert('Month Title Clicked!');
                });
            }

            function changeMonth(type) {
                var daystr = $(TitleSelector).html();
                var str = '';
                if (type == 'B') {
                    month_relative--;
                    var dateFormate = daystr.replace(/\//g, "-") + '-1';
                    str = gotoMonth('B', dateFormate);
                }

                if (type == 'N') {
                    month_relative++;
                    var dateFormate = daystr.replace(/\//g, "-") + '-1';
                    str = gotoMonth('N', dateFormate);
                }

                setTooltips();


                $(TitleSelector).empty();
                $(TitleSelector).append('' + str);
            }

            function setTooltips() {
                var data = new Array();
                var datenow = getCurrentMonthLastDay(month_relative);
                var month = datenow.getMonth(); //实际月-1

                var today = new Date().getDate(); //今日

                var date = new Date(datenow.getTime() - ((datenow.getDate() - 2) * 24 * 60 * 60 * 1000)); //获取当月第一天

                var week = (date.getDay() == 0 ? 7 : date.getDay()) - 1; //获取月第一天星期

                var milli = date.getTime(); //月第一天转化为毫秒数

                date = new Date(milli - (week * 24 * 60 * 60 * 1000));//日历控件上显示的第一天
                milli = date.getTime();

                //求出显示的格子数
                var MonthdayNum = getCurrentMonthLastDay(month_relative).getDate();
               
                //格子数
                var RenderNum = 35;

                if ((week == 6 && MonthdayNum == 31) || (week == 7 && MonthdayNum > 29)) {
                    RenderNum = 42;
                }

                var showinfo = "";
                var datavalue = 0;

                for (var i = 0; i < RenderNum; i++) {

                    if (date.getMonth() != month) {
                        data.push({
                            name: date.getMonth() + 1 + "-" + date.getDate(),
                            showinfo: '123',
                            isToday: false,
                            y: 7 - Math.floor(i / 7),//需要逆转
                            x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                            value: 0,
                            dataLabels: { enabled: false }
                        });
                    } else {
                        if (date.getDate() == today && date.getMonth() == (new Date().getMonth())) {//今日格子
                            data.push({
                                name: date.getDate(),
                                isToday: true,
                                datet: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                                y: 7 - Math.floor(i / 7), x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                                value: datavalue,
                                showinfo: '',
                                dataLabels: {
                                    enabled: true,
                                    format: '<a style="color:#CCCCCC;cursor:pointer; font-family:Roboto-Regular;font-size:14px">{point.name}</a>',
                                    useHTML: true
                                }
                            });
                        } else {
                            data.push({
                                name: date.getDate(),
                                isToday: false,
                                datet: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                                y: 7 - Math.floor(i / 7), x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                                value: datavalue,
                                showinfo: '',
                                dataLabels: {
                                    enabled: true,
                                    format: '<a style="color:#A1A1A1;cursor:pointer; font-family:Roboto-Thin;font-size:14px" >{point.name}</a>',
                                    useHTML: true
                                }
                            });

                        }
                    }
                    milli = milli + (1 * 24 * 60 * 60 * 1000);//下一天
                    date = new Date(milli);
                }

                var chart = $(Selector).highcharts();

                var seriesnum = chart.series.length;
                //remove series
                for (var i = 0; i < seriesnum; i++) {
                    chart.series[0].remove();
                }
         
                //add new series
                chart.addSeries({
                    dataLabels: {
                        enabled: false,
                        color: '#ffffff',
                        format: '{point.name}'
                    },
                    data: data,
                    marker: {
                        enabled: false,
                        lineColor: null,
                        lineWidth: 0
                    }
                });
            }

            //change month
            function gotoMonth(type, currentTime) {
                var numberOfValue = currentTime.split("-");
                var month = parseInt(numberOfValue[1]);
                if (type == 'N') {
                    if (month == 12) {
                        var year = parseInt(numberOfValue[0]);
                        return year + 1 + "/0" + 1;
                    } else {
                        return numberOfValue[0] + "/0" + (month + 1);
                    }
                }
                if (type == 'B') {
                    if (month == 1) {
                        var year = parseInt(numberOfValue[0]);
                        return year - 1 + "/" + 12;
                    } else {
                        return numberOfValue[0] + "/0" + (month - 1);
                    }
                }
            }

            //get last day of  current month 
            function getCurrentMonthLastDay(relativeobj) {
                var current = new Date();
                var currentMonth = current.getMonth();
                var nextMonth = ++currentMonth + relativeobj;

                var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);

                var minusDate = 1000 * 60 * 60 * 24;

                return new Date(nextMonthDayOne.getTime() - minusDate);
            }
        }
    })
})(jQuery);


