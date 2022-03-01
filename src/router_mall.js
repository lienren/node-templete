/*
 * @Author: Lienren
 * @Date: 2019-10-14 13:47:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-18 12:02:47
 */
'use strict';

const Router = require('koa-router');
const ctrl = require('./controllers/mall/index.js');
const tenpay = require('tenpay');

const tenpayAPI = new tenpay({
  appid: 'wx17112a11c395f6e3',
  mchid: '1610949193',
  partnerKey: '06E9561F6D35212879AE5A272FE7D6BA',
  notify_url: 'https://mall.lixianggo.com/mall/notify/weipay'
}, true);

const router = new Router({
  prefix: '/mall'
});

for (let className in ctrl) {
  // 枚举文件不用进入路由
  if (className === 'mallEnum' || className === 'checkParam') {
    continue;
  }

  for (let funName in ctrl[className]) {
    if (className === 'notify' && funName === 'weipay') {
      router.all(`/${className}/${funName}`, tenpayAPI.middleware('pay'), ctrl[className][funName]);
    } else {
      router.all(`/${className}/${funName}`, ctrl[className][funName]);
    }
  }
}

module.exports = router.routes();