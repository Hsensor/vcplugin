package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class HealthchecksServiceImpl implements HealthchecksService {
    
	private final static Log _logger = LogFactory
			.getLog(HealthchecksServiceImpl.class);
	
	@Override
	public String list(String healthCheckIds, String globalConfig,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HealthchecksServiceImpl.list function");
		Map<String, String> params = new HashMap<String, String>();
		
		if (healthCheckIds != null) {
			params.put("healthCheckIds", healthCheckIds);
		}
		if (globalConfig != null) {
			params.put("globalConfig", globalConfig);
		}
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "health_checks", TypeUtil.mapToString(params));
	}

	@Override
	public String modify(Map<String, String> headers, String body) throws Exception {
		_logger.info("calling HealthchecksServiceImpl.modify function");
		Map<String, String> params = new HashMap<String, String>();
		
		_logger.info("calling HealthchecksServiceImpl.modify body is "
				+ body);
		return HttpClientUtil.doPatch(HttpConfig.parseBaseUrl(headers)
				+ "health_checks",TypeUtil.mapToString(params), body);
	}

	@Override
	public String update(
			Map<String, String> headers, String body) throws Exception {
		_logger.info("calling HealthchecksServiceImpl.update function");
		Map<String, String> params = new HashMap<String, String>();
		
		_logger.info("calling HealthchecksServiceImpl.update body is "
				+ body);
		return HttpClientUtil.doPut(HttpConfig.parseBaseUrl(headers)
				+ "health_checks",TypeUtil.mapToString(params), body);
	}

	@Override
	public String get(String healthCheckId, String globalConfig,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HealthchecksServiceImpl.get function");
		Map<String, String> params = new HashMap<String, String>();
		
		if (globalConfig != null) {
			params.put("globalConfig", globalConfig);
		}
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "health_checks/" + healthCheckId,
				TypeUtil.mapToString(params));
	}

}
