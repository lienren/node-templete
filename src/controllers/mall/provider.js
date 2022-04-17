/*
 * @Author: Lienren 
 * @Date: 2021-07-13 08:15:39 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-07-13 08:19:15
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  providerList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    let result = await ctx.orm().provider_info.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues
        }
      }),
    };
  },
}