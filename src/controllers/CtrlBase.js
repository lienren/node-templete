/*
 * @Author: Lienren
 * @Date: 2018-06-21 19:37:43
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-05-07 10:46:12
 */
'use strict';

const assert = require('assert');
const path = require('path');
const comm = require('../utils/comm');
const date = require('../utils/date');
const makeimgcode = require('../utils/makeimgcode');
const config = require('../config.js');

const configData = require('./ConfigData');

module.exports = {
  // 获取图形验证码
  getImageCode: async ctx => {
    let token = ctx.request.body.token || '';

    assert.notStrictEqual(token, '', configData.ERROR_KEY_ENUM.ImageCodeTokenIsNull);

    let now = date.getTimeStamp();

    // 获取图形验证码随机数配置
    let ImageCodeRandomCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ImageCodeRandomCount);
    let ImageCodeOverTime = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ImageCodeOverTime);

    let code = comm.randCode(ImageCodeRandomCount);
    let overTime = now + ImageCodeOverTime * 1000;
    let imgCode = await makeimgcode.makeCapcha(code, 90, 30, {
      ...{ bgColor: 0xffffff, topMargin: { base: 5, min: -8, max: 8 } }
    });
    let imgCodeBase64 = 'data:image/bmp;base64,' + imgCode.getFileData().toString('base64');

    // 保存数据库
    ctx.orm().BaseImgCode.create({
      token: token,
      imgCode: code,
      isUse: 0,
      overTime: overTime,
      addTime: now
    });

    ctx.body = {
      imgbase64: imgCodeBase64
    };
  },
  // 上传文件
  uploadFile: async ctx => {
    if (ctx.req.files && ctx.req.files.length > 0) {
      ctx.body = {
        filePath: config.sys.uploadVirtualFilePath + '/files/' + ctx.req.files[0].filename
      };
    } else {
      ctx.body = {};
    }
  }
};
