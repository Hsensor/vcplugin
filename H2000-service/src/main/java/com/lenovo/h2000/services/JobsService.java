package com.lenovo.h2000.services;

import java.util.Map;

public interface JobsService {
	
	public String list(Map<String, String> headers) throws Exception;
	
	public String detail(String jobUuid,
			Map<String, String> headers) throws Exception;
	
}
