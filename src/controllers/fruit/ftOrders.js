/*
 * @Author: Lienren
 * @Date: 2019-10-18 16:56:04
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-21 18:57:05
 */
'use strict';

const assert = require('assert');
const cp = require('./checkParam');
const dic = require('./fruitEnum');
const comm = require('../../utils/comm');
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

    let total = await ctx.orm().ftOrders.count({
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

    cp.isEmpty(param.userId);
    cp.isEmpty(param.groupId);
    cp.isEmpty(param.groupUserId);
    cp.isArrayLengthGreaterThan0(param.proList);

    // 获取团长
    let groupUser = await ctx.orm().ftUsers.findOne({
      where: {
        id: param.groupUserId,
        userType: 2,
        verifyType: 2,
        isDel: 0
      }
    });
    cp.isNull(groupUser, '团长不存在!');

    // 获取团长账户
    let groupAcc = await ctx.orm().ftAccount.findOne({
      where: {
        userId: groupUser.id,
        isDel: 0
      }
    });
    cp.isNull(groupAcc, '团长帐户不存在!');

    // 获取团购
    let group = await ctx.orm().ftGroups.findOne({
      where: {
        id: param.groupId,
        groupUserId: groupUser.id,
        gStatus: 2,
        gStartTime: {
          $lt: date.formatDate()
        },
        gEndTime: {
          $gt: date.formatDate()
        },
        isDel: 0
      }
    });
    cp.isNull(group, '团购不存在或已下线!');

    // 获取用户优惠券
    let userDiscount = null;
    if (param.oDisId && param.oDisId > 0) {
      userDiscount = await ctx.orm().ftUserDiscounts.findOne({
        id: param.oDisId,
        userId: param.userId,
        isUse: 0,
        isOver: 0,
        isDel: 0
      });
      cp.isNull(userDiscount, '优惠券不存在!');
    }

    

    let oSN = 'O' + date.getTimeStamp() + comm.randNumberCode(4);

    await ctx.orm().ftProvince.create({
      oSN,
      userId: param.userId,
      oType: 1,
      oTypeName: dic.orderTypeEnum[`1`],
      parentOSN: '',
      oDisId: userDiscount ? userDiscount.id : 0,
      oDisName: userDiscount ? userDiscount.disTitle : '',
      oDisPrice: 0,
      oStatus: 1,
      oStatusName: dic.orderStatusEnum[`1`],
      oStatusTime: date.formatDate(),
      isPay: 0,
      oShipStatus: 1,
      oShipStatusName: dic.orderShipStatusEnum[`1`],
      groupId: group.id,
      groupName: group.gName,
      groupUserId: groupUser.id,
      groupUserName: groupUser.userName,
      groupUserPhone: groupUser.userPhone,
      originalPrice: 0,
      sellPrice: 0,
      isSettlement: 0,
      settlementPrice: 0,
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
