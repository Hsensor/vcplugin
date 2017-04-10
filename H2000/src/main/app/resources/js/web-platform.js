// ------------------------------------------------------------------------------
// Javascript initialization to include when using the HTML bridge:
// - Creates the plugin's private namespace com_lenovo_h2000
// - Defines APIs to ensure compatibility with future Web Client HTML platform
// ------------------------------------------------------------------------------

// WEB_PLATFORM is the VMware Web Client platform reference.
// When the Flex client is running it is defined as the Flash container.
var WEB_PLATFORM;

// Define a private namespace using the plugin bundle name,
// It should be the only global symbol added by this plugin!
var com_lenovo_h2000;
if (!com_lenovo_h2000) {
   com_lenovo_h2000 = {};

   // The web context path to use for server requests
   // (same as the Web-ContextPath value in the plugin's MANIFEST.MF)
   com_lenovo_h2000.webContextPath = "/vsphere-client/h2000";

   // The API setup is done inside an anonymous function to keep things clean.
   // See the HTML bridge documentation for more info on those APIs.
   (function () {
      // Namespace shortcut
      var ns = com_lenovo_h2000;

      // ------------------------ Private functions -------------------------------
   
      // Get a string from the resource bundle defined in plugin.xml
      function getString(key, params) {
         return WEB_PLATFORM.getString("com_lenovo_h2000", key, params);
      }

      // Get a parameter value from the current document URL
      function getURLParameter(name) {
         // Use location.href because location.search may be null with some frameworks
         return (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
               .exec(location.href) || [,""])[1].replace(/\+/g, '%20') || null;
      }

      // Build the REST url prefix to retrieve a list of properties,
      // this is mapped to the DataAccessController on the java side.
      function buildDataUrl(objectId, propList) {
         var propStr = propList.toString();
         var dataUrl = ns.webContextPath +
               "/rest/data/properties/" + objectId + "?properties=" + propStr;
         return dataUrl;
      }

      // -------------------------- Public APIs --------------------------------

      // Functions exported to the com_lenovo_h2000 namespace
      ns.getString = getString;
      ns.buildDataUrl = buildDataUrl;

      // APIs added to WEB_PLAFORM for compatibility with future HTML platform
      if (!WEB_PLATFORM) {
         WEB_PLATFORM = self.top.document.getElementById("container_app");

         // Get the current context object id or return null if none is defined
         WEB_PLATFORM.getObjectId = function() {
            return getURLParameter("objectId");
         };
         // Get the current action Uid or return null if none is defined
         WEB_PLATFORM.getActionUid = function() {
            return getURLParameter("actionUid");
         };
         // Get the comma-separated list of object ids for an action, or null for a global action
         WEB_PLATFORM.getActionTargets = function() {
            return getURLParameter("targets");
         };
         // Get the current locale
         WEB_PLATFORM.getLocale = function() {
            return getURLParameter("locale");
         };

         // Get the info provided in a global view using a vCenter selector
         WEB_PLATFORM.getVcSelectorInfo = function() {
            var info = {serviceGuid: getURLParameter("serviceGuid"),
                        sessionId: getURLParameter("sessionId"),
                        serviceUrl: getURLParameter("serviceUrl")};
            return info;
         };
      }
   })();
} // end of if (!com_lenovo_h2000)
