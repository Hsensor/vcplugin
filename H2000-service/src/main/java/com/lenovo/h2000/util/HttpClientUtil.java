package com.lenovo.h2000.util;

import java.io.IOException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPatch;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class HttpClientUtil {

	private final static Log _logger = LogFactory.getLog(HttpClientUtil.class);

	public static String doGet(String url, String params) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpGet httpGet = new HttpGet(url + "?" + params);
		_logger.info("getting HttpClientUtil.doGet requestLine with "
				+ httpGet.getRequestLine());
		String responseBody = "";
		try {
			HttpResponse response = httpClient.execute(httpGet);
			HttpEntity entity = response.getEntity();
			_logger.info("getting HttpClientUtil.doGet statusLine with "
					+ response.getStatusLine());
			responseBody = EntityUtils.toString(entity);
			return responseBody;
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doDelete ClientProtocolException with "
					+ e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doDelete IOException with "
					+ e.getMessage());
		} finally {
			httpClient.close();
		}
		return responseBody;
	}

	public static String doDelete(String url, String params) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpDelete httpDelete = new HttpDelete(url + "?" + params);
		_logger.info("getting HttpClientUtil.doDelete requestLine with "
				+ httpDelete.getRequestLine());
		String responseBody = "";
		try {
			HttpResponse response = httpClient.execute(httpDelete);
			response.setHeader(HttpHeaders.CONTENT_TYPE,
					"application/json; charset=UTF-8");
			HttpEntity entity = response.getEntity();
			_logger.info("getting HttpClientUtil.doDelete statusLine with "
					+ response.getStatusLine());
			responseBody = EntityUtils.toString(entity);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doDelete ClientProtocolException with "
					+ e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doDelete IOException with "
					+ e.getMessage());
		} finally {
			httpClient.close();
		}
		return responseBody;
	}

	public static String doPost(String url, String params, String body)
			throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(url + "?" + params);
		String responseBody = "";
		_logger.info("getting HttpClientUtil.doPost requestLine with "
				+ httpPost.getRequestLine());
		try {
			StringEntity requestEntity = new StringEntity(body, "UTF-8");
			requestEntity.setContentEncoding("UTF-8");
			requestEntity.setContentType("application/json");
			httpPost.setEntity(requestEntity);
			HttpResponse response = httpClient.execute(httpPost);
			response.setHeader(HttpHeaders.CONTENT_TYPE,
					"application/json; charset=UTF-8");
			HttpEntity responseEntity = response.getEntity();
			_logger.info("getting HttpClientUtil.doPost statusLine with "
					+ response.getStatusLine());
			responseBody = EntityUtils.toString(responseEntity);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPost ClientProtocolException with "
					+ e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPost IOException with "
					+ e.getMessage());
		} finally {
			httpClient.close();
		}
		return responseBody;
	}

	public static String doPut(String url, String params,
			String body) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPut httpPut = new HttpPut(url + "?" + params);
		String responseBody = "";
		_logger.info("getting HttpClientUtil.doPut requestLine with "
				+ httpPut.getRequestLine());
		try {
			StringEntity requestEntity = new StringEntity(body, "UTF-8");
			requestEntity.setContentEncoding("UTF-8");
			requestEntity.setContentType("application/json");
			httpPut.setEntity(requestEntity);
			HttpResponse response = httpClient.execute(httpPut);
			response.setHeader(HttpHeaders.CONTENT_TYPE,
					"application/json; charset=UTF-8");
			HttpEntity responseEntity = response.getEntity();
			_logger.info("getting HttpClientUtil.doPut statusLine with "
					+ response.getStatusLine());
			responseBody = EntityUtils.toString(responseEntity);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPut ClientProtocolException with "
					+ e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPut IOException with "
					+ e.getMessage());
		} finally {
			httpClient.close();
		}
		return responseBody;
	}

	public static String doPatch(String url, String params,
			String body) throws IOException {
		CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPatch httpPatch = new HttpPatch(url + "?" + params);
		String responseBody = "";
		_logger.info("getting HttpClientUtil.doPatch requestLine with "
				+ httpPatch.getRequestLine());
		try {
			StringEntity requestEntity = new StringEntity(body, "UTF-8");
			requestEntity.setContentEncoding("UTF-8");
			requestEntity.setContentType("application/json");
			httpPatch.setEntity(requestEntity);
			HttpResponse response = httpClient.execute(httpPatch);
			response.setHeader(HttpHeaders.CONTENT_TYPE,
					"application/json; charset=UTF-8");
			HttpEntity responseEntity = response.getEntity();
			_logger.info("getting HttpClientUtil.doPatch statusLine with "
					+ response.getStatusLine());
			responseBody = EntityUtils.toString(responseEntity);
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPatch ClientProtocolException with "
					+ e.getMessage());
		} catch (IOException e) {
			e.printStackTrace();
			_logger.error("throwing HttpClientUtil.doPatch IOException with "
					+ e.getMessage());
		} finally {
			httpClient.close();
		}
		return responseBody;
	}
}
