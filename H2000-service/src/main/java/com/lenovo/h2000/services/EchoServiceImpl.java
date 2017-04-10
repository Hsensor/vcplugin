package com.lenovo.h2000.services;

/**
 * Implementation of the EchoService interface
 */
public class EchoServiceImpl implements EchoService {

   /* (non-Javadoc)
    * @see com.lenovo.h2000.EchoService#echo(java.lang.String)
    */
   public String echo(String message) {
      return message;
   }
}
