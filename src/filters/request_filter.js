/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-01 10:03:50
 */
'use strict';

const assert = require('assert');
const sendfile = require('koa-sendfile');
const log = require('../utils/log');
const redirect = require('./request_redirect');
const auth = require('./request_authentication');

module.exports = async function(ctx, next) {
  // 响应开始时间
  const requestStartTime = new Date();

  // 整合query和body内容
  ctx.request.body = {
    ...ctx.request.query,
    ...ctx.request.body
  };

  ctx.work = {
    code: '000000',
    message: 'success'
  };

  // 根据请求目录转入指定静态目录
  let sitepath = await redirect(ctx, async (ctx, requestUrl, sitepath) => {
    await sendfile(ctx, sitepath);
  });

  try {
    // 鉴权验证
    let { token, isPass, authSource } = await auth(
      ctx,
      async (ctx, requestUrl) => {
        return false;
      },
      async (ctx, requestUrl, token, isPass, authInfo, authSource) => {
        if (isPass && authInfo) {
          // 验证通过
        } else {
          // 验证未通过
        }

        return {
          isPass,
          authSource,
          token
        };
      }
    );

    assert.ok(isPass, 'TokenIsFail');

    await next();

    // 响应间隔时间
    let ms = new Date() - requestStartTime;

    // 记录响应日志
    log.logResponse(ctx, ms);

    ctx.body = {
      code: ctx.work.code,
      message: ctx.work.message,
      data: ctx.body || {}
    };
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
