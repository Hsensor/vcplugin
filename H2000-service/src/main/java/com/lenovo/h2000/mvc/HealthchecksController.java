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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.HealthchecksService;

@Controller
@RequestMapping(value = "/health_checks")
public class HealthchecksController {
	private final static Log _logger = LogFactory
			.getLog(HealthchecksController.class);

	private final HealthchecksService _healthchecksService;

	@Autowired
	public HealthchecksController(
			@Qualifier("healthchecksService") HealthchecksService healthchecksService) {
		_healthchecksService = healthchecksService;
	}

	public HealthchecksController() {
		_healthchecksService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list(String healthCheckIds, String globalConfig,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HealthchecksController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _healthchecksService.list(healthCheckIds, globalConfig, header);
	}

	@RequestMapping(value = "/modify", method = RequestMethod.POST)
	@ResponseBody
	public String modify(@RequestHeader HttpHeaders headers, String body)
			throws Exception {
		_logger.info("getting HealthchecksController.modify headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _healthchecksService.modify(header, body);
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	@ResponseBody
	public String update(
			@RequestHeader HttpHeaders headers, String body) throws Exception {
		_logger.info("getting HealthchecksController.update headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _healthchecksService.update(header, body);
	}

	@RequestMapping(value = "/get", method = RequestMethod.GET)
	@ResponseBody
	public String get(String healthCheckId, String globalConfig,
			@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting HealthchecksController.get headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _healthchecksService.get(healthCheckId, globalConfig,header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}
