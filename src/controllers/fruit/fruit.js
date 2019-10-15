/*
 * @Author: Lienren
 * @Date: 2019-10-14 14:17:55
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-15 11:32:48
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const AlipaySdk = require('alipay-sdk').default;

const appId = '2019101268338026';
const notifyUrl = '';
const app_cert_sn = 'e590fd11100405cf71b771b5b495c226';
const alipay_root_cert_sn = '687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6';
const alipay_cert_sn = fs.readFileSync(path.resolve(__dirname, './crt/alipayCertPublicKey_RSA2.crt'), 'ascii');
const alipay_private = fs.readFileSync(path.resolve(__dirname, './crt/aliPrivateKey.txt'), 'ascii');

// aliCertSN=e590fd11100405cf71b771b5b495c226
// aliPublicKey=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl0ri0hRgIplCktb3b88MREUXv3aNSc7CsPzyZc/9BWeqJNxRW7Rz++KKOqcMVOGby7gjJrSZQzxkKO3NZ6dnE2CRb8nrTEq9iZEv8WXsJI5JoLq241ZMD6+m6ZbuYU1xi3MhzmolmRcSlaTQKQw5cQvVO5K+EPHjRh6HIZKf6i5cA/P0x5MEOtEBQGeYBi+8zyTrU2Hlbitv+9WSyZnHCzPM7Flccjn7jLVnJ5z8CciEIRVqvRQEHBUxKfR1X0vbnlSW2Ph/07FLS5aYUMSwjImSJtJnuL3W6glYQhsrNfSDmE0nCsLG4SeeJjC7+958zfxMA68PjBvIaHSN8AhlGwIDAQAB
// aliRootCertSN=687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6

const alipaySdk = new AlipaySdk({
  appId,
  privateKey: alipay_private,
  alipayPublicKey: alipay_cert_sn
});

module.exports = {
  getToken: async ctx => {
    let code = ctx.request.body.code || '';

    assert.notStrictEqual(code, '', '入参不能为空！');

    const result = await alipaySdk.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code,
      refreshToken: 'token',
      app_cert_sn: app_cert_sn,
      alipay_root_cert_sn: alipay_root_cert_sn
    });

    ctx.body = {
      result: result
    };
  }
};
