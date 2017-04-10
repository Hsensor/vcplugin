define(["resources/js/utils", "jquery", "moment", "bootstrap.table"], function(utils, $, moment) {
    var $cardWrapParent = $("#volume_container");
    var $cardWrap = $($("#volume_container_card").html());
    // volumeContainer_createTimer
    var vC_cT = {};
    var moniterTimers = [];
    var loading = false;
    var volume_container;
    var colors = ["#ee685d", " #973fed"]; 

    //保存loadVolumeContainers(),loadDatastores() promise，下次请求数据时如果上次请求还未响应，则中断上次请求
    var volumeContainerXHRs = [];

    //清除监控产生的定时器
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

    function renderContainerCharts(type, containerUuid) {
        clearMoniterTimers();
        var performanceMetrics = [
            { name: "container_iops", metric: "IOPS", unit: "iops", statistics: "Sum" },
            { name: "container_bandwidth", metric: "吞吐量", unit: "KBps", statistics: "Sum" },
            { name: "container_iolatency", metric: "延时", unit: "ms", statistics: "Average" }
        ];

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
            if (!$('#volumeContainer_start_input').find("input").val() || !$('#volumeContainer_end_input').find("input").val()) {
                return;
            }
            var startInputDate = new Date($('#volumeContainer_start_input').find("input").val());
            var endInputDate = new Date($('#volumeContainer_end_input').find("input").val());

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
                containerUuid: containerUuid,
                loadInTime: type == "define" ? false : true
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
                url: app.webPath + "/rest/containers/stats",
                data: {
                    metrics: metric.name + "_r",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    containerUuid: param.containerUuid,
                    statistics: metric.statistics
                },
                dataType: "json"
            }),
            $.ajax({
                type: "get",
                url: app.webPath + "/rest/containers/stats",
                data: {
                    metrics: metric.name + "_w",
                    startTimeInUsecs: param.startTimeInUsecs * Math.pow(10,3),
                    endTimeInUsecs: param.endTimeInUsecs * Math.pow(10,3),
                    intervalInSecs: param.intervalInSecs,
                    containerUuid: param.containerUuid,
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
                        url: app.webPath + "/rest/containers/stats",
                        data: {
                            metrics: metric.name + "_r",
                            startTimeInUsecs: startTimeInUsecs * Math.pow(10, 3),
                            endTimeInUsecs: endTimeInUsecs * Math.pow(10, 3),
                            intervalInSecs: param.intervalInSecs,
                            containerUuid: param.containerUuid,
                            statistics: metric.statistics
                        },
                        dataType: "json"
                    }),
                    $.ajax({
                        type: "get",
                        url: app.webPath + "/rest/containers/stats",
                        data: {
                            metrics: metric.name + "_w",
                            startTimeInUsecs:  startTimeInUsecs * Math.pow(10, 3),
                            endTimeInUsecs:  endTimeInUsecs * Math.pow(10, 3),
                            intervalInSecs: param.intervalInSecs,
                            containerUuid: param.containerUuid,
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
                        that.series[0].addPoint([startTimeInUsecs, 0], true, addPointBoolean)
                    }

                    if (datapoints_w && datapoints_w.length) {
                        for (var i = 0; i < datapoints_w.length; i++) {
                            that.series[1].addPoint(datapoints_w[i], true, addPointBoolean);
                        }
                    } else {
                        that.series[1].addPoint([startTimeInUsecs, 0], true, addPointBoolean)
                    }
                    startTimeInUsecs = endTimeInUsecs;
                });
            }, param.intervalInSecs * 1000));
        };
    }

    function renderVolumeContainers() {
        clearMoniterTimers();
        clearVC_cT();

        if (loading && volumeContainerXHRs.length) {
            for(var i=0;i<volumeContainerXHRs.length;i++){
                volumeContainerXHRs[i].abort();
            }
            volumeContainerXHRs.splice(0);
        }
        loading = true;
        $cardWrapParent.find(".card-wrap").remove();
        $cardWrapParent.find(".detail-panel").hide();
        $cardWrapParent.siblings(".loading").show().html("...... 正在加载数据 ......");
        // 渲染 card

        /* loadVolumeContainers().then(function(result){
            return loadDatastores().then(function(datastores){
                return mergeDatastoreVolume_container(result.entities,datastores);
            }).fail(function(){
                $cardWrapParent.siblings(".loading").html("加载数据失败");
                console.log("list datastore failed");
            });
        }) */

        (function() {
            var dtd = $.Deferred();
            volumeContainerXHRs.push(loadVolumeContainers(),loadDatastores());

            $.when.apply(null,volumeContainerXHRs).then(function(result1, result2) {
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
            loading = false;
            volumeContainerXHRs.splice(0);

            volume_container = result;
            $cardWrapParent.siblings(".loading").hide();

            for (var attr in vC_cT) {
                clearTimeout(vC_cT[attr]);
            }

            for (var i = 0; i < result.length; i++) {
                if (result[i].datastore && result[i].datastore.jobInfo && (typeof result[i].datastore.jobInfo === "object") && result[i].datastore.jobInfo.executionStatus === "OPEN") {
                    getJobStatusByJobId({ jobUuid: result[i].datastore.jobInfo.jobId, containerUuid: result[i].containerUuid })();
                }
            }

            for (var i = 0; i < result.length; i++) {
                renderCard($cardWrapParent, $cardWrap.clone(), result[i]);
            }

            utils.addCreateBtnCardWrap($cardWrapParent, $("#btnCardWrap").html());
            utils.cardWrapBindHandler($cardWrapParent, detailPanelCallback, createCallback);

            return result;
        }).fail(function(result) {
            loading = false;
            volumeContainerXHRs.splice(0);
            
            if (result && result.error) {
                $cardWrapParent.siblings(".loading").show().html(result.error.message);
            } else {
                $cardWrapParent.siblings(".loading").show().html("加载数据失败! 请再次重试");
            }
        });
    }

    // 为详情选项卡绑定事件
    utils.detailPanelTab($cardWrapParent.find(".detail-panel"), function(tabIndex) {

        var index = utils.getCardSelectedIndex($cardWrapParent);
        var curVolumeContainer = volume_container[index];

        // 清除定时器
        clearMoniterTimers();

        if (tabIndex == 0) {
            initPanelDetail(index);
        } else if (tabIndex == 1) {
            renderContainerCharts($cardWrapParent.find(".queryButton").val(), curVolumeContainer.containerUuid);
        } else if (tabIndex == 2) {
            initAlerts(index);
        } else if (tabIndex == 3) {
            initEvents(index);
        }
    });

    utils.detailPanelClose($cardWrapParent.find(".detail-panel"), function() {
        $cardWrapParent.find(".card-wrap.active").removeClass("active");
        // 清除监控定时器
        clearMoniterTimers();
    });

    $cardWrapParent.find(".queryButton").change(function() {
        var $this = $(this);
        var type = $this.val();
        var index = utils.getCardSelectedIndex($cardWrapParent);
        var curVolumeContainer = volume_container[index];
        if (type !== "define") {
            $("#volumeContainer_start_input").off("dp.change");
            $("#volumeContainer_end_input").off("dp.change");

            renderContainerCharts(type, curVolumeContainer.containerUuid);
            $this.siblings(".time-input").hide();
        } else {
            var curDate = new Date();

            $('#volumeContainer_start_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));

            $('#volumeContainer_end_input').datetimepicker({
                locale: "zh-cn",
                format: 'YYYY/MM/DD HH:mm',
                ignoreReadonly: true
            }).data("DateTimePicker").maxDate(moment(curDate).format("YYYY-MM-DD HH:mm:ss"));

            $('#volumeContainer_start_input').data("DateTimePicker").clear();
            $('#volumeContainer_end_input').data("DateTimePicker").clear();

            $("#volumeContainer_start_input").on("dp.change", function(e) {
                if (new Date(e.date._d).getTime() > curDate.getTime()) {
                    return;
                }
                $('#volumeContainer_end_input').data("DateTimePicker").minDate(e.date);
                renderContainerCharts(type, curVolumeContainer.containerUuid);
            });
            $("#volumeContainer_end_input").on("dp.change", function(e) {
                $('#volumeContainer_start_input').data("DateTimePicker").maxDate(e.date);
                renderContainerCharts(type, curVolumeContainer.containerUuid);
            });

            $this.siblings(".time-input").show();
        }
    })

    bindDetailBtnHandler();

    function bindDetailBtnHandler() {
        var $btns = $cardWrapParent.find(".detail-panel .update-delete-btn a");
        var $updateBtn = $btns.eq(0);
        var $deleteBtn = $btns.eq(1);

        $updateBtn.on("click", utils.debounce(updateContainer,300,{trailing:false}));
        $deleteBtn.on("click", utils.debounce(deleteContainer,300,{trailing:false}));
    }


    // 当点击不是添加card时，展示card详情
    // 通过detailPanelState 对 cardWrap进行dom操作
    function detailPanelCallback(detailPanel) {
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

    function initPanelDetail(cardIndex) {
        var $volumeContainer_DetailPanel = $cardWrapParent.find(".detail-panel");
        var $detailContent = $volumeContainer_DetailPanel.find(".detail-content");

        var volume_containerDetail = volume_container[cardIndex];
        if (!volume_containerDetail) {
            return;
        }

        /*if (volume_containerDetail.datastore) {

            $detailContent.find(".datastore-val").html(volume_containerDetail.datastore.datastoreName);
        }*/
        $detailContent.find(".datastore-val").html(volume_containerDetail.name);
        $detailContent.find(".name-val").html(volume_containerDetail.alias);
        $detailContent.find(".fst-val").html(volume_containerDetail.protocolType);
        $detailContent.find(".replication-val").html(volume_containerDetail.replicationFactor); //副本数
        
        $detailContent.find(".reservecapacity-val").html(utils.conversion(volume_containerDetail.totalExplicitReservedCapacity, { decimalCount: 2 }));
        $detailContent.find(".usedcapacity-val").html(utils.conversion(volume_containerDetail.usageStats.storage_usage_bytes, { decimalCount: 2 }));
        $detailContent.find(".totalcapacity-val").html(utils.conversion(volume_containerDetail.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
        $detailContent.find(".freecapacity-val").html(utils.conversion(volume_containerDetail.usageStats.storage_free_bytes, { decimalCount: 2 }));
        $detailContent.find(".createtime-val").html((new Date(volume_containerDetail.ctime)).format("yyyy-MM-dd HH：mm：ss"));

        $.ajax({
            url: app.webPath + "/rest/storage_pools/detail",
            type: "get",
            data: {
                storagePoolUuid: volume_containerDetail.storagePoolUuid
            },
            dataType: "json"
        }).then(function(result) {
            if (!result.error && result.name){ 
                $detailContent.find(".storagepool-val").html(result.name);
            } else {
                console.log('get storagepool by uuid ,an error happened');
            }
        })
    }

    function initEvents(cardIndex) {
        var $eventContent = $("#grid-container-events");
        initEventTable($eventContent);

        function initEventTable($eventContent) {
            $eventContent.empty();
            var $eventTable = $("<table></table>");
            $eventContent.append($eventTable);

            $eventTable.bootstrapTable({
                method: "get",
                url: app.webPath + '/rest/containers/' + volume_container[cardIndex].containerUuid + '/events',
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
                            return "存储池";
                        }else if("delete_container" == value){
                            return "删除卷容器";
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
                        if("containers" == value){
                            return "卷容器";
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
        var $alertContent = $("#grid-container-alert");
        var queryParams={};

        initAlertsTable($alertContent);
        

        function initAlertsTable($alertContent) {
            $alertContent.empty();
            var $alertTable = $("<table></table>");
            $alertContent.append($alertTable);

            $alertTable.bootstrapTable({
                method: "get",
                url: app.webPath + '/rest/containers/' + volume_container[cardIndex].containerUuid + '/alerts',
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
                    if(queryParams.refresh){
                        params.offset=0;
                        delete queryParams.refresh;
                    }
                    if(queryParams) {
                        if(queryParams.severity){
                            params.severity=queryParams.severity;
                        }
                        if(queryParams.entityType){
                            params.entityType=queryParams.entityType;
                        }
                        if(queryParams.acknowledged){
                            params.acknowledged=queryParams.acknowledged;
                        }
                        if (queryParams.startTimeInUsecs) {
                            params.startTimeInUsecs=queryParams.startTimeInUsecs*1000;
                        }
                        if (queryParams.endTimeInUsecs) {
                            params.endTimeInUsecs=queryParams.endTimeInUsecs*1000;
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
                        return value == "alarm" ? "警示" : "警告";
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
                        if($(this).data("severity")!=null && $(this).data("severity")!=""){
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
                }, {
                    title:"对象",
                    field:"entityType",
                    formatter:function(value,row,index){
                        if(utils.entityTypeMap["containers"] == value){
                            return "卷容器";
                        }else{
                            return "-";
                        }
                    }
                }, {
                    field: 'alertTitle',
                    title: "告警名称",
                    formatter:function(value,row,index){
                        //产生tooltip dom结构
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

    // 当点击添加card时，弹出创建的弹框
    function createCallback() {
        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("创建卷容器");
            var formTpl =
                '<form class="form-horizontal" name="createContainer" id="createContainer" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>名称</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="alias" id="alias" autocomplete="off" class="no-raduis form-control input-sm" >' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>Datastore</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="name" id="name" autocomplete="off" class="no-raduis form-control input-sm" >' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">存储池</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<select name="storagePoolUuid" id="storagePoolUuid" class="no-raduis form-control input-sm" ></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>容量 </label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<div class="input-group">' +
                '<input type="text" name="maxCapacity" id="maxCapacity" class="no-raduis form-control input-sm" >' +
                '<span class="input-group-addon no-raduis">GB</span>' +
                '</div>' +
                '</div>' +

                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">副本数</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<select name="replicationFactor" id="replicationFactor" autocomplete="off" class="no-raduis form-control input-sm" ></select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">文件系统类型</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<select name="protocolType " id="protocolType" class="no-raduis form-control input-sm" >' +
                '<option value="NFS">NFS</option>' +
                //'<option value="ISCSI">ISCSI</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">预留容量</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<div class="input-group">' +
                '<input type="text" name="totalExplicitReservedCapacity" id="totalExplicitReservedCapacity" class="no-raduis form-control input-sm" >' +
                '<span class="input-group-addon no-raduis">GB</span>' +
                '</div>' +
                '</div>' +

                '</div>' +
                '<div class="form-group" style="margin-bottom:0;visibility:hidden;height:0" >' +
                '<div class="clearfix"><label for="advancedSetting" class="control-label pull-left">datastore(默认在所有节点中创建)</label><span id="menu-btn" class="pull-right menu-btn glyphicon glyphicon-menu-right"></span></div>' +
                '<div id="host" style="visibility:hidden;height:0"></div>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>';

            $modalWrap.find(".modal-body").html(formTpl);
            loadStoragePool();
            loadHost();

            createContainerValidate($modalWrap);

            function loadStoragePool() {
                $.ajax({
                    url: app.webPath + "/rest/storage_pools/list",
                    type: "get",
                    data: {},
                    dataType: "json",
                    success: function(result) {
                        if (result && result.entities && result.entities.length) {
                            var str = "";
                            for (var i = 0; i < result.entities.length; i++) {
                                if (i == 0) {
                                    str += '<option value="' + result.entities[i].storagePoolUuid + '" checked>' + result.entities[i].name + '</option>';
                                } else {
                                    str += '<option value="' + result.entities[i].storagePoolUuid + '">' + result.entities[i].name + '</option>';
                                }
                            }
                            $modalWrap.find("#storagePoolUuid").append(str);

                            initCapacity(result.entities);
                            $modalWrap.find("#storagePoolUuid").change(function() {
                                initCapacity(result.entities);
                            })
                        }
                    }
                });
            }

            function initCapacity(storagePools) {
                $.map(storagePools, function(item, index) {
                    if (item.storagePoolUuid == $modalWrap.find("#storagePoolUuid").val()) {
                        $modalWrap.find("#maxCapacity").attr('placeholder', '容量不能大于' + utils.conversion(item.usageStats.storage_free_bytes, { decimalCount: 2, endUnit: 'GB', need_not_unit: true }));
                        $modalWrap.find("#maxCapacity").attr('max', utils.conversion(item.usageStats.storage_free_bytes, { decimalCount: 2, endUnit: 'GB', need_not_unit: true }));
                        $modalWrap.find("#totalExplicitReservedCapacity").val(0)
                    }
                })
            }

            function loadHost() {
                $.ajax({
                    url: app.webPath + "/rest/hosts/list",
                    type: "get",
                    dataType: "json"
                }).then(function(result) {
                    hosts = result && result.entities;
                    var str = "";
                    if (hosts.length) {
                        if (hosts.length < 3) {
                            str += '<option value="1" checked>1</option>';
                        } else if (hosts.length < 5) {
                            str += '<option value="1" checked>1</option><option value="2">2</option>';
                        } else {
                            str += '<option value="1" checked>1</option><option value="2">2</option><option value="3">3</option>';
                        }
                        $modalWrap.find("#replicationFactor").append(str);
                    }
                })
            }
        })
    }

    $.validator.addMethod("selfDefineMax", function(value, element, params) {
        if (Number(value) > Number($(element).parents("form").find(params).val())) {
            return false;
        } else {
            return true;
        }
    });

    // 验证container,并创建
    function createContainerValidate($modalWrap) {
        $modalWrap.find("#createContainer").validate({
            errorPlacement: function(error, element) {
                element.parents(".col-xs-9")
                    .append(error);
            },
            "rules": {
                "alias": {
                    "required": true,
                    "minlength": 1,
                    "regValidation": /^[a-zA-Z0-9_u4e00-u9fa5]+$/
                },
                "name": {
                    "required": true,
                    "minlength": 1,
                    "maxlength": 25,
                    "regValidation": /^[a-zA-Z][a-zA-Z0-9_]*$/
                },
                "replicationFactor": {
                    "required": true
                },
                "protocolType":{
                    "required":true,
                },
                "maxCapacity": {
                    "required": true,
                    "regValidation": /^(?=(0|[1-9]\d*)$)/,
                },
                "storagePoolUuid": {
                    "required": true
                },
                "totalExplicitReservedCapacity": {
                    "regValidation": /^(?=(0|[1-9]\d*)$)/,
                    "selfDefineMax": "#maxCapacity"
                }
            },
            "messages": {
                "alias": {
                    "required": "卷容器名称为必填项",
                    "minlength":  "不少于1个字符",
                    "regValidation": /^[a-zA-Z0-9_u4e00-u9fa5]+$/
                },
                "name": {
                    "required": "Datastore名称为必填项",
                    "minlength": "不少于1个字符",
                    "maxlength": "名称长度不大于25个字符",
                    "regValidation": "名称支持英文、数字、下划线，中文"
                },
                "replicationFactor": {
                    "required": "请选择副本数"
                },
                "storagePoolUuid": {
                    "required": "请选择一个存储池"
                },
                "maxCapacity": {
                    "required": "容量为必填项",
                    "regValidation": "容量只能输入正整数",
                    "max": $.validator.format("容量只能小于存储池容量大小{0}")
                },
                "totalExplicitReservedCapacity": {
                    "regValidation": "容量只能输入正整数",
                    "selfDefineMax": "预留容量不能大于卷容器容量大小"
                }
            },
            submitHandler: function(form) {
                var $form = $(form);
                $form.siblings(".error").remove();
                $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                $form.find("#submit-form").attr("disabled", "disabled");

                var param = {
                    alias: $form.find("#alias").val(),
                    name: $form.find("#name").val(),
                    storagePoolUuid: $form.find("#storagePoolUuid").val(),
                    replicationFactor: $form.find("#replicationFactor").val(), //副本数
                    maxCapacity: ($form.find("#maxCapacity").val()) * 1024 * 1024 * 1024, //容量
                    totalExplicitReservedCapacity: ($form.find("#totalExplicitReservedCapacity").val()) * 1024 * 1024 * 1024, //预留容量
                    protocolType: $form.find("#protocolType").val()
                }

                var dtd = (function() {
                    var dtd = $.Deferred();
                    $.ajax({
                        url: app.webPath + "/rest/containers/create",
                        type: "post",
                        data: param,
                        dataType: "json",
                        success: function(result) {
                            if (!result.error) {
                                addDatastore({
                                    containerName: param.name,
                                    datastoreName: param.name
                                }).then(function() {
                                    dtd.resolve();
                                }, function() {
                                    // 创建datastore 网络出错
                                    dtd.reject();
                                })
                            } else if (result.error) {
                                dtd.reject(result.error);
                            }
                        }
                    });
                    return dtd;
                })();
                dtd.then(function() {
                    $form.siblings(".error").remove();
                    setTimeout(function(){
                        $modalWrap.removeDom();
                        $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                        $form.find("#submit-form").removeAttr("disabled");
                        renderVolumeContainers();
                    },500)
                }, function(error) {
                    $form.siblings(".error").remove();

                    if (error.message === "resource_exist") {
                        $('<div class="error">卷容器名称重复<div/>').insertBefore($form);
                    } else {
                        $('<div class="error">' + error.message + '<div/>').insertBefore($form);
                    }

                    $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                    $form.find("#submit-form").removeAttr("disabled");
                })
                return false;
            }
        });
    }

    function updateContainer() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var curVolumeContainer = volume_container[selectedCardIndex];
        console.log(curVolumeContainer)
        if (!curVolumeContainer) {
            throw new Error("unexpected an error hanppend");
        }

        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("更新卷容器");
            var formTpl =
                '<form class="form-horizontal" name="updateContainer" id="updateContainer" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">名称</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="alias" id="alias" autocomplete="off" class="no-raduis form-control input-sm" value="' + curVolumeContainer.alias + '" >' +
                '</div>' +
                '</div>' +
                '<input type="hidden" name="containerUuid" id="containerUuid" class="form-control input-sm" value="' + curVolumeContainer.containerUuid + '">' +
                /*'<div class="form-group mb clearfix" >'+
                    '<label for="containerName" class="col-xs-3 control-label">存储池</label>'+
                    '<div class="col-xs-9 input-p0" >'+
                        '<select name="storagePoolUuid" id="storagePoolUuid" class="no-raduis form-control input-sm" ></select>'+
                    '</div>'+
                '</div>'+*/
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">容量 </label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<div class="input-group">' +
                '<input type="text" name="maxCapacity" id="maxCapacity" class="no-raduis form-control input-sm"  value="' + utils.conversion(curVolumeContainer.maxCapacity, { decimalCount: 2, need_not_unit: true }) + '" disabled >' +
                '<span class="input-group-addon">GB</span>' +
                '</div>' +

                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">副本数</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<input type="text" name="replicationFactor" id="replicationFactor" autocomplete="off" class="no-raduis form-control input-sm" value="' + curVolumeContainer.replicationFactor + '" autocomplete="off" disabled >' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">文件系统类型</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<select name="fileSystemType" id="fileSystemType" class="no-raduis form-control input-sm" disabled >' +
                '<option value="nfs">NFS</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<div class="form-group mb clearfix" >' +
                '<label for="containerName" class="col-xs-3 control-label">预留容量</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<div class="input-group">' +
                '<input type="text" name="totalExplicitReservedCapacity" id="totalExplicitReservedCapacity" class="no-raduis form-control input-sm" value="' + utils.conversion(curVolumeContainer.totalExplicitReservedCapacity, { decimalCount: 2, need_not_unit: true }) + '" disabled >' +
                '<span class="input-group-addon">GB</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>';

            $modalWrap.find(".modal-body").html(formTpl);

            $modalWrap.find("#updateContainer").validate({
                errorPlacement: function(error, element) {
                    element.parent()
                        .append(error);
                },
                "rules": {
                    "alias": {
                        "required": true,
                        "minlength": 1,
                        "regValidation": /^[a-zA-Z0-9_u4e00-u9fa5]+$ /
                    },
                    "replicationFactor": {
                        "required": true
                    },
                    "totalExplicitReservedCapacity": {
                        "regValidation": /^(?=(0|[1-9]\d*)$)/
                    }
                },
                "messages": {
                    "alias": {
                        "required": "卷容器名称为必填项",
                        "minlength": "不少于1个字符",
                        "regValidation": "名称支持英文、数字、下划线，中文"
                    },
                    "replicationFactor": {
                        "required": "请选择副本数"
                    },
                    "totalExplicitReservedCapacity": {
                        "regValidation": "容量只能输入正整数"
                    }
                },
                submitHandler: function(form) {
                    var $form = $(form);
                    $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                    $form.find("#submit-form").attr("disabled", "disabled");

                    var param = {
                        alias: $form.find("#alias").val(),
                       // totalExplicitReservedCapacity: ($form.find("#totalExplicitReservedCapacity").val()) * 1024 * 1024 * 1024,
                        containerUuid: $form.find("#containerUuid").val()
                    }
                    $.ajax({
                        url: app.webPath + "/rest/containers/update",
                        type: "post",
                        data: param,
                        dataType: "json"
                    }).then(function(result) {
                        if (result.value == true) {
                            $modalWrap.removeDom();
                            renderVolumeContainers();
                        } else if (result.error) {
                            $form.siblings(".error").remove();
                            if (result.error.message == "resource_exist") {
                                $('<div class="error">卷容器名称重复<div/>').insertBefore($form);
                            } else {
                                $('<div class="error">' + result.error.message + '<div/>').insertBefore($form);
                            }
                        }
                        $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                        $form.find("#submit-form").removeAttr("disabled");
                    }).fail(function() {
                        $form.siblings(".error").remove();
                        $('<div class="error">网络出错<div/>').insertBefore($form);
                    })
                    return false;
                }
            });
        });
    }

    function deleteContainer() {
        var selectedCardIndex = utils.getCardSelectedIndex($cardWrapParent);
        var curVolumeContainer = volume_container[selectedCardIndex];
        if (!curVolumeContainer) {
            throw new Error("unexpected an error hanppend");
        }

        var checkDeleteAction = false;
        utils.addModal(function($modalWrap) {
            $modalWrap.find(".modal-title").html("删除卷容器");
            var msgBody = '<form name="deleteDatastore" id="deleteDatastore" autocomplete="off" novalidate="novalidate"><span class="checktip">您确定要删除此卷容器吗?</span><input type="submit" id="submit-form" class="hidden" /></form>';
            $modalWrap.find(".modal-body").html(msgBody);

            $modalWrap.find("#deleteDatastore").validate({
                submitHandler: function(form) {
                    // 验证通过执行该方法
                    $form = $(form);

                    if (!checkDeleteAction) {
                        checkDeleteAction = true;
                        $form.find(".checktip").html("请再次确定您要删除此卷容器吗?");
                        return;
                    } 
                    $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                    $form.find("#submit-form").attr("disabled", "disabled");

                    var datastoreName = curVolumeContainer.name;
                    if(curVolumeContainer.datastore && curVolumeContainer.datastore.datastoreName){
                        datastoreName = curVolumeContainer.datastore.datastoreName;
                    }

                    $.ajax({
                        url: app.webPath + "/rest/data_stores/remove",
                        type: "post",
                        data: { datastoreName: datastoreName },
                        dataType: "json"
                    }).then(function(result) {
                        $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                        $form.find("#submit-form").removeAttr("disabled");

                        if (result && result.jobId) {
                            $modalWrap.removeDom();
                            renderVolumeContainers();
                        } else if (result.error) {
                            $form.siblings(".error").remove();
                            if (result.error.message == "datastore have Volumes, can't remove") {
                                $('<div class="error">该卷容器正在被使用，不可删除<div/>').insertBefore($form);
                            } else {
                                $('<div class="error">' + result.error.message + '<div/>').insertBefore($form);
                            }
                        }
                    }).fail(function() {
                        $form.siblings(".error").remove();
                        $('<div class="error">网络出错<div/>').insertBefore($form);
                    })
                    return false;
                }
            });
        })
    }

    function addDatastore(opt) {
        return $.ajax({
            url: app.webPath + "/rest/data_stores/add",
            type: "post",
            data: opt || {},
            dataType: "json"
        })
    }

    // 渲染card
    function renderCard($cardWrapParent, $cardWrap, cardInfo) {
        // 设置attr containerUuid属性
        $cardWrap.attr("uuid", cardInfo.containerUuid);
        var jobInfo = "";
        $cardWrap.find(".card-icon-title").html(cardInfo.name).attr("title", cardInfo.name);
        if (!cardInfo.datastore || Object.prototype.toString.call(cardInfo.datastore.jobInfo) !== "[object Object]") {
            $cardWrap.find(".card-icon-status").addClass("error");
            $cardWrapParent.find(".detail-panel").before($cardWrap);
        } else {
            jobInfo = cardInfo.datastore.jobInfo;

            if (jobInfo.executionStatus === "OPEN") {
                if (jobInfo.jobName === "add_datastore") {
                    $cardWrap.find(".card-icon-status").addClass("warning").removeClass("success error");
                } else if (jobInfo.jobName == "remove_datastore") {
                    $cardWrap.find(".card-icon-status").addClass("warning").removeClass("success error");
                }
                //append card when volume_contianer creating  or deleting
                $cardWrapParent.find(".detail-panel").before($cardWrap);
            } else if (jobInfo.executionStatus === "CLOSED") {
                if (jobInfo.closeStatus === "COMPLETED") {
                    if (jobInfo.jobName === "add_datastore") {
                        $cardWrap.find(".card-icon-status").addClass("success").removeClass("error warning");
                    } else if (jobInfo.jobName === "remove_datastore") {
                        $cardWrap.find(".card-icon-status").addClass("success").removeClass("error warning");
                    }
                } else if (jobInfo.closeStatus === "TERMINATED" || jobInfo.closeStatus === "TIME_OUT") {
                    if (jobInfo.jobName === "add_datastore") {
                        $cardWrap.find(".card-icon-status").addClass("error").removeClass("success warning");
                    } else if (jobInfo.jobName === "remove_datastore") {
                        $cardWrap.find(".card-icon-status").addClass("error").removeClass("success warning");
                    }
                }
                $cardWrapParent.find(".detail-panel").before($cardWrap);
            }
        }

        $cardWrap.find(".available>span").html(utils.conversion(cardInfo.usageStats.storage_free_bytes, { decimalCount: 2 }));
        $cardWrap.find(".already-used>span").html(utils.conversion(cardInfo.usageStats.storage_usage_bytes, { decimalCount: 2 }));
        $cardWrap.find(".total-capacity>span").html(utils.conversion(cardInfo.usageStats.storage_capacity_bytes, { decimalCount: 2 }));
        if (cardInfo.datastore) {
            $cardWrap.find(".datastore-name>span").html(cardInfo.datastore.datastoreName).attr("title", "Datastore:" + cardInfo.datastore.datastoreName);
        }
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
                        renderVolumeContainers();
                    } else if(result.jobName == "remove_datastore"){
                        renderVolumeContainers();
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

    return { renderVolumeContainers: renderVolumeContainers, clearMoniterTimers: clearMoniterTimers,clearVC_cT:clearVC_cT }
});
