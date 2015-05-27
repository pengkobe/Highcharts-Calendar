
//日历插件
(function ($) {
    $.fn.extend({
        CalendarRalative_dash: 0,//日历偏移值
        ProjectCode_Calendar: ProjectCode,//项目编号
        CalendarSelector: "#UnitConsumption",//日历选择器
        CalendarTitleSelector: "#CalendarTitle_Dash",//日历标题
        DataUrl: '',//数据请求url
        DataParams: [{ paramName: 'EnergyCost', units_b: '￥', units_a: '' }],//日期框显示参数

        CalendarPlugin: function (options) {
            var me = this;

            var defaults = {
                ProjectCode_Calendar: ProjectCode,
                CalendarSelector: "#UnitConsumption",
                CalendarTitleSelector: "#CalendarTitle_Dash",
                DataUrl: 'Action.ashx?Name=HYD.E3.Business.CustQueryService.GetMainPageCalendarData',
                DataParams: [{ paramName: 'EnergyCost', units_b: '￥', units_a: '' }]
            };

            var opts = $.extend({}, defaults, options);
            me.ProjectCode_Calendar = opts.ProjectCode_Calendar;
            me.CalendarSelector = opts.CalendarSelector;
            me.CalendarTitleSelector = opts.CalendarTitleSelector;
            me.DataUrl = opts.DataUrl;
            me.DataParams = opts.DataParams;

            //初始化日历
            me.InitChart();
            //获取日历数据
            me.GetCalendarDetaisl_dash();
            //初始化事件
            me.BindEvents();
        },

        //元素事件绑定
        BindEvents: function () {
            var me = this;
            $('#dashBoarderCalendar_before').on('click', function () {
                me.DashBoarderCalendar_before()
            });

            $('#DashBoarderCalendar_after').on('click', function () {
                me.DashBoarderCalendar_after()
            });

            $('#CalendarTitle_Dash').on('click', function () {
                me.MonthClick()
            });
        },

        //日历标题点击事件
        MonthClick: function () {
            var me = this;
            $.ajax({
                type: 'post',
                url: 'Action.ashx?Name=HYD.E3.Business.CustQueryService.GetMainPageCalendarData',
                data: { ProjectCode: me.ProjectCode_Calendar, CalendarRalative: me.CalendarRalative_dash },
                dataType: "json",
                success: function (response) {
                    var Energydata = new Array();
                    var Costdata = new Array();
                    var Comparedata = new Array();
                    var category = new Array();
                    var datenow = new Date(response.data[16].DayTime.replace(/-/g, "/")); //("2015/2/23 00:00:00");
                    var month = datenow.getMonth();
                    var today = new Date().getDate();
                    var date = new Date(datenow.getTime() - (datenow.getDate() * 24 * 60 * 60 * 1000));
                    var week = (date.getDay() == 0 ? 7 : date.getDay()) - 1;
                    var milli = date.getTime();
                    date = new Date(milli - (week * 24 * 60 * 60 * 1000));
                    milli = date.getTime();
                    for (var i = 0; i < 42; i++) {
                        if (date.getMonth() != month) {
                        } else {
                            category.push(date.getDate());
                            Energydata.push(
                                {
                                    name: date.getDate(),
                                    y: response.data[i].EnergyConsumption
                                });

                            Costdata.push(
                                {
                                    name: date.getDate(),
                                    y: response.data[i].EnergyCost
                                });

                            Comparedata.push(
                                {
                                    name: date.getDate(),
                                    y: response.data[i].unitConsumption
                                });
                        }
                        milli = milli + (1 * 24 * 60 * 60 * 1000);
                        date = new Date(milli);
                    }

                    $('#monthEnergy123').highcharts({
                        lang: {
                            noData: ''
                        },
                        chart: {
                            type: 'column',
                            spacing: [10, 10, 0, 0],
                            marginLeft: 40,
                            marginRight: 0
                        },
                        title: {
                            text: "",
                            useHTML: true,
                            x: 0, y: 4
                        },
                        xAxis: {
                            categories: category,
                            lineColor: '#4C4B4C',
                            tickColor: '#4C4B4C',
                            tickLength: 2,
                            labels: {
                                style: {
                                    color: '#4C4B4C',
                                    fontSize: '10Pt',
                                    fontFamily: '微软雅黑',
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            },
                            labels: {
                                style: {
                                    color: '#4C4B4C',
                                    fontSize: '10Pt',
                                    fontFamily: 'DINCond-Medium',
                                }
                            },
                            stackLabels: {
                                enabled: false,
                                style: {
                                    fontWeight: 'bold',
                                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                }
                            }
                        },
                        legend: {
                            verticalAlign: 'top',
                            align: 'right',
                            borderWidth: 0,
                            floating: true,
                            enabled: true,
                            layout: 'vertical',
                            itemStyle: { cursor: 'pointer', lineHeight: '18px', color: '#666666' },
                            symbolPadding: 2,
                            itemWidth: 30,
                            symbolWidth: 12,
                            symbolHeight: 8,
                            x: -20
                        },
                        tooltip: {
                            headerFormat: '',
                            pointFormat: '<span style="color:#A6A6A6">{series.name}: </span><b style="">{point.y}',
                            shared: false

                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0,
                                borderWidth: 0
                            }
                        },
                        series: [{
                            color: '#08683E',
                            name: '能耗',
                            dataLabels: {
                                enabled: false,
                                color: '#08683E',
                                format: '{point.name}'
                            },
                            data: Energydata
                        },
                        {
                            color: '#CD4F39',
                            name: '电费',
                            dataLabels: {
                                enabled: false,
                                color: '#D83525',
                                format: '{point.name}'
                            },
                            data: Costdata
                        }
                        ]
                    });
                    $('#Month').modal('show');
                }
            });
        },

        //日历向前导航
        DashBoarderCalendar_before: function () {
            var me = this;

            me.CalendarRalative_dash--;
            me.GetCalendarDetaisl_dash();

            var daystr = $(me.CalendarTitleSelector).html();
            $(me.CalendarTitleSelector).empty();
            //转化为日期
            var dateFormate = daystr.replace(/\//g, "-") + '-1';
            var str = me.gotoBeforeMonth(dateFormate);
            $(me.CalendarTitleSelector).append('' + str);
        },

        //日历向后导航
        DashBoarderCalendar_after: function () {
            var me = this;
            me.CalendarRalative_dash++;
            me.GetCalendarDetaisl_dash();

            var daystr = $(me.CalendarTitleSelector).html();
            $(me.CalendarTitleSelector).empty();
            //转化为日期
            var dateFormate = daystr.replace(/\//g, "-") + '-1';
            var str = me.gotoNextMonth(dateFormate);
            $(me.CalendarTitleSelector).append('' + str);
        },

        //下一月
        gotoNextMonth: function (currentTime) {

            var numberOfValue = currentTime.split("-");
            var month = parseInt(numberOfValue[1]);
            if (month == 12) {
                var year = parseInt(numberOfValue[0]);
                return year + 1 + "/0" + 1;
            } else {
                return numberOfValue[0] + "/0" + (month + 1);
            }
        },

        //前一月
        gotoBeforeMonth: function (currentTime) {
            var numberOfValue = currentTime.split("-");
            var month = parseInt(numberOfValue[1]);
            if (month == 1) {
                var year = parseInt(numberOfValue[0]);
                return year - 1 + "/" + 12;
            } else {
                return numberOfValue[0] + "/0" + (month - 1);
            }
        },

        //初始化渲染图表
        InitChart: function () {
            var me = this;

            var rects = [];
            (function (H) {
                var wrap = H.wrap,
                    seriesTypes = H.seriesTypes;
                H.wrap(H.seriesTypes.heatmap.prototype, 'drawPoints', function (proceed) {
                });
            }(Highcharts));

            var Month = new Date().getMonth() + 1;
            var Year = new Date().getFullYear();

            //前移按钮
            var str_before = '<button  id="dashBoarderCalendar_before" class="btn btn-link" type="button" style="color: #737373">';
            str_before += '<span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span>';
            str_before += '</button>';
            //后移按钮
            var str_after = '';
            str_after += '<button id="DashBoarderCalendar_after"  class="btn btn-link" type="button"  style="color: #737373">';
            str_after += '<span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span>';
            str_after += '</button>';
            $(me.CalendarSelector).highcharts({
                chart: {
                    type: 'heatmap',
                    marginTop: 45,
                    marginBottom: 5,
                    borderWidth: 0,
                    events: {
                        redraw: function () {
                            for (var i = 0; i < rects.length; i++) {
                                rects[i].destroy(); //销毁之前所画对象
                            }
                            rects = [];
                            me.drawCalendarRec(rects, this);
                        }
                    }
                },
                title: {
                    text: str_before + '<a id="CalendarTitle_Dash" style="font-size:16px;cursor:pointer;color:#737373">' + Year + '/' + Month + '</a>' + str_after,
                    y: 10,
                    useHTML: true
                },
                xAxis: [{
                    categories: ['', '', '', '', '', '', ''], ///设置月份标题
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
                    maxColor: Highcharts.getOptions().colors[1]
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        if (this.point.showinfo == '123') {
                            return false; //防冒泡
                        } else { return '<b style="color:#FFFF00;font-family:Roboto-Regular;font-size:12px;z-index:10000">' + this.point.showinfo + '</b>'; }
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
        },

        //获取日历详情
        GetCalendarDetaisl_dash: function () {
            var me = this;
            $.ajax({
                type: 'post',
                url: me.DataUrl,
                data: { ProjectCode: me.ProjectCode_Calendar, CalendarRalative: me.CalendarRalative_dash },
                dataType: "json",
                success: function (response) {
                    var data = new Array();
                    var datenow = new Date(response.data[16].DayTime.replace(/-/g, "/")); //转化为格式如:("2015/2/23 00:00:00")
                    var month = datenow.getMonth(); //实际月-1

                    var today = new Date().getDate(); //今日

                    var date = new Date(datenow.getTime() - ((datenow.getDate() - 2) * 24 * 60 * 60 * 1000)); //获取当月第一天

                    var week = (date.getDay() == 0 ? 7 : date.getDay()) - 1; //获取月第一天星期

                    var milli = date.getTime(); //月第一天转化为毫秒数

                    date = new Date(milli - (week * 24 * 60 * 60 * 1000));//日历控件上显示的第一天
                    milli = date.getTime();

                    //求出显示的格子数
                    var MonthdayNum = me.getCurrentMonthLastDay_py(me.CalendarRalative_dash).getDate();

                    //格子数
                    var RenderNum = 35;

                    if ((week == 6 && MonthdayNum == 31) || (week == 7 && MonthdayNum > 29)) {
                        RenderNum = 42;
                    }

                    var showinfo = "";
                    var datavalue = 0;

                    for (var i = 0; i < RenderNum; i++) {

                        //tooltip显示信息
                        var showinfo = '';
                        var parames = me.DataParams;
                        for (var j = 0; j < parames.length; j++) {
                            showinfo = parames[j].units_b + response.data[i][parames[j].paramName].toFixed(2) + parames[j].units_a;
                        }
                        if (parames.length > 0) {
                            datavalue = response.data[i][parames[0].paramName];
                        }

                        if (date.getMonth() != month) {
                            data.push(
                                    {
                                        name: date.getMonth() + 1 + "-" + date.getDate(),
                                        showinfo: '123',
                                        isToday: false,
                                        y: 7 - Math.floor(i / 7),//需要逆转
                                        x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                                        value: 0,
                                        dataLabels: {
                                            enabled: false
                                        }
                                    });
                        } else {
                            if (date.getDate() == today && date.getMonth() == (new Date().getMonth())) {//今日格子
                                data.push(
                                {
                                    name: date.getDate(),
                                    isToday: true,
                                    datet: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                                    y: 7 - Math.floor(i / 7), x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                                    value: datavalue,
                                    showinfo: showinfo,
                                    dataLabels: {
                                        enabled: true,
                                        format: '<a style="color:#CCCCCC;cursor:pointer; font-family:Roboto-Regular;font-size:14px" onclick="javascript:dateclicked(\'{point.datet}\',\'{point.noteInfo}\')">{point.name}</a>',
                                        useHTML: true
                                    }
                                });
                            } else {
                                data.push(
                                    {
                                        name: date.getDate(),
                                        isToday: false,
                                        datet: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
                                        y: 7 - Math.floor(i / 7), x: date.getDay() == 0 ? 6 : date.getDay() - 1,
                                        value: datavalue,
                                        showinfo: showinfo,
                                        dataLabels: {
                                            enabled: true,
                                            format: '<a style="color:#A1A1A1;cursor:pointer; font-family:Roboto-Thin;font-size:14px" onclick="javascript:dateclicked(\'{point.datet}\',\'{point.noteInfo}\')">{point.name}</a>',
                                            useHTML: true
                                        }
                                    });
                            
                            }
                        }
                        milli = milli + (1 * 24 * 60 * 60 * 1000);//下一天
                        date = new Date(milli);
                    }

                    var realdata = $(me.CalendarSelector).highcharts();

                    var seriesnum = realdata.series.length;
                    //清除原有数据
                    for (var i = 0; i < seriesnum; i++) {
                        realdata.series[0].remove();
                    }

                    realdata.addSeries({
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
            });
        },

        //绘制日期框矩形
        drawCalendarRec: function (rects, chart) {
            if (chart.renderer.forExport) {
                proceed.call(chart); //调用原函数
            } else {

                if (chart.series.length == 0) {
                    return;
                }
                Highcharts.each(chart.series[0].data, function (point) {
                    //空白部分
                    if (point != null && point.showinfo == '123') {
                        return;
                    }
                    var plotY = point.plotY, shapeArgs;
                    if (plotY !== undefined && !isNaN(plotY) && point.y !== null) {
                        shapeArgs = point.shapeArgs;
                        if (point.isToday) { //今日样式
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
        },

        //获取本月的最后一天
        getCurrentMonthLastDay_py: function (relativeobj) {
            var current = new Date();
            var currentMonth = current.getMonth();
            var nextMonth = ++currentMonth + relativeobj;

            var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);

            var minusDate = 1000 * 60 * 60 * 24;

            return new Date(nextMonthDayOne.getTime() - minusDate);
        }
    })

})(jQuery);


