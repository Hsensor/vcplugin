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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.ContainersService;

@Controller
@RequestMapping(value = "/containers")
public class ContainersController {
	private final static Log _logger = LogFactory
			.getLog(ContainersController.class);

	private final ContainersService _containersService;

	@Autowired
	public ContainersController(
			@Qualifier("containersService") ContainersService containersService) {
		_containersService = containersService;
	}

	public ContainersController() {
		_containersService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,@RequestHeader HttpHeaders headers)
			throws Exception {
		_logger.info("getting ContainersController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.list(count, filterCriteria, sortCriteria,
				searchString, searchAttributeList, page, projection, header);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@ResponseBody
	public String create(String name,
			@RequestParam(required = true) String storagePoolUuid,
			String alias,
			String storagePoolName, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor, String maxCapacity, String protocolType,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.create headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));

		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.create(name, storagePoolUuid, alias, 
				storagePoolName, erasureCode, fingerPrintOnWrite, onDiskDedup,
				compressionEnabled, totalExplicitReservedCapacity,
				advertisedCapacity, compressionDelayInSecs, replicationFactor,
				maxCapacity, protocolType, header);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String update(String name,
			@RequestParam(required = true) String containerUuid, String alias,
			String storagePoolUuid, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor, String protocolType,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.update headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.update(name, containerUuid, alias, storagePoolUuid,
				erasureCode, fingerPrintOnWrite, onDiskDedup,
				compressionEnabled, totalExplicitReservedCapacity,
				advertisedCapacity, compressionDelayInSecs, replicationFactor,
				protocolType, header);
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public String delete(@RequestParam(required = true) String containerUuid,@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.delete headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.delete(containerUuid, header);
	}

	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@ResponseBody
	public String detail(@RequestParam(required = true) String containerUuid,@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.detail headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.detail(containerUuid, header);
	}

	@RequestMapping(value = "/stats", method = RequestMethod.GET)
	@ResponseBody
	public String stats(@RequestParam(required = true) String containerUuid,
			String metrics, String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.stats headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.stats(containerUuid, metrics,
				startTimeInUsecs, endTimeInUsecs, intervalInSecs, statistics,
				header);
	}
	
	@RequestMapping(value = "/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String alerts(String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String severity, String alertTypeUuid,
			String resolved, String acknowledged,@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.alerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.alerts(count, page,
				startTimeInUsecs, endTimeInUsecs, severity, alertTypeUuid,
				resolved, acknowledged, header);
	}
	
	@RequestMapping(value = "/{containerUuid}/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String uuidAlerts(@PathVariable String containerUuid, String count,
			String page, String startTimeInUsecs, String endTimeInUsecs,
			String severity, String alertTypeUuid, String resolved,
			String acknowledged,@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.uuidAlerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.uuidAlerts(containerUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, severity, alertTypeUuid,
				resolved, acknowledged, header);
	}
	
	@RequestMapping(value = "/events", method = RequestMethod.GET)
	@ResponseBody
	public String events(String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String acknowledged,@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ContainersController.events headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.events(count, page, startTimeInUsecs,
				endTimeInUsecs, acknowledged, header);
	}
	
	@RequestMapping(value = "/{containerUuid}/events", method = RequestMethod.GET)
	@ResponseBody
	public String uuidEvents(@PathVariable String containerUuid, String count,
			String page, String startTimeInUsecs, String endTimeInUsecs,
			String acknowledged, @RequestHeader HttpHeaders headers)
			throws Exception {
		_logger.info("getting ContainersController.uuidEvents headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _containersService.uuidEvents(containerUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, acknowledged, header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}

