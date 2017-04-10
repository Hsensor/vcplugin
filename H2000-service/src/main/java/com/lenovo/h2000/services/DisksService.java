package com.lenovo.h2000.services;

import java.util.Map;

public interface DisksService {
	
	public String list(String count, String filterCriteria,
			String sortCriteria, String searchString,
			String searchAttributeList, String page, String projection,
			Map<String, String> headers) throws Exception;

	public String get(String diskUuid, Map<String, String> headers)
			throws Exception;

}
