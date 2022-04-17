/*
 * @Author: Lienren 
 * @Date: 2021-01-28 20:30:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-28 23:28:41
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  list: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;
    let keyword = ctx.request.body.keyword || null;

    let where = {
      is_del: 0
    }
    if (keyword) {
      where.$or = [{
        name: {
          $like: `%${keyword}%`
        }
      }, {
        phone: {
          $like: `%${keyword}%`
        }
      }, {
        area: {
          $like: `%${keyword}%`
        }
      }, {
        city: {
          $like: `%${keyword}%`
        }
      }];
    }

    let result = await ctx.orm().website_applyinfo.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          workArea: m.dataValues.work_area,
          createTime: m.dataValues.create_time
        }
      }),
    };
  },
  del: async (ctx) => {
    let id = ctx.request.body.id || 0;

    ctx.orm().website_applyinfo.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  }
}