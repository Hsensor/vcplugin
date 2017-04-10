package com.lenovo.h2000.services;

import java.util.Map;

public interface AlertsService {
	
	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			String entityType, String entityIds, String alertIds,
			Map<String, String> headers) throws Exception;

	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			Map<String, String> headers) throws Exception;
	
	public String resolve(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count,
			Map<String, String> headers) throws Exception;
	
	public String alertAcknowledge(String alertId, String body,
			Map<String, String> headers) throws Exception;
	
	public String alertResolve(String alertId, String body,
			Map<String, String> headers) throws Exception;
}
