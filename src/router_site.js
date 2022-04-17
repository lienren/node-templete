/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-28 23:40:56
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/site/index.js');

const router = new Router({
  prefix: '/site'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();