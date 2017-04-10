package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class ContainersServiceImpl implements ContainersService {

	private final static Log _logger = LogFactory
			.getLog(ContainersServiceImpl.class);

	@Override
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling ContainersServiceImpl.list function");
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
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "containers",
				TypeUtil.mapToString(params));
	}

	@Override
	public String create(String name, String storagePoolUuid,
			String alias, 
			String storagePoolName, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor, String maxCapacity, String protocolType,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.create function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (name != null) {
			body.put("name", name);
		}
		if (storagePoolUuid != null) {
			body.put("storagePoolUuid", storagePoolUuid);
		}
		if (alias != null) {
			body.put("alias", alias);
		}
		if (storagePoolName != null) {
			body.put("storagePoolName", storagePoolName);
		}
		if (erasureCode != null) {
			body.put("erasureCode", erasureCode);
		}
		if (totalExplicitReservedCapacity != null) {
			body.put("totalExplicitReservedCapacity",
					Long.parseLong(totalExplicitReservedCapacity));
		}
		if (advertisedCapacity != null) {
			body.put("advertisedCapacity", Long.parseLong(advertisedCapacity));
		}
		if (fingerPrintOnWrite != null) {
			body.put("fingerPrintOnWrite", fingerPrintOnWrite);
		}
		if (onDiskDedup != null) {
			body.put("onDiskDedup", onDiskDedup);
		}
		if (compressionEnabled != null) {
			body.put("compressionEnabled",
					Boolean.parseBoolean(compressionEnabled));
		}
		if (compressionDelayInSecs != null) {
			body.put("compressionDelayInSecs",
					Integer.parseInt(compressionDelayInSecs));
		}
		if (replicationFactor != null) {
			body.put("replicationFactor", Integer.parseInt(replicationFactor));
		}
		if (maxCapacity != null) {
			body.put("maxCapacity", Long.parseLong(maxCapacity));
		}
		if (protocolType != null) {
			body.put("protocolType", protocolType);
		}
		_logger.info("calling ContainersServiceImpl.create body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "containers", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String update(String name, String containerUuid, String alias,
			String storagePoolUuid, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor, String protocolType,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.update function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (name != null) {
			body.put("name", name);
		}
		if (storagePoolUuid != null) {
			body.put("storagePoolUuid", storagePoolUuid);
		}
		if (containerUuid != null) {
			body.put("containerUuid", containerUuid);
		}
		if (alias != null) {
			body.put("alias", alias);
		}
		if (erasureCode != null) {
			body.put("erasureCode", erasureCode);
		}
		if (totalExplicitReservedCapacity != null) {
			body.put("totalExplicitReservedCapacity",
					Long.parseLong(totalExplicitReservedCapacity));
		}
		if (advertisedCapacity != null) {
			body.put("advertisedCapacity", Long.parseLong(advertisedCapacity));
		}
		if (fingerPrintOnWrite != null) {
			body.put("fingerPrintOnWrite", fingerPrintOnWrite);
		}
		if (onDiskDedup != null) {
			body.put("onDiskDedup", onDiskDedup);
		}
		if (compressionEnabled != null) {
			body.put("compressionEnabled",
					Boolean.parseBoolean(compressionEnabled));
		}
		if (compressionDelayInSecs != null) {
			body.put("compressionDelayInSecs",
					Integer.parseInt(compressionDelayInSecs));
		}
		if (replicationFactor != null) {
			body.put("replicationFactor", Integer.parseInt(replicationFactor));
		}
		if (protocolType != null) {
			body.put("protocolType", protocolType);
		}
		_logger.info("calling ContainersServiceImpl.update body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPut(HttpConfig.parseBaseUrl(headers)
				+ "containers", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String delete(String containerUuid,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.delete function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doDelete(HttpConfig.parseBaseUrl(headers) + "containers/"
				+ containerUuid, TypeUtil.mapToString(params));
	}

	@Override
	public String detail(String containerUuid,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.detail function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "containers/"
				+ containerUuid, TypeUtil.mapToString(params));
	}

	@Override
	public String stats(String containerUuid, String metrics,
			String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.stats function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (metrics != null) {
			params.put("metrics", metrics);
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (intervalInSecs != null) {
			params.put("intervalInSecs", Integer.parseInt(intervalInSecs));
		}
		if (statistics != null) {
			params.put("statistics", statistics);
		}
		_logger.info("calling ContainersServiceImpl.stats params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "containers/" + containerUuid + "/stats",
				TypeUtil.mapToString(params));
	}

	@Override
	public String alerts(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling ContainersServiceImpl.alerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (resolved != null) {
			params.put("resolved", Boolean.parseBoolean(resolved));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling ContainersServiceImpl.alerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "containers/alerts", TypeUtil.mapToString(params));
	}
	
	@Override
	public String uuidAlerts(String containerUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling ContainersServiceImpl.uuidAlerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (containerUuid != null) {
			params.put("containerUuid", containerUuid);
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (resolved != null) {
			params.put("resolved", Boolean.parseBoolean(resolved));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling ContainersServiceImpl.uuidAlerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "containers/"
				+ containerUuid + "/alerts", TypeUtil.mapToString(params));
	}

	@Override
	public String events(String count, String page, String startTimeInUsecs,
			String endTimeInUsecs, String acknowledged,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.events function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling ContainersServiceImpl.events params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "containers/events", TypeUtil.mapToString(params));
	}
	
	@Override
	public String uuidEvents(String containerUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs,
			String acknowledged,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ContainersServiceImpl.uuidEvents function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (containerUuid != null) {
			params.put("containerUuid", containerUuid);
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", Long.parseLong(startTimeInUsecs));
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", Long.parseLong(endTimeInUsecs));
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling ContainersServiceImpl.uuidEvents params " + TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "containers/" + containerUuid + "/events", TypeUtil.mapToString(params));
	}

	

}
