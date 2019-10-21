/*
 * @Author: Lienren
 * @Date: 2019-10-18 16:56:04
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-18 17:18:15
 */
'use strict';

const assert = require('assert');
const cp = require('./checkParam');
const dic = require('./fruitEnum');
const date = require('../../utils/date');

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.startTime && param.endTime) {
      where.addTime = {
        $between: [param.startTime, param.endTime]
      };
    }

    if (param.startPayTime && param.endPayTime) {
      where.payTime = {
        $between: [param.startPayTime, param.endPayTime]
      };
    }

    if (param.startShipTime && param.endShipTime) {
      where.oShipTime = {
        $between: [param.startShipTime, param.endShipTime]
      };
    }

    if (param.oType && param.oType > 0) {
      where.oType = param.oType;
    }

    if (param.oStatus && param.oStatus > 0) {
      where.oStatus = param.oStatus;
    }

    if (param.oShipStatus && param.oShipStatus > 0) {
      where.oShipStatus = param.oShipStatus;
    }

    if (param.isPay !== undefined && param.isPay !== null) {
      where.isPay = param.isPay;
    }

    if (param.groupId && param.groupId > 0) {
      where.groupId = param.groupId;
    }

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (param.beginSellPrice !== undefined && param.endSellPrice !== undefined) {
      where.sellPrice = {
        $between: [param.beginSellPrice, param.endSellPrice]
      };
    }

    let total = await ctx.orm().ftOrders.findAndCount({
      where
    });
    let list = await ctx.orm().ftOrders.findAll({
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

    let order = await ctx.orm().ftOrders.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    let orderProduct = await ctx.orm().ftOrderProducts.findAll({
      where: {
        oId: param.id,
        isDel: 0
      }
    });

    ctx.body = {
      order,
      orderProduct
    };
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
