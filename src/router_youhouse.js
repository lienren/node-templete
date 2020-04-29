/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-04-29 16:07:40
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/youhouse/index.js');

const router = new Router({
  prefix: '/yh'
});

for (let className in ctrl) {
  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();
