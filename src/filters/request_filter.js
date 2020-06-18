/*
 * @Author: Lienren
 * @Date: 2018-04-19 13:38:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-17 17:17:35
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
    ...ctx.request.body,
  };

  ctx.work = {
    code: '000000',
    message: 'success',
    managerId: 0, // 管理员编号
    managerLoginName: '', // 管理员帐号
    managerRealName: '', // 管理员真实姓名
    managerPhone: '', // 管理员手机号
    userId: 0, // 用户编号
    alipayUserId: '', // 支付宝帐号
  };

  // 根据请求目录转入指定静态目录
  if (ctx.path.indexOf('axon_admin') > -1) {
    await sendfile(
      ctx,
      path.resolve(__dirname, '../../assets/school_report/index.html')
    );
    return;
  }

  try {
    // 鉴权验证
    let { isPass, authSource, authInfo, token } = await auth(
      ctx,
      async (ctx, requestUrl) => {
        return false;
      },
      async (ctx, requestUrl, token, isPass, authInfo, authSource) => {
        if (isPass && authInfo) {
          // 验证通过
          // 记录管理员信息
          ctx.work.managerId = authInfo.managerId || 0;
          ctx.work.managerLoginName = authInfo.managerLoginName;
          ctx.work.managerRealName = authInfo.managerRealName;
          ctx.work.managerPhone = authInfo.managerPhone;
          ctx.work.userId = authInfo.userId || 0;
          ctx.work.alipayUserId = authInfo.alipayUserId;
        } else {
          // 验证未通过
        }

        return {
          isPass,
          authSource,
          authInfo,
          token,
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
        data: ctx.body || {},
      };
    }
  } catch (error) {
    // 响应间隔时间
    let ms = new Date() - requestStartTime;

    console.log('error:', error);

    // 记录异常日志
    log.logError(ctx, error, ms);

    ctx.body = {
      code: error.code || error.name || error.message,
      message: error.message,
      data: {},
    };
  }
};
