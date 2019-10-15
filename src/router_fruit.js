/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-14 19:11:13
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/fruit/index.js');

const router = new Router({
  prefix: '/fruit'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
