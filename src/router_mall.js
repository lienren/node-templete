/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-18 12:02:47
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/mall/index.js');

const router = new Router({
  prefix: '/mall'
});

for (let className in ctrl) {
  // 枚举文件不用进入路由
  if (className === 'mallEnum' || className === 'checkParam') {
    continue;
  }

  for (let funName in ctrl[className]) {
    router.all(`/${className}/${funName}`, ctrl[className][funName]);
  }
}

module.exports = router.routes();