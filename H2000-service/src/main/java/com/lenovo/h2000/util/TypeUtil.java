package com.lenovo.h2000.util;

import java.util.HashMap;
import java.util.Map;

public class TypeUtil {

	private static final String IN_SEPARATOR = "=";
	private static final String OUT_SEPARATOR = "&";

	public static String mapToString(Map<?, ?> map) {
		StringBuffer sb = new StringBuffer();
		for (Object key : map.keySet()) {
			Object value = map.get(key);
			sb.append(key.toString() + IN_SEPARATOR + value);
			if (map.size() > 1) {
				sb.append(OUT_SEPARATOR);
			}
		}
		if (sb.toString().endsWith(OUT_SEPARATOR)) {
			return sb.toString().substring(0, sb.toString().length() - 1);
		} else {
			return sb.toString();
		}
	}

	public static Map<?, ?> stringToMap(String mapString) {
		if (mapString == null || mapString.equals("")) {
			return null;
		}
		if (!mapString.endsWith(OUT_SEPARATOR)) {
			mapString = mapString + OUT_SEPARATOR;
		}
		Map<String, String> map = new HashMap<String, String>();
		String[] text = mapString.split(OUT_SEPARATOR);
		for (String str : text) {
			String[] keyText = str.split(IN_SEPARATOR);
			if (keyText.length < 1) {
				continue;
			}
			String key = keyText[0];
			String value = keyText[1];
			map.put(key, value);
		}
		return map;
	}
    
	public static String mapToJSONString(Map<?, ?> map) {
		String result = "";
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		for (Object key : map.keySet()) {
			Object value = map.get(key);
			if (value != null) {
				sb.append("\"" + key + "\"");
				sb.append(":");
				if (value instanceof Byte || value instanceof Double
						|| value instanceof Float || value instanceof Double
						|| value instanceof Integer || value instanceof Long
						|| value instanceof Short) {
					sb.append(value);
				} else if (value instanceof Boolean) {
					sb.append(value);
				} else if (value instanceof String) {
					if (((String) value).indexOf(",") != -1) {
						String[] values = ((String) value).split(",");
						String arrayString = "";
						StringBuilder builder = new StringBuilder();
						builder.append("[");
						for (String s : values) {
							builder.append("\"" + s + "\"");
							builder.append(",");
						}
						if (builder.toString().endsWith(",")) {
							arrayString = builder.toString().substring(0,
									builder.toString().length() - 1)
									+ "]";
						}
						sb.append(arrayString);
					} else {
						sb.append("\"" + value + "\"");
					}
				} else if (value instanceof String[]) {
					StringBuilder builder = new StringBuilder();
					String[] values = (String[]) value;
					builder.append("[");
					for (int i = 0; i < values.length; i++) {
						builder.append("\"");
						builder.append(values[i]);
						builder.append("\"");
						if (i != values.length - 1) {
							builder.append(",");
						}
					}
					builder.append("]");
					sb.append(builder.toString());
				} else {

				}
				sb.append(",");
			}
		}
		if (sb.toString().endsWith(",")) {
			result = sb.toString().substring(0, sb.toString().length() - 1)
					+ "}";
		}
		return result;
	}
}
