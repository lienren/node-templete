/*
 * @Author: Lienren
 * @Date: 2018-06-07 14:35:15
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 21:45:01
 */
'use strict';

const Router = require('koa-router');
const uploadFile = require('./utils/uploadfile');
const ctrl = require('./controllers/index.js');

const router = new Router({
  prefix: '/demo'
});

// 装载路由
Object.keys(ctrl).forEach(classNameKey => {
  Object.keys(ctrl[classNameKey]).forEach(funNameKey => {
    if (funNameKey === 'uploadFile') {
      router.post(`/${funNameKey}`, uploadFile.getMulter('demo').any(), ctrl[classNameKey][funNameKey]);
    } else {
      router.all(`/${funNameKey}`, ctrl[classNameKey][funNameKey]);
    }
  });
});

module.exports = router.routes();
