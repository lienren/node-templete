/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-21 14:44:44
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/reclaim/index.js');

const router = new Router({
  prefix: '/reclaim'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
