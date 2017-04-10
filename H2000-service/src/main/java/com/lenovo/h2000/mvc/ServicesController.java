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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.lenovo.h2000.services.EchoService;

@Controller
@RequestMapping(value = "/services")
public class ServicesController {
	private final static Log _logger = LogFactory
			.getLog(ServicesController.class);

	private final EchoService _echoService;

	@Autowired
	public ServicesController(@Qualifier("echoService") EchoService echoService) {
		_echoService = echoService;
	}

	public ServicesController() {
		_echoService = null;
	}

	@RequestMapping(value = "/echo", method = RequestMethod.POST)
	@ResponseBody
	public String echo(String message) throws Exception {
		return _echoService.echo(message);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}

