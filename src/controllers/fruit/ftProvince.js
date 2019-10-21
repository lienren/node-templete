/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:58:40
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-21 10:27:06
 */
'use strict';

const date = require('../../utils/date');
const cp = require('./checkParam');
const dic = require('./fruitEnum');

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    let total = await ctx.orm().ftProvince.count({
      where
    });
    let list = await ctx.orm().ftProvince.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['addTime', 'DESC']]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  get: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let result = await ctx.orm().ftProvince.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.pName);

    await ctx.orm().ftProvince.create({
      pName: param.pName,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.pName);

    await ctx.orm().ftProvince.update(
      {
        pName: param.pName,
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftProvince.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );
  }
};
