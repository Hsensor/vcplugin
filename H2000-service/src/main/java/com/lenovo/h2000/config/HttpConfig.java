package com.lenovo.h2000.config;

import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class HttpConfig {

	private final static Log _logger = LogFactory.getLog(HttpConfig.class);

	private final static String HTTP = "http://";
	private final static String BASE_URL = "/v1/actions/";
	private static String VEGA_URL = "vega-prism-api.com";

	public static String parseBaseUrl(Map<String, String> headers) {
		StringBuffer url = new StringBuffer();
		url.append(HTTP);
		if (headers != null) {
			Iterator<Map.Entry<String, String>> it = headers.entrySet()
					.iterator();
			while (it.hasNext()) {
				Map.Entry<String, String> entry = it.next();
				if (entry.getValue() != null) {
					url.append(entry.getValue()).append("-").append(VEGA_URL)
							.append(BASE_URL);
				} else {
					url.append(VEGA_URL).append(BASE_URL);
				}
			}
			_logger.info("getting HttpConfig.parseBaseUrl.url => "
					+ url.toString());
		}
		return url.toString();
	}

}
