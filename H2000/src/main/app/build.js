({
  out: 'resources/main.js',
  baseUrl: './',
  name: 'resources/app_config',
  optimizeCss: 'standard',
  optimize: 'none',//'uglify',
  removeCombined: true,
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
    "$mCustomScrollbar": {
      deps: ["jquery",],
      exports: "jquery"
    },
    "$mousewheel": {
      deps: ["jquery"],
      exports: "jquery"
    },
    "bootstrap.table": {
      deps: ["jquery"],
      exports: "jquery"
    }
  }
})
