define(["resources/js/utils","jquery","resources/js/dropdown"],function(utils,$){

	var $cardWrapParent = $("#host");
	var $cardWrap = $($("#host_card").html());
	var $discoverCardWrap = $($("#host_discover_card").html());
	var hosts = null;
	var loading = false;
  var hostXHR;

	function renderHosts(){
		if(loading){
			hostXHR.abort();
		}
		loading = true;

		$cardWrapParent.find(".card-wrap").remove();
		$cardWrapParent.find(".detail-panel").hide();
		$cardWrapParent.siblings(".loading").show().html("...... 正在加载数据 ......");

    hostXHR = loadHosts();
		$.when(hostXHR).done(function(result1){
			loading = false;

			if(result1.error){
				$cardWrapParent.siblings(".loading").show().html(result1.error.message);
			}else{
				$cardWrapParent.siblings(".loading").hide();
				hosts = result1&&result1.entities.sort(function(a,b){
					return a.hypervisorAddress.match(/\d+$/)[0]-b.hypervisorAddress.match(/\d+$/)[0];
				});
				if(!hosts){
					throw new Error("list host error");
				}
				for(var i=0;i<hosts.length;i++){
					$cloneCardWrap = $cardWrap.clone();
					renderCard($cardWrapParent,$cloneCardWrap,hosts[i]);
				}
				//renderDiscoverdCard($cardWrapParent,$discoverCardWrap.clone(),hosts[0]);
				
				utils.cardWrapBindHandler($cardWrapParent,detailPanelCallback,joinHost);
			}

		}).fail(function(){
			loading = false;
			$cardWrapParent.siblings(".loading").show().html("加载数据失败! 请再次重试");
		});
	}

	utils.detailPanelTab($cardWrapParent.find(".detail-panel"),function(tabIndex){
		var index = utils.getCardSelectedIndex($cardWrapParent);
		if(tabIndex==0){
			initPanelDetail(index);
		}else if(tabIndex==1){
			initHostDisks(index);
		}else if(tabIndex==2){
			initHostAlarm(index);
		}else if(tabIndex==3){
			initHostEvent(index);
		}
	});

	utils.detailPanelClose($cardWrapParent.find(".detail-panel"),function(){
		$cardWrapParent.find(".card-wrap.active").removeClass("active");		
	});

	function detailPanelCallback(detailPanel){
		var index = detailPanel.index;
		var status = detailPanel.status;

		var $detailPanel = $cardWrapParent.find(".detail-panel");
		var $navLis = $detailPanel.find(".detail-tab-nav>.nav-list>li");

		if(status==="expand"){
			for(var i=0;i<$navLis.length;i++){
				if($navLis.eq(i).hasClass("active")){
					$navLis.eq(i).trigger("click",[true]);
					break;
				}
			}
		}else if(status==="close"){
			
		}
	}

	function joinHost(){
		utils.addModal(function($modalWrap){
			$modalWrap.find(".modal-title").html("确认添加主机");
			var formTpl = 
			'<form class="form-horizontal" name="createContainer" id="createContainer" autocomplete="off" novalidate="novalidate">'+
      	'<div class="form-group mb clearfix" >'+
          '<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>主机IP：</label>'+
        	'<div class="col-xs-9 input-p0" >'+
            '<input type="text" name="hostIp" id="hostIp" autocomplete="off" class="no-raduis form-control input-sm" >'+
        	'</div>'+
      	'</div>'+
      	'<div class="form-group mb clearfix" >'+
        	'<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>用户名：</label>'+
        	'<div class="col-xs-9 input-p0" >'+
            '<input type="text" name="userName" id="userName" autocomplete="off" class="no-raduis form-control input-sm" >'+
        	'</div>'+
      	'</div>'+
      	'<div class="form-group mb clearfix" >'+
        	'<label for="containerName" class="col-xs-3 control-label"><span class="required">*</span>密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>'+
        	'<div class="col-xs-9 input-p0" >'+
            '<input type="password" name="password" id="password" autocomplete="off" class="no-raduis form-control input-sm" >'+
        	'</div>'+
      	'</div>'+
      	'<input type="submit" id="submit-form" class="hidden" />'+
  		'</form>';

  		$modalWrap.find(".modal-body").html(formTpl);
		})
	}


	function initPanelDetail(cardIndex){
		var $host_DetailPanel = $cardWrapParent.children(".detail-panel");
		var $detailContent = $host_DetailPanel.find(".detail-content");

		var hostDetail = hosts[cardIndex];

		if(!hostDetail){
			console.log("get hostDetail error");
			return;
		}

		$detailContent.find(".name-val").html(hostDetail.name);
		$detailContent.find(".ip-val").html(hostDetail.hypervisorAddress);
		$detailContent.find(".status-val").html(hostDetail.state=="NORMAL"?"开机":"关机");
		// $detailContent.find(".free-val").html(utils.conversion(hostDetail.usageStats.storage_free_bytes,{decimalCount:2}));
		$detailContent.find(".used-val").html(utils.conversion(hostDetail.usageStats.storage_usage_bytes,{decimalCount:2}));
		$detailContent.find(".totalCapacity-val").html(utils.conversion(hostDetail.usageStats.storage_capacity_bytes,{decimalCount:2}));
	}

	function initHostDisks(cardIndex){
		var $diskTpl = $($("#storagePoolDiskPanel").html());
		var $host_DetailPanel = $cardWrapParent.children(".detail-panel");
		var $diskContent = $host_DetailPanel.find(".disks-content");
		$diskContent.empty();
		var hostDetail = hosts[cardIndex];
		$diskDetailParent.append("...正在努力加载数据...");
		
    loadDisks().then(function(result){
			$diskContent.empty();
      try {
  			result.entities = result.entities.filter(function(curDisk){
          return curDisk.cvmIpAddress === hostDetail.serviceVMExternalIP;
        })
        .sort(function(diskA,diskB){
  				return diskA.storageTierName.localeCompare(diskB.storageTierName);
  			});
      } catch(e) {
        console.log("cvmIpAddress match serviceVMExternalIP failed or disk have not storageTierName property");
      }
			
			for(var i = 0;i<result.entities.length;i++){
				var curDisk = result.entities[i];
				if(curDisk.cvmIpAddress==hostDetail.serviceVMExternalIP){
					var $tempDisk = $diskTpl.clone();
					$tempDisk.attr("title",curDisk.diskUuid);//设置悬停效果
					$diskContent.append($tempDisk);
					$tempDisk.find(".card-icon-title").html(curDisk.diskUuid);
					$tempDisk.find(".disk-type>span").html(curDisk.storageTierName);
					$tempDisk.find(".disk-status>span").html(curDisk.diskStatus==="NORMAL"?"online":"offline");
					$tempDisk.find(".disk-avalible>span").html(utils.conversion(curDisk.usageStats.storage_free_bytes,{decimalCount:2}));
					$tempDisk.find(".disk-total>span").html(utils.conversion(curDisk.diskSize,{decimalCount:2}));
					$tempDisk.find(".disk-life").hide().find("span").html(curDisk.storageTierName);	
					if(curDisk.diskStatus==="NORMAL"){
						$tempDisk.find(".card-icon-status").addClass("success").removeClass("error");
					}else{
						$tempDisk.find(".card-icon-status").addClass("error").removeClass("success");
					}
				}
			}
		}).fail(function(){
      $diskContent.empty();
			$diskContent.append("服务出错");
		});
	}

	function initHostAlarm(cardIndex){
		var $host_DetailPanel = $cardWrapParent.children(".detail-panel");
		var $alarmContent = $host_DetailPanel.find(".alarm-content");
		var queryParams={};
		$alarmContent.empty();		

		var hostDetail = hosts[cardIndex];
		var $alarmTable = $("<table></table>");

		$alarmContent.append($alarmTable);
		$alarmTable.bootstrapTable({
			method:"get",
  		url:app.webPath+'/rest/hosts/'+hostDetail.uuid+"/alerts",
  		clickToSelect:true,
  		//singleSelect:true,
  		dataField:"data",
  		pagination:true,
  		pageNumber:1,
  		pageSize:5,
  		formatNoMatches:function(){
				return "未能查询到数据";
			},
			formatLoadingMessage:function(){
				return "正在努力加载资源";
			},
			formatShowingRows:function(pageFrom, pageTo, totalRows){
				return "";
			},
			formatRecordsPerPage:function(){
				return "";
			},
			queryParams:function(params){
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
			responseHandler:function(result){
				var res = null;
				if(result&&result.entities){
					res = {data:result.entities,total:result.metadata.total};
				}else{
					res = {data:[],total:0};
				}
				
				return res;
			},
		    columns: [
		    {
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
		    },
		    {
		    	field:"entityType",
		    	title:"对象",
		    	formatter:function(value,row,index){
		    		if (utils.entityTypeMap["hosts"] == value) {
		    			return "主机";
		    		}else {
		    			return "-";
		    		}
		    	}
		    },
		    {
	        field:"alertTitle",
	        title: "告警名称",
		  		formatter:function(value,row,index){
		  			//产生tooltip dom结构
            var alertTitleFormat = '<div class="showAlarmDetail" data-html="true" data-placement="top" data-title="'+utils.alarmTipDom(row)+'">'+value+'</div>';
            $(alertTitleFormat).tooltip();
            return alertTitleFormat;
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
	        title:"触发时间",
	        sortable: true,
	        formatter:function(){
				    return arguments[1].createdTimestampInUsecs?utils.transDate(arguments[1].createdTimestampInUsecs):"-"
					}
		    }, {
	        title: "确认时间",
	        sortable: true,
	        formatter:function(){
				    return arguments[1].acknowledgedTimestampInUsecs?utils.transDate(arguments[1].acknowledgedTimestampInUsecs):"-";
					},
		    },
		    {
			    field:"acknowledgedByUserName",
			    title: "确认者"
			}]
		})
	}

	function initHostEvent(cardIndex){
		var $host_DetailPanel = $cardWrapParent.children(".detail-panel");
		var $eventContent = $host_DetailPanel.find(".event-content");
		$eventContent.empty();

		var hostDetail = hosts[cardIndex];
		var $eventTable = $("<table></table>");
		$eventContent.append($eventTable);

		$eventTable.bootstrapTable({
			method:"get",
			url:app.webPath+'/rest/hosts/'+hostDetail.uuid+"/events",
			clickToSelect:true,
			//singleSelect:true,
			dataField:"data",
			pagination:true,
			pageNumber:1,
			pageSize:5,
			formatNoMatches:function(){
				return "未能查询到数据";
			},
			formatLoadingMessage:function(){
				return "正在努力加载资源";
			},
			formatShowingRows:function(pageFrom, pageTo, totalRows){
				return "";
			},
			formatRecordsPerPage:function(){
				return "";
			},
			queryParams:function(params){
  			delete params.limit;
  			delete params.offset;
  			delete params.order;
  			return params;
			},
			responseHandler:function(result){
				var res = null;
				if(result&&result.entities){
					res = {data:result.entities,total:result.metadata.total};
				}else{
					res = {data:[],total:0};
				}
				
				return res;
			},
	    columns: [
	    {
        field: 'severity',
        title: "名称",
        formatter:function(value,row,index){
        	return '<a class="even" href="javascript:void(0)">'+value+'</a>';
        },
        events:{
        	'click .even':function(e,value,row,index){
        		$(".navigator-bar>.navigator-bar-ul>li:eq(5)").triggle("click");
        	}
        }
	    },
	    {
        field: 'entityType',
        title: "目标"
	    }, 
	    {
        field:"alertTitle",
        title: "详细信息"
	    }, 
	    {
	    	title: "启动者",
	      formatter:function(){
			    return 'administrator'
				}
	    }, 
	    {
        title: "完成时间",
        formatter:function(){
				  return arguments[1].createdTimestampInUsecs?utils.transDate(arguments[1].createdTimestampInUsecs):"-";
				}
	    }]
		})

	}

	function renderCard($cardWrapParent,$cardWrap,host){
		$cardWrap.attr("uuid",host.uuid);
		$cardWrapParent.find(".detail-panel").before($cardWrap);
		
		host.state=="NORMAL"?$cardWrap.find(".card-icon-status").addClass('success').removeClass("error"):$cardWrap.find(".card-icon-status").addClass('error').removeClass("success");
		$cardWrap.find(".card-icon-title").html(host.name).attr("title",host.name);
		$cardWrap.find(".card-detail>.host_ip>span").html(host.hypervisorAddress);
		$cardWrap.find(".card-detail>.host_status>span").html(host.state=="NORMAL"?"开机":"关机");
	}

	function renderDiscoverdCard($cardWrapParent,$cardWrap,host){
		$cardWrapParent.find(".detail-panel").before($cardWrap);
		$cardWrap.find(".card-detail>.host_ip>span").html(host.hypervisorAddress);
	}

	function loadHosts(){
		return $.ajax({
			url:app.webPath+"/rest/hosts/list",
			type:"get",
			dataType:"json"
		});
	}

	function loadDiscoverHost(){
		return $.ajax({
			url:app.webPath+"/rest/hosts/list",
			type:"get",
			dataType:"json"
		})
	}

	function loadDisks(){
		return $.ajax({
			url:app.webPath+"/rest/disks/list",
			type:"get",
			dataType:"json"
		})
	}

	return {
		renderHosts: renderHosts
	}
})
