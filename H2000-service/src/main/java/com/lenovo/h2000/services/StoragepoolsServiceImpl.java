package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class StoragepoolsServiceImpl implements StoragepoolsService {

	private final static Log _logger = LogFactory
			.getLog(StoragepoolsServiceImpl.class);

	@Override
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.list function");
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
				+ "storage_pools", TypeUtil.mapToString(params));
	}

	@Override
	public String create(String name, String capacity, String reservedCapacity,
			String markedForRemoval, String tierwiseFreeCapacityMap,
			String disks,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.create function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if (name != null) {
			body.put("name", name);
		}
		if (capacity != null) {
			body.put("capacity", Long.parseLong(capacity));
		}
		if (reservedCapacity != null) {
			body.put("reservedCapacity", Long.parseLong(reservedCapacity));
		}
		if (markedForRemoval != null) {
			body.put("markedForRemoval", Boolean.parseBoolean(markedForRemoval));
		}
		if (tierwiseFreeCapacityMap != null) {
			body.put("tierwiseFreeCapacityMap", tierwiseFreeCapacityMap);
		}
		if (disks != null) {
			body.put("disks", disks.split(","));
		}
		_logger.info("calling StoragepoolsServiceImpl.create body is "
				+ TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPost(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String update(String storagePoolUuid, String name,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.update function");
		Map<String, String> params = new HashMap<String, String>();
		
		Map<String, Object> body = new HashMap<String, Object>();
		if(name != null){
			body.put("name", name);
		}
		if(storagePoolUuid != null){
			body.put("storagePoolUuid", storagePoolUuid);
		}
		_logger.info("calling StoragepoolsServiceImpl.update body is " + TypeUtil.mapToJSONString(body));
		return HttpClientUtil.doPatch(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools", TypeUtil.mapToString(params),
				TypeUtil.mapToJSONString(body));
	}

	@Override
	public String delete(String storagePoolUuid,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.delete function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doDelete(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools/" + storagePoolUuid,
				TypeUtil.mapToString(params));
	}

	@Override
	public String detail(String storagePoolUuid,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.detail function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "storage_pools/"
				+ storagePoolUuid, TypeUtil.mapToString(params));
	}

	@Override
	public String stats(String storagePoolUuid, String metrics,
			String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.stats function");
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
		_logger.info("calling StoragepoolsServiceImpl.stats params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools/" + storagePoolUuid + "/stats",
				TypeUtil.mapToString(params));
	}

	@Override
	public String alerts(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.alerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (resolved != null) {
			params.put("resolved", resolved);
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling StoragepoolsServiceImpl.alerts params " + TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools/alerts", TypeUtil.mapToString(params));
	}
	
	@Override
	public String uuidAlerts(String storagePoolUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.alerts function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (storagePoolUuid != null) {
			params.put("storagePoolUuid", storagePoolUuid);
		}
		if (count != null) {
			params.put("count", Integer.parseInt(count));
		}
		if (page != null) {
			params.put("page", Integer.parseInt(page));
		}
		if (startTimeInUsecs != null) {
			params.put("startTimeInUsecs", startTimeInUsecs);
		}
		if (endTimeInUsecs != null) {
			params.put("endTimeInUsecs", endTimeInUsecs);
		}
		if (severity != null) {
			params.put("severity", severity);
		}
		if (alertTypeUuid != null) {
			params.put("alertTypeUuid", alertTypeUuid);
		}
		if (resolved != null) {
			params.put("resolved", resolved);
		}
		if (acknowledged != null) {
			params.put("acknowledged", Boolean.parseBoolean(acknowledged));
		}
		_logger.info("calling StoragepoolsServiceImpl.uuidAlerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "storage_pools/"
				+ storagePoolUuid + "/alerts", TypeUtil.mapToString(params));
	}

	@Override
	public String events(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.events function");
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
		_logger.info("calling StoragepoolsServiceImpl.events params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "storage_pools/events", TypeUtil.mapToString(params));

	}

	@Override
	public String uuidEvents(String storagePoolUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers) throws Exception {
		_logger.info("calling StoragepoolsServiceImpl.uuidEvents function");
		Map<String, Object> params = new HashMap<String, Object>();
		
		if (storagePoolUuid != null) {
			params.put("storagePoolUuid", storagePoolUuid);
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
		_logger.info("calling StoragepoolsServiceImpl.uuidEvents params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers) + "storage_pools/"
				+ storagePoolUuid + "/events", TypeUtil.mapToString(params));
	}

}
