/*
 * @Author: Lienren
 * @Date: 2020-07-14 07:43:15
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-07-15 08:05:01
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const http = require('../../utils/http');

const crypto = require('crypto');

/**
账号： lilaoshi 
初始密码：F1G6kqEG
应用名称：旧物回收
应用标识：jiuwuhuishou
应用密钥：默认分区：hN5p3eHl8DwJnIJZgbKDGy8Yr3KUE7cs
 */

const hainaConfig = {
  paasid: 'jiuwuhuishou',
  token: 'hN5p3eHl8DwJnIJZgbKDGy8Yr3KUE7cs'
}

module.exports = {
  haina: async (ctx) => {
    let userCode = ctx.request.body.userCode || '';
    let appType = ctx.request.body.appType || '';

    assert.ok(!(userCode === '' && appType === ''), '入参不能为空！');

    let timestamp = date.getSecondStamp()
    let nonce = comm.getGuid()
    let signature = `${timestamp}${hainaConfig.token}${nonce}${timestamp}`

    let hash = crypto.createHash('sha256');
    hash.update(signature);
    signature = hash.digest('hex').toUpperCase();

    let result = await http.post({
      url: 'https://rio-pre.haina.com/ebus/hainaapi/login/getUserInfoByUserCode',
      data: {
        userCode: userCode
      },
      headers: {
        'Content-type': 'application/json',
        'x-rio-paasid': hainaConfig.paasid,
        'x-rio-timestamp': timestamp,
        'x-rio-nonce': nonce,
        'x-rio-signature': signature
      }
    })

    console.log('result:', result.data)

    ctx.body = result.data;
  },
};