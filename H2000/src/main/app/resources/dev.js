function appendRequireScript(ns){
  var oScript = document.createElement('script');
  oScript.src= ns.webContextPath+"/assets/js/require.js";
  oScript.setAttribute("data-main",ns.webContextPath+"/resources/app_config.js");
  oScript.setAttribute("type","text/javascript");

  document.head.appendChild(oScript);
}

appendRequireScript(com_lenovo_h2000);