/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-12 14:04:54
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');
const sendmsg = require('./yhSendMsg');

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

    let now = date.formatDate();
    // 验证是否有未过期短信
    let sendSms = await ctx.orm('youhouse').yh_sms_code.findOne({
      where: {
        phone: userPhone,
        isUse: 0,
        overTime: {
          $gt: now,
        },
        isDel: 0,
      },
    });

    assert.ok(sendSms === null, '不能重复发送验证码！');

    // 生成短信验证码
    let code = comm.randNumber(4);
    let overTime = date.formatDate(date.getTimeStamp(120));
    await ctx.orm('youhouse').yh_sms_code.create({
      phone: userPhone,
      code: code,
      isUse: 0,
      overTime: overTime,
      addTime: now,
      isDel: 0,
    });

    // 发送验证码
    sendmsg.create(ctx, {
      smsTitle: '登录短信验证码',
      smsContent: `【悠房】您的验证码是${code}。如非本人操作，请忽略本短信`,
      smsPhones: userPhone,
    });

    ctx.body = {};
  },
  manageGetMsg: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_msg.findAll({
      where: {
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    ctx.body = result;
  },
  manageSendMsg: async (ctx) => {
    let msgTitle = ctx.request.body.msgTitle || '';
    let msgContent = ctx.request.body.msgContent || '';

    cp.isEmpty(msgContent);

    let result = await ctx.orm('youhouse').yh_msg.create({
      msgTitle: msgTitle,
      msgContent: msgContent,
      addTime: date.formatDate(),
      isDel: 0,
    });

    ctx.body = {
      id: result.id,
    };
  },
  manageDeleteMsg: async (ctx) => {
    let id = ctx.request.body.id || 0;

    cp.isNumberGreaterThan0(id);

    await ctx.orm('youhouse').yh_msg.update(
      {
        isDel: 1,
      },
      {
        where: {
          id: id,
          isDel: 0,
        },
      }
    );

    ctx.body = {};
  },
};
