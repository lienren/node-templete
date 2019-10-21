/*
 * @Author: Lienren
 * @Date: 2019-10-17 11:28:47
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-18 11:01:57
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

    if (param.proVerifyType && param.proVerifyType > 0) {
      where.proVerifyType = param.proVerifyType;
    }

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (param.sortId && param.sortId > 0) {
      where.sortId = param.sortId;
    }

    if (param.isOnline !== undefined && param.isOnline !== null) {
      where.isOnline = param.isOnline;
    }

    let total = await ctx.orm().ftProducts.findAndCount({
      where
    });
    let list = await ctx.orm().ftProducts.findAll({
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

    let result = await ctx.orm().ftProducts.findOne({
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
    cp.isEmpty(param.costPrice);
    if (param.isLimit && param.isLimit > 0) {
      cp.isEmpty(param.limitNum);
    }
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);
    if (param.proType === 1) {
      cp.isEmpty(param.groupUserId);
      cp.isEmpty(param.proVerifyType);
    }

    // 平台商品计算返佣
    if (param.proType === 2) {
      cp.isEmpty(param.rebateType);

      // 如果佣金没有配置，则设置为10%
      if (param.rebateRate === undefined || param.rebateRate === null) {
        param.rebateRate = 10;
      }

      // 计算返佣
      param.rebatePrice = dic.rebateTypeEnum.calc(
        param.rebateType,
        param.sellPrice,
        param.rebateRate,
        param.rebatePrice
      );
    }

    await ctx.orm().ftProducts.create({
      proType: param.proType,
      proTypeName: dic.proTypeEnum[`${param.proType}`],
      proIndex: param.proIndex,
      sortId: param.sortId,
      sortName: param.sortName,
      title: param.title,
      subTitle: param.subTitle,
      originalPrice: param.originalPrice,
      sellPrice: param.sellPrice,
      costPrice: param.costPrice,
      proProfit: param.sellPrice - param.costPrice,
      isLimit: param.isLimit || 0,
      limitNum: param.limitNum || 0,
      pickTime: param.pickTime || 0,
      specInfo: param.specInfo,
      isOnline: param.isOnline || 0,
      proVerifyType: param.proType === 1 ? param.proVerifyType : 3,
      proVerifyTypeName: dic.proVerifyTypeEnum[`${param.proType === 1 ? param.proVerifyType : 3}`],
      proVerifyTime: param.proType === 1 ? undefined : date.formatDate(),
      content: param.content,
      stock: param.stock || 0,
      saleNum: 0,
      saleNumV: param.saleNumV || 0,
      masterImg: param.masterImg,
      subImg: JSON.stringify(param.subImg),
      groupUserId: param.groupUserId || 0,
      rebateType: param.proType === 1 ? 0 : param.rebateType,
      rebateTypeName: dic.rebateTypeEnum[`${param.proType === 1 ? 0 : param.rebateType}`],
      rebateRate: param.rebateRate || 0,
      rebatePrice: param.rebatePrice || 0,
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
    cp.isEmpty(param.costPrice);
    if (param.isLimit && param.isLimit > 0) {
      cp.isEmpty(param.limitNum);
    }
    cp.isEmpty(param.specInfo);
    cp.isEmpty(param.content);
    cp.isEmpty(param.masterImg);
    cp.isArray(param.subImg);
    if (param.proType === 1) {
      cp.isEmpty(param.groupUserId);
      cp.isEmpty(param.proVerifyType);
    }

    // 平台商品计算返佣
    if (param.proType === 2) {
      cp.isEmpty(param.rebateType);

      // 如果佣金没有配置，则设置为10%
      if (param.rebateRate === undefined || param.rebateRate === null) {
        param.rebateRate = 10;
      }

      // 计算返佣
      param.rebatePrice = dic.rebateTypeEnum.calc(
        param.rebateType,
        param.sellPrice,
        param.rebateRate,
        param.rebatePrice
      );
    }

    await ctx.orm().ftProducts.update(
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
        costPrice: param.costPrice,
        proProfit: param.sellPrice - param.costPrice,
        isLimit: param.isLimit || 0,
        limitNum: param.limitNum || 0,
        pickTime: param.pickTime || 0,
        specInfo: param.specInfo,
        isOnline: param.isOnline || 0,
        proVerifyType: param.proType === 1 ? param.proVerifyType : 3,
        proVerifyTypeName: dic.proVerifyTypeEnum[`${param.proType === 1 ? param.proVerifyType : 3}`],
        proVerifyTime: param.proType === 1 ? undefined : date.formatDate(),
        content: param.content,
        stock: param.stock || 0,
        saleNum: 0,
        saleNumV: param.saleNumV || 0,
        masterImg: param.masterImg,
        subImg: JSON.stringify(param.subImg),
        groupUserId: param.groupUserId || 0,
        rebateType: param.proType === 1 ? 0 : param.rebateType,
        rebateTypeName: dic.rebateTypeEnum[`${param.proType === 1 ? 0 : param.rebateType}`],
        rebateRate: param.rebateRate || 0,
        rebatePrice: param.rebatePrice || 0,
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
    await ctx.orm().ftProducts.update(
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

    // 删除团购商品
    await ctx.orm().ftGroupProducts.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          proId: param.id,
          isDel: 0
        }
      }
    );
    await ctx.orm().ftGroupProductRounds.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          proId: param.id,
          isDel: 0
        }
      }
    );
  },
  verifyPro: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.proVerifyType);

    await ctx.orm().ftProducts.update(
      {
        proVerifyType: param.proVerifyType,
        proVerifyTypeName: dic.proVerifyTypeEnum[`${param.proVerifyType}`],
        proVerifyTime: date.formatDate(),
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          proVerifyType: 2,
          isDel: 0
        }
      }
    );
  },
  onOffLinePro: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftProducts.update(
      {
        isOnline: param.isOnline || 0,
        updateTime: date.formatDate()
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
