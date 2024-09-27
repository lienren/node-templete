/*
 * @Author: Lienren
 * @Date: 2019-08-17 15:34:03
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-21 11:48:02
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/visitor/index.js');

const router = new Router({
  prefix: '/visitor'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
