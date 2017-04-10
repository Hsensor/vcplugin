package com.lenovo.h2000.mvc;

import java.util.Collections;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.SampleActionService;

import com.vmware.vise.data.query.ObjectReferenceService;


/**
 * A controller to serve HTTP JSON GET/POST requests to the endpoint "/actions.html".
 */
@Controller
@RequestMapping(value = "/actions.html")
public class ActionsController {
   private final static Log _logger = LogFactory.getLog(ActionsController.class);

   // UI plugin resource bundle for localized messages
   private final String RESOURCE_BUNDLE = "__bundleName__";

   private final SampleActionService _actionService;
   private final ObjectReferenceService _objectReferenceService;

   @Autowired
   public ActionsController(
         SampleActionService actionService,
         @Qualifier("objectReferenceService") ObjectReferenceService objectReferenceService) {
      _actionService = actionService;
      _objectReferenceService = objectReferenceService;
      QueryUtil.setObjectReferenceService(objectReferenceService);
   }

   // Empty controller to avoid warnings in H2000's bundle-context.xml
   // where the bean is declared
   public ActionsController() {
      _actionService = null;
      _objectReferenceService = null;
   }


   /**
    * Generic method to invoke an action on a given object or a global action.
    *
    * @param actionUid  the action Uid as defined in plugin.xml
    *
    * @param targets  null for a global action, comma-separated list of object ids
    *    for an action on 1 or more objects
    *
    * @param json additional data in JSON format, or null for the delete action.
    *
    * @return
    *    Returns a map with key values.
    */
   @RequestMapping(method = RequestMethod.POST)
   @ResponseBody
   public Map<String, Object> invoke(
            @RequestParam(value = "actionUid", required = true) String actionUid,
            @RequestParam(value = "targets", required = false) String targets,
            @RequestParam(value = "json", required = false) String json)
            throws Exception {
      // Parameters validation
      Object objectRef = null;
      if (targets != null) {
         String[] objectIds = targets.split(",");
         if (objectIds.length > 1) {
            // Our actions only support 1 target object for now
            _logger.warn("Action " + actionUid + " called with " + objectIds.length
                  + " target objects, will use only the first one");
         }
         String objectId = ObjectIdUtil.decodeParameter(objectIds[0]);
         objectRef = _objectReferenceService.getReference(objectId);
         if (objectRef == null) {
            String errorMsg = "Error in action " + actionUid +
                  ", object not found with id: " + objectId;
            _logger.error(errorMsg);
            throw new Exception(errorMsg);
         }
      }

      ActionResult actionResult = new ActionResult(actionUid, RESOURCE_BUNDLE);

      if (actionUid.equals("com.lenovo.h2000.sampleAction1")) {
          _actionService.sampleAction1(objectRef);
          // Display a test error message
          actionResult.setErrorLocalizedMessage("Testing error message for action1");

      } else if (actionUid.equals("com.lenovo.h2000.sampleAction2")) {
          boolean result = _actionService.sampleAction2(objectRef);
          actionResult.setResult(result, null);

      } else {
         String warning = "Action not implemented yet! "+ actionUid;
         _logger.warn(warning);
         actionResult.setErrorLocalizedMessage(warning);
      }
      return actionResult.getJsonMap();
   }

   /**
    * Handles any internal exception that occurs whilst using the data
    * service/DFC, by sending a 500 response with the exception in a JSON body.
    *
    * @param ex
    *           The exception that was thrown.
    * @return Model containing the exception to be serialized by the JSON mapper.
    */
   @ExceptionHandler(Exception.class)
   @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
   public Map<String, String> handleDataAccessException(Exception ex) {
      return Collections.singletonMap("message", ex.getMessage());
   }
}

