/*
 * @Author: Lienren
 * @Date: 2019-08-17 10:55:19
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-17 14:23:49
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../utils/comm');
const date = require('../utils/date');
const http = require('../utils/http');

const tokenFilePath = path.resolve(__dirname, '../../assets/wx_token.json');

const appId = 'wx984e28c5b868e075';
const appSecret = '37e97888e2e6dc472e6c2432e12d5ce7';

let wxHelper = {
  requestToken: async () => {
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    let result = await http.get({
      url
    });
    result = result && result.data ? result.data : {};

    let lastUpdateTime = date.formatDate();
    let token = result.access_token;
    let expiresTime = date.getTimeStamp(7000);
    let expiresTimeYMD = date.formatDate(expiresTime);

    let fileContext = {
      token,
      expiresTime,
      expiresTimeYMD,
      lastUpdateTime
    };

    fs.writeFileSync(tokenFilePath, JSON.stringify(fileContext), { encoding: 'utf8' });

    return token;
  },
  readFileToken: () => {
    let token = '';

    // 从文件读取token
    if (fs.existsSync(tokenFilePath)) {
      let fileContext = fs.readFileSync(tokenFilePath, { encoding: 'utf8' });

      if (fileContext && fileContext.length > 0) {
        try {
          fileContext = JSON.parse(fileContext);

          let now = date.getTimeStamp();

          if (fileContext.expiresTime > now) {
            return fileContext.token;
          }
        } catch (e) {}
      }
    }

    return token;
  },
  getToken: async () => {
    let token = wxHelper.readFileToken();

    if (!token || token.length === 0) {
      token = await wxHelper.requestToken();
    }

    return token;
  },
  requestOpenIdAndUnionId: async code => {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    let result = await http.get({
      url
    });
    result = result && result.data ? result.data : {};

    let openId = result && result.errcode === 0 && result.openid ? result.openid : '';
    let unionId = result && result.errcode === 0 && result.unionid ? result.unionid : '';

    return {
      openId,
      unionId
    };
  }
};

module.exports = {
  getToken: async (ctx, next) => {
    let token = await wxHelper.getToken();

    ctx.body = {
      token
    };
  },
  getOpenId: async (ctx, next) => {
    let code = ctx.request.body.code || '';

    assert.notStrictEqual(code, '', '入参不能为空！');

    let result = await wxHelper.requestOpenIdAndUnionId(code);

    ctx.body = {
      ...result
    };
  }
};
