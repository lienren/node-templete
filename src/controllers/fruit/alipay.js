/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:54:56
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-16 19:55:18
 */
'use strict';

const assert = require('assert');
const ali = require('../../extends/ali');

module.exports = {
  getToken: async ctx => {
    let code = ctx.request.body.code || '';

    assert.notStrictEqual(code, '', '入参不能为空！');

    const result = await ali.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code,
      refreshToken: 'token'
    });

    ctx.body = {
      result: result,
      dic: dic.disRangeTypeEnum[`1`]
    };
  }
};
