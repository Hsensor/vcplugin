##VMware VSphere web plugin deplody guide
* 上传zip文件
    * 制作.zip的压缩包
        * 将H2000 web html插件生成的target目录下的H2000.war，拷贝至Lenovo-H2000/plugins/ 目录
        * 将H2000-service java 插件生成的targe目录下H2000-service.jar，拷贝至Lenovo-H2000/plugins/ 目录
        * 将Lenovo-H2000 目录下plugins 文件夹和plugin-package.xml文件打包成一个ZIP文件，放置到一个可以访问的web服务器上，以供VMware vsphere web client客户端下载
    * 将zip 文件上传至可以访问的web服务器，并测试通过，可以直接下载


* 将zip文件与Vcenter Client 关联
    * 创建一个extension.xml，作为配置VCenter Server,更新插件的管理依据
    <extension>
       <description>
          <label>Lenovo LHS</label>
          <summary>Lenovo H2000 storage plugin for VMware</summary>
       </description>
       <key>com.lenovo.h2000.H2000</key>
       <company>VMware</company>
       <version>1.5.6</version>
       <client>
          <version>1.5.6</version>
          <description>
             <label>Lenovo LHS</label>
             <summary>Lenovo H2000 storage plugin for VMware</summary>
          </description>
          <company>VMWare</company>
          <type>vsphere-client-serenity</type>
          <url>http://10.100.123.236:3000/H2000.zip</url>
       </client>
       <lastHeartbeatTime>2017-03-14T08:42:59.814418Z</lastHeartbeatTime>
    </extension>
    * extension.xml 释义
        * key是插件plugin-package.xml中的id,必须一致.
        * version必须与插件plugin-package.xml中定义的version，必须一致
        * type必须是vsphere-client-serenity
        * url  web服务器上可以下载的连接
    * extention.xml 使用
        * 访问https://YOUR_VC_IP/mob/?moid=ExtensionManager 
        * UnregisterExtension ,清楚之前的extensionKey,like com.lenovo.h2000.H2000 (即extension.xml中的key和plugin-package.xml中的id属性)
        * registerExtension,将extension.xml 文件拷贝入输入框中提交


* 验证插件是否部署成功
    * 若当前为以登录状态，则注销，再次访问vcenter vsphere web client
    * 未发现新部署的插件 ，进入错误排查流程


* 错误排查
    * C:\ProgramData\VMware\vCenterServer\cfg\vsphere-client\webclient.properties 文件设置allowHttp = true
    * 检查该目录下C:\ProgramData\VMware\vCenterServer\cfg\vsphere-client\vc-packages\vsphere-client-serenity 是否有download插件
    * 客户端访问服务器端的log日志文件vsphere_client_virgo.log，地址: C:\ProgramData\VMware\vCenterServer\logs\vsphere-client\logs 
    * 以上均无错误那就只能重启机器了
    * 以上都不ok直接去看vsphere-client-sdk docs文档，偌还搞不定，那就去vmware community官网求教


##VMware VSphere web plugin 开发部署指导
* 上传H2000/tareget/H2000.war 和 H2000-service/target/H2000-service.jar 包
    * 使用windows远程工具，映射本地H2000插件项目，连接至VCenter Verver
    * 进入C:\ProgramData\VMware\vCenterServer\cfg\vsphere-client\vc-packages\vsphere-client-serenity\com.lenovo.h2000.H2000-X.X.XX 目录。
    * 将本地H2000/tareget/H2000.war 和 H2000-service/target/H2000-service.jar 包,替换该目录文件。
    * 在windows 服务器管理程序中查找到 vsphere web client 服务，并重启该服务。