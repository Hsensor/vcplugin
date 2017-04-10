package com.lenovo.h2000.services;

import java.util.Map;

public interface StoragepoolsService {

	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers)
			throws Exception;

	public String create(String name, String capacity, String reservedCapacity,
			String markedForRemoval, String tierwiseFreeCapacityMap,
			String disks,
			Map<String, String> headers) throws Exception;

	public String update(String storagePoolUuid, String name,
			Map<String, String> headers) throws Exception;

	public String delete(String storagePoolUuid,
			Map<String, String> headers) throws Exception;

	public String detail(String storagePoolUuid,
			Map<String, String> headers) throws Exception;

	public String stats(String storagePoolUuid, String metrics,
			String startTimeInUsecs, String endTimeInUsecs,
			String intervalInSecs, String statistics,
			Map<String, String> headers) throws Exception;

	public String alerts(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
	public String uuidAlerts(String storagePoolUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers)
			throws Exception;

	public String events(String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String acknowledged,
			Map<String, String> headers)
			throws Exception;
	
	public String uuidEvents(String storagePoolUuid, String count, String page,
			String startTimeInUsecs, String endTimeInUsecs, String severity,
			String alertTypeUuid, String resolved, String acknowledged,
			Map<String, String> headers) throws Exception;

}
