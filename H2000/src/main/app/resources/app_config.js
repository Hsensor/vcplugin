(function(win){
	var ns = com_lenovo_h2000;
	win.app = {
		ns:ns,
		WEB_PLATFORM:WEB_PLATFORM,
		webPath:ns.webContextPath
	}
})(window);

require.config({
  baseUrl: './../',
	paths:{
		jquery: "assets/js/jquery",
    highcharts: "assets/js/highcharts",
    "$validate": "assets/js/jquery.validate",
    "$mousewheel": "assets/js/jquery.mousewheel",
    "$mCustomScrollbar": "assets/js/jquery.mCustomScrollbar",
    "bootstrap.table": "resources/js/bootstrap-table",
    "moment": "assets/js/moment-with-locales",
    "datetimepicker": "assets/js/bootstrap-datetimepicker"
	},
	shim:{
		"$mCustomScrollbar":{
      deps:["jquery"],
      exports: "jquery"
    },
    "$mousewheel":{
      deps:["jquery"],
      exports: "jquery"
    },
		"bootstrap.table":{
			deps:["jquery"],
			exports:"jquery"
		}
	}
})

require(['resources/js/app'], function(){
})

