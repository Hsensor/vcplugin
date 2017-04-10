package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class JobsServiceImpl implements JobsService {

	private final static Log _logger = LogFactory
			.getLog(JobsServiceImpl.class);
	
	@Override
	public String list(
			Map<String, String> headers) throws Exception {
		_logger.info("calling JobsServiceImpl.list function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "jobs",
				TypeUtil.mapToString(params));
	}

	@Override
	public String detail(String jobUuid, Map<String, String> headers)
			throws Exception {
		_logger.info("calling JobsServiceImpl.detail function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(
				HttpConfig.parseBaseUrl(headers) + "jobs/" + jobUuid,
				TypeUtil.mapToString(params));
	}

}
