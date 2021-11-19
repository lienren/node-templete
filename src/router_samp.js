/*
 * @Author: Lienren
 * @Date: 2019-08-17 15:34:03
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-06 11:28:22
 */
'use strict';

const Router = require('koa-router');
const uploadFile = require('./utils/uploadfile');
const ctrl = require('./controllers/samp/index.js');

const router = new Router({
  prefix: '/samp'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {

    if (funName === 'uploadFile') {
      // 上传文件
      router.post(`/${className}/${funName}`, uploadFile.getMulter('files').any(), ctrl[className][funName])
    } else if (funName === 'importUsers') {
      // 上传文件
      router.post(`/${className}/${funName}`, uploadFile.getMulter('files').any(), ctrl[className][funName])
    } else {
      router.all(`/${className}/${funName}`, ctrl[className][funName]);
    }
  }
}

module.exports = router.routes();
