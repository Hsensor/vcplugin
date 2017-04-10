define(
	[
		"jquery","resources/js/utils",
		"resources/js/host","resources/js/volume_container",
		"resources/js/cluster","resources/js/storage_pool",
		"resources/js/alarm","resources/js/events",
		"resources/js/uploader","$mCustomScrollbar",
		"$mousewheel"
	],function ( $, utils, host, volumeContainer, cluster, storagePool, alarm, events,ss){
	var dataUrl = app.ns.buildDataUrl(app.WEB_PLATFORM.getObjectId(),["name"]);
  
  var licenseInfoConfig = {
    NOT_TRAIL_NOT_LICESE: {
      CODE: '402.1'
    },
    ON_TRAIL_NODE_OVERFLOW: {
      CODE:'402.2'
    },
    NODE_OVERFLOW:{
      CODE: '402.3'
    },
    ADMIN_NODE_UNAUTH:{
      CODE: '402.4'
    },
    DEADLINE_OVERFLOW_TEST_LICENSE: {
      CODE: '402.8'
    }
  };

  var licenseTip = {
    "uploadStart":"开始上传License文件",
    "uploadSuccess": "上传成功",
    "uploadFailed": "上传失败，服务暂不可用",
    "validateStart": "检验License合法性",
    "validateSuccess": "License合法",
    "validateFailed": "非法License"
  }

	var $navigatorLis = $(".navigator-bar>.navigator-bar-ul>li");
	$.getJSON(dataUrl,function(data){
		$.ajaxSetup({"headers":{"X-Lenovo-ClusterName":data.name},cache:false});

    licenseValidate().then(function (result) {
      
      if (!result || !result.success) {
        //如果没有合法或者没有license
        $(".tabBody").addClass("hide-tabBody");
        $(".license-invalide-mask").addClass("show-invalide-license");
        showLicenseInfo(result,licenseInfoConfig,uploadSuccessLicense)
      } else {
        //有合法的license 则展示界面
        //license马上到期提醒界面提示信息待完善
        $navigatorLis.on("click",navigatorMethod).eq(0).trigger("click",[false]);
      }

    }).fail(function(){
      //服务不可用
    });

		
		$("#settings_dropdown").dropdown();

		$(".navigator-bar .license-manager").on("click", utils.debounce(managerLicense, 300, {trailing:false}));
	});

  function validateUploadLicense () {
    setTimeout(function(){
      $licenseInvalideMask.find(".license-tip").html(licenseTip.validateStart);
      licenseValidate().then(function(result){
        if (result && result.success) {
          //license 合法
          setTimeout(function(){
            $navigatorLis.on("click",navigatorMethod).eq(0).trigger("click",[false]);
          },1000)
        } else {
          $licenseInvalideMask.find(".license-tip").html(licenseTip.validateFailed);
        }
      });
    },1000)
  }

  function managerLicense(){
    utils.addModal(function($modalWrap){
      
      licenseValidate().then(function (result) {
        //没有合法的license
        if (!result && !result.success) {
          uploadLicense($modalWrap, result ,licenseInfoConfig);
        } else {

          //有合法的license 则展示列表
          licenseShow().then(function(result){
            if (result && result.success) {
              licenseTableShow($modalWrap,result.resultObject)
            }else {

            }
          }).fail(function () {

          })
          
        }
      }).fail(function () {
        //服务不可用
      });
    },{hideFooter:true})
  }

  function licenseTableShow($modalWrap, licenseTableData){
    $modalWrap.find(".modal-title").html(app.ns.getString("license"));

    var $licenseTable= $('<div class="license-table-info clearfix"></div>');
    var tableColumnsArr = [
      "customer","allowedNodeModel",
      "maxCpuGHz","maxMemorySize",
      "maxNodeNum","maxSSDDiskNum",
      "maxSSDDiskSize","maxHDDDiskNum",
      "maxHDDDiskSize","allowedNodeModel",
      "allowedNodeModel","deadline",
      "importAt"
    ]
    
    for(var i=0;i<tableColumnsArr.length;i++){
      var currentColumn = tableColumnsArr[i];
      
      if (licenseTableData[currentColumn]) {
        $licenseTable.append(buildLicenseTableTr(tableColumnsArr[i],licenseTableData));
      }
    }

    $modalWrap.find(".modal-body").html($licenseTable);
  }

  function buildLicenseTableTr (tableColumn, licenseTableData) {
    if(tableColumn!=="deadline" && tableColumn !== "importAt"){
      return ('<div class ="col-xs-3">'+
        app.ns.getString("licenseTableConfig."+tableColumn)+
      '</div><div class ="col-xs-3">'+
        licenseTableData[tableColumn]+
      '</div>');
    } else {
      return ('<div class ="col-xs-3">'+
        app.ns.getString("licenseTableConfig."+tableColumn)+
      '</div><div class ="col-xs-3" style="font-family:Arail">'+
        new Date(licenseTableData[tableColumn]).format("YYYY-MM-DD HH:mm:ss")+
      '</div>');
    }
  }

  //考虑是否上传的那段js代码提出去的必要性

  function uploadLicense ($modalWrap, licenseInfo, licenseInfoConfig) {
    $modalWrap.find(".modal-title").html(app.ns.getString("license"));
    var htmlTpl = 
      '<div class="export_hd_wrap">'+
        '<span class="export_hd_btn">导出硬件信息</span><span>注：获取产品密钥之前，需要先导出硬件信息。</span>'+
      '</div>'+
      '<div class="upload_license_wrap">'+
        '<form id="uploadLicense">'+
          '<div class="file-wrap" >'+
            '<div class="input_wrap" id="selectLicenseBtn"><span >选择文件</span><span class="filename"></span></div><span class="upload_license_btn">上传文件</span>'+  
          '</div>'
        '</form>'+
      '</div>';

    $modalWrap.find(".modal-body").html(htmlTpl);
    
    var uploader = new ss.SimpleUpload(
      {
        button: $modalWrap.find("#selectLicenseBtn")[0],
        cors: true,
        appendTarget: window.parent.document.body,
        withCredentials: true,
        customHeaders: $.ajaxSetup().headers,
        url: app.webPath + "/rest/license/import",
        name: 'licenseFile',
        multipart: true,
        form: $modalWrap.find("#uploadLicense")[0],
        hoverClass: 'hover',
        focusClass: 'focus',
        startXHR: function() {
        
        },
        onSubmit: function() {
            
        },
        onComplete: function(filename, response ) {
          this._createInput();
          $modalWrap.find(".input_wrap .filename").html("");
        },
        onChange: function(filename, extension, uploadBtn, size, file) {
          if(filename){
            $modalWrap.find(".input_wrap .filename").html(filename);
          }else{
            $modalWrap.find(".input_wrap .filename").html("");
          }
        },
        onError: function() {
           
        }
      }
    );
    
    $modalWrap.on("close",function () {
      $(window.parent.document.body).find('input[name=licenseFile]').parent().remove();
      $modalWrap.off("close");
    });

    $modalWrap.find(".upload_license_btn").click(function () {
      $modalWrap.find("#uploadLicense").submit();
    });
  }

  function showLicenseInfo (licenseInfo, licenseInfoConfig, uploadSuccessLicense){
    if (licenseInfo) {
      if (licenseInfo.resultCode === licenseInfoConfig.NOT_TRAIL_NOT_LICESE) {

      } else if (licenseInfo.resultCode === licenseInfoConfig.ON_TRAIL_NODE_OVERFLOW) {

      } else if (licenseInfo.resultCode === licenseInfoConfig.NODE_OVERFLOW) {

      } else if (licenseInfo.resultCode === licenseInfoConfig.ADMIN_NODE_UNAUTH) {

      } else if (licenseInfo.resultCode === licenseInfoConfig.DEADLINE_OVERFLOW_TEST_LICENSE) {

      }
    } else {
      throw new Error("license invalide");
      return ;
    }
    var $licenseInvalideMask = $(".license-invalide-mask")
    var uploader = new ss.SimpleUpload(
      {
        button: $licenseInvalideMask.find("#selectLicenseBtn")[0],
        cors: true,
        appendTarget: document.body,
        withCredentials: true,
        customHeaders: $.ajaxSetup().headers,
        url: app.webPath + "/rest/license/import",
        name: 'licenseFile',
        multipart: true,
        form: $licenseInvalideMask.find("#uploadLicense")[0],
        hoverClass: 'hover',
        focusClass: 'focus',
        startXHR: function() {
          $licenseInvalideMask.find(".license-tip").html(licenseTip.uploadStart);
        },
        onSubmit: function() {
            
        },
        onComplete: function(filename, response ) {
          this._createInput();
          $licenseInvalideMask.find(".input_wrap .filename").html("");
          $licenseInvalideMask.find(".license-tip").html(licenseTip.uploadSuccess);
          validateUploadLicense();
        },
        onChange: function(filename, extension, uploadBtn, size, file) {
          if(filename){
            $licenseInvalideMask.find(".license-tip").html("");
            $licenseInvalideMask.find(".input_wrap .filename").html(filename);
          }else{
            $licenseInvalideMask.find(".input_wrap .filename").html("");
          }
        },
        onError: function() {
           
        }
      }
    );

    $licenseInvalideMask.find(".upload_license_btn").click(function(){
      $licenseInvalideMask.find("#uploadLicense").submit();
    })
  }

	app.WEB_PLATFORM.onGlobalRefreshRequest = function(){
		for (var i = 0; i < $navigatorLis.length;i++) {
			var curNavigatorLi = $navigatorLis.eq(i);
			if(curNavigatorLi.hasClass("active")){
				return curNavigatorLi.trigger("click",[true]);
			}
		}

		$navigatorLis.eq(0).trigger("click",[true]);
	}
		
	function navigatorMethod(event,refreshFlag){
		$this = $(this);

		if($this.hasClass("active") && !refreshFlag){
			return;
		}

		var index = $this.index();
		var i;

		//切换Tab时,清除监控的定时器
		volumeContainer.clearMoniterTimers();
		volumeContainer.clearVC_cT();
		cluster.clearMoniterTimers();
		storagePool.clearMoniterTimers();
		storagePool.clearVC_cT();

		$this.addClass("active").siblings().removeClass("active");
		$(".tabBody>.tab-content").removeClass("active").eq(index).addClass("active");

		if(index==0){
			cluster.initCluster();
		}else if(index == 1){
			host.renderHosts();
		}else if(index==2){
			storagePool.renderStoragePool();
		}else if(index==3){
			volumeContainer.renderVolumeContainers();
		}else if(index==4){
			alarm.updateDateNow();
		}else if(index==5){
			events.updateDateNow();
		}
	}

  function licenseValidate () {
    return $.ajax({
      url: app.webPath + "/rest/license/validate",
      type: "get",
      dataType: "json"
    })
  }

  function licenseShow () {
    return $.ajax({
      url: app.webPath + "/rest/license/show",
      type: "get",
      dataType: "json"
    })
  }

	$(".tabBody>.tab-content").mCustomScrollbar({
		theme:"inset-2-dark",
		keyboard:{
			enable:true,
			scrollType:"stepless",
			scrollAmount:"auto"
		}
	});
})