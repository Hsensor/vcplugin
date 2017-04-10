package com.lenovo.h2000.services;

import java.util.Map;

public interface HostsService {
	
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers) throws Exception;

	public String alerts(String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			Map<String, String> headers)
			throws Exception;
	
	public String uuidAlerts(String hostUuid, String startTimeInUsecs, String endTimeInUsecs,
			String count, String resolved, String acknowledged,
			String severity, String alertTypeUuid, String page,
			Map<String, String> headers)
			throws Exception;

	public String events(String startTimeInUsecs, String endTimeInUsecs,
			String count, String acknowledged, String page,
			Map<String, String> headers) throws Exception;
	
	public String uuidEvents(String hostUuid, String startTimeInUsecs,
			String endTimeInUsecs, String count, String acknowledged,
			String page,
			Map<String, String> headers) throws Exception;
	
	public String get(String serviceVMId, String projection,
			Map<String, String> headers) throws Exception;
	
	public String create(String ip, String username, String password,
			Map<String, String> headers)
			throws Exception;
}
