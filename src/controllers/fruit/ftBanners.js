/*
 * @Author: Lienren
 * @Date: 2019-10-31 14:52:35
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-31 14:58:33
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

    let total = await ctx.orm().ftBanners.count({
      where
    });
    let list = await ctx.orm().ftBanners.findAll({
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

    let result = await ctx.orm().ftBanners.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.imgUrl);

    await ctx.orm().ftBanners.create({
      imgUrl: param.imgUrl,
      imgLink: param.imgLink,
      sortIndex: param.sortIndex || 0,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftBanners.update(
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
