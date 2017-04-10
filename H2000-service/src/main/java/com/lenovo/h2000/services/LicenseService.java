package com.lenovo.h2000.services;

import java.util.Map;

public interface LicenseService {
	
	public String export(Map<String, String> headers) throws Exception;

	public String upload(String filePath, Map<String, String> headers)
			throws Exception;
	public String upload(byte[] fileBytes, Map<String, String> headers)
			throws Exception;
	
	public String show( Map<String, String> headers)
			throws Exception;
	
	public String validate( Map<String, String> headers)
			throws Exception;
}
