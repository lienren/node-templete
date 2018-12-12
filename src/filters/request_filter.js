/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 17:59:39
 */
'use strict';

const log = require('../utils/log');
const sendfile = require('koa-sendfile');

module.exports = async function(ctx, next) {
  let urlPath = ctx.request.path || '';

  // 响应开始时间
  const requestStartTime = new Date();

  // 根据请求目录转入指定静态目录
  if (urlPath.indexOf('website') > -1) {
    await sendfile(ctx, path.resolve(__dirname, '../../assets/website/', 'index.html'));
    return;
  }

  try {
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
