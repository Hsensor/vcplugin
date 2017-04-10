package com.lenovo.h2000.services;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class ClustersServiceImpl implements ClustersService {
	
	private final static Log _logger = LogFactory.getLog(ClustersServiceImpl.class);

	public String summary(Map<String, String> headers) throws Exception {
		_logger.info("calling ClusterServiceImpl.summary function");
		Map<String, String> params = new HashMap<String, String>();
		
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "clusters/summary", TypeUtil.mapToString(params));
	}
	
	public String stats(String metrics, String startTimeInUsecs,
			String endTimeInUsecs, String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception {
		_logger.info("calling ClusterServiceImpl.stats function");
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
		_logger.info("calling ClusterServiceImpl.stats params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
				+ "cluster/stats", TypeUtil.mapToString(params));
	}

	@Override
	public String alerts(String clusterUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling ClusterServiceImpl.alerts function");
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
		_logger.info("calling ClusterServiceImpl.alerts params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(
				HttpConfig.parseBaseUrl(headers) + "clusters/alerts",
				TypeUtil.mapToString(params));
	}

	@Override
	public String events(String clusterUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception {
		_logger.info("calling ClusterServiceImpl.events function");
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
		_logger.info("calling ClusterServiceImpl.events params "
				+ TypeUtil.mapToString(params));
		return HttpClientUtil.doGet(
				HttpConfig.parseBaseUrl(headers) + "clusters/events",
				TypeUtil.mapToString(params));
	}

}
