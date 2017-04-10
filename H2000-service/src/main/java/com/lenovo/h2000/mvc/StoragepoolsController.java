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

import com.lenovo.h2000.services.StoragepoolsService;

@Controller
@RequestMapping(value = "/storage_pools")
public class StoragepoolsController {

	private final static Log _logger = LogFactory
			.getLog(StoragepoolsController.class);

	private final StoragepoolsService _storagepoolsService;

	@Autowired
	public StoragepoolsController(
			@Qualifier("storagepoolsService") StoragepoolsService storagepoolsService) {
		_storagepoolsService = storagepoolsService;
	}

	public StoragepoolsController() {
		_storagepoolsService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.list(count, filterCriteria, sortCriteria,
				searchString, searchAttributeList, page, projection, header);
	}

	@RequestMapping(value = "/create", method = RequestMethod.POST)
	@ResponseBody
	public String create(String name, String capacity, String reservedCapacity,
			String markedForRemoval, String tierwiseFreeCapacityMap,
			String disks, @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.create headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.create(name, capacity, reservedCapacity,
				markedForRemoval, tierwiseFreeCapacityMap, disks, header);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String update(@RequestParam(required = true) String storagePoolUuid,
			String name, @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.update headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.update(storagePoolUuid, name, header);
	}

	@RequestMapping(value = "/delete", method = RequestMethod.POST)
	@ResponseBody
	public String delete(@RequestParam(required = true) String storagePoolUuid,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.delete headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.delete(storagePoolUuid, header);
	}

	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@ResponseBody
	public String detail(@RequestParam(required = true) String storagePoolUuid,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.detail headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.detail(storagePoolUuid, header);
	}

	@RequestMapping(value = "/stats", method = RequestMethod.GET)
	@ResponseBody
	public String stats(@RequestParam(required = true) String storagePoolUuid,
			String metrics, String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.stats headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.stats(storagePoolUuid, metrics,
				startTimeInUsecs, endTimeInUsecs, intervalInSecs, statistics,
				header);
	}

	@RequestMapping(value = "/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String alerts(String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String severity, String alertTypeUuid,
			String resolved, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.alerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.alerts(count, page, startTimeInUsecs,
				endTimeInUsecs, severity, alertTypeUuid, resolved,
				acknowledged, header);
	}

	@RequestMapping(value = "/{storagePoolUuid}/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String uuidAlerts(@PathVariable String storagePoolUuid,
			String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String severity, String alertTypeUuid,
			String resolved, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.uuidAlerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.uuidAlerts(storagePoolUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, severity, alertTypeUuid,
				resolved, acknowledged, header);
	}

	@RequestMapping(value = "/events", method = RequestMethod.GET)
	@ResponseBody
	public String events(String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.events headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.events(count, page, startTimeInUsecs,
				endTimeInUsecs, acknowledged, header);
	}

	@RequestMapping(value = "/{storagePoolUuid}/events", method = RequestMethod.GET)
	@ResponseBody
	public String uuidEvents(@PathVariable String storagePoolUuid,
			String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String severity, String alertTypeUuid,
			String resolved, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting StoragepoolsController.uuidEvents headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _storagepoolsService.uuidEvents(storagePoolUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, severity, alertTypeUuid,
				resolved, acknowledged, header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}
