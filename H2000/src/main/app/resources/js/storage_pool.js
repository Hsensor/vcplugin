define(["resources/js/utils", "jquery", "moment", "bootstrap.table"], function(utils, $, moment, bootstrap) {
    var $cardWrapParent = $("#storage_pool");
    var $cardWrap = $($("#storage_pool_card").html());
    var storage_pool;
    var loading = false;
    var moniterTimers = [];
    var vC_cT = {};
    var colors = ["#ee685d", " #973fed"]; 

    //loadStoragePools() promise，下次请求数据时如果上次请求还未响应，则中断上次请求
    var storagepoolXHR;

    // 清除监控产生的定时器
    function clearMoniterTimers() {
        if (moniterTimers.length) {
            for (var i = 0; i < moniterTimers.length; i++) {
                clearInterval(moniterTimers[i]);
            }
            moniterTimers.splice();
        }
    }

    function clearVC_cT(){
        for(var attr in vC_cT){
            clearTimeout(vC_cT[attr]);
            delete vC_cT[attr];
        }
    }

    function renderStoragePool() {
        clearMoniterTimers();
        clearVC_cT();

        if (loading) {
            storagepoolXHR.abort();
        }
        
        loading = true;

        $cardWrapParent.find(".card-wrap").remove();
        $cardWrapParent.find(".detail-panel").hide();
        $cardWrapParent.siblings(".loading").show().html("...... 正在加载数据 ......");
        // 渲染 Card

        storagepoolXHR = loadStoragePools().then(function(result) {
            loading = false;
            if (result.error) {
                $cardWrapParent.siblings(".loading").show().html(result.error.message);
            } else {
                storage_pool = result.entities;

                $cardWrapParent.siblings(".loading").hide();
                for (var i = 0; i < result.entities.length; i++) {
                    renderCard($cardWrapParent, $cardWrap.clone(), result.entities[i]);
                }
                utils.addCreateBtnCardWrap($cardWrapParent, $("#btnCardWrap").html());
                utils.cardWrapBindHandler($cardWrapParent, detailPanelCallback, createCallback);
            }
        }).fail(function() {
            loading = false;
            $cardWrapParent.show().siblings(".loading").html("加载数据失败! 请再次重试");
        })
    }

    // 为详情选项卡绑定事件
    utils.detailPanelTab($cardWrapParent.find(".detail-panel"), function(tabIndex) {
        var index = utils.getCardSelectedIndex($cardWrapParent);
        var curStoragePool = storage_pool[index];

        clearMoniterTimers();
        clearVC_cT();

        if (tabIndex == 0) {
            initPanelDetail(index);
        } else if (tabIndex == 1) {
            renderStoragePoolCharts($cardWrapParent.find(".queryButton").val(), curStoragePool.storagePoolUuid);
        } else if (tabIndex == 2) {
            initDisks(index);
        } else if (tabIndex == 3) {
            initVolumeContainers();
        } else if (tabIndex == 4) {
            initAlerts(index);
        } else if (tabIndex == 5) {
            initEvents(index);
        }
    });

    utils.detailPanelClose($cardWrapParent.find(".detail-panel"), function() {
        $cardWrapParent.find(".card-wrap.active").removeClass("active");
        clearMoniterTimers();
    });

    $cardWrapParent.find(".queryButton").change(function() {
        var $this = $(this);
        var type = $this.val();
        var index = utils.getCardSelectedIndex($cardWrapParent);
        var curStoragePool = storage_pool[index];
        if (type !== "define") {
            $("#storagePool_start_input").off("dp.change");
            $("#storagePool_end_input").off("dp.change");

            renderStoragePoolCharts(type, curStoragePool.storagePoolUuid);
            $this.siblings(".time-input").hide();
        } else {
            var curDate = new Date();


            $('#storagePool_start_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));
            $('#storagePool_end_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));

            $('#storagePool_start_input').data("DateTimePicker").clear();
            $('#storagePool_end_input').data("DateTimePicker").clear();

            $("#storagePool_start_input").on("dp.change", function(e) {
                if (new Date(e.date._d).getTime() > curDate.getTime()) {
                    return;
                }
                $('#storagePool_end_input').data("DateTimePicker").minDate(e.date);
                renderStoragePoolCharts(type, curStoragePool.storagePoolUuid);
            });
            $("#storagePool_end_input").on("dp.change", function(e) {
                $('#storagePool_start_input').data("DateTimePicker").maxDate(e.date);
                renderStoragePoolCharts(type, curStoragePool.storagePoolUuid);
            });
            $this.siblings(".time-input").show();
        }
    })


    bindDetailBtnHandler();

    function bindDetailBtnHandler() {
        var $btns = $cardWrapParent.find(".detail-panel .update-delete-btn a");
        // var $expandBtn = $btns.eq(0);
        var $updateBtn = $btns.eq(1);
        var $deleteBtn = $btns.eq(2);

        // $expandBtn.on("click",expandStoragePool);
        $updateBtn.on("click", utils.debounce(updateStoragePool,300,{trailing:false}));
        $deleteBtn.on("click", utils.debounce(deleteStoragePool,300,{trailing:false}));

    }

    // 当点击不是添加card时，展示card详情
    // 通过detailPanelState 对 cardWrap进行dom操作
    function detailPanelCallback(detailPanel) {
        var index = detailPanel.index;
        var status = detailPanel.status;

        var $detailPanel = $cardWrapParent.find(".detail-panel");
        var $navLis = $detailPanel.find(".detail-tab-nav>.nav-list>li");

        if (status === "expand") {
            for (var i = 0; i < $navLis.length; i++) {
                if ($navLis.eq(i).hasClass("active")) {
                    $navLis.eq(i).trigger("click",[true]);
                    break;
                }
            }
        } else if (status === "close") {
            if($navLis.eq(1).hasClass("active")){
                clearMoniterTimers();
            }
        }
    }

    function renderStoragePoolCharts(type, storagePoolUuid) {
        clearMoniterTimers();
        var performanceMetrics = [
            { name: "storage_pool_iops", metric: "IOPS", unit: "iops", lineColor: "#39cdde", statistics: "Average" },
            { name: "storage_pool_bandwidth", metric: "吞吐量", unit: "KBps", lineColor: "#f49c94", statistics: "Average" },
            { name: "storage_pool_iolatency", metric: "延时", unit: "ms", lineColor: "#b77af2", statistics: "Average" }
        ];

        var startD = new Date();
        var endTimeInUsecs = startD.getTime();
        var startTimeInUsecs, intervalInSecs;
        $cardWrapParent.find(".detail-nav-content").css("padding-top", "16px");

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
            if (!$('#storagePool_start_input').find("input").val() || !$('#storagePool_end_input').find("input").val()) {
                return;
            }
            var startInputDate = new Date($('#storagePool_start_input').find("input").val());
            var endInputDate = new Date($('#storagePool_end_input').find("input").val());

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
                storagePoolUuid: storagePoolUuid,
                loadInTime: "define" === type ? false : true
            });
        }
    }

    function renderChartCB(chartOptions, metric, param) {
        chartOptions.chart.backgroundColor = "#effaff";
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
                url: app.webPath + "/rest/storage_pools/stats",
                data: {
                    metrics: metric.name + "_r",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    storagePoolUuid: param.storagePoolUuid,
                    statistics: metric.statistics
                },
                dataType: "json"
            }),
            $.ajax({
                type: "get",
                url: app.webPath + "/rest/storage_pools/stats",
                data: {
                    metrics: metric.name + "_w",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    storagePoolUuid: param.storagePoolUuid,
                    statistics: metric.statistics
                },
                dataType: "json"
            })
        ).then(function(result_r, result_w) {

            chartOptions.series = [];
            var datapoints_r = utils.changePointToArr(result_r[0].entities[0].values.datapoints).sort(function(datapointA, datapointB) {
                return datapointA[0] - datapointB[0]
            });
            var datapoints_w = utils.changePointToArr(result_w[0].entities[0].values.datapoints).sort(function(datapointA, datapointB) {
                return datapointA[0] - datapointB[0];
            });

            if (param.loadInTime) {
                // 当下拉选择不是自定义时间时实时加载，下次图表绘制的开始时间为上次的结束时间
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

            if (!datapoints_r || !datapoints_w || !datapoints_r.length || !datapoints_w.length) {
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
                name: "写 " + metric.name,
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
                        url: app.webPath + "/rest/storage_pools/stats",
                        data: {
                            metrics: metric.name + "_r",
                            startTimeInUsecs: startTimeInUsecs * Math.pow(10,3),
                            endTimeInUsecs: endTimeInUsecs * Math.pow(10,3),
                            intervalInSecs: param.intervalInSecs,
                            storagePoolUuid: param.storagePoolUuid,
                            statistics: metric.statistics
                        },
                        dataType: "json"
                    }),
                    $.ajax({
                        type: "get",
                        url: app.webPath + "/rest/storage_pools/stats",
                        data: {
                            metrics: metric.name + "_w",
                            startTimeInUsecs: startTimeInUsecs * Math.pow(10,3),
                            endTimeInUsecs: endTimeInUsecs * Math.pow(10,3),
                            intervalInSecs: param.intervalInSecs,
                            storagePoolUuid: param.storagePoolUuid,
                            statistics: metric.statistics
                        },
                        dataType: "json"
                    })
                ).then(function(result_r, result_w) {
                    var datapoints_r = utils.changePointToArr(result_r[0].entities[0].values.datapoints);
                    var datapoints_w = utils.changePointToArr(result_w[0].entities[0].values.datapoints);
                    var diffTime = that.series[0].processedXData.slice(-1)[0] - that.series[0].processedXData[0] + param.intervalInecs * 1000;
                    var addPointBoolean = utils.checkChartLineEnoughLength(diffTime);


                    if (datapoints_r && datapoints_r.length) {
                        for (var i = 0; i < datapoints_r.length; i++) {
                            that.series[0].addPoint(datapoints_r[i], true, addPointBoolean);
                        }
                    } else {
                        that.series[0].addPoint([new Date(startTimeInUsecs).getTime(), 0], true, addPointBoolean);
                    }

                    if (datapoints_w && datapoints_w.length) {
                        for (var i = 0; i < datapoints_w.length; i++) {
                            that.series[1].addPoint(datapoints_w[i], true, addPointBoolean);
                        }
                    } else {
                        that.series[1].addPoint([new Date(startTimeInUsecs).getTime(), 0], true, addPointBoolean);
                    }
                    startTimeInUsecs = endTimeInUsecs;
                });

            }, param.intervalInSecs * 1000));
        };
    }

    function initEvents(cardIndex) {
        var $eventContent = $("#grid-storagepool-events");
        $cardWrapParent.find(".detail-nav-content").css("padding-top", "16px");
        initEventTable($eventContent);

        function initEventTable($eventContent) {
            $eventContent.empty();

            var $eventTable = $("<table></table>");
            $eventContent.append($eventTable);

            $eventTable.bootstrapTable({
                method: "get",
                url: app.webPath + '/rest/storage_pools/' + storage_pool[cardIndex].storagePoolUuid + '/events',
                paginationPreText: "上一页",
                paginationNextText: "下一页",
                clickToSelect: true,
                // singleSelect:true,
                dataField: "data",
                pagination: true,
                pageNumber: 1,
                pageSize: 5,
                formatNoMatches: function() {
                    return "未能查询到数据";
                },
                formatLoadingMessage: function() {
                    return "正在努力加载资源";
                },
                formatShowingRows: function(pageFrom, pageTo, totalRows) {
                    return "";
                },
                formatRecordsPerPage: function() {
                    return "";
                },
                queryParams: function(params) {
                    delete params.limit;
                    delete params.offset;
                    delete params.order;
                    return params;
                },
                responseHandler: function(result) {
                    var res = null;
                    if (result && result.entities) {
                        res = { data: result.entities, total: result.metadata.total };
                    } else {
                        res = { data: [], total: 0 };
                    }

                    return res;
                },
                columns: [{
                    field: 'message',
                    title: "名称",
                    formatter:function(value,row,index){
                        if("post_container" == value ){
                            return "创建卷容器";
                        }else if("post_storage_pools" == value){
                            return "创建存储池";
                        }else if("delete_container" == value){
                            return "删除卷容器";
                        }else if("patch_storage_pools" == value){
                            return "更新存储池";
                        }
                        return '<a class="even" href="javascript:void(0)">'+value+'</a>';
                    },
                    events:{
                        'click .even':function(e,value,row,index){
                            $(".navigator-bar>.navigator-bar-ul>li:eq(5)").trigger("click");
                        }
                    }
                }, {
                    field: 'entityType',
                    title: "目标",
                    formatter:function(value,row,index){
                        if("storage_pools" == value){
                            return "存储池";
                        }
                    }
                }, {
                    field: "detailedMessage",
                    title: "详细信息"
                }, {
                    // field:"admin",
                    formatter: function() {
                        return '管理员'
                    },
                    title: "启动者"
                }, {
                    formatter: function() {
                        return arguments[1].createdTimestampInUsecs ? utils.transDate(arguments[1].createdTimestampInUsecs) : "-";
                    },
                    title: "完成时间"
                }]
            })
        }
    }

    function initAlerts(cardIndex) {
        var $alertContent = $("#grid-storagepool-alert");
        $cardWrapParent.find(".detail-nav-content").css("padding-top", "16px");
        var queryParams={};

        initAlertsTable($alertContent);

        function initAlertsTable($alertContent) {
            $alertContent.empty();

            var $alertTable = $("<table></table>");
            $alertContent.append($alertTable);

            $alertTable.bootstrapTable({
                method: "get",
                url: app.webPath + '/rest/storage_pools/' + storage_pool[cardIndex].storagePoolUuid + '/alerts',
                clickToSelect: true,
                // singleSelect:true,
                dataField: "data",
                pagination: true,
                pageNumber: 1,
                formatShowingRows: function(pageFrom, pageTo, totalRows) {
                    return "";
                },
                formatNoMatches: function() {
                    return "未能查询到数据";
                },
                formatLoadingMessage: function() {
                    return "正在努力加载资源";
                },
                formatRecordsPerPage: function() {
                    return "";
                },
                pageSize: 5,
                queryParams: function(params) {
                    if(queryParams.refresh){
                        params.offset = 0;
                        delete queryParams.refresh;
                    }
                    if (queryParams) {
                        if (queryParams.severity) {
                            params.severity = queryParams.severity;
                        }
                        if(queryParams.entityType){
                            params.entityType = queryParams.entityType;
                        }
                        if (queryParams.acknowledged) {
                            params.acknowledged = queryParams.acknowledged;
                        }
                        if (queryParams.startTimeInUsecs) {
                            params.startTimeInUsecs = queryParams.startTimeInUsecs*1000;
                        }

                        if (queryParams.endTimeInUsecs) {
                            params.endTimeInUsecs = queryParams.endTimeInUsecs*1000;
                        }
                    }

                    delete params.limit;
                    delete params.offset;
                    delete params.order;
                    return params;
                },
                responseHandler: function(result) {
                    var res = null;
                    if (result && result.entities) {
                        res = { data: result.entities, total: result.metadata.total };
                    } else {
                        res = { data: [], total: 0 };
                    }

                    return res;
                },
                columns: [{
                    field: 'severity',
                    title: "告警级别",
                    formatter: function(value,row,index){
                        return value == "alarm" ? "警示":"警告";
                    },
                    headerCellTpl:function(){
                       var headerCellHtml = '<span class="action_slide dropdown"><span class="glyphicon glyphicon-chevron-down dropdown-toggle" data-toggle="dropdown"></span>'+
                        '<ul class="dropdown-menu">'+
                            '<li data-severity="null"><a herf="javascript:void(0)">全部</a></li>'+
                            '<li data-severity="alert"><a herf="javascript:void(0)">警告</a></li>'+
                            '<li data-severity="alarm"><a herf="javascript:void(0)">警示</a></li>'+
                        '</ul></span>';
                        var $headerCellTpl = $(headerCellHtml)
                        $headerCellTpl.find(".dropdown-toggle").dropdown();

                        $headerCellTpl.find("li").on("click",function(){
                            if($(this).hasClass("active")){
                                return;
                            }
                            $(this).siblings().removeClass("active");
                            $(this).addClass("active");
                            if($(this).data("severity")){
                                queryParams.severity = $(this).data("severity");
                            }else{
                                delete queryParams.severity ;
                            }
                            queryParams.refresh = true;
                            $alertTable.data('bootstrap.table').refresh({},function(options){
                                options.pageNumber = 1;
                                options.totalRows = 0;
                                options.totalPages = 0;
                            });
                        }).each(function(){
                            if(queryParams.severity==$(this).data("severity")){
                                $(this).addClass("active");
                            }else{
                                $(this).removeClass("active");
                            }                       
                        });

                        return $headerCellTpl;
                    }
                },{
                    field:'entityType',
                    title:"对象",
                    formatter:function(value,row,index){
                        if(utils.entityTypeMap["storagepools"] == value){
                            return "存储池";
                        }else {
                            return "-";
                        }
                    }
                },{
                    field: 'alertTitle',
                    title: "告警名称",
                    formatter:function(value,row,index){
                        /*var alertTitleFormat = '<div class="showAlarmDetail" data-html="true" data-placement="top" data-title="'+utils.alarmTipDom(row)+'">'+value+'</div>';
                        $(alertTitleFormat).tooltip();
                        return alertTitleFormat;*/
                        return utils.alarmTipDom(row);
                    },
                    events:{
                        'click .showAlarmDetail':function(e,value,row,index){
                            $(".navigator-bar>.navigator-bar-ul>li:eq(4)").trigger("click");
                        },
                        'mouseover .showAlarmDetail':function(){
                            $(this).tooltip("show");
                        },
                        'mouseout .showAlarmDetail':function(){
                            $(this).tooltip("hide");
                        }
                    }
                }, {
                    title: "详细信息",
                    field: 'message'
                }, {
                    formatter: function() {
                        return arguments[1].createdTimestampInUsecs ? utils.transDate(arguments[1].createdTimestampInUsecs) : "-";
                    },
                    title: "触发时间",
                    sortable: true
                }, {
                    formatter: function() {
                        return arguments[1].acknowledgedTimestampInUsecs ? utils.transDate(arguments[1].acknowledgedTimestampInUsecs) : "-";
                    },
                    title: "确认时间",
                    sortable: true
                }, {
                    field: "acknowledgedByUserName",
                    title: "确认者"
                }]
            })
        }
    }

    function initDisks(cardIndex) {
        var $storage_DetailPanel = $("#storage_pool").find(".detail-panel"),
            $disksListWrap = $storage_DetailPanel.find(".disks-content"),
            $diskDetailParent = $disksListWrap.find(".storage-pool-disks-list"),
            disksArr = [],
            storagePoolUuid = storage_pool[cardIndex].storagePoolUuid;
        $storage_DetailPanel.find(".detail-nav-content").css("padding-top", "16px");
        $diskDetailParent.empty();

        var disks = storage_pool[cardIndex].disks;
        getAllDisks($diskDetailParent, disks);        
    }

    function getAllDisks($diskDetailParent, disks) {

        var allDisksPromise = [];

        for (var i = 0; i < disks.length; i++) {
            allDisksPromise.push($.ajax({
                type: "get",
                url: app.webPath + "/rest/disks/get?diskUuid=" + disks[i],
                dataType: "json"
            }))
        }
        $diskDetailParent.append("...正在努力加载数据...");

        if (allDisksPromise.length) {
            $.when.apply(null, allDisksPromise).then(function() {
                $diskDetailParent.empty();
                if (allDisksPromise.length == 1) {
                    var disks = [].slice.call([arguments]);
                } else {
                    var disks = [].slice.call(arguments);
                }

                disks.sort(function(diskA, diskB) {
                    return diskA[0].storageTierName.localeCompare(diskB[0].storageTierName);
                })

                for (var i = 0; i < disks.length; i++) {
                    var item = disks[i][0];
                    var $diskPanel = $($("#storagePoolDiskPanel").html()).clone();
                    $diskPanel.attr("title", item.diskUuid);
                    $diskPanel.find(".card-icon-title").text(item.diskUuid);
                    $diskPanel.find(".disk-type > span").text(item.storageTierName);
                    $diskPanel.find(".disk-type > span").attr("title", item.storageTierName);
                    $diskPanel.find(".disk-status > span").text(item.diskStatus === "NORMAL" ? "online" : "offline");
                    $diskPanel.find(".disk-avalible > span").text(utils.conversion(item.usageStats.storage_free_bytes, { decimalCount: 2 }));
                    $diskPanel.find(".disk-total > span").text(utils.conversion(item.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
                    $diskDetailParent.append($diskPanel);
                    if (item.diskStatus === "NORMAL") {
                        $diskPanel.find(".card-icon-status").addClass("success").removeClass("error");
                    } else {
                        $diskPanel.find(".card-icon-status").addClass("error").removeClass("success");
                    }
                }
            }).fail(function(){
                $diskDetailParent.empty();
                $diskDetailParent.append("加载数据失败! 请再次重试");
            });
        }
    }

    function initVolumeContainers() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var storage_poolDetail = storage_pool[selectedCardIndex];

        var $volumeDetailPanel = $("#storage_pool").find(".detail-panel");
        var $volumeContent = $($("#volume_container_card").html()).clone();
        
        $volumeContent.addClass("disk-card-wrap");
        $volumeContent.find(".card-container").addClass("disk-card-container");

        var $volumeWrap = $volumeDetailPanel.find(".containers-content");
        var $volumeParent = $volumeWrap.find(".storage-pool-containers-list");

        $volumeParent.empty();
        $volumeParent.append("...正在努力加载数据...");
        $volumeDetailPanel.find(".detail-nav-content").css("padding-top", "16px");
        (function() {
            var dtd = $.Deferred();
            $.when(loadVolumeContainers(), loadDatastores()).then(function(result1, result2) {
                if (result1[0].error || result2[0].error) {
                    if (result1[0].error) {
                        dtd.reject(result1[0])
                    } else {
                        dtd.reject(result2[0]);
                    }

                } else {
                    result1[0].entities.sort(function(containerA, containerB) {
                        return -(new Date(containerA.ctime).getTime() - new Date(containerB.ctime).getTime());
                    });
                    dtd.resolve(mergeDatastoreVolume_container(result1[0].entities, result2[0].entities));
                }
            }).fail(function(){
                dtd.reject();
            })
            return dtd;
        })().then(function(result) {
            result = result.filter(function(item){
                if(item.storagePoolUuid==storage_poolDetail.storagePoolUuid){
                    return item;
                }
            });

            for (var i = 0; i < result.length; i++) {
                if (result[i].datastore && (typeof result[i].datastore.jobInfo === "object") && result[i].datastore.jobInfo.executionStatus === "OPEN") {
                    getJobStatusByJobId({ jobUuid: result[i].datastore.jobInfo.jobId, containerUuid: result[i].containerUuid })();
                }
            }

            for (var i = 0; i < result.length; i++) {
                renderVolumeCard($volumeParent, $volumeContent.clone(), result[i]);
            }
            return result;
        }).fail(function(){
            $volumeParent.empty();
            $volumeParent.append("加载数据失败! 请再次重试");
        });
    }

    function renderVolumeCard($volumeParent, $volumeContent, cardInfo) {

        $volumeContent.find(".card-container").css("background-color", "#effaff");
        // 设置attr containerUuid属性
        $volumeContent.attr("uuid", cardInfo.containerUuid);
        var jobInfo = "";
        $volumeContent.find(".card-icon-title").html(cardInfo.name).attr("title", cardInfo.name);
        if (!cardInfo.datastore || Object.prototype.toString.call(cardInfo.datastore.jobInfo) !== "[object Object]") {
            $volumeContent.find(".card-icon-status").addClass("error").removeClass("success warning");
            $volumeParent.find(".detail-panel").before($volumeContent);
        } else {
            jobInfo = cardInfo.datastore.jobInfo;
            if (jobInfo.executionStatus === "OPEN") {
                if (jobInfo.jobName === "add_datastore") {
                    $volumeContent.find(".card-icon-status").addClass("warning").removeClass("error success");
                } else if (jobInfo.jobName == "remove_datastore") {
                    $volumeContent.find(".card-icon-status").addClass("warning").removeClass("error success");
                }
                // append card when volume_contianer creating  or deleting
                $volumeParent.find(".detail-panel").before($volumeContent);
            } else if (jobInfo.executionStatus === "CLOSED") {
                if (jobInfo.closeStatus === "COMPLETED") {
                    if (jobInfo.jobName === "add_datastore") {
                        $volumeContent.find(".card-icon-status").addClass("success").removeClass("error warning");
                    } else if (jobInfo.jobName === "remove_datastore") {
                        $volumeContent.find(".card-icon-status").addClass("success").removeClass("error warning");
                    }
                } else if (jobInfo.closeStatus === "TERMINATED" || jobInfo.closeStatus === "TIME_OUT") {
                    if (jobInfo.jobName === "add_datastore") {
                        $volumeContent.find(".card-icon-status").addClass("error").removeClass("success warning");
                    } else if (jobInfo.jobName === "remove_datastore") {
                        $volumeContent.find(".card-icon-status").addClass("error").removeClass("success warning");
                    }
                }
                $volumeParent.find(".detail-panel").before($volumeContent);
            }
        }
        $volumeContent.find(".available>span").text(utils.conversion(cardInfo.usageStats.storage_free_bytes, { decimalCount: 2 }));
        $volumeContent.find(".already-used>span").text(utils.conversion(cardInfo.usageStats.storage_usage_bytes, { decimalCount: 2 }));
        $volumeContent.find(".total-capacity>span").text(utils.conversion(cardInfo.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
        if (cardInfo.datastore) {
            $volumeContent.find(".datastore-name>span").text(cardInfo.datastore.datastoreName).attr("title", "Datastore:" + cardInfo.datastore.datastoreName);
        }
        $volumeParent.append($volumeContent);
    }

    function mergeDatastoreVolume_container(containers, datastores) {
        for (var i = 0; i < containers.length; i++) {
            for (var j = 0; j < datastores.length; j++) {
                if (containers[i].containerUuid == datastores[j].containerUuid) {
                    containers[i].datastore = datastores[j];
                }
            }
        }
        return containers;
    }

    function getJobStatusByJobId(opt) {
        return function fn() {
            clearTimeout(vC_cT[opt.containerUuid]);

            getJobDetail(opt).then(function(result) {
                if (result.executionStatus === "OPEN") {
                    vC_cT[opt.containerUuid] = setTimeout(function() {
                        fn(opt);
                    }, 5000);
                } else {
                    if (result.jobName == "add_datastore") {
                        initVolumeContainers();
                    } else {
                        $.ajax({
                            url: app.webPath + "/rest/containers/delete",
                            type: "post",
                            data: { containerUuid: opt.containerUuid },
                            dataType: "json",
                            success: function(result) {
                                if (result.value == true) {
                                    initVolumeContainers();
                                }
                            }
                        })
                    }
                    // 刷新对应的状态
                }
            })
        }
    }

    function getJobDetail(opt) {
        opt = opt || {};
        return $.ajax({
            url: app.webPath + "/rest/jobs/detail",
            data: opt,
            type: "get",
            dataType: "json"
        })
    }


    function loadVolumeContainers() {
        return $.ajax({
            url: app.webPath + "/rest/containers/list",
            type: "get",
            dataType: "json"
        })
    }

    function loadDatastores() {
        return $.ajax({
            url: app.webPath + "/rest/data_stores/list",
            type: "get",
            dataType: "json"
        })
    }

    function initPanelDetail(cardIndex) {
        var $storage_DetailPanel = $("#storage_pool").find(".detail-panel"),
            $detailContent = $storage_DetailPanel.find(".detail-content"),
            $disksListWrap = $storage_DetailPanel.find(".disks-content");
        $storage_DetailPanel.find(".detail-nav-content").css("padding-top", "16px");

        var storage_poolDetail = storage_pool[cardIndex];
        $detailContent.find('.name-val').text(storage_poolDetail.name);
        $detailContent.find('.disks-val').text(storage_poolDetail.disks.length);
        $detailContent.find('.available-val').text(utils.conversion(storage_poolDetail.usageStats.storage_free_bytes, { decimalCount: 2 }));
        $detailContent.find('.used-val').text(utils.conversion(storage_poolDetail.usageStats.storage_usage_bytes, { decimalCount: 2 }));
        $detailContent.find('.total-val').text(utils.conversion(storage_poolDetail.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
        $detailContent.find('.create-time').text(new Date(storage_poolDetail.ctime).format("yyyy-MM-dd HH：mm：ss"));
    }

    function expandStoragePool() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var curStoragePool = storage_pool[selectedCardIndex];
        if (!curStoragePool) {
            throw new Error("unexpected an error hanppend");
        }

        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("扩容");
            var formTpl =
                '<form class="form-horizontal" name="expandHost" id="expandHost" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label for="hosts" class="col-xs-3 control-label">选择主机</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '</div>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>'
            $modalWrap.find(".modal-body").html(formTpl);
        })
    }

    function updateStoragePool() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var curStoragePool = storage_pool[selectedCardIndex];
        if (!curStoragePool) {
            throw new Error("unexpected an error hanppend");
        }

        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("更新存储池");
            var formTpl =
                '<form class="form-horizontal" name="updateStoragePool" id="updateStoragePool" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label for="poolName" class="col-xs-3 control-label">名称</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="name" id="name" autocomplete="off" class="no-raduis form-control input-sm" value="' + curStoragePool.name + '">' +
                '</div>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>'
            $modalWrap.find(".modal-body").html(formTpl);
            $modalWrap.find("#updateStoragePool").validate({
                errorPlacement: function(error, element) {
                    element.parent()
                        .append(error);
                },
                "rules": {
                    "name": {
                        "required": true,
                        "minlength": 1,
                        "maxlength": 25,
                        "regValidation": /^[a-zA-Z][a-zA-Z0-9_]*$/
                    }
                },
                "messages": {
                    "name": {
                        "required": "存储池名称为必填项",
                        "minlength": "不少于1个字符",
                        "maxlength": "名称长度不大于25个字符",
                        "regValidation": "名称支持英文、数字、下划线，并且只能英文开头"
                    }
                },
                submitHandler: function(form) {
                    var $form = $(form);
                    $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                    $form.find("#submit-form").attr("disabled", "disabled");

                    var param = {
                        storagePoolUuid: curStoragePool.storagePoolUuid,
                        name: $form.find("#name").val()
                    }
                    $.ajax({
                        url: app.webPath + "/rest/storage_pools/update",
                        type: "post",
                        data: param,
                        dataType: "json",
                        success: function(result) {
                            if (result.value == true) {
                                renderStoragePool();
                                $modalWrap.removeDom();
                            } else if (result.error) {
                                $form.siblings(".error").remove();
                                if (result.error.message == "resource_exist") {
                                    $('<div class="error">存储池名称重复<div/>').insertBefore($form);
                                } else {
                                    $('<div class="error">' + result.error.message + '<div/>').insertBefore($form);
                                }
                            }
                            $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                            $form.find("#submit-form").removeAttr("disabled");
                        }
                    })
                    return false;
                }
            })
        })
    }

    function deleteStoragePool() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var curStoragePool = storage_pool[selectedCardIndex];
        if (!curStoragePool) {
            throw new Error("unexpected an error hanppend");
        }
        var checkDeleteAction = false;
        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("删除存储池");

            var msgBody = '<form name="deleteStoragePool" id="deleteStoragePool" autocomplete="off" novalidate="novalidate"><span class="checktip">您确定要删除此存储池吗?</span><input type="submit" id="submit-form" class="hidden" /></form>';
            $modalWrap.find(".modal-body").html(msgBody);

            $modalWrap.find("#deleteStoragePool").validate({
                submitHandler: function(form) {
                    // 验证通过执行该方法
                    $form = $(form);
                    if (!checkDeleteAction) {
                        checkDeleteAction = true;
                        $form.find(".checktip").html("请再次确定您要删除此存储池吗?");
                        return;
                    }
                    $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                    $form.find("#submit-form").attr("disabled", "disabled");
                    $.ajax({
                        url: app.webPath + "/rest/storage_pools/delete",
                        type: "post",
                        data: { storagePoolUuid: curStoragePool.storagePoolUuid },
                        dataType: "json",
                        success: function(result) {
                            $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                            $form.find("#submit-form").removeAttr("disabled");

                            if (!result.error) {
                                $modalWrap.removeDom();
                                renderStoragePool();
                            } else {
                                $form.siblings(".error").remove();
                                if (result.error.message == "this storage pool has container") {
                                    $('<div class="error"">该存储池中存在卷容器，不可删除<div/>').insertBefore($form);
                                } else {
                                    $('<div class="error"">' + result.error.message + '<div/>').insertBefore($form);
                                }
                            }
                        }
                    })
                    return false;
                }
            })
        })
    }

    function loadStoragePools() {
        return $.ajax({
            url: app.webPath + "/rest/storage_pools/list",
            type: "get",
            dataType: "json"
        })
    }

    function renderCard($cardWrapParent, $cardWrap, cardInfo) {
        $cardWrap.attr("uuid", cardInfo.storagePoolUuid);
        $cardWrap.find(".card-icon-title").text(cardInfo.name).attr("title", cardInfo.name);
        $cardWrap.find(".available > span").text(utils.conversion(cardInfo.usageStats.storage_free_bytes, { decimalCount: 2 }));
        $cardWrap.find(".already-used  > span").text(utils.conversion(cardInfo.usageStats.storage_usage_bytes, { decimalCount: 2 }));
        $cardWrap.find(".total-capacity  > span").text(utils.conversion(cardInfo.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
        $cardWrapParent.find(".detail-panel").before($cardWrap);
    }

    function createCallback() {
        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("创建存储池");
            var formTpl =
                '<form class="form-horizontal" name="createStoragePool" id="createStoragePool" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label for="poolName" class="col-xs-3 control-label"><span class="required">*</span>名称:</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="name" id="name" autocomplete="off" class="no-raduis form-control input-sm" >' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="hosts" class="col-xs-3 control-label"><span class="required">*</span>选择主机:</label>' +
                '<div class="col-xs-9 input-p0">' +
                '<table style="width:100%" class="host-table" id="host-table" cellspacing="0">' +
                '<thead>' +
                '<tr>' +
                '<th><input id="allCheck" type="checkbox" name="hosts" /></th>' +
                '<th>主机名称</th>' +
                '<th>IP</th>' +
                '<th>容量</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody></tbody>' +
                '<table>' +
                '</div>' +
                '<p style="display:none" class="create-tip col-xs-12">没有空余磁盘！</p>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>'
            $modalWrap.find(".modal-body").html(formTpl);

            $.when($.ajax({ type: 'GET', url: app.webPath + "/rest/hosts/list", dataType: 'json' }))
                .then(function(result) {
                    var allHosts = result.entities;

                    $.ajax({
                        type: 'GET',
                        url: app.webPath + '/rest/disks/list',
                        dataType: 'json',
                        success: function(result) {
                            var allDisks = result.entities;
                            var showHosts = $.map(allHosts, function(item, index) {
                                var obj = {};
                                obj.name = item.name;
                                obj.serviceVMExternalIP = item.serviceVMExternalIP;
                                obj.capacity = 0;
                                obj.disks = [];
                                for (var i = 0; i < allDisks.length; i++) {
                                    if (item.serviceVMExternalIP == allDisks[i].cvmIpAddress && (allDisks[i].storagePoolUuid == null || allDisks[i].storagePoolUuid == "")) {
                                        obj.disks.push(allDisks[i]);
                                        obj.capacity += allDisks[i].diskSize;
                                    }
                                }
                                if (obj.disks.length >= 1) {
                                    return obj;
                                }
                            });

                            hostTable = utils.initHostTable(showHosts, $modalWrap);
                            if (showHosts.length == 0) {
                                $modalWrap.find(".create-tip").css("display", "block");
                                $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                                $modalWrap.find("#submit-form").attr("disabled", "disabled");
                            }

                        },
                        error: function() {
                        }
                    })
                }, function(result) {
                })

            $modalWrap.find("#createStoragePool").validate({
                errorPlacement: function(error, element) {
                    element.parents(".col-xs-9")
                        .append(error);
                },
                "rules": {
                    "name": {
                        "required": true,
                        "minlength": 1,
                        "maxlength": 25,
                        "regValidation": /^[a-zA-Z][a-zA-Z0-9_]*$/
                    },
                    "hosts": {
                        "required": true
                    }

                },
                "messages": {
                    "name": {
                        "required": "存储池名称为必填项",
                        "minlength": "不少于1个字符",
                        "maxlength": "名称长度不大于25个字符",
                        "regValidation": "名称支持英文、数字、下划线，并且只能英文开头"
                    },
                    "hosts": {
                        "required": "主机为必选项"
                    }
                },
                submitHandler: function(form) {
                    $form = $(form);

                    $form.siblings(".error").remove();
                    $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                    $form.find("#submit-form").attr("disabled", "disabled");
                    
                    var diskArr = [],
                        hosts = hostTable.getSelectedRows(),
                        capacity = 0;

                    if (hosts.length != 0) {
                        $.map(hosts, function(item, index) {
                            capacity += parseInt(item.capacity);
                            // concat api concat将返回一个数组，不会修改原实例
                            // slice 方法 返回一个新数组，不会修改原实例
                            // splice 方法返回一个薪数组，原实例会被修改
                            for (var i = 0; i < item.disks.length; i++) {
                                if (!item.disks[i].storagePoolUuid) {
                                    diskArr.push(item.disks[i].diskUuid);
                                }
                            }
                        })
                    } else {
                        return;
                    }
                    var param = {
                        "name": $modalWrap.find('#name').val(),
                        "capacity": capacity,
                        "markedForRemoval": false,
                        "disks": diskArr.length == 0 ? '' : diskArr.join(",")
                    }

                    $.ajax({
                        url: app.webPath + "/rest/storage_pools/create",
                        type: "post",
                        data: param,
                        dataType: "json",
                        success: function(result) {
                            if (!result.error) {
                                setTimeout(function(){
                                    renderStoragePool();
                                    $modalWrap.removeDom();    
                                },5000)
                            } else {
                                $form.siblings(".error").remove();
                                if (result.error && result.error.message == "resource_exist") {
                                    $('<div class="error">存储池名称重复<div/>').insertBefore($form);
                                } else {
                                    $('<div class="error">' + result.error.message + '<div/>').insertBefore($form);
                                }
                            }
                            $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                            $form.find("#submit-form").removeAttr("disabled");
                        }
                    })
                }
            })
        })
    }

    return {
        renderStoragePool: renderStoragePool,
        clearMoniterTimers: clearMoniterTimers,
        clearVC_cT:clearVC_cT
    }

})
