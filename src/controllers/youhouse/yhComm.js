/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-05-12 17:05:08
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

async function checkImageCode(ctx, imgCodeToken, imgCode) {
  let now = date.getTimeStamp();

  // 验证图形验证码
  let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
    where: {
      token: imgCodeToken,
      imgCode: imgCode.toLocaleUpperCase(),
      isUse: 0,
      overTime: {
        $gt: now,
      },
    },
  });

  if (resultImgCodeToken) {
    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      {
        isUse: 1,
      },
      {
        where: {
          token: imgCodeToken,
          imgCode: imgCode,
        },
      }
    );

    return true;
  }

  return false;
}

module.exports = {
  notifySms: async (ctx) => {
    console.log('ctx.request.body:', ctx.request.body);
  },
  getBanners: async (ctx) => {
    let imgState = ctx.request.body.imgState || 1;

    let where = {
      isDel: 0,
    };
    if (imgState > 0) {
      where.imgState = imgState;
    }

    let result = await ctx.orm('youhouse').yh_banners.findAll({
      where: where,
    });

    ctx.body = result;
  },
  getMsgs: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_msg.findAll({
      where: {
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let msgItems = [];
    if (result) {
      msgItems = result.map((m) => {
        return {
          ...m.dataValues,
          time: date.formatDate(m.dataValues.addTime, 'YYYY年MM月DD日 HH:mm'),
        };
      });
    }

    ctx.body = msgItems;
  },
  sendSmsCode: async (ctx) => {
    let userPhone = ctx.request.body.userPhone || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(userPhone);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let imgCodeResult = await checkImageCode(ctx, imgCodeToken, imgCode);
    assert.ok(imgCodeResult, '验证码错误或已过期！');

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        userPhone: userPhone,
        isDel: 0,
      },
    });

    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');

    ctx.body = msgItems;
  },
};
