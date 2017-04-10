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

import com.lenovo.h2000.services.EventsService;

@Controller
@RequestMapping(value = "/events")
public class EventsController {
	private final static Log _logger = LogFactory
			.getLog(EventsController.class);
	
	private final EventsService _eventsService;
	
	@Autowired
	public EventsController(
			@Qualifier("eventsService") EventsService eventsService) {
		_eventsService = eventsService;
	}

	public EventsController() {
		_eventsService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page, @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting EventsController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _eventsService.list(startTimeInUsecs, endTimeInUsecs, count,
				acknowledged, page, header);
	}
	
	@RequestMapping(value = "/acknowledge", method = RequestMethod.POST)
	@ResponseBody
	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count, @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting EventsController.acknowledge headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _eventsService.acknowledge(startTimeInUsecs, endTimeInUsecs,
				severity, entityType, entityTypeIds, count, header);
	}
	
	@RequestMapping(value = "/{eventId}/acknowledge", method = RequestMethod.POST)
	@ResponseBody
	public String alertAcknowledge(@PathVariable String eventId,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting EventsController.alertAcknowledge headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _eventsService.eventAcknowledge(eventId, header);
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}
}
