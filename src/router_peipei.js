/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-25 00:02:43
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/peipei/index.js');

const router = new Router({
  prefix: '/peipei'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
