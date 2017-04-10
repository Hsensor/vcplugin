package com.lenovo.h2000.mvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.vmware.vise.data.query.DataService;
import com.vmware.vise.data.query.ObjectReferenceService;
import com.vmware.vise.data.query.PropertyValue;

/**
 * A generic controller to serve HTTP JSON GET requests to the endpoint "/data".
 *
 */
@Controller
@RequestMapping(value = "/data", method = RequestMethod.GET)
public class DataAccessController {
   private final static Log _logger = LogFactory.getLog(DataAccessController.class);
   private final static String OBJECT_ID = "id";

   private final DataService _dataService;
   private final ObjectReferenceService _objectReferenceService;

   @Autowired
   public DataAccessController(
         DataService dataService,
         @Qualifier("objectReferenceService") ObjectReferenceService objectReferenceService) {
      _dataService = dataService;
      _objectReferenceService = objectReferenceService;
      QueryUtil.setObjectReferenceService(objectReferenceService);
   }

   // Empty controller to avoid warnings in H2000's bundle-context.xml
   // where the bean is declared
   public DataAccessController() {
      _dataService = null;
      _objectReferenceService = null;
   }

   /**
    * Generic method to fetch properties for a given object.
    * e.g. /properties/{objectId}?properties=name,config
    *
    * @param encodedObjectId
    *    Encoded object id.
    *
    * @param properties
    *    Properties passed as a request parameter that needs to be fetched.
    *    They are comma separated.
    *    For e.g. name,runtime
    *
    * @return
    *    Returns a map with property name as key and property value as the value.
    */
   @RequestMapping(value = "/properties/{objectId}")
   @ResponseBody
   public Map<String, Object> getProperties(
            @PathVariable("objectId") String encodedObjectId,
            @RequestParam(value = "properties", required = true) String properties)
            throws Exception {

      String objectId = ObjectIdUtil.decodePathVariable(encodedObjectId);
      Object ref = _objectReferenceService.getReference(objectId);
      if (ref == null) {
         _logger.error("Object not found with id: " + objectId);
         return null;
      }

      String[] props = properties.split(",");
      PropertyValue[] pvs = QueryUtil.getProperties(_dataService, ref, props);
      Map<String, Object> propsMap = new HashMap<String, Object>();
      propsMap.put(OBJECT_ID, objectId);
      for (PropertyValue pv : pvs) {
         propsMap.put(pv.propertyName, pv.value);
      }
      return propsMap;
   }

   /**
    * Generic method to fetch properties using relation for the given object.
    *
    * @param encodedObjectId
    *    Encoded object id.
    *
    * @param relation
    *    Relationship, like vm for a host, the relation would be "vm".
    *
    * @param targetType
    *    Type of objects targeted by this data request.
    *
    * @param properties
    *    Properties passed as a request parameter that needs to be fetched.
    *    They are comma separated.
    *    For e.g. name,runtime
    *
    * @return
    *    Returns an array of <code>PropertyValue</code>
    * @throws Exception
    */
   @RequestMapping(value = "/propertiesByRelation/{objectId}")
   @ResponseBody
   public PropertyValue[] getPropertiesForRelatedObject(
            @PathVariable("objectId") String encodedObjectId,
            @RequestParam(value = "relation", required = true) String relation,
            @RequestParam(value = "targetType", required = true) String targetType,
            @RequestParam(value = "properties", required = true) String properties)
            throws Exception {
      String objectId = ObjectIdUtil.decodePathVariable(encodedObjectId);
      Object ref = _objectReferenceService.getReference(objectId);
      String[] props = properties.split(",");
      PropertyValue []result = QueryUtil.getPropertiesForRelatedObjects(
            _dataService, ref, relation, targetType, props);
      return result;
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

