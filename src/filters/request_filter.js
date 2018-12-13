/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-13 23:30:34
 */
'use strict';

const sendfile = require('koa-sendfile');
const log = require('../utils/log');
const redirect = require('./request_redirect');

module.exports = async function(ctx, next) {
  let urlPath = ctx.path || '';
  let token = ctx.headers['authentication'] || '';

  // 根据请求目录转入指定静态目录
  await redirect(urlPath, async sitepath => {
    await sendfile(ctx, sitepath);
  });

  try {
    // 响应开始时间
    const requestStartTime = new Date();

    // 整合query和body内容
    ctx.request.body = {
      ...ctx.request.query,
      ...ctx.request.body
    };

    await next();

    // 响应间隔时间
    let ms = new Date() - requestStartTime;

    // 记录响应日志
    log.logResponse(ctx, ms);

    ctx.body = {
      code: '000000',
      message: 'success',
      reslut: ctx.body
    };
  } catch (error) {
    // 响应间隔时间
    let ms = new Date() - requestStartTime;
    // 记录异常日志
    log.logError(ctx, error, ms);

    ctx.body = {
      code: error.code,
      message: error.message,
      reslut: {}
    };
  }
};
