/*
 * @Author: Lienren
 * @Date: 2018-06-07 14:41:33
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 22:47:46
 */
'use strict';

const assert = require('assert');
const Router = require('koa-router');
const comm = require('../utils/comm');
const makeimgcode = require('../utils/makeimgcode');
const encrypt = require('../utils/encrypt');
const http = require('../utils/http');
const wait = require('../utils/delay');
const mq = require('../utils/mq');
const jwt = require('jsonwebtoken');

module.exports = {
  hello: async (ctx, next) => {
    ctx.body = {
      context: 'hello world!',
      guid: comm.getGuid()
    };
  },
  waitHello: async (ctx, next) => {
    let delayTime = 3000;
    ctx.body = {
      context: 'hello world!',
      guid: comm.getGuid(),
      delayTime: delayTime
    };

    await wait(delayTime);
  },
  getUsers: async (ctx, next) => {
    let users = await ctx.orm().users.findAll();
    let users_dbname = await ctx.orm('db_test').users.findAll();

    ctx.body = {
      users,
      users_dbname
    };
  },
  getUserByRedis: async (ctx, next) => {
    let redis = require('../utils/redis');
    await redis.set('lienren', JSON.stringify({ name: 'Lienren', age: 34 }));
    let result = await redis.get('lienren');

    ctx.body = {
      context: JSON.parse(result)
    };
  },
  postParam: async (ctx, next) => {
    let param = ctx.request.body.param;
    ctx.body = {
      param: param
    };
  },
  requestHttp: async (ctx, next) => {
    let id = ctx.request.body.id || 100;
    let areaId = ctx.request.body.areaid || 1;
    let reqUrl = 'https://fn.51pinzhi.cn/sku/sku/product/pro';

    let result = await http.post({
      url: reqUrl,
      data: {
        id: id,
        areaid: areaId
      },
      headers: ctx.headers
    });

    ctx.body = result.data;
  },
  uploadFile: async (ctx, next) => {
    ctx.body = {
      file: ctx.req.files
    };
  },
  getImageCode: async (ctx, next) => {
    let code = comm.randCode(4);
    let imgCode = await makeimgcode.makeCapcha(code, 90, 30, {
      ...{ bgColor: 0xffffff, topMargin: { base: 5, min: -8, max: 8 } }
    });
    let imgCodeBase64 = 'data:image/bmp;base64,' + imgCode.getFileData().toString('base64');

    ctx.body = {
      imgbase64: imgCodeBase64
    };
  },
  setRebitMQ: async (ctx, next) => {
    let result = await mq.set('demo_sendmessage', 'direct', 'userinfo', 'baseinfo', { name: 'lienren is here!' });

    ctx.body = {
      result: result
    };
  },
  jsonwebtoken: async (ctx, next) => {
    let user = {
      userId: 1,
      userName: '李恩仁',
      userRoles: [
        {
          roleId: 1,
          roleName: '超级管理员'
        },
        {
          roleId: 2,
          roleName: '管理员'
        }
      ]
    };

    let key = comm.randCode(36);
    let options = {
      expiresIn: '10h',
      issuer: 'Node-Templete',
      audience: 'LI R&D TEAM 2018-2020',
      algorithm: 'HS512'
    };
    let algorithms = [options.algorithm];

    let token = jwt.sign(user, key, options);
    let decoded = jwt.verify(token, key, { algorithms });

    ctx.body = {
      key,
      token,
      decoded
    };
  }
};
