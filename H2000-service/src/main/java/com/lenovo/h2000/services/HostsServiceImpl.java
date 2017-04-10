package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class HostsServiceImpl implements HostsService {

	private final static Log _logger = LogFactory
			.getLog(HostsServiceImpl.class);
	
	@Override
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HostsServiceImpl.list function");
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
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "hosts",
				TypeUtil.mapToString(params));
	}

	@Override
	public String alerts(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling HostsServiceImpl.alerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (resolved != null) {
			params.put("resolved", Boolean.parseBoolean(resolved));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		_logger.info("calling HostsServiceImpl.alerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "hosts/alerts", TypeUtil.mapToString(params));
	}
	
	@Override
	public String uuidAlerts(String hostUuid, String startTimeInUsecs,
			String endTimeInUsecs, String count, String resolved,
			String acknowledged, String severity, String alertTypeUuid,
			String page,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HostsServiceImpl.uuidAlerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (hostUuid != null) {
			params.put("hostUuid", hostUuid);
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (resolved != null) {
			params.put("resolved", Boolean.parseBoolean(resolved));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		_logger.info("calling HostsServiceImpl.uuidAlerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "hosts/"
				+ hostUuid + "/alerts", TypeUtil.mapToString(params));
	}

	@Override
	public String events(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HostsServiceImpl.events function");
		Map<String, Object> params = new HashMap<String, Object>();
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		
		_logger.info("calling HostsServiceImpl.events params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "hosts/events",
				TypeUtil.mapToString(params));
	}
	
	@Override
	public String uuidEvents(String hostUuid, String startTimeInUsecs,
			String endTimeInUsecs, String count, String acknowledged,
			String page,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HostsServiceImpl.uuidEvents function");
		Map<String, Object> params = new HashMap<String, Object>();
		if (hostUuid != null) {
			params.put("hostUuid", hostUuid);
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		
		_logger.info("calling HostsServiceImpl.events uuidEvents "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "hosts/"
				+ hostUuid + "/events", TypeUtil.mapToString(params));
	}
    
	@Override
	public String get(String serviceVMId, String projection,
			Map<String, String> headers) throws Exception {
		_logger.info("calling HostsServiceImpl.get function");
		Map<String, Object> params = new HashMap<String, Object>();
		if (projection != null) {
			params.put("projection", projection);
		}
		
		_logger.info("calling HostsServiceImpl.get params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "hosts/"
				+ serviceVMId, TypeUtil.mapToString(params));
	}

	@Override
	public String create(String ip, String username, String password,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling HostsServiceImpl.create function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (ip != null) {
			body.put("ip", ip);
		}
		if (username != null) {
			body.put("username", username);
		}
		if (password != null) {
			body.put("password", password);
		}
		_logger.info("calling HostsServiceImpl.create body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers) + "hosts",
				TypeUtil.mapToString(params), TypeUtil.mapToJSONString(body));
	}
}
