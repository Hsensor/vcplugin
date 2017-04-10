define(["jquery","highcharts","$validate","datetimepicker"],function($){

	Highcharts.setOptions({global: {useUTC: false}});
	
	/**
	* extend Date format
	* use like this
	* new Date().format("MM-dd HH:mm:ss:S");
	*/
	Date.prototype.format = function (fmt) {
	   	var o = {
	        "M+": this.getMonth() + 1, //月           
          	"d+": this.getDate(), //日           
          	"h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //时           
          	"H+": this.getHours(), //小时           
          	"m+": this.getMinutes(), //分           
          	"s+": this.getSeconds(), //秒           
          	"q+": Math.floor((this.getMonth() + 3) / 3), //季          
          	"S": this.getMilliseconds() //毫秒           
      	};
      	var week = {
          "0": "\u65e5",
          "1": "\u4e00",
          "2": "\u4e8c",
          "3": "\u4e09",
          "4": "\u56db",
          "5": "\u4e94",
          "6": "\u516d"
      	};
      	if (/(y+)/.test(fmt)) {
          	fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      	}
      	if (/(E+)/.test(fmt)) {
          	fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + week[this.getDay() + ""]);
      	}
      	for (var k in o) {
          	if (new RegExp("(" + k + ")").test(fmt)) {
              	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          	}
      	}
      	return fmt;
    }

    /**
	* continueDealWithHtmlFn  required 继续加工html片段
	* conf (options)	对modal弹框可配置
	* conf.hideFooter=true 隐藏Footer
	* conf.hideHeader=true 隐藏Header
	* conf.modalDialog.cssObj 使用css对象的形式为modal-dialog元素添加css
	* conf.modalDialog.className 使用css class的形式为modal-dailog元素添加css
    */
	function addModal(continueDealWidthHtmlFn,conf){
		var modalWrap = '<div class="modal-wrap">'+
		  '<div id="myModal" class="modal fade in" style="display: block;">'+
		    '<div class="modal-dialog">'+
		      '<div style="background-color:#fff;border:1px solid #666;">'+
		        '<div class="modal-header">'+
		          '<button type="button" class="close">'+
		            '<img src="'+app.webPath+'/assets/images/close.png">'+
		          '</button>'+
		          '<h4 class="modal-title"></h4>'+
		        '</div>'+
		        '<div class="modal-body"></div>'+
		        '<div class="modal-footer">'+
		          '<label class="btn no-raduis btn-sm save" for="submit-form">确定</label>'+
		          '<button type="button" class="btn no-raduis btn-sm cancel">取消</button>'+
		        '</div>'+
		      '</div>'+
		    '</div>'+
		  '</div>'+
		  '<div class="modal-backdrop fade in"></div>'+
		'</div>';

		var $indexCss = $('<link rel="stylesheet" href="'+app.webPath+'/assets/css/index.css"/>');
		$(window.parent.document.head).append($indexCss);
		var $modalWrap = $(modalWrap);
		$(window.parent.document.body).append($modalWrap);

		if(typeof continueDealWidthHtmlFn === "function"){
			continueDealWidthHtmlFn($modalWrap);
		}

		$modalWrap.find(".modal-header>.close").on("click",removeDom);
		$modalWrap.find(".modal-footer>.cancel").on("click",removeDom);
		if( conf && conf.hideFooter ){
			$modalWrap.find(".modal-footer>.cancel").off("click");
			$modalWrap.find(".modal-footer").remove();	
		}

		if( conf && conf.hideHeader ){
			$modalWrap.find(".modal-header>.close").off("click");
			$modalWrap.find(".modal-header").remove();
		}

		if(conf && conf.modalDialog){
			if(conf.modalDialog.className&&("string" == $.type(conf.modalDialog.className))){
				$modalWrap.find(".modal-dialog").addClass(conf.modalDialog);
			}

			if(conf.modalDialog.cssObj&&($.type(conf.modalDialog.cssObj)=="object")){
				$modalWrap.find(".modal-dialog").css(conf.modalDialog.cssObj)
			}
		}

		$modalWrap.removeDom = removeDom;
		
		function removeDom(){
      $modalWrap.trigger("close");
		  $modalWrap.remove();
		  $indexCss.remove();
		}
	}

  /**
  * byteSize number required
  * opt  {}    options
  * startUnit BYTE
  * use like this 
  * conversion(1024*1024*1024) =>1GB
  * conversion(1024*1024*1024,{endUnit:"GB"}) =>1024*1024GB
  * conversion(1024*1024*1024,{startUnit:"KB"}) =>1TB
  * conversion(1024*1024*1024,{startUnit:"KB",endUnit:"GB"}) =>1024*1024GB
  * conversion(1024*1024*1024,{needNotUnit:false,endUnit:"GB"}) =>1GB
  * conversion(1024*1024*1024,{needNotUnit:false,startUnit:"KB",endUnit:"GB"}) =>1024GB
  * conversion(1024*1024,{needNotUnit:true,startUnit:"GB",endUnit:"MB"}) => 1073741824
  */
  function conversion(byteSize,opt){
      opt = opt||{};
      if(!byteSize){
          return 0;
      }
      var unit = ["BYTE","KB","MB","GB","TB"];
      var start = 0,end = unit.length-1;

      
      if(opt.startUnit){
          start = unit.indexOf(opt.startUnit.toUpperCase());
      }
      if(opt.endUnit){
          end = unit.indexOf(opt.endUnit.toUpperCase());
      }

      var resultSize = unit_conversion(byteSize, opt, start, end);

      if(!opt.needNotUnit){
          if(typeof opt.decimalCount !=="undefined"){
              return resultSize.size.toFixed(opt.decimalCount) + unit[resultSize.unit];
          }else{
              return resultSize.size + unit[resultSize.unit];
          }
      }else{
          if(typeof opt.decimalCount!=="undefined"){
              return resultSize.size.toFixed(opt.decimalCount);
          }else{
              return resultSize.size;
          }
      }
  }

  function unit_conversion(byteSize, opt, start, end){
      //10 byte--->mb
      if (opt.endUnit && start < end) {
          start++;
          byteSize = byteSize / 1024;
          return unit_conversion(byteSize, opt, start, end)
      }

      if (opt.startUnit && opt.endUnit && start > end) {
          start--;
          byteSize = byteSize * 1024;
          return unit_conversion(byteSize, opt, start, end);
      }

      if (byteSize >= 1024 && start < end) {
          start++;
          byteSize = byteSize / 1024;
          return unit_conversion(byteSize, opt, start, end) //arguments.callee(byteSize);
      }

      return {size:Number(byteSize),unit:start};
  }

	/**
	* 为每一个card-wrap 绑定一个click事件,用来展开、关闭card-wrap的详细信息
	**/
	function cardWrapBindHandler($cardParent,detailPanelCallback,addCallback){
		
		var $cardWraps = $cardParent.find(".card-wrap");
		var $detailPanel = $cardParent.find(".detail-panel");

		$cardWraps.unbind();
		function cardWrapsClickCallback(){
			
			var $this = $(this);
			var index = $cardWraps.index($this);
			var lineNum = Math.floor(index/4)+1;
			if($this.hasClass("add")){
				addCallback();
			}else{
				if($this.hasClass("active")){
					$this.removeClass("active");
					$detailPanel.slideUp(function(){
						detailPanelCallback({status:"close",index:index,uuid:$this.attr("uuid")});
					});
					
					//hide
				}else{
					$this.addClass("active").siblings().removeClass("active");

					var pos = lineNum*4-1>=$cardWraps.length?$cardWraps.length-1:lineNum*4-1;
					$cardWraps.eq(pos).after($detailPanel);
					$detailPanel.hide().slideDown(function(){
						detailPanelCallback({status:"expand",index:index,uuid:$this.attr("uuid")});
					});
				}
			}
		}

		$cardWraps.on("click",debounce(cardWrapsClickCallback,300,{trailing:false}));
	}

	//获取当前选中的Card的索引
	function getCardSelectedIndex($cardWrapParent){
		var $cardWraps = $cardWrapParent.find(".card-wrap");
		for(var i=0;i<$cardWraps.length;i++){
			if($cardWraps.eq(i).hasClass("active")){
				return i;
			}
		}
		return i;
	}

	//注册详细信息的Tab事件绑定，给出回调函数
	function detailPanelTab($detailPanel,detailPanelNavCB){
		var $navListLis = $detailPanel.find(".nav-list>li");
		var $tabContent = $detailPanel.find(".detail-nav-content>.tab-content");

		$navListLis.on("click",function(event,selfTrigger){
			
			var $this = $(this);
			if($this.hasClass("active")&&!selfTrigger) return;

			var index = $navListLis.index($this);
			$this.addClass("active").siblings().removeClass("active");
			$tabContent.eq(index).addClass("active").siblings().removeClass("active");
			if(typeof detailPanelNavCB == "function"){
				detailPanelNavCB(index);
			}
		});
	}

	//注册关闭详细信息的事件，给出回调函数
	function detailPanelClose($detailPanel,closePanelCB){
		var $closeBtn = $detailPanel.find(".close_btn");
		$closeBtn.on("click",function(){
			$detailPanel.slideUp(function(){
				closePanelCB()
			});
		})
	}

	function addCreateBtnCardWrap($cardWrapParent,$createCardWrap){
		$cardWrapParent.find(".detail-panel").before($createCardWrap);
	}

	$.validator.addMethod("regValidation",function(value, element, params){
	    if(params.test(value)){
	      return true;
	    }else{
	      return false;
	    }
	});


	function initHostTable(data,$modalWrap){
		var $hostTable = $modalWrap.find("#host-table"), 
			$allCheck = $hostTable.find("thead>tr input"),
			$tbody = $hostTable.find("tbody");
		
		loadData(data);
		
		$allCheck.on('click',function(){
			var checked = this.checked;						
			$.each($tbody.find("tr>td>input"),function(index,item){
				item.checked = checked;
			})		
		})	
		$tbody.find("input[type='checkbox']").on('click',function(){
		 	var flag = true;
		 	$tbody.find("input[type='checkbox']").each(function(index,item){
		 		if(!item.checked){
		 			flag = false;
		 		}

		 	})
		 	$allCheck[0].checked = flag;
		 });
				
		function loadData(data){			
			$.each(data,function(index,item){
					
				var trHtml ='<tr>'+
								'<td>'+
								 	'<input type="checkbox"  name="hosts"/>'+
								'</td>'+
								'<td>'+
									item.name+
								'</td>'+
								'<td>'+
									item.serviceVMExternalIP+
								'</td>'+
								'<td>'+
									conversion(item.capacity,{decimalCount:2})
								'</td>'+
							'</tr>';
				$modalWrap.find("#host-table >tbody").append(trHtml);
			})
		}

		function getSelectedRows(){
			var attr = [];
			$tbody.find("input[type='checkbox']").each(function(index,item){
				if(item.checked){
					
					console.log(data[index])
					attr.push(data[index]);					
				}
			})
			return attr;
		}

		return {
			getSelectedRows:getSelectedRows
		}
	}
		
	/**
	* highchart 详细配置
	*/
	var chartBaseOptions = {
	  	"chart": {
	    	"type": "area",
	    	height:160,
	    	events:{
	    	},
	    	//"backgroundColor":"#effaff"
	  	},
	  	/*legend: {
	    	enabled: true,
	    	align:"right",
	    	verticalAlign:"top",
	    	backgroundColor:"#ffffff",
	    	borderColor:"#ffffff"
	  	},*/
	  	"plotOptions": {
	    	area: {
                marker: {
                    enabled: false, 
	        		radius:1, 
	        		states: {  
	          			hover: {  
	            			enabled: true                       
	          			}  
	        		},
	        		symbol: 'circle' 
                },
                lineWidth:1,
                fillOpacity:0.1,
                states: {
                    hover: {
                        lineWidth: 2
                    }
                },
                threshold: null
            }
	  	},
	  	"title": {
	    	"text": null
	  	},
	  	"credits": {
	    	"enabled": false
	  	},
	  	legend: {
            align: 'right',
            verticalAlign: 'top',
            y:0,
            x:0,
            enabled:false
        },
	  	"loading": false,
	  	yAxis: {
	    	lineColor: 'rgb(192, 208, 224)',
	    	lineWidth: 1,
	    	labels:{
	      		enabled:true,
	      		align:"left",
	      		x:0,
	      		y:0
	    	},
	    	type:"linear",
	    	endOnTick: false,
	    	maxPadding: 0.25,
	    	title:{
	      		text:null
	    	},
	    	min:0
	  	},
	  	xAxis:{
	    	type: 'datetime',
	    	dateTimeLabelFormats:{
	      		minute:"%H:%M",
	      		day:"%m-%d"
	    	},
	    	tickLength:5
	  	},
	  	series:[]
	};

	function renderChart(chartBaseOptions){
		return function(callback){
			callback.apply(null,[$.extend(true,{},chartBaseOptions)].concat([].slice.call(arguments,1)));
		}
	}

	function noData(startTime,endTime,intervalInsecs){
		var datapoints =  [];
		var diffTime = (+new Date(endTime))-(+new Date(startTime));

		for(var i=Math.floor(diffTime/(intervalInsecs*1000));i>=0;i--){
			datapoints.push([(+new Date(startTime))+i*intervalInsecs*1000,0]);
		}

		return datapoints.reverse();

	}

	function transDate(str){
		str=str/1000;
		var myDate = new Date(str);
		var year = myDate.getFullYear();
		var month = myDate.getMonth()+1<10?'0'+(myDate.getMonth()+1):myDate.getMonth()+1;
		var date = myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate();
		var hours = myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours();
		var minutes = myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes();
		var seconds = myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds();
		str = year +'-'+month +'-'+date + ' ' + hours + '：' + minutes + '：' + seconds;
		return str;
	}

	// it only does '%s', and return '' when arguments are undefined
  function sprintf (str) {
      var args = arguments,
          flag = true,
          i = 1;

      str = str.replace(/%s/g, function () {
          var arg = args[i++];

          if (typeof arg === 'undefined') {
              flag = false;
              return '';
          }
          return arg;
      });
      return flag ? str : '';
  };

  function checkChartLineEnoughLength(chartDiffTime){
  	//[3*60*60*1000,24*60*60*1000,7*24*60*60*1000,30*24*60*60*1000,365*24*60*60*1000]
  	//检查数据点显示的是否足够3小时,足够的话返回true,添加动态点图表动态前进
  	//不足够的话返回false,添加动态点图表不前进
  	var cycles =[10800000, 86400000, 604800000, 2592000000, 31536000000];
  	for(var i=0;i<cycles.length;i++){
  		if(chartDiffTime<cycles[i]){
  			return false;
  		}
  	}
  	return true;
  }

  function changePointToArr(datapoints){
  	var newDatapoints = [];
  	for(var i=0;i<datapoints.length;i++){
  		var curPoint = datapoints[i];
  		newDatapoints.push([curPoint.timestamp,curPoint.value]);
  	}
  	return newDatapoints;
  }
  /**
	 * 空闲控制函数， fn仅执行一次
	 * @param fn{Function}     传入的函数
	 * @param delay{Number}    时间间隔
	 * @param options{Object}  如果想忽略开始边界上的调用则传入 {leading:false},
	 *                         如果想忽略结束边界上的调用则传入 {trailing:false},
	 * @returns {Function}     返回调用函数
	*/
	function debounce(fn,delay,options){
		var timeoutId,leadingExc = false;
		options = options||{};

		return function(){
			var that = this,args = arguments;
			if(!leadingExc&&!(options.leading === false)){
				fn.apply(that,args);
			}
			leadingExc = true;
			if(timeoutId){
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(function(){
				if(!(options.trailing===false)){
					fn.apply(that,args);
				}
				leadingExc = false;
			},delay)
		}
	}
  function alarmTipDom(entityTypeMap){
  	return function (row){
      var tipDom = "<div>";

      if (entityTypeMap["disks"] == row.entityType) {
        tipDom+="<div>硬盘裸容量";
        if(row.alertTitle&&row.alertTitle.indexOf("usage")>-1){
          if(row.contexts){
            tipDom+="使用率当前值："+row.contexts[2].split(":")[1]+"</div><div>超过当前所设置阈值："+row.contexts[0].split(":")[1]+"</div>"; 
          }
        }else{
          tipDom+="状态异常</div>";
        }
      }else if (entityTypeMap["hosts"] == row.entityType) {
        tipDom+="<div>主机状态异常</div>";
      }else if ("storagepools" == row.entityType) {
        tipDom+="<div>存储池裸容量";
        if(row.alertTitle&&row.alertTitle.indexOf("usage")>-1){
          tipDom+="使用率当前值："+row.contexts[2].split(":")[1]+"</div><div>超过当前所设置阈值："+row.contexts[0].split(":")[1]+"</div>";
        }else{
          tipDom+="</div>";
        }
      }else if(entityTypeMap["containers"] == row.entityType){
        tipDom+="<div>卷容器裸容量";
        if(row.alertTitle&&row.alertTitle.indexOf("usage")>-1){
          tipDom+="使用率当前值："+row.contexts[2].split(":")[1]+"</div><div>超过当前所设置阈值："+row.contexts[0].split(":")[1]+"</div>";
        }else{
          tipDom+="</div>";
        }
      }else if(entityTypeMap["clusters"] == row.entityType){
        tipDom+="<div>存储集群裸容量";
        if(row.alertTitle&&row.alertTitle.indexOf("usage")>-1){
          tipDom+="使用率当前值："+row.contexts[2].split(":")[1]+"</div><div>超过当前所设置阈值："+row.contexts[0].split(":")[1]+"</div>";
        }else{
          tipDom+="</div>";
        }
      }else if(entityTypeMap["storagepools"] == row.entityType){
        tipDom+="<div>存储池裸容量";
        if(row.alertTitle&&row.alertTitle.indexOf("usage")>-1){
          tipDom+="使用率当前值："+row.contexts[2].split(":")[1]+"</div><div>超过当前所设置阈值："+row.contexts[0].split(":")[1]+"</div>";
        }else{
          tipDom+="</div>";
        }
      }
      return tipDom+="</div>";
    }
  }

  var entityTypeMap = {
    disks:'disks',
    containers:'containers',
    storagepools:'storage_pools',
    clusters:'clusters',
    hosts:'hosts'
  }

  var metricNameMap = {
    diskState: 'disk_state',
    hostState: 'host_state',
    diskUsage: 'disk_usage',
    clusterStorageUsage: 'cluster_storage_usage',
    storagePoolStorageUsage: 'storage_pool_storage_usage',
    containerStorageUsage: 'container_storage_usage'
  }


	return {
		addModal:addModal,
		conversion:conversion,
		getCardSelectedIndex:getCardSelectedIndex,
		cardWrapBindHandler:cardWrapBindHandler,
		detailPanelTab:detailPanelTab,
		detailPanelClose:detailPanelClose,
		addCreateBtnCardWrap:addCreateBtnCardWrap,
		initHostTable:initHostTable,
		renderChart:renderChart(chartBaseOptions),
		noData:noData,
		sprintf:sprintf,
		transDate:transDate,
		changePointToArr:changePointToArr,
		checkChartLineEnoughLength:checkChartLineEnoughLength,
		debounce:debounce,
		alarmTipDom:alarmTipDom(entityTypeMap),
    entityTypeMap:entityTypeMap,
    metricNameMap:metricNameMap
	}


})