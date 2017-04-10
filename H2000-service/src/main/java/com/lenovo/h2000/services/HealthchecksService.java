package com.lenovo.h2000.services;

import java.util.Map;

public interface HealthchecksService {

	public String list(String healthCheckIds, String globalConfig,
			Map<String, String> headers) throws Exception;

	public String modify(Map<String, String> headers, String body)
			throws Exception;

	public String update(
			Map<String, String> headers, String body) throws Exception;

	public String get(String healthCheckId, String globalConfig,
			Map<String, String> headers) throws Exception;

}
