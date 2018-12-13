/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-14 00:30:56
 */
'use strict';

const sendfile = require('koa-sendfile');
const log = require('../utils/log');
const redirect = require('./request_redirect');

module.exports = async function(ctx, next) {
  // 响应开始时间
  const requestStartTime = new Date();

  let urlPath = ctx.path || '';
  let token = ctx.headers['authentication'] || '';

  // 根据请求目录转入指定静态目录
  await redirect(urlPath, async sitepath => {
    await sendfile(ctx, sitepath);
  });

  try {
    // 整合query和body内容
    ctx.request.body = {
      ...ctx.request.query,
      ...ctx.request.body
    };

    ctx.work = {
      code: '000000',
      message: 'success'
    };

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
      code: error.code || error.name,
      message: error.message,
      data: {}
    };
  }
};
