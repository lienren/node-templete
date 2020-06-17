/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-17 11:22:19
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/marking/index.js');

const router = new Router({
  prefix: '/mk'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
