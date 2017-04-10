package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class DisksServiceImpl implements DisksService {
    
	private final static Log _logger = LogFactory
			.getLog(DisksServiceImpl.class);
	
	@Override
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers) throws Exception {
		_logger.info("calling DisksServiceImpl.list function");
		Map<String, String> params = new HashMap<String, String>();
		if (count != null) {
			params.put("count", count);
		}
		if (filterCriteria != null) {
			params.put("filterCriteria", filterCriteria);
		}
		if (sortCriteria != null) {
			params.put("sortCriteria", sortCriteria);
		}
		if (searchString != null) {
			params.put("searchString", searchString);
		}
		if (searchAttributeList != null) {
			params.put("searchAttributeList", searchAttributeList);
		}
		if (page != null) {
			params.put("page", page);
		}
		if (projection != null) {
			params.put("projection", projection);
		}
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "disks", TypeUtil.mapToString(params));
	}

	@Override
	public String get(String diskUuid, Map<String, String> headers)
			throws Exception {
		_logger.info("calling DisksServiceImpl.get function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "disks/"
				+ diskUuid, TypeUtil.mapToString(params));
	}

}
