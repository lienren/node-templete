/*
 * @Author: Lienren
 * @Date: 2019-08-17 10:55:19
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-27 01:43:42
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const https = require("https");
const date = require('../../utils/date');
const http = require('../../utils/http');

const tokenFilePath = path.resolve(__dirname, '../../../assets/wx_token.json');

const appId = 'wx3b38fa805a1fb08a';
const appSecret = '7b938b40522062b725d4cfb073f2e294';

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

    fs.writeFileSync(tokenFilePath, JSON.stringify(fileContext), {
      encoding: 'utf8'
    });

    return token;
  },
  readFileToken: () => {
    let token = '';

    // 从文件读取token
    if (fs.existsSync(tokenFilePath)) {
      let fileContext = fs.readFileSync(tokenFilePath, {
        encoding: 'utf8'
      });

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
  requestOpenId: async code => {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

    let result = await http.get({
      url
    });
    result = result && result.data ? result.data : {};

    let sessionKey = result && result.session_key ? result.session_key : '';
    let openId = result && result.openid ? result.openid : '';

    return {
      sessionKey,
      openId
    };
  },
  sendMessage: async (openId, templateId, page, data) => {
    let token = wxHelper.readFileToken();

    if (!token || token.length === 0) {
      token = await wxHelper.requestToken();
    }

    let url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`

    let result = await http.post({
      url,
      data: {
        touser: openId,
        template_id: templateId,
        page: page ? page : `pages/visitor/index`,
        data: data,
        miniprogram_state: 'trial'
      }
    });
  },
  getwxacode: async (id, wxPath, line_color) => {
    let token = wxHelper.readFileToken();

    if (!token || token.length === 0) {
      token = await wxHelper.requestToken();
    }

    let data = {
      path: wxPath,
      auto_color: false,
      line_color: line_color
    };
    data = JSON.stringify(data);

    let options = {
      method: "POST",
      host: "api.weixin.qq.com",
      path: `/wxa/getwxacode?access_token=${token}`,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
      }
    };
    let req = https.request(options, function (res) {
      res.setEncoding("binary");

      let imgData = "";
      res.on('data', function (chunk) {
        imgData += chunk;
      });
      res.on("end", function () {
        fs.writeFile(path.resolve(__dirname, `../../../assets/uploads/wxacode/${id}.jpeg`), imgData, "binary", function (err) {
          if (err) {
            console.log(err)
          }
        });
      });
    });
    req.write(data);
    req.end();
  }
};

module.exports = {
  getToken: async (ctx, next) => {
    let token = await wxHelper.getToken();

    ctx.body = {
      token
    };
  },
  sendMessage: async (openId, templateId, page, data) => {
    await wxHelper.sendMessage(openId, templateId, page, data);
  },
  getwxacode: async (id, wxPath, line_color) => {
    await wxHelper.getwxacode(id, wxPath, line_color);
  },
  getOpenId: async (ctx, next) => {
    let code = ctx.request.body.code || '';

    assert.notStrictEqual(code, '', '入参不能为空！');

    let result = await wxHelper.requestOpenId(code);


    if (result && result.sessionKey && result.openId && result.sessionKey.length > 0 && result.openId.length > 0) {
      ctx.body = {
        openId: result.openId
      };
    }
  }
};