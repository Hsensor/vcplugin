package com.lenovo.h2000.services;

import java.util.Map;

public interface ClustersService {
	
	public String summary(
			Map<String, String> headers) throws Exception;

	public String stats(String metrics, String startTimeInUsecs,
			String endTimeInUsecs, String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception;
	
	public String alerts(String clusterUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)  throws Exception;

	public String events(String clusterUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
}
