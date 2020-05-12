/*
 * @Author: Lienren
 * @Date: 2020-05-11 17:14:39
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-05-11 17:47:59
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const enumSendStatusName = {
  1: '未发送',
  2: '正在发送',
  3: '已发送',
  4: '发送成功',
  5: '发送失败',
};

module.exports = {
  create: async (ctx, params) => {
    let smsTitle = params.smsTitle || '';
    let smsContent = params.smsContent || '';
    let smsPhones = params.smsPhones || [];

    if (smsTitle === '' || smsContent === '' || smsPhones.length === 0) {
      return;
    }

    let result = await ctx.orm('youhouse').yh_send_sms.create({
      smsTitle: smsTitle,
      smsContent: smsContent,
      smsPhones: JSON.stringify(smsPhones),
      addTime: date.formatDate(),
      isDel: 0,
      sendCount: 0,
      sendStatus: 1,
      sendStatusName: enumSendStatusName[1],
    });

    return result;
  },
};
