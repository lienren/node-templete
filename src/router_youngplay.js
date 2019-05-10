/*
 * @Author: Lienren
 * @Date: 2019-04-02 17:36:46
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-04-02 22:49:04
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/youngplay/index.js');

const router = new Router({
  prefix: '/youngplay'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
