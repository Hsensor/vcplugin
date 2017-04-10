define(["resources/js/utils", "jquery","moment", "bootstrap.table", "resources/js/tooltip","resources/js/dropdown"], function(utils, $ ,moment) {
    var $alarm = $("#alarm");
    var $alarmNavBtns = $alarm.find(".alarm_btns span");
    var $alarmContentChildren = $alarm.find(".alarmContent").children();
    var metrics,$alarmTable;
    var queryParams = {};

    var $alarmTimepicker = $alarm.find(".alarm_timepicker");

    function updateDateNow(){
        if ($alarmNavBtns.eq(0).hasClass("active")) {
            try{
                $alarmTimepicker.data("DateTimePicker").clear();
                $alarmTimepicker.data("DateTimePicker").destroy();
            }catch(e){
            }

            $alarmTimepicker.datetimepicker({
                locale:"zh-cn",
                format:'YYYY/MM/DD HH:mm',
                ignoreReadonly:true,
                defaultDate:"now"
            });
            $alarmTimepicker.data("DateTimePicker").maxDate("now");
        
            queryParams.endTimeInUsecs = +new Date($alarmTimepicker.find("input").val());
            queryParams.startTimeInUsecs = +new Date(+new Date($alarmTimepicker.find("input").val())-2*24*60*60*1000);
            //进入alarmTimepicker dp.change 回掉函数中， $alarmTable.data("bootstrap.table").refresh()
            
        } else {
            
            initMetric('all');
        }
    }

    $alarmTimepicker.on("dp.change",utils.debounce(function(){
        if($alarmTimepicker.find("input").val()){
            queryParams.endTimeInUsecs = +new Date($alarmTimepicker.find("input").val());
            queryParams.startTimeInUsecs = +new Date(+new Date($alarmTimepicker.find("input").val())-2*24*60*60*1000);
            try{
                $alarmTable.data('bootstrap.table').refresh({},function(options){
                    options.pageNumber = 1;
                    options.totalRows = 0;
                    options.totalPages = 0;
                });
            }catch(e){
                initAlarmTable($alarmContentChildren.eq(0));
            }
        }
        
    },300,{leading:false}));

    $alarmNavBtns.on("click", function() {
        var index = $alarmNavBtns.index($(this));

        if (index==0) {
            $alarm.find(".search_wraps").show();
        } else {
            $alarm.find(".search_wraps").hide();
        }

        $(this).addClass("active").siblings().removeClass("active");
        $alarmContentChildren.eq(index).addClass("active").siblings().removeClass("active");
        updateDateNow();
    });

    $alarmContentChildren.eq(1).find(".alarm-rules-list>li").on("click",function(){
        var $this = $(this);

        if($this.hasClass("active")){
            return;       
        }
        $this.siblings().removeClass("active");
        $this.addClass("active");

        initMetric($this.data("type"));
    })

    function initMetric(metricType) {
        listMetrics().then(function(result) {
            if(result.error && typeof result.error === "string"){
                console.error("list health_checks"+result.error);
                return;
            }else{
                if(result.error){
                    console.error("list health_checks",result.error);
                    return;
                }
            }
            $alarm.find(".rulesAlarm tbody").html("");
            var metrics = result.entities;
            for (var i = 0; i < metrics.length; i++) {
                var curMetricTpl = $(metricTranslate(metrics[i]));
                if (metricType.indexOf(metrics[i].entityType)>-1 || metricType == 'all') {
                    curMetricTpl.find("td:eq(0)").find("span").attr({
                        "data-toggle": "tooltip",
                        "data-html": "true",
                        "data-placement": "right",
                        "data-trigger": "hover",
                        "data-title": createTooltipHtml(metrics[i])
                    });
                    
                    $alarm.find(".rulesAlarm tbody").append(curMetricTpl);
                }
            }

            $alarm.find('.rulesAlarm td [data-toggle="tooltip"]').tooltip();

            $alarmContentChildren.find(".settings_btn").click(function() {
                var index = $alarmContentChildren.find(".settings_btn").index($(this));
                if (metrics) {
                    updateMetric(metrics[index]);
                }
            });

        }).fail(function() {
            $alarm.find(".rulesAlarm tbody").html("");
            createMetricErrorTpl($alarm.find(".rulesAlarm tbody"));
        });
    }

    function createTooltipHtml(curMetric) {
        var tempArr = [];
        if (curMetric.metricName != utils.metricNameMap["diskState"] && curMetric.metricName != utils.metricNameMap["hostState"]) {
            if (!curMetric.alert || !curMetric.alarm) {
                console.log("expected metric.alert and metric.alarm have value");
            }
            return [
                '<ul>',
                '<li>启&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用：' + (curMetric.actionsEnabled ? "是" : "否") + '</li>',
                '<li>警&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;告：>=' + (curMetric.alert || '') + '%</li>',
                '<li>警&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;示：>=' + (curMetric.alarm || '') + '%</li>',
                '<li>告警频率：' + (curMetric.period/60) + '分钟</li>',
                '</ul>'
            ].join("");
        } else {
            return [
                '<ul>',
                '<li>启&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用：' + (curMetric.actionsEnabled ? "是" : "否") + '</li>',
                '<li>告警频率：' + (curMetric.period/60) + '分钟</li>',
                '</ul>'
            ].join("");
        }
    }

    function initAlarmTable($alarmContent) {
        $alarmContent.empty();

        $alarmTable = $("<table></table>");
        $alarmContent.append($alarmTable);

        $alarmTable.bootstrapTable({
            method: "get",
            url: app.webPath + '/rest/alerts/list',
            paginationPreText:"上一页",
            paginationNextText:"下一页",
            //singleSelect:true,
            dataField: "data",
            pagination: true,
            pageNumber: 1,
            pageSize: 10,
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
                //params.count = params.limit;
                if(queryParams.refresh){
                    params.offset = 0;
                    delete queryParams.refresh;
                }
                //params.page = parseInt(params.offset / params.limit);
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
                }
                params.startTimeInUsecs = queryParams.startTimeInUsecs*1000;
                params.endTimeInUsecs = queryParams.endTimeInUsecs*1000;

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
                title: "告警级别",
                field: 'severity',
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
                    $headerCellTpl.find(".drowdown-toggle").dropdown();

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
                        $alarmTable.data('bootstrap.table').refresh({},function(options){
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
                title: "对象",
                field: "entityType",
                formatter:function(value,row,index){
                    if (utils.entityTypeMap["disks"] == value) {
                        return "硬盘";
                    }else if (utils.entityTypeMap["hosts"] == value) {
                        return "主机";
                    }else if (utils.entityTypeMap["storagepools"] == value) {
                        return "存储池";
                    }else if (utils.entityTypeMap["containers"] == value) {
                        return "卷容器";
                    }else if (utils.entityTypeMap["clusters"] == value) {
                        return "存储集群";
                    }
                },
                headerCellTpl:function(){
                   var headerCellHtml = '<span class="action_slide dropdown"><span class="glyphicon glyphicon-chevron-down dropdown-toggle" data-toggle="dropdown"></span>'+
                    '<ul class="dropdown-menu">'+
                        '<li data-entity-type="null"><a herf="javascript:void(0)">全部</a></li>'+
                        '<li data-entity-type="'+utils.entityTypeMap["clusters"]+'"><a herf="javascript:void(0)">存储集群</a></li>'+
                        '<li data-entity-type="'+utils.entityTypeMap["storagepools"]+'"><a herf="javascript:void(0)">存储池</a></li>'+
                        '<li data-entity-type="'+utils.entityTypeMap["containers"]+'"><a herf="javascript:void(0)">卷容器</a></li>'+
                        '<li data-entity-type="'+utils.entityTypeMap["hosts"]+'"><a herf="javascript:void(0)">主机</a></li>'+
                        '<li data-entity-type="'+utils.entityTypeMap["disks"]+'"><a herf="javascript:void(0)">硬盘</a></li>'+
                    '</ul></span>';
                    var $headerCellTpl = $(headerCellHtml)
                    $headerCellTpl.find(".drowdown-toggle").dropdown();

                    $headerCellTpl.find("li").on("click",function(){
                        if($(this).hasClass("active")){
                            return;
                        }
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");
                        if($(this).data("entityType")){
                            queryParams.entityType = $(this).data("entityType");
                        }else{
                            delete queryParams.entityType ;
                        }
                        queryParams.refresh = true;
                        $alarmTable.data('bootstrap.table').refresh({},function(options){
                            options.pageNumber = 1;
                            options.totalRows = 0;
                            options.totalPages = 0;
                        });
                    }).each(function(){
                        if(queryParams.severity==$(this).data("entityType")){
                            $(this).addClass("active");
                        }else{
                            $(this).removeClass("active");
                        }                       
                    });

                    return $headerCellTpl;
                }
            }, {
                title: "告警名称",
                field: "alertTitle",
                events:{//自定义时间用来触发tooltip
                    'mouseover .showAlarmDetail':function(){
                        $(this).tooltip("show");
                    },
                    'mouseout .showAlarmDetail':function(){
                        $(this).tooltip("hide");
                    }
                },
                formatter:function(value,row,index){
                    //产生tooltip dom结构
                    /*var alertTitleFormat = '<div class="showAlarmDetail" data-html="true" data-placement="top" data-title="'+utils.alarmTipDom(row)+'">'+arguments[1].alertTitle+'</div>';
                    $(alertTitleFormat).tooltip();
                    return alertTitleFormat;*/
                    return utils.alarmTipDom(row);
                }
            }, {
                title: "详细信息",
                field: 'message'
                }, {
                title: "触发时间",
                field: 'createdTimestampInUsecs',
                sortable: true,
                formatter: function(value,row,index) {
                    return value ? utils.transDate(value) : "-";
                }
            }, {
                title: "确认时间",
                field:"acknowledgedTimestampInUsecs",
                sortable: true,
                formatter: function(value,row,index) {
                    return value ? utils.transDate(value) : "-";
                }
            }, {
                title: "确认者",
                field:"acknowledgedByUserName",
                formatter: function(value,row,index) {
                    return value && value != "null" ? value : "-";
                }
            }, {
                title: "操作",
                field:"acknowledged",
                formatter: function(value,row,index) {
                    if (false == value) {
                        return '<button class="acknowledged acknowledged_btn" style="font-family:HanHei-SC-thin,MicrosoftYaHei,arial,helvetica,sans-serif;color:#666;"><span class="check_icon"></span>确认</button>';
                    } else {
                        return "已确认"
                    }
                },
                headerCellTpl:function(){
                   var headerCellHtml = '<span class="action_slide dropdown"><span class="glyphicon glyphicon-chevron-down dropdown-toggle" data-toggle="dropdown"></span>'+
                    '<ul class="dropdown-menu">'+
                        '<li data-acknowledged="null"><a herf="javascript:void(0)">全部</a></li>'+
                        '<li data-acknowledged="true"><a herf="javascript:void(0)">已确认</a></li>'+
                    '</ul></span>';
                    var $headerCellTpl = $(headerCellHtml)
                    $headerCellTpl.find(".drowdown-toggle").dropdown();

                    $headerCellTpl.find("li").on("click",function(){
                        if($(this).hasClass("active")){
                            return;
                        }
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");
                        if($(this).data("acknowledged")){
                            queryParams.acknowledged = $(this).data("acknowledged");
                        }else{
                            delete queryParams.acknowledged ;
                        }
                        queryParams.refresh = true;
                        $alarmTable.data('bootstrap.table').refresh({},function(options){
                            options.pageNumber = 1;
                            options.totalRows = 0;
                            options.totalPages = 0;
                        });
                    }).each(function(){
                        if(queryParams.severity==$(this).data("acknowledged")){
                            $(this).addClass("active");
                        }else{
                            $(this).removeClass("active");
                        }                       
                    });

                    return $headerCellTpl;
                },
                events: {
                    'click .acknowledged':acknowledgedEvent 
                }
            }]
        })
    }

    function acknowledgedEvent(e, value, row, index) {
        $.ajax({
            url: app.webPath + '/rest/alerts/' + row.entityId + '/acknowledge',
            type: "post",
            dataType: "json",
            data: {
                body: JSON.stringify({
                    type: row.entityType,
                    timestamp: row.createdTimestampInUsecs
                })
            }
        }).then(function(result) {
            if (!result.error) {
                $alarmTable.data('bootstrap.table').refresh();
            }
        }).fail(function() {
            alert("error");
        });

        $.ajax({
            url:app.webPath+'/rest/alerts/'+row.entityId+'/resolve',
            type:"post",
            dataType:"json",
            data:{
                body:JSON.stringify({
                    type:row.entityType,
                    timestamp:row.createdTimestampInUsecs
                })
            }
        }).then(function(result){
            
        }).fail(function(){
            alert("error");
        })
    }

    function listMetrics() {
        return $.ajax({
            method: "get",
            url: app.webPath + '/rest/health_checks/list',
            dataType: "json"
        })
    }

    function metricTranslate(metric) {
        var tpl = "";
        switch (metric.metricName) {
            case utils.metricNameMap["diskUsage"] :
                tpl = createMetricItemTpl({ "metricName": "硬盘裸容量状态", "entity_type": "硬盘" });
                break;
            case utils.metricNameMap["diskState"] :
                tpl = createMetricItemTpl({ "metricName": "硬盘状态", "entity_type": "硬盘" });
                break;
            case utils.metricNameMap["hostState"] :
                tpl = createMetricItemTpl({ "metricName": "主机状态", "entity_type": "主机" });
                break;
            case utils.metricNameMap["containerStorageUsage"] :
                tpl = createMetricItemTpl({ "metricName": "卷容器裸容量状态", "entity_type": "卷容器" });
                break;
            case utils.metricNameMap["storagePoolStorageUsage"] :
                tpl = createMetricItemTpl({ "metricName": "存储池裸容量状态", "entity_type": "存储池" });
                break;
            case  utils.metricNameMap["clusterStorageUsage"] :
                tpl = createMetricItemTpl({ "metricName": "集群裸容量状态", "entity_type": "存储集群" });
                break;
        }

        return tpl;
    }

    function createMetricItemTpl(metric) {
        return ['<tr><td><span class="tooltip_span">', metric.metricName, '</td><td>', metric.entity_type, '</span></td><td><span class="settings_btn"><span class="setting_btn"></span>设置</span></td></tr>'].join("");
    }

    function createMetricErrorTpl($metricTableTbody){
        var tdLen = $metricTableTbody.prev().find("tr").children().length;

        $metricTableTbody.append('<tr><td class="align-center" colspan="'+tdLen+'">加载数据失败! 请再次重试</td></tr>');
    }

    function updateMetric(metric) {
        utils.addModal(function($modalWrap) {
            if (metric.metricName == utils.metricNameMap["hostState"]) {
                $modalWrap.find(".modal-title").html("主机状态");
            } else if (metric.metricName == utils.metricNameMap["diskState"]) {
                $modalWrap.find(".modal-title").html("硬盘状态");
            } else if (metric.metricName == utils.metricNameMap["diskUsage"]) {
                $modalWrap.find(".modal-title").html("硬盘裸容量状态");
            } else if (metric.metricName == utils.metricNameMap["containerStorageUsage"]) {
                $modalWrap.find(".modal-title").html("卷容器裸容量状态");
            } else if (metric.metricName == utils.metricNameMap["clusterStorageUsage"]) {
                $modalWrap.find(".modal-title").html("集群裸容量状态");
            } else if (metric.metricName == utils.metricNameMap["storagePoolStorageUsage"]) {
                $modalWrap.find(".modal-title").html("存储池裸容量状态");
            }
            var formTpl =
                '<form class="form-horizontal" name="updateMetric" id="updateMetric" autocomplete="off" novalidate="novalidate">' +
                '<div class="form-group mb clearfix" >' +
                '<label class="col-xs-3 control-label">启用：</label>' +
                '<div class="col-xs-9 input-p0" style="padding-top:8px;">' +
                '<input type="checkbox" id="actionsEnabled"/>' +
                '</div>' +
                '</div>';
            if (metric.metricName != utils.metricNameMap["diskState"] && metric.metricName != utils.metricNameMap["hostState"]) {
                formTpl +=
                    '<div class="form-group mb clearfix" >' +
                    '<label class="col-xs-3 control-label">警告：</label>' +
                    '<div class="col-xs-9 input-p0" >' +
                    '<div class="input-group">' +
                    '<span class="input-group-addon" style="border:0;background-color:#fff;padding:0">>=</span><input type="number" name="alertOperator" id="alertOperator" class="no-raduis form-control input-sm"/><span class="input-group-addon  no-raduis">%</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group mb clearfix" >' +
                    '<label class="col-xs-3 control-label">警示：</label>' +
                    '<div class="col-xs-9 input-p0 " >' +
                    '<div class="input-group">' +
                    '<span class="input-group-addon" style="border:0;background-color:#fff;padding:0;">>=</span><input type="number" name="alarmOperator" id="alarmOperator" class="no-raduis form-control input-sm"/><span class="input-group-addon  no-raduis">%</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

            formTpl +=
                '<div class="form-group mb clearfix" >' +
                '<label class="col-xs-3 control-label">告警频率：</label>' +
                '<div class="col-xs-9 input-p0" >' +
                '<select name="periods" id="periods" class="no-raduis form-control input-sm" >' +
                '<option value="1">1分钟</option>' +
                '<option value="5">5分钟</option>' +
                '<option value="10">10分钟</option>' +
                '<option value="30">30分钟</option>' +
                '<option value="60">60分钟</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '<input type="submit" id="submit-form" class="hidden" />' +
                '</form>';


            $modalWrap.find(".modal-body").html(formTpl);

            $modalWrap.find("#actionsEnabled")[0].checked = metric.actionsEnabled ? true : false;

            var periods = $modalWrap.find("#periods>option")

            for (var i = 0; i < periods.length; i++) {
                if (periods[i].value == Number(metric.period/60)) {
                    periods[i].selected = true;
                }
            }

            if (metric.metricName != utils.metricNameMap["diskState"] && metric.metricName != utils.metricNameMap["hostState"]) {
                var alarmOperator = $modalWrap.find("#alarmOperator");
                if (metric.alarm) {
                    alarmOperator.get(0).value = metric.alarm;
                } else {
                    console.log("expected metric.alarm have value");
                }
                var alertOperator = $modalWrap.find("#alertOperator");
                if (metric.alert) {
                    alertOperator.get(0).value = metric.alert;
                } else {
                    console.log("expected metric.alert have value");
                }
            }

            submitMetric($modalWrap, metric);

        });
    }

    $.validator.addMethod("selfDefineRange", function(value, element, params) {
        if (Number(value) <= 0) {
            return false;
        } else if (Number(value) >= 100) {
            return false;
        } else {
            return true
        }
    });
    $.validator.addMethod("operatorValue", function(value, element, params) {
        if (params == "#alarmOperator") {
            var warningValue = Number($(element).parents("form").find(params).val());
            if (!warningValue) {
                return true;
            }

            if (warningValue && Number(value) < warningValue) {
                return true;
            } else {
                return false;
            }
        } else if (params == "#alertOperator") {
            var hintValue = Number($(element).parents("form").find(params).val());
            if (!hintValue) {
                return true;
            }
            if (hintValue && Number(value) > hintValue) {
                return true;
            } else {
                return false;
            }
        }
    });

    function submitMetric($modalWrap, metric) {
        $modalWrap.find("#updateMetric").validate({
            errorPlacement: function(error, element) {
                element.parents(".col-xs-9")
                    .append(error);
            },
            "rules": {
                "alertOperator": {
                    "required": true,
                    "operatorValue": "#alarmOperator",
                    "selfDefineRange": "",
                },
                "alarmOperator": {
                    "required": true,
                    "operatorValue": "#alertOperator",
                    "selfDefineRange": ""
                }
            },
            "messages": {
                "alertOperator": {
                    "required": "警告为必填项",
                    "operatorValue": "警告阈值需小于警示阈值",
                    "selfDefineRange": "大于0小于100的数值"
                },
                "alarmOperator": {
                    "required": "警示为必填项",
                    "operatorValue": "警示阈值需大于警告阈值",
                    "selfDefineRange": "大于0小于100的数值"
                }
            },
            submitHandler: function(form) {
                var $form = $(form);

                $form.siblings(".error").remove();
                $modalWrap.find(".modal-footer>.save").attr("disabled", "disabled");
                $form.find("#submit-form").attr("disabled", "disabled");

                var option = {

                }
                if (metric.metricName != "disk_state" && metric.metricName != "host_state") {
                    option.alert = Number($modalWrap.find("#alertOperator").val());
                    option.alarm = Number($modalWrap.find("#alarmOperator").val());
                }
                option.actionsEnabled = $modalWrap.find("#actionsEnabled")[0].checked;
                option.period = Number($modalWrap.find("#periods").val())*60;//s
                option.namespace = metric.namespace;
                option.metricName = metric.metricName;
                option.accountId = metric.accountId;
                option.entityType = metric.entityType;
                option.healthCheckUuid = metric.healthCheckId;

                ajaxUpdateMetric(option).then(function(result) {
                    if (!result || !result.error) {
                        $modalWrap.removeDom();
                        initMetric('all');
                        $modalWrap.find(".modal-footer>.save").removeAttr("disabled");
                        $form.find("#submit-form").removeAttr("disabled");
                    } else {
                        $form.siblings(".error").remove();
                        if(result&&result.error&&result.error.message){
                            $('<div class="error">' + result.error.message + '<div/>').insertBefore($form);
                        }
                    }
                    
                });

                return false;
            }
        });
    }

    function ajaxUpdateMetric(jsonBody) {
        return $.ajax({
            url: app.webPath + '/rest/health_checks/modify',
            type: "post",
            dataType: "json",
            data: {
                body: JSON.stringify(jsonBody)
            }
        })
    }
    return {
        updateDateNow:updateDateNow
    };
}); 