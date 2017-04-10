package com.lenovo.h2000.mvc;

//import java.io.File;
import java.util.Collections;
//import java.util.Date;
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
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import com.lenovo.h2000.services.LicenseService;

@Controller
@RequestMapping(value = "/license")
public class LicenseController {

	private final static Log _logger = LogFactory
			.getLog(LicenseController.class);

	private final LicenseService _licenseService;

	@Autowired
	public LicenseController(
			@Qualifier("licenseService") LicenseService licenseService) {
		_licenseService = licenseService;
	}

	public LicenseController() {
		_licenseService = null;
	}

	@RequestMapping(value = "/export", method = RequestMethod.GET)
	@ResponseBody
	public String export(@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting LicenseController.export headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		return _licenseService.export(header);
	}

	@RequestMapping(value = "/import", method = RequestMethod.POST)
	@ResponseBody
	public String upload(@RequestParam("licenseFile") CommonsMultipartFile file, @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting LicenseController.upload headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		/*String path = System.getProperty("java.io.tmpdir")+ "/" + new Date().getTime()+file.getOriginalFilename();
		File newFile=new File(path);
        file.transferTo(newFile);
        
        return _licenseService.upload(path, header);*/
        return _licenseService.upload(file.getBytes(), header);
	}
	
	@RequestMapping(value = "/validate", method = RequestMethod.GET)
	@ResponseBody
	public String validate(@RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting LicenseController.upload headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
		
		return _licenseService.validate(header);
	}
	@RequestMapping(value = "/show", method = RequestMethod.GET)
	@ResponseBody
	public String show( @RequestHeader HttpHeaders headers) throws Exception {
		_logger.info("getting LicenseController.upload headers.X-Lenovo-ClusterName "
				+ headers.getFirst("X-Lenovo-ClusterName"));
		Map<String, String> header = new HashMap<String, String>();
		header.put("X-Lenovo-ClusterName",
				headers.getFirst("X-Lenovo-ClusterName"));
        
		return _licenseService.show(header);
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, String> handleDataAccessException(Exception ex) {
		_logger.error(ex);
		return Collections.singletonMap("message", ex.getMessage());
	}

}
