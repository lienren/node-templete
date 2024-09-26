/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-29 11:23:23
 */
'use strict';

const assert = require('assert');
const path = require('path');
const sendfile = require('koa-sendfile');
const log = require('../utils/log');
const redirect = require('./request_redirect');
const auth = require('./request_authentication');

module.exports = async function (ctx, next) {
  // 响应开始时间
  const requestStartTime = new Date();

  // 整合query和body内容
  ctx.request.body = {
    ...ctx.request.query,
    ...ctx.request.body
  };

  ctx.work = {
    code: '000000',
    message: 'success',
    managerId: 0, // 管理员编号
    managerLoginName: '', // 管理员帐号
    managerRealName: '', // 管理员真实姓名
    managerPhone: '' // 管理员手机号
  };

  // 根据请求目录转入指定静态目录
  if (ctx.path.indexOf('adminweb') > -1) {
    await sendfile(ctx, path.resolve(__dirname, '../../assets/adminweb/index.html'));
    return;
  }

  if (ctx.path.indexOf('bike_mobile') > -1) {
    await sendfile(ctx, path.resolve(__dirname, '../../assets/bike_mobile/index.html'));
    return;
  }

  /* let sitepath = await redirect(ctx, async (ctx, requestUrl, sitepath) => {
    let stats = await sendfile(ctx, sitepath);

    console.log('stats:', stats);

    return sitepath;
  });

  if (sitepath && sitepath.length > 0) {
    console.log('stop!!!');
    return;
  } */

  try {
    // 鉴权验证
    let { isPass, authSource, authInfo, token } = await auth(
      ctx,
      async (ctx, requestUrl) => {
        let api = await ctx.orm().BaseApi.findOne({ where: { apiUrl: requestUrl } });
        return api && api.isAuth === 1;
      },
      async (ctx, requestUrl, token, isPass, authInfo, authSource) => {
        if (isPass && authInfo) {
          // 验证通过
          // 记录管理员信息
          ctx.work.managerId = authInfo.managerId;
          ctx.work.managerLoginName = authInfo.managerLoginName;
          ctx.work.managerRealName = authInfo.managerRealName;
          ctx.work.managerPhone = authInfo.managerPhone;
        } else {
          // 验证未通过
        }

        return {
          isPass,
          authSource,
          authInfo,
          token
        };
      }
    );

    assert.ok(isPass, '登录验证异常');

    await next();

    // 响应间隔时间
    let ms = new Date() - requestStartTime;

    // 记录响应日志
    log.logResponse(ctx, ms);

    if (!ctx.disableBodyParserReturn) {
      ctx.body = {
        code: ctx.work.code,
        message: ctx.work.message,
        data: ctx.body || {}
      };
    }
  } catch (error) {
    // 响应间隔时间
    let ms = new Date() - requestStartTime;

    // 记录异常日志
    log.logError(ctx, error, ms);

    ctx.body = {
      code: error.code || error.name || error.message,
      message: error.message,
      data: {}
    };
  }
};
