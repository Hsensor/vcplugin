package com.lenovo.h2000.services;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHeaders;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import com.lenovo.h2000.config.HttpConfig;
import com.lenovo.h2000.util.HttpClientUtil;
import com.lenovo.h2000.util.TypeUtil;

public class LicenseServiceImpl implements LicenseService {
  
  private final static Log _logger = LogFactory.getLog(LicenseServiceImpl.class);

  @Override
  public String export(Map<String, String> headers) throws Exception {
    _logger.info("calling LicenseServiceImpl.export function");
    Map<String, String> params = new HashMap<String, String>();
    
    return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
        + "license/export", TypeUtil.mapToString(params));
  }

  @Override
  public String upload(String filePath, Map<String, String> headers) throws Exception {
    _logger.info("calling LicenseServiceImpl.upload function");
    Map<String, String> params = new HashMap<String, String>();
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpPost httpPost = new HttpPost(HttpConfig.parseBaseUrl(headers) + "license/import" + "?" + TypeUtil.mapToString(params));// new HttpPost("http://localhost:3002/license/import");
    
    String responseBody = "";
    DataInputStream in = null;
    try {
      _logger.info("filePath"+filePath);
      File file = new File(filePath);
  	  in = new DataInputStream(new FileInputStream(filePath));
	  byte[] bufferOut = new byte[(int) file.length()];  
	  
	  int bytes = 0;  
	  int i = 0;
	  int len = (int) (1024>file.length() ? file.length() : 1024);
	  while ((bytes = in.read(bufferOut, i, len)) > 0) {
		 if(bytes < 1024)
			 break;
		 else{
			len = (int) (file.length()-bytes);
			i += bytes;
		 }
	  }
    
      ByteArrayEntity requestEntity = new ByteArrayEntity(bufferOut);  
      requestEntity.setContentEncoding("UTF-8");
      requestEntity.setContentType("application/octet-stream");
      httpPost.setEntity(requestEntity);
      HttpResponse response = httpClient.execute(httpPost);
      response.setHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
      HttpEntity responseEntity = response.getEntity();
      responseBody = EntityUtils.toString(responseEntity);
      
      if(file.isFile() && file.exists()){
    	  file.delete();
      }
      
    } catch (ClientProtocolException e) {
    	e.printStackTrace();
    	_logger.error("throwing HttpClientUtil.doPost ClientProtocolException with " + e.getMessage());
    } catch (IOException e) {
    	e.printStackTrace();
    	_logger.error("throwing HttpClientUtil.doPost IOException with " + e.getMessage());
    } finally {
    	httpClient.close();
    	if(in != null){
    		in.close();
    	}
    }
    return responseBody;
  }
  @Override
  public String upload(byte[] fileBytes, Map<String, String> headers) throws Exception {
    Map<String, String> params = new HashMap<String, String>();
    
    CloseableHttpClient httpClient = HttpClients.createDefault();
    HttpPost httpPost = new HttpPost(HttpConfig.parseBaseUrl(headers) + "license/import" + "?" + TypeUtil.mapToString(params));
    
    String responseBody = "";
    DataInputStream in = null;
    try {
      
      ByteArrayEntity requestEntity = new ByteArrayEntity(fileBytes);  
      requestEntity.setContentEncoding("UTF-8");
      requestEntity.setContentType("application/octet-stream");
      httpPost.setEntity(requestEntity);
      HttpResponse response = httpClient.execute(httpPost);
      response.setHeader(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");
      HttpEntity responseEntity = response.getEntity();
      responseBody = EntityUtils.toString(responseEntity);
    } catch (ClientProtocolException e) {
    	e.printStackTrace();
    	_logger.error("throwing HttpClientUtil.doPost ClientProtocolException with " + e.getMessage());
    } catch (IOException e) {
    	e.printStackTrace();
    	_logger.error("throwing HttpClientUtil.doPost IOException with " + e.getMessage());
    } finally {
    	httpClient.close();
    	if(in != null){
    		in.close();
    	}
    }
    return responseBody;
  }
  
  @Override
  public String show(Map<String, String> headers) throws Exception {
    _logger.info("calling LicenseServiceImpl.export function");
    Map<String, String> params = new HashMap<String, String>();
    
    return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
        + "license/show", TypeUtil.mapToString(params));
  }
  
  @Override
  public String validate(Map<String, String> headers) throws Exception {
    _logger.info("calling LicenseServiceImpl.export function");
    Map<String, String> params = new HashMap<String, String>();
    
    return HttpClientUtil.doGet(HttpConfig.parseBaseUrl(headers)
        + "license/validate", TypeUtil.mapToString(params));
  }
}
