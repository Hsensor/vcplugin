package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class DatastoresServiceImpl implements DatastoresService {

	private final static Log _logger = LogFactory
			.getLog(DatastoresServiceImpl.class);
	
	@Override
	public String list(
			Map<String, String> headers) throws Exception {
		_logger.info("calling DatastoresServiceImpl.list function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "containers/datastores",
				TypeUtil.mapToString(params));
	}
	
	@Override
	public String add(String nodeIds, String datastoreName,
			String containerName, String targetPath, String readOnly,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling DatastoresServiceImpl.add function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (nodeIds != null) {
			body.put("nodeIds", nodeIds);
		}
		if (datastoreName != null) {
			body.put("datastoreName", datastoreName);
		}
		if (containerName != null) {
			body.put("containerName", containerName);
		}
		if (targetPath != null) {
			body.put("targetPath", targetPath);
		}
		if (readOnly != null) {
			body.put("readOnly", readOnly);
		}
		_logger.info("calling DatastoresServiceImpl.add body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "containers/datastores/add_datastore", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String remove(String nodeIds, String datastoreName,
			Map<String, String> headers) throws Exception {
		_logger.info("calling DatastoresServiceImpl.remove function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (nodeIds != null) {
			body.put("nodeIds", nodeIds);
		}
		if (datastoreName != null) {
			body.put("datastoreName", datastoreName);
		}
		_logger.info("calling DatastoresServiceImpl.remove body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "containers/datastores/remove_datastore", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	
}
