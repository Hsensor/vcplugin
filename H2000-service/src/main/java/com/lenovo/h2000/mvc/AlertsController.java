package com.lenovo.h2000.mvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.AlertsService;

@Controller
@RequestMapping(value = "/alerts")
public class AlertsController {

	private final static Log _logger = LogFactory
			.getLog(AlertsController.class);

	private final AlertsService _alertsService;

	@Autowired
	public AlertsController(
			@Qualifier("alertsService") AlertsService alertsService) {
		_alertsService = alertsService;
	}

	public AlertsController() {
		_alertsService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			String entityType, String entityIds, String alertIds,
			@RequestHeader HttpHeaders headers)
			throws Exception {
		_logger.info("getting AlertsController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _alertsService.list(startTimeInUsecs, endTimeInUsecs, count,
				resolved, acknowledged, severity, alertTypeUuid, page,
				entityType, entityIds, alertIds, header);
	}
	
	@RequestMapping(value = "/acknowledge", method = RequestMethod.POST)
	@ResponseBody
	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting AlertsController.acknowledge headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _alertsService.acknowledge(startTimeInUsecs, endTimeInUsecs,
				severity, entityType, entityTypeIds, count, header);
	}
	
	@RequestMapping(value = "/{alertId}/acknowledge", method = RequestMethod.POST)
	@ResponseBody
	public String alertAcknowledge(@PathVariable String alertId, String body,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting AlertsController.alertAcknowledge headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _alertsService.alertAcknowledge(alertId, body, header);
	}
	
	@RequestMapping(value = "/resolve", method = RequestMethod.POST)
	@ResponseBody
	public String resolve(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting AlertsController.resolve headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _alertsService.resolve(startTimeInUsecs, endTimeInUsecs,
				severity, entityType, entityTypeIds, count, header);
	}
	
	@RequestMapping(value = "/{alertId}/resolve", method = RequestMethod.POST)
	@ResponseBody
	public String alertResolve(@PathVariable String alertId, String body,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting AlertsController.alertResolve headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _alertsService.alertResolve(alertId, body, header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}
