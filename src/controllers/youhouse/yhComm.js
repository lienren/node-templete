/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-05-12 10:10:24
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

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
};
