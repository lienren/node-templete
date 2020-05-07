/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-05-07 17:31:31
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
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
};
