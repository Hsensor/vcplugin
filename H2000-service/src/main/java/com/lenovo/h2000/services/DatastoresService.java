package com.lenovo.h2000.services;

import java.util.Map;

public interface DatastoresService {
    
	public String list(Map<String, String> headers) throws Exception;
	
	public String add(String nodeIds, String datastoreName,
			String containerName, String targetPath, String readOnly,
			Map<String, String> headers)
			throws Exception;

	public String remove(String nodeIds, String datastoreName,
			Map<String, String> headers) throws Exception;

}
