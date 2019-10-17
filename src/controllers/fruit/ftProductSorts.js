/*
 * @Author: Lienren
 * @Date: 2019-10-17 11:20:25
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-17 11:27:46
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

    let total = await ctx.orm().ftProductSorts.findAndCount({
      where
    });
    let list = await ctx.orm().ftProductSorts.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['sortIndex']]
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

    let result = await ctx.orm().ftProductSorts.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.sortName);
    cp.isEmpty(param.sortIndex);

    await ctx.orm().ftProductSorts.create({
      sortName: param.sortName,
      sortIndex: param.sortIndex,
      groupUserId: param.groupUserId || 0,
      sortType: 2,
      sortTypeName: dic.sortTypeEnum[`${2}`],
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.sortName);
    cp.isEmpty(param.sortIndex);

    await ctx.orm().ftProductSorts.update(
      {
        sortName: param.sortName,
        sortIndex: param.sortIndex,
        groupUserId: param.groupUserId || 0,
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

    await ctx.orm().ftProductSorts.update(
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
