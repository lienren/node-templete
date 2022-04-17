/*
 * @Author: Lienren
 * @Date: 2019-10-26 20:48:08
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-26 20:55:13
 */
'use strict';

const pinyin = require('pinyin');
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

    if (param.userId && param.userId > 0) {
      where.userId = param.userId;
    }

    let total = await ctx.orm().ftUserRecAddress.count({
      where
    });
    let list = await ctx.orm().ftUserRecAddress.findAll({
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

    let result = await ctx.orm().ftUserRecAddress.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.recName);
    cp.isEmpty(param.recPhone);
    cp.isEmpty(param.recAddress);
    cp.isEmpty(param.recPName);
    cp.isEmpty(param.recCName);
    cp.isEmpty(param.recAName);

    await ctx.orm().ftUserRecAddress.create({
      userId: param.userId,
      recName: param.recName,
      recPhone: param.recPhone,
      recSiteName: param.recSiteName,
      recAddress: param.recAddress,
      recPName: param.recPName,
      recCName: param.recCName,
      recAName: param.recAName,
      isDefault: param.isDefault || 0,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.userId);
    cp.isEmpty(param.recName);
    cp.isEmpty(param.recPhone);
    cp.isEmpty(param.recAddress);
    cp.isEmpty(param.recPName);
    cp.isEmpty(param.recCName);
    cp.isEmpty(param.recAName);

    await ctx.orm().ftUserRecAddress.update(
      {
        recName: param.recName,
        recPhone: param.recPhone,
        recSiteName: param.recSiteName,
        recAddress: param.recAddress,
        recPName: param.recPName,
        recCName: param.recCName,
        recAName: param.recAName,
        isDefault: param.isDefault || 0,
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          userId: param.userId,
          isDel: 0
        }
      }
    );
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.userId);

    await ctx.orm().ftUserRecAddress.update(
      {
        isDel: 1,
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          userId: param.userId,
          isDel: 0
        }
      }
    );
  }
};
