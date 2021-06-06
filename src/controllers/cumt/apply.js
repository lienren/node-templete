/*
 * @Author: Lienren 
 * @Date: 2021-06-06 11:41:44 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-06 17:12:15
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const stateNameEnum = {
  1: '未处理',
  2: '处理中',
  3: '已处理',
  4: '不用处理'
}

module.exports = {
  createApply: async ctx => {
    let openId = ctx.request.body.openId || '';
    let name = ctx.request.body.name || '';
    let phone = ctx.request.body.phone || '';
    let depname = ctx.request.body.depname || '';
    let remark = ctx.request.body.remark || '';
    let imglist = ctx.request.body.imgList || [];
    let imgCode = ctx.request.body.imgCode || '';
    let imgToken = ctx.request.body.imgToken || '';

    assert.ok(!!imgCode, '请填写正确的图形验证码！');
    assert.ok(!!imgToken, '请填写正确的图形验证码！');

    assert.ok(!!openId, '用户信息异常，请联系管理员！');
    assert.ok(!!name, '请填写您的姓名！');
    assert.ok(!!phone, '请填写您的手机号码！');

    let now = date.getTimeStamp();

    // 验证图形验证码
    let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
      where: {
        token: imgToken,
        imgCode: imgCode.toLocaleUpperCase(),
        isUse: 0,
        overTime: { $gt: now }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, '验证码输入错误！');

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      { isUse: 1 },
      {
        where: {
          id: resultImgCodeToken.id
        }
      }
    );

    let imgcount = imglist ? imglist.length : 0;
    let state = 0;

    ctx.orm().applyInfo.create({
      openId,
      name,
      phone,
      depname,
      remark,
      imgcount,
      imglist: imglist ? JSON.stringify(imglist) : [],
      state,
      stateName: stateNameEnum[state]
    });

    ctx.body = {};
  }
}