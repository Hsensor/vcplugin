package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class EventsServiceImpl implements EventsService {

	private final static Log _logger = LogFactory
			.getLog(EventsServiceImpl.class);
	
	@Override
	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page, Map<String, String> headers) throws Exception {
		_logger.info("calling EventsServiceImpl.list function");
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
		if (acknowledged != null) {
			params.put("acknowledged", acknowledged);
		}
		if (page != null) {
			params.put("page", page);
		}
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "events",
				TypeUtil.mapToString(params));
	}

	@Override
	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count, Map<String, String> headers) throws Exception {
		_logger.info("calling EventsServiceImpl.acknowledge function");
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
		_logger.info("calling EventsServiceImpl.acknowledge body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "events/acknowledge", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String eventAcknowledge(String eventId, Map<String, String> headers)
			throws Exception {
		_logger.info("calling EventsServiceImpl.eventAcknowledge function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		_logger.info("calling EventsServiceImpl.eventAcknowledge body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers) + "events/"
				+ eventId + "/acknowledge", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

}
