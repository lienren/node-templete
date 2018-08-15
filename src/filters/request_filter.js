/*
 * @Author: Lienren 
 * @Date: 2018-04-19 13:38:30 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-04-19 17:22:36
 */
'use strict';

const log = require('../utils/log');

module.exports = async function(ctx, next) {
  // 响应开始时间
  const requestStartTime = new Date();

  try {
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
