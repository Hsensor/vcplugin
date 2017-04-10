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

import com.lenovo.h2000.services.JobsService;

@Controller
@RequestMapping(value = "/jobs")
public class JobsController {
	private final static Log _logger = LogFactory
			.getLog(JobsController.class);
	
	private final JobsService _jobsService;
	
	@Autowired
	public JobsController(
			@Qualifier("jobsService") JobsService jobsService) {
		_jobsService = jobsService;
	}

	public JobsController() {
		_jobsService = null;
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	@ResponseBody
	public String list( @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting JobsController.list headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _jobsService.list(header);
	}
	
	@RequestMapping(value = "/detail", method = RequestMethod.GET)
	@ResponseBody
	public String detail(String jobUuid, @RequestHeader HttpHeaders headers)
			throws Exception {
		_logger.info("getting JobsController.detail headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _jobsService.detail(jobUuid, header);
	}
	
	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}
}

