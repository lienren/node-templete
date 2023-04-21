/*
 * @Author: Lienren
 * @Date: 2019-08-17 15:34:03
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-06 11:28:22
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/wms/index.js');

const router = new Router({
  prefix: '/wms'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
