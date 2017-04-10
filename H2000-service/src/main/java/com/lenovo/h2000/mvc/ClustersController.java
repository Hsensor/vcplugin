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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.ClustersService;

@Controller
@RequestMapping(value = "/clusters")
public class ClustersController {

	private final static Log _logger = LogFactory
			.getLog(ClustersController.class);

	private final ClustersService _clustersService;

	@Autowired
	public ClustersController(
			@Qualifier("clustersService") ClustersService clustersService) {
		_clustersService = clustersService;
	}

	public ClustersController() {
		_clustersService = null;
	}

	@RequestMapping(value = "/summary", method = RequestMethod.GET)
	@ResponseBody
	public String summary(@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ClustersController.summary headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _clustersService.summary(header);
	}

	@RequestMapping(value = "/stats", method = RequestMethod.GET)
	@ResponseBody
	public String stats(String metrics, String startTimeInUsecs,
			String endTimeInUsecs, String intervalInSecs, String statistics,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ClustersController.stats headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _clustersService.stats(metrics, startTimeInUsecs,
				endTimeInUsecs, intervalInSecs, statistics, header);
	}

	@RequestMapping(value = "/alerts", method = RequestMethod.GET)
	@ResponseBody
	public String alerts(@RequestParam(required = false) String clusterUuid,
			String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String severity, String alertTypeUuid,
			String resolved, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ClustersController.alerts headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _clustersService.alerts(clusterUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, severity, alertTypeUuid,
				resolved, acknowledged, header);
	}

	@RequestMapping(value = "/events", method = RequestMethod.GET)
	@ResponseBody
	public String events(@RequestParam(required = false) String clusterUuid,
			String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String acknowledged,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting ClustersController.events headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _clustersService.events(clusterUuid, count, page,
				startTimeInUsecs, endTimeInUsecs, acknowledged, header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}

