define(["resources/js/utils","jquery","moment","bootstrap.table","resources/js/dropdown"],function(utils,$,moment){
	var $event = $("#event");
	var $eventContent = $event.find(".event_table");
	var $eventTable;
	var queryParams = {};
	
	$eventTimePicker = $event.find(".event_timepicker")

	function updateDateNow(){
		try{
			$eventTimePicker.data("DateTimePicker").clear();
			$eventTimePicker.data("DateTimePicker").destroy();
		}catch(e){

		}

		$eventTimePicker.datetimepicker({
      locale:"zh-cn",
      format:'YYYY/MM/DD HH:mm',
      ignoreReadonly:true,
      defaultDate:"now"
    });
		$eventTimePicker.data("DateTimePicker").maxDate("now");

		queryParams.endTimeInUsecs = +new Date($eventTimePicker.find("input").val());
    queryParams.startTimeInUsecs = +new Date(+new Date($eventTimePicker.find("input").val())-2*24*60*60*1000);
	}

  $eventTimePicker.on("dp.change",utils.debounce(function(){
  	if ($eventTimePicker.find("input").val()) {
      queryParams.endTimeInUsecs = +new Date($eventTimePicker.find("input").val());
      queryParams.startTimeInUsecs = +new Date(+new Date($eventTimePicker.find("input").val())-2*24*60*60*1000);

      try{
        $eventTable.data('bootstrap.table').refresh({},function(options){
          options.pageNumber = 1;
          options.totalRows = 0;
          options.totalPages = 0;
        });
      }catch(e){
        initEvent();
      }
    }
  },300,{leading:false}));

	function initEvent(){
		initEventTable($eventContent);
	}

	function initEventTable($eventContent){
		$eventContent.empty();
		
		$eventTable = $("<table></table>");
		$eventContent.append($eventTable);

		$eventTable.bootstrapTable({
		method:"get",
  		url:app.webPath+'/rest/events/list',
  		paginationPreText:"上一页",
      	paginationNextText:"下一页",
  		dataField:"data",
  		pagination:true,
  		pageNumber:1,
  		pageSize:10,
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
                //params.page = parseInt(params.offset / params.limit);
          if (queryParams) {
              
          }
          params.startTimeInUsecs = queryParams.startTimeInUsecs*1000;
          params.endTimeInUsecs = queryParams.endTimeInUsecs*1000;
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
	        title: "名称",
	        field: 'message',
	        formatter:function(value,row,index){
	        	if("post_container" == value ){
	        		return "创建卷容器";
	        	}else if("post_storage_pool" == value){
	        		return "创建存储池";
	        	}else if("delete_container" == value){
	        		return "删除卷容器";
	        	}else if("patch_storage_pools" == value){
	        		return "更新存储池";
	        	}
	        }
		    },
		    {
	        title: "目标",
	        field: 'entityType',
	        formatter:function(value,row,index){
	        	return value == "storage_pools" ? "存储池" : "卷容器";
	        }
		    }, {
		    	title: "详细信息",
		      	field:"detailedMessage"
		    }, {
		    	title: "启动者",
		        //field:"admin",
	        formatter:function(){
		        return "管理员";
			    }
		    }, {
		    	title: "完成时间",
		    	field:"createdTimestampInUsecs",
		      formatter:function(){
			        return arguments[1].createdTimestampInUsecs? utils.transDate(arguments[1].createdTimestampInUsecs):"-";
			    }      
		    }
      ]
		})
	}

	return {
		initEvent:initEvent,
		updateDateNow:updateDateNow
	};
});