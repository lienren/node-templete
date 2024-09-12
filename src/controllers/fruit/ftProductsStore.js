/*
 * @Author: Lienren
 * @Date: 2019-10-17 14:23:14
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-21 10:28:36
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

    if (param.proType && param.proType > 0) {
      where.proType = param.proType;
    }

    if (param.sortId && param.sortId > 0) {
      where.sortId = param.sortId;
    }

    let total = await ctx.orm().ftProductsStore.count({
      where
    });
    let list = await ctx.orm().ftProductsStore.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['proIndex']]
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

    let result = await ctx.orm().ftProductsStore.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.proType);
    cp.isEmpty(param.proIndex);
    cp.isEmpty(param.sortId);
    cp.isEmpty(param.sortName);
    cp.isEmpty(param.title);
    cp.isEmpty(param.subTitle);
    cp.isEmpty(param.originalPrice);
    cp.isEmpty(param.sellPrice);
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);

    await ctx.orm().ftProductsStore.create({
      proType: param.proType,
      proTypeName: dic.proTypeEnum[`${param.proType}`],
      proIndex: param.proIndex,
      sortId: param.sortId,
      sortName: param.sortName,
      title: param.title,
      subTitle: param.subTitle,
      originalPrice: param.originalPrice,
      sellPrice: param.sellPrice,
      pickTime: param.pickTime || 0,
      specInfo: param.specInfo,
      content: param.content,
      masterImg: param.masterImg,
      subImg: JSON.stringify(param.subImg),
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.proType);
    cp.isEmpty(param.proIndex);
    cp.isEmpty(param.sortId);
    cp.isEmpty(param.sortName);
    cp.isEmpty(param.title);
    cp.isEmpty(param.subTitle);
    cp.isEmpty(param.originalPrice);
    cp.isEmpty(param.sellPrice);
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);

    await ctx.orm().ftProductsStore.update(
      {
        proType: param.proType,
        proTypeName: dic.proTypeEnum[`${param.proType}`],
        proIndex: param.proIndex,
        sortId: param.sortId,
        sortName: param.sortName,
        title: param.title,
        subTitle: param.subTitle,
        originalPrice: param.originalPrice,
        sellPrice: param.sellPrice,
        pickTime: param.pickTime || 0,
        specInfo: param.specInfo,
        content: param.content,
        masterImg: param.masterImg,
        subImg: JSON.stringify(param.subImg),
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

    // 删除商品
    await ctx.orm().ftProductsStore.update(
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
