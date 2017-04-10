package com.lenovo.h2000.test;

import java.util.HashMap;
import java.util.Map;

import com.lenovo.h2000.util.TypeUtil;

public class Prism {

	public static void main(String[] args) throws Exception {
		Map<String, Object> body = new HashMap<String, Object>();
		body.put("disks", "naa.600605b009e084501f4ffef75a65e145,"
				+ "naa.600605b008ff8a501f35b56b1009b515,"
				+ "naa.600605b009e0cf101f5006032f0fc162".split(","));
		System.out.println(TypeUtil.mapToJSONString(body));
	}

}
