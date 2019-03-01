/*
 * @Author: Lienren
 * @Date: 2018-12-14 09:01:56
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-01 09:55:36
 */
'use strict';

const auth = require('../config.js').auth;
const comm = require('../utils/comm');
const jwt = require('../utils/jwt');

/**
 * 鉴权验证
 * @param {*} ctx ctx对象
 * @param {*} needMethod 验证该请求是否需要鉴权的方法
 * @param {*} callback 验证结束后回调的方法
 */
module.exports = async function(ctx, needMethod, callback) {
  if (!auth.authOpen) {
    return true;
  }

  let requestUrl = ctx.path || '';

  // 验证该请求是否需要鉴权
  let isNeed = false;
  if (typeof needMethod === 'function') {
    isNeed = await needMethod(ctx, requestUrl);
  }

  let token = ctx.headers[auth.authSite] || '';
  let authSource = ctx.headers[auth.authSource] || '';
  let isPass = false;
  let authInfo = null;

  if (isNeed) {
    // 业务逻辑处理后，需要验证
    if (comm.isEmpty(token)) {
      isPass = false;
    } else {
      authInfo = jwt.verifyToken(token);

      if (authInfo) {
        isPass = true;
      } else {
        authInfo = null;
        isPass = false;
      }
    }

    if (typeof callback === 'function') {
      return await callback(ctx, requestUrl, token, isPass, authInfo, authSource);
    }
  } else {
    // 业务逻辑处理后，不需要验证
    isPass = true;
  }

  return {
    isPass,
    authSource,
    token
  };
};
