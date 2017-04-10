package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class AlertsServiceImpl implements AlertsService {

	private final static Log _logger = LogFactory
			.getLog(AlertsServiceImpl.class);

	@Override
	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			String entityType, String entityIds, String alertIds,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling AlertsServiceImpl.list function");
		Map<String, String> params = new HashMap<String, String>();
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (count != null) {
			params.put("count", count);
		}
		if (resolved != null) {
			params.put("resolved", resolved);
		}
		if (acknowledged != null) {
			params.put("acknowledged", acknowledged);
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (page != null) {
			params.put("page", page);
		}
		if (entityType != null) {
			params.put("entityType", entityType);
		}
		if (entityIds != null) {
			params.put("entityIds", entityIds);
		}
		if (alertIds != null) {
			params.put("alertIds", alertIds);
		}
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "alerts",
				TypeUtil.mapToString(params));
	}

	@Override
	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			Map<String, String> headers) throws Exception {
		_logger.info("calling AlertsServiceImpl.acknowledge function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (startTimeInUsecs != null) {
			body.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			body.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (severity != null) {
			body.put("severity", severity);
		}
		if (entityType != null) {
			body.put("entityType", entityType);
		}
		if (entityTypeIds != null) {
			body.put("entityTypeIds", entityTypeIds);
		}
		if (count != null) {
			body.put("count", count);
		}
		_logger.info("calling AlertsServiceImpl.acknowledge body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "alerts/acknowledge", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String resolve(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			Map<String, String> headers) throws Exception {
		_logger.info("calling AlertsServiceImpl.resolve function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (startTimeInUsecs != null) {
			body.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			body.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (severity != null) {
			body.put("severity", severity);
		}
		if (entityType != null) {
			body.put("entityType", entityType);
		}
		if (entityTypeIds != null) {
			body.put("entityTypeIds", entityTypeIds);
		}
		if (count != null) {
			body.put("count", count);
		}
		_logger.info("calling AlertsServiceImpl.resolve body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(
				HttpConfig.parseBaseUrl(headers) + "alerts/resolve",
				TypeUtil.mapToString(params), TypeUtil.mapToJSONString(body));
	}

	@Override
	public String alertAcknowledge(String alertId, String body,
			Map<String, String> headers) throws Exception {
		_logger.info("calling AlertsServiceImpl.alertAcknowledge function");
		Map<String, String> params = new HashMap<String, String>();
		
		_logger.info("calling AlertsServiceImpl.alertAcknowledge body is "
				+ body);
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "alerts/" + alertId + "/acknowledge",
				TypeUtil.mapToString(params), body);
	}

	@Override
	public String alertResolve(String alertId, String body,
			Map<String, String> headers) throws Exception {
		_logger.info("calling AlertsServiceImpl.alertResolve function");
		Map<String, String> params = new HashMap<String, String>();
		
		_logger.info("calling AlertsServiceImpl.alertResolve body is "
				+ body);
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "alerts/" + alertId + "/resolve",
				TypeUtil.mapToString(params), body);
	}

}
