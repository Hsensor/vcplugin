define(["jquery", "resources/js/utils", "moment"], function($, utils, moment) {

    var url = app.webPath + "/rest/clusters/stats";
    var moniterTimers = [];
    var colors = ["#ee685d", " #973fed"]; // ["#27b5ff","#29ff6f"];
    var curDate;

    // 清除监控产生的定时器
    function clearMoniterTimers() {
        if (moniterTimers.length) {
            for (var i = 0; i < moniterTimers.length; i++) {
                clearInterval(moniterTimers[i]);
            }
            moniterTimers.splice();
        }
    }

    function initCluster() {
        clearMoniterTimers();
        renderClusterCharts($(".cluster-charts-wrap .queryButton").val());
        initSummary();
    }

    $(".cluster-charts-wrap .queryButton").change(function() {
        var $this = $(this);
        var type = $this.val();

        if (type !== "define") {
            renderClusterCharts(type);
            $this.siblings(".time-input").hide();
            $("#cluster_start_input").off("dp.change", setEndMinDate);
            $("#cluster_end_input").off("dp.change", setStartMaxDate);
        } else {
            curDate = new Date();

            $('#cluster_start_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));
            $('#cluster_end_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));
            $('#cluster_start_input').data("DateTimePicker").clear();
            $('#cluster_end_input').data("DateTimePicker").clear();

            $("#cluster_start_input").on("dp.change", setEndMinDate);
            $("#cluster_end_input").on("dp.change", setStartMaxDate);

            $this.siblings(".time-input").show();
        }
    })

    function setEndMinDate(e) {
        if (new Date(e.date._d).getTime() > curDate.getTime()) {
            return;
        }
        $('#cluster_end_input').data("DateTimePicker").minDate(e.date);
        renderClusterCharts("define");
    }

    function setStartMaxDate(e) {
        $('#cluster_start_input').data("DateTimePicker").maxDate(e.date);
        renderClusterCharts("define");
    }

    function renderClusterCharts(type) {
        clearMoniterTimers();

        var performanceMetrics = [
            { name: "cluster_iops", metric: "IOPS", unit: "iops", statistics: "Sum" },
            { name: "cluster_bandwidth", metric: "吞吐量", unit: "KBps", statistics: "Sum" },
            { name: "cluster_iolatency", metric: "延时", unit: "ms", statistics: "Average" }
        ];
        //startTimeInUsecs,endTimeInUsecs
        var startD = new Date();
        var startTimeInUsecs, intervalInSecs;
        var endTimeInUsecs = startD.getTime();

        if (type == "realtime") {
            startTimeInUsecs = new Date(+startD - 3 * 60 * 60 * 1000).getTime();
            intervalInSecs = 60;
        } else if (type == "day") {
            startTimeInUsecs = new Date(+startD - 24 * 60 * 60 * 1000).getTime();
            intervalInSecs = 5 * 60;
        } else if (type == "week") {
            startTimeInUsecs = new Date(+startD - 7 * 24 * 60 * 60 * 1000).getTime();
            intervalInSecs = 30 * 60;
        } else if (type == "month") {
            startTimeInUsecs = new Date(startD.setMonth(startD.getMonth() - 1)).getTime();
            intervalInSecs = 2 * 60 * 60;
        } else if (type == "year") {
            startTimeInUsecs = new Date(startD.setMonth(startD.getMonth() - 12)).getTime();
            intervalInSecs = 24 * 60 * 60;
        } else {
            if (!$('#cluster_start_input').find("input").val() || !$('#cluster_end_input').find("input").val()) {
                return;
            }
            var startInputDate = new Date($('#cluster_start_input').find("input").val());
            var endInputDate = new Date($('#cluster_end_input').find("input").val());

            var diffTime = endInputDate.getTime() - startInputDate.getTime();
            if (diffTime <= 0) {
                return;
            } else {
                if (diffTime <= 3 * 60 * 60 * 1000) {
                    intervalInSecs = 60;
                } else if (diffTime <= 24 * 60 * 60 * 1000) {
                    intervalInSecs = 5 * 60;
                } else if (diffTime <= 7 * 24 * 60 * 60 * 1000) {
                    intervalInSecs = 30 * 60;
                } else if (diffTime <= (new Date(startInputDate).getTime() - new Date(new Date(startInputDate).setMonth(new Date(startInputDate).getMonth() - 1)).getTime())) {
                    // 当前输入的时间戳-当前上一个月的时间戳
                    intervalInSecs = 2 * 60 * 60;
                } else {
                    intervalInSecs = 24 * 60 * 60;
                }
                startTimeInUsecs = startInputDate.getTime();
                endTimeInUsecs = endInputDate.getTime();
            }
        };

        for (var i = 0; i < performanceMetrics.length; i++) {
            utils.renderChart(renderChartCB, performanceMetrics[i], {
                startTimeInUsecs: startTimeInUsecs,
                endTimeInUsecs: endTimeInUsecs,
                intervalInSecs: intervalInSecs,
                loadInTime: type == "define" ? false : true
            });
        }
    };

    function renderChartCB(chartOptions, metric, param) {

        chartOptions.chart.renderTo = 'chart-' + metric.name;
        if (metric.unit == "iops") {
            chartOptions.yAxis.labels.formatter = function() {
                return (this.value).toFixed(2);
            }
            chartOptions.tooltip = {
                formatter: function() {
                    var s = '<b>' + Highcharts.dateFormat('%m-%d %H:%M:%S', this.x) + '</b>';
                    this.points.forEach(function(item) {
                        s += '<br/><tspan style="fill:' + item.series.color + '" x="8" dy="15">●</tspan><tspan>' + item.series.name + ': ' +
                            (item.y).toFixed(2) + " iops</tspan>";
                    })
                    return s;
                },
                shared: true
            }
        } else if (metric.unit == "KBps") {
            chartOptions.yAxis.labels.formatter = function() {
                return utils.conversion(this.value, { decimalCount: 2, endUnit: "KB", need_not_unit: true });
            }

            chartOptions.tooltip = {
                formatter: function() {
                    var s = '<b>' + Highcharts.dateFormat('%m-%d %H:%M:%S', this.x) + '</b>';
                    this.points.forEach(function(item) {
                        s += '<br/><tspan style="fill:' + item.series.color + '" x="8" dy="15">●</tspan><tspan>' + item.series.name + ': ' +
                            utils.conversion(item.y, { decimalCount: 2, endUnit: "KB", need_not_unit: true }) + " KBps</tspan>";
                    })
                    return s;
                },
                shared: true
            }
        } else {
            chartOptions.yAxis.labels.formatter = function() {
                return (this.value / 1000000).toFixed(2);
            }
            chartOptions.tooltip = {
                formatter: function() {
                    var s = '<b>' + Highcharts.dateFormat('%m-%d %H:%M:%S', this.x) + '</b>';
                    this.points.forEach(function(item) {
                        s += '<br/><tspan style="fill:' + item.series.color + '" x="8" dy="15">●</tspan><tspan>' + item.series.name + ': ' +
                            (item.y / 1000000).toFixed(2) + " ms" + "</tspan>";
                    })
                    return s;
                },
                shared: true
            }
        }

        $.when(
            $.ajax({
                type: "get",
                url: app.webPath + "/rest/clusters/stats",
                data: {
                    metrics: metric.name + "_r",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    statistics: metric.statistics
                },
                dataType: "json"
            }),
            $.ajax({
                type: "get",
                url: app.webPath + "/rest/clusters/stats",
                data: {
                    metrics: metric.name + "_w",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    statistics: metric.statistics
                },
                dataType: "json"
            })
        ).then(function(result_r, result_w) {

            chartOptions.series = [];

            // 对图表进行排序，防止highcharts抛出警告
            var datapoints_r = utils.changePointToArr(result_r[0].entities[0].values.datapoints).sort(function(datapointA, datapointB) {
                return datapointA[0] - datapointB[0];
            });
            var datapoints_w = utils.changePointToArr(result_w[0].entities[0].values.datapoints).sort(function(datapointA, datapointB) {
                return datapointA[0] - datapointB[0];
            });

            if (param.loadInTime) {
                // 当下拉选择不是自定义时间时 实时加载，下次图表绘制的开始时间为上次的结束时间
                if (datapoints_r.length && datapoints_w.length) {
                    if (datapoints_r.length >= datapoints_w.length) {
                        param.endTimeInUsecs = new Date(datapoints_r[datapoints_r.length - 1][0]).toISOString();
                    } else if (datapoints_r.length < datapoints_w.length) {
                        param.endTimeInUsecs = new Date(datapoints_w[datapoints_w.length - 1][0]).toISOString();
                    }
                }
                chartOptions.chart.events.load = load;
            }

            chartOptions.series.push({
                color: colors[0],
                name: "读 " + metric.metric,
                data: datapoints_r
            });

            chartOptions.series.push({
                color: colors[1],
                name: "写 " + metric.metric,
                data: datapoints_w
            });

            if (!datapoints_r || !datapoints_r || !datapoints_r.length || !datapoints_w.length) {
                chartOptions.series[0].data = utils.noData(param.startTimeInUsecs, param.endTimeInUsecs, param.intervalInSecs);
                chartOptions.series[1].data = utils.noData(param.startTimeInUsecs, param.endTimeInUsecs, param.intervalInSecs);
            }
            new Highcharts.Chart(chartOptions);

        }).fail(function() {

            chartOptions.series = [];
            var r = {
                color: colors[0],
                name: "读 " + metric.metric,
                data: utils.noData(param.startTimeInUsecs, param.endTimeInUsecs, param.intervalInSecs)
            };

            var w = {
                color: colors[1],
                name: "写 " + metric.metric,
                data: utils.noData(param.startTimeInUsecs, param.endTimeInUsecs, param.intervalInSecs)
            };

            chartOptions.series.push(r);
            chartOptions.series.push(w);

            new Highcharts.Chart(chartOptions);
        });

        function load() {
            if (!this.series || !this.series[0]) {
                return;
            }
            ajaxLoadFn(this);
        }

        function ajaxLoadFn(that) {
            var startTimeInUsecs = new Date(+new Date(param.endTimeInUsecs) + param.intervalInSecs * 1000).getTime();
            moniterTimers.push(window.setInterval(function() {
                var endTimeInUsecs = new Date(startTimeInUsecs + param.intervalInSecs * 1000).getTime();

                $.when(
                    $.ajax({
                        type: "get",
                        url: app.webPath + "/rest/clusters/stats",
                        data: {
                            metrics: metric.name + "_r",
                            startTimeInUsecs: startTimeInUsecs*Math.pow(10,3),
                            endTimeInUsecs: endTimeInUsecs*Math.pow(10,3),
                            intervalInSecs: param.intervalInSecs,
                            statistics: metric.statistics
                        },
                        dataType: "json"
                    }),
                    $.ajax({
                        type: "get",
                        url: app.webPath + "/rest/clusters/stats",
                        data: {
                            metrics: metric.name + "_w",
                            startTimeInUsecs: startTimeInUsecs*Math.pow(10,3),
                            endTimeInUsecs: endTimeInUsecs*Math.pow(10,3),
                            intervalInSecs: param.intervalInSecs,
                            statistics: metric.statistics
                        },
                        dataType: "json"
                    })
                ).then(function(result_r, result_w) {
                    var datapoints_r = utils.changePointToArr(result_r[0].entities[0].values.datapoints);
                    var datapoints_w = utils.changePointToArr(result_w[0].entities[0].values.datapoints);
                    var diffTime = that.series[0].processedXData.slice(-1)[0] - that.series[0].processedXData[0] + param.intervalInSecs * 1000;
                    var addPointBoolean = utils.checkChartLineEnoughLength(diffTime);

                    if (datapoints_r && datapoints_r.length) {
                        for (var i = 0; i < datapoints_r.length; i++) {
                            that.series[0].addPoint(datapoints_r[i], true, addPointBoolean);
                        }
                    } else {
                        var diffTime = that.series[0].processedXData.slice(-1)[0] - that.series[0].processedXData[0];
                        that.series[0].addPoint([startTimeInUsecs, 0], true, addPointBoolean);
                    }

                    if (datapoints_w && datapoints_w.length) {
                        for (var i = 0; i < datapoints_w.length; i++) {
                            that.series[1].addPoint(datapoints_w[i], true, addPointBoolean);
                        }
                    } else {
                        that.series[1].addPoint([startTimeInUsecs, 0], true, addPointBoolean);
                    }

                    startTimeInUsecs = endTimeInUsecs;
                });
            }, param.intervalInSecs * 1000));
        };
    }

    function initSummary() {
        $.ajax({
            url: app.webPath + "/rest/clusters/summary",
            type: 'GET',
            dataType: 'json',
            success: function(summary) {
                var clusterDetail = summary.entities;
                var $summary = $(".summary");
                $summary.find(".cluster-name").html(clusterDetail.cluster_name);
                $summary.find(".cluster-version").text('版本：' + clusterDetail.cluster_version);
                $summary.find(".host-count-val").html(clusterDetail.hosts_num);
                $summary.find(".disk-count-val").html(clusterDetail.disks_num);
                $summary.find(".storagepool-count-val").html(clusterDetail.storage_pools_num);
                $summary.find(".container-count-val").html(clusterDetail.containers_num);
                $summary.find(".unused-capacity-val").html(utils.conversion(clusterDetail.total_capacity - clusterDetail.used_capacity, { decimalCount: 2 }));
                $summary.find(".capacity").html(utils.conversion((clusterDetail.total_capacity - clusterDetail.used_capacity), { decimalCount: 2 }));
                $summary.find(".used-capacity-val").text('已使用：' + utils.conversion(clusterDetail.used_capacity, { decimalCount: 2 })).attr("title",'已使用：' + utils.conversion(clusterDetail.used_capacity, { decimalCount: 2 }));
                $summary.find(".total-capacity-val").text('总容量：' + utils.conversion(clusterDetail.total_capacity, { decimalCount: 2 })).attr("title",'总容量：' + utils.conversion(clusterDetail.total_capacity, { decimalCount: 2 }));
                
                var progress = Math.floor(clusterDetail.used_capacity / clusterDetail.total_capacity * 100);
                var style = { width: progress + "%" };

                if (progress >= 12) {
                    style.color = "#fff";
                }

                $summary.find(".used-capacity-progress").css(style).html(progress + "%");
            }
        });
    }

    return {
        initCluster: initCluster,
        clearMoniterTimers: clearMoniterTimers
    }
})
