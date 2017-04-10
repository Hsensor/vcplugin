package com.lenovo.h2000.services;

import java.util.Map;

public interface ContainersService {
	
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers)
			throws Exception;
    
	public String create(String name, String storagePoolUuid,
			String alias, 
			String storagePoolName, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor,String maxCapacity, String protocolType,
			Map<String, String> headers) throws Exception;

	public String update(String name, String containerUuid, String alias, 
			String storagePoolUuid, String erasureCode,
			String fingerPrintOnWrite, String onDiskDedup,
			String compressionEnabled, String totalExplicitReservedCapacity,
			String advertisedCapacity, String compressionDelayInSecs,
			String replicationFactor, String protocolType,
			Map<String, String> headers) throws Exception;

	public String delete(String containerUuid,
			Map<String, String> headers) throws Exception;
	
	public String detail(String containerUuid,
			Map<String, String> headers) throws Exception;
	
	public String stats(String containerUuid, String metrics,
			String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception;
	
	public String alerts(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
	public String uuidAlerts(String containerUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
	public String events(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
	public String uuidEvents(String containerUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception;
}
