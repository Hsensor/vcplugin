Welcome to H2000!
===================
----------


## Document
-------------
package.json  scripts 脚本如下

* 对于首次安装依赖编译,合并js,生成文件到vmware插件所需要webapp目录,打包生成war包
  * 生产环境npm run start:p
  * 开发环境npm run start:d 

* 非首次打包,不需要安装依赖,合并js,生成文件到vmware插件所需要webapp目录,直接打包生成war包
    * 生产环境npm run start:p
    * 开发环境npm run start:d 


## Learning guid
* npm run scripts 
* require.js http://www.requirejs.cn/
* r.js 压缩
* gulp 插件，gulpfile.js 中详见
  