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

import com.lenovo.h2000.services.HostsService;

@Controller
@RequestMapping(value = "/hosts")
public class HostsController {
	private final static Log _logger = LogFactory
			.getLog(HostsController.class);
	
	private final HostsService _hostsService;
	
	@Autowired
	public HostsController(
			@Qualifier("hostsService") HostsService hostsService) {
		_hostsService = hostsService;
	}

	public HostsController() {
		_hostsService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.list(count, filterCriteria, sortCriteria,
				searchString, searchAttributeList, page, projection, header);
	}
	
	@RequestMapping(value = "/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String alerts(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			@RequestHeader HttpHeaders headers)
			throws Exception {
		_logger.info("getting HostsController.alerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.alerts(startTimeInUsecs, endTimeInUsecs, count,
				resolved, acknowledged, severity, alertTypeUuid, page,header);
	}
	
	@RequestMapping(value = "/{hostUuid}/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String uuidAlerts(@PathVariable String hostUuid,
			String startTimeInUsecs, String endTimeInUsecs, String count,
			String resolved, String acknowledged, String severity,
			String alertTypeUuid, String page,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.uuidAlerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.uuidAlerts(hostUuid, startTimeInUsecs,
				endTimeInUsecs, count, resolved, acknowledged, severity,
				alertTypeUuid, page, header);
	}

	@RequestMapping(value = "/events", method = RequestMethod.GET)
	@ResponseBody
	public String events(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.events headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.events(startTimeInUsecs, endTimeInUsecs, count,
				acknowledged, page, header);
	}
	
	@RequestMapping(value = "/{hostUuid}/events", method = RequestMethod.GET)
	@ResponseBody
	public String uuidEvents(@PathVariable String hostUuid, String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.uuidEvents headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.uuidEvents(hostUuid, startTimeInUsecs, endTimeInUsecs, count,
				acknowledged, page, header);
	}
	
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	@ResponseBody
	public String get(String serviceVMId, String projection,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.get headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.get(serviceVMId, projection, header);
	}
	
	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@ResponseBody
	public String create(String ip, String username, String password,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HostsController.create headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _hostsService.create(ip, username, password, header);
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}
}
