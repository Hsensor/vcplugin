package com.lenovo.h2000.services;

import java.util.Map;

public interface EventsService {

	public String list(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page,
			Map<String, String> headers) throws Exception;

	public String acknowledge(String startTimeInUsecs, String endTimeInUsecs,
			String severity, String entityType, String entityTypeIds,
			String count, Map<String, String> headers) throws Exception;

	public String eventAcknowledge(String eventId, Map<String, String> headers) throws Exception;

}
