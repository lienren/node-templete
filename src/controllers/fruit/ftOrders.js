/*
 * @Author: Lienren
 * @Date: 2019-10-18 16:56:04
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-26 11:56:37
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize').Sequelize;
const cp = require('./checkParam');
const dic = require('./fruitEnum');
const ali = require('../../extends/ali');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const aliPayNotifyUrl = 'http://fruit.billgenius.cn/fruit/ftOrders/notify';

async function splitOrder(ctx, order) {
  // 获取团长商品
  let orderProducts = await ctx.orm().ftOrderProducts.findAll({
    where: {
      oId: order.id,
      isDel: 0
    }
  });

  if (orderProducts && orderProducts.length > 0) {
    let orderGroupUserProducts = orderProducts.filter(f => {
      return f.proType === 1;
    });

    // 有团长商品
    // 且还有平台商品
    // 则拆单
    if (
      orderGroupUserProducts &&
      orderGroupUserProducts.length > 0 &&
      orderGroupUserProducts.length < orderProducts.length
    ) {
      // 部分团长商品
      // 获取收货地址
      let newOrderRec = await ctx.orm().ftOrderRecAddress.findOne({
        where: {
          oId: order.id,
          isDel: 0
        }
      });

      // 生成新订单
      // 更新订单收益为商品销售价
      let newOSN = order.oSN + '001';
      let newOrder = await ctx.orm().ftOrders.create({
        oSN: newOSN,
        userId: order.userId,
        oType: 2,
        oTypeName: dic.orderTypeEnum[`2`],
        parentOSN: order.oSN,
        oDisId: 0,
        oDisName: '',
        oDisPrice: 0,
        oStatus: 2,
        oStatusName: dic.orderStatusEnum[`2`],
        oStatusTime: date.formatDate(),
        isPay: 1,
        oShipStatus: 4,
        oShipStatusName: dic.orderShipStatusEnum[`4`],
        oShipTime: date.formatDate(),
        groupId: order.groupId,
        groupName: order.groupName,
        groupUserId: order.groupUserId,
        groupUserName: order.groupUserName,
        groupUserPhone: order.groupUserPhone,
        originalPrice: 0,
        sellPrice: 0,
        totalPrice: 0,
        isSettlement: 0,
        settlementPrice: orderGroupUserProducts.reduce((total, curr) => {
          return total + parseFloat(curr.totalPrice);
        }, 0),
        addTime: date.formatDate(),
        isDel: 0,
        isRevertStock: 0,
        revertStockName: '未还原库存',
        oRemark: order.oRemark,
        oPickDay: 0,
        oPickTime: date.formatDate()
      });

      // 生成新订单商品
      let newOrderPros = orderGroupUserProducts.map(m => {
        return {
          oId: newOrder.id,
          oSN: newOrder.oSN,
          userId: newOrder.userId,
          proId: m.proId,
          proTitle: m.proTitle,
          proMasterImg: m.proMasterImg,
          specInfo: m.specInfo,
          proType: m.proType,
          proTypeName: m.proTypeName,
          pickTime: m.pickTime,
          originalPrice: m.originalPrice,
          sellPrice: m.sellPrice,
          costPrice: m.costPrice,
          proProfit: m.proProfit,
          pNum: m.pNum,
          totalPrice: m.totalPrice,
          totalProfit: m.totalProfit,
          isLimit: m.isLimit,
          groupId: m.groupId,
          groupName: m.groupName,
          rebateType: m.rebateType,
          rebateTypeName: m.rebateTypeName,
          rebateRate: m.rebateRate,
          rebatePrice: m.rebatePrice,
          totalRebatePrice: m.totalRebatePrice,
          gProType: m.gProType,
          gProTypeName: m.gProTypeName,
          roundId: m.roundId,
          addTime: date.formatDate(),
          isDel: 0
        };
      });
      await ctx.orm().ftOrderProducts.bulkCreate(newOrderPros);

      // 添加收货地址
      await ctx.orm().ftOrderRecAddress.create({
        oId: newOrder.id,
        oSn: newOrder.oSN,
        userId: newOrderRec.userId,
        recName: newOrderRec.recName,
        recPhone: newOrderRec.recPhone,
        recSiteName: newOrderRec.recSiteName,
        recAddress: newOrderRec.recAddress,
        recPName: newOrderRec.recPName,
        recCName: newOrderRec.recCName,
        recAName: newOrderRec.recAName,
        addTime: date.formatDate(),
        isDel: 0
      });

      // 更新老订单商品数量
      await ctx.orm().ftOrders.update(
        {
          proNum: sequelize.literal(
            ` proNum - ${orderGroupUserProducts.length} `
          ),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: order.id,
            isDel: 0
          }
        }
      );

      // 删除老订单中团长商品
      await ctx.orm().ftOrderProducts.update(
        {
          isDel: 1
        },
        {
          where: {
            id: {
              $in: orderGroupUserProducts.map(m => {
                return m.id;
              })
            },
            proType: 1,
            oId: order.id
          }
        }
      );
    } else if (
      orderGroupUserProducts &&
      orderGroupUserProducts.length > 0 &&
      orderGroupUserProducts.length === orderProducts.length
    ) {
      // 全是团长商品
      // 更新订单收益为商品销售价
      await ctx.orm().ftOrders.update(
        {
          oType: 2,
          oTypeName: dic.orderTypeEnum[`2`],
          oStatus: 2,
          oStatusName: dic.orderStatusEnum[`2`],
          oStatusTime: date.formatDate(),
          oShipStatus: 4,
          oShipStatusName: dic.orderShipStatusEnum[`4`],
          oShipTime: date.formatDate(),
          settlementPrice: orderGroupUserProducts.reduce((total, curr) => {
            return total + parseFloat(curr.totalPrice);
          }, 0),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: order.id,
            isDel: 0
          }
        }
      );
    }
  }
}

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.oSN && param.oSN.length > 0) {
      where.oSN = param.oSN;
    }

    if (param.userId && param.userId > 0) {
      where.userId = param.userId;
    }

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

    if (param.oStatusList && param.oStatusList.length > 0) {
      where.oStatus = {
        $in: param.oStatusList
      };
    }

    if (param.oShipStatus && param.oShipStatus > 0) {
      where.oShipStatus = param.oShipStatus;
    }

    if (param.isPay !== undefined && param.isPay !== null) {
      where.isPay = param.isPay;
    }

    if (param.isSettlement !== undefined && param.isSettlement !== null) {
      where.isSettlement = param.isSettlement;
    }

    if (param.groupId && param.groupId > 0) {
      where.groupId = param.groupId;
    }

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (
      param.beginSellPrice !== null &&
      param.beginSellPrice !== undefined &&
      param.endSellPrice !== null &&
      param.endSellPrice !== undefined
    ) {
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

    let proList = await ctx.orm().ftOrderProducts.findAll({
      where: {
        oId: {
          $in: list.map(m => {
            return m.id;
          })
        },
        isDel: 0
      },
      order: [['oId', 'DESC']]
    });

    let orderRec = await ctx.orm().ftOrderRecAddress.findAll({
      where: {
        oId: {
          $in: list.map(m => {
            return m.id;
          })
        },
        isDel: 0
      },
      order: [['oId', 'DESC']]
    });

    ctx.body = {
      list,
      proList,
      orderRec,
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

    let orderRec = await ctx.orm().ftOrderRecAddress.findOne({
      where: {
        oId: param.id,
        isDel: 0
      }
    });

    let group = await ctx.orm().ftUsers.findOne({
      where: {
        id: order.groupUserId,
        isDel: 0
      }
    });

    ctx.body = {
      order,
      orderProduct,
      orderRec,
      group
    };
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.groupId);
    cp.isEmpty(param.groupUserId);
    cp.isEmpty(param.recId);
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

    // 获取收货地址
    let userRec = await ctx.orm().ftUserRecAddress.findOne({
      where: {
        id: param.recId,
        userId: param.userId,
        isDel: 0
      }
    });
    cp.isNull(userRec, '收货地址不存在!');

    // 获取商品
    let getProsSql = `
        select gp.*, p.sortId, p.sortName, p.title, p.subTitle, p.originalPrice, p.sellPrice, p.costPrice, p.proProfit, 
        p.isLimit, p.limitNum, p.pickTime, p.specInfo, p.isOnline, p.content, p.stock, p.saleNum, p.saleNumV, 
        p.masterImg, p.subImg, p.groupUserId, p.proType, p.proTypeName, p.rebateType, p.rebateTypeName, p.rebateRate, p.rebatePrice from ftGroupProducts gp 
        inner join ftProducts p on p.id = gp.proId and p.isOnline = 1 and p.proVerifyType = 3 and stock > 0 and p.isDel = 0 
        where 
        gp.gId = ${group.id} and 
        p.id in (${param.proList
          .map(m => {
            return m.proId;
          })
          .join(',')}) and
        gp.isDel = 0;`;

    let groupProList = await ctx.orm().query(getProsSql);
    cp.isArrayLengthGreaterThan0(groupProList, '商品数据异常!');
    assert.ok(param.proList.length === groupProList.length, '商品数据异常!');

    // 整合购买量和roundId
    groupProList = groupProList.reduce((total, curr) => {
      let pro = param.proList.find(f => {
        return f.proId === curr.proId;
      });

      curr.pNum = pro.pNum;
      curr.roundId = pro.roundId;

      total.push(curr);

      return total;
    }, []);

    let pickTime = groupProList
      .map(m => {
        return m.pickTime;
      })
      .sort((a, b) => {
        return b - a;
      })[0];

    // 验证是否已购买限购商品
    let limitProList = groupProList.filter(f => {
      return f.isLimit === 1;
    });
    if (limitProList && limitProList.length > 0) {
      for (let i = 0, j = limitProList.length; i < j; i++) {
        let limitOrderProductSql = `select IFNULL(sum(op.pNum),0) num from ftOrderProducts op inner join ftOrders o on o.id = op.oId and o.isDel = 0 and o.oStatus != 999 where op.groupId = ${group.id} and op.userId = ${param.userId} and op.proId = ${limitProList[i].proId} and op.isDel = 0;`;
        let limitOrderProduct = await ctx.orm().query(limitOrderProductSql);
        if (limitOrderProduct && limitOrderProduct.length > 0) {
          assert.ok(
            limitProList[i].pNum + parseInt(limitOrderProduct[0].num) <=
              limitProList[i].limitNum,
            '购买商品已超限购数量！'
          );
        }
      }
    }

    // 获取用户优惠券
    let userDiscount = null;
    let orderDisPrice = 0;
    let orderOriginalPrice = groupProList.reduce((total, curr) => {
      return total + parseFloat(curr.originalPrice) * curr.pNum;
    }, 0);
    let orderTotalPrice = groupProList.reduce((total, curr) => {
      return total + parseFloat(curr.sellPrice) * curr.pNum;
    }, 0);
    let orderSellPrice = 0;
    if (param.oDisId && param.oDisId > 0) {
      userDiscount = await ctx.orm().ftUserDiscounts.findOne({
        where: {
          id: param.oDisId,
          userId: param.userId,
          isUse: 0,
          isOver: 0,
          isDel: 0
        }
      });
      cp.isNull(userDiscount, '优惠券不存在!');

      let discount = await ctx.orm().ftDiscounts.findOne({
        where: {
          id: userDiscount.disId,
          isDel: 0
        }
      });
      cp.isNull(discount, '优惠券不存在!');

      // 提取优惠券商品
      let discountHit = dic.disRangeTypeEnum.verify(
        discount.disRangeType,
        discount.disRange,
        groupProList
      );
      assert.ok(discountHit.isHit, '购买的商品无法使用优惠券!');

      // 能使用优惠券的商品总金额
      let discountOrderSellPrice = discountHit.disProList.reduce(
        (total, curr) => {
          return total + parseFloat(curr.sellPrice) * curr.pNum;
        },
        0
      );

      // 不能使用优惠券的商品总金额
      let notDiscountOrderSellPrice = discountHit.notDisProList.reduce(
        (total, curr) => {
          return total + parseFloat(curr.sellPrice) * curr.pNum;
        },
        0
      );

      // 计算优惠金额
      let disCalc = dic.disTypeEnum.calc(
        userDiscount.disType,
        userDiscount.disContext,
        discountOrderSellPrice
      );
      orderDisPrice = disCalc.orderDisPrice;
      orderSellPrice = disCalc.orderSellPrice + notDiscountOrderSellPrice;

      // 设置优惠券失效
      ctx.orm().ftUserDiscounts.update(
        {
          isUse: 1,
          updateTime: date.formatDate()
        },
        {
          where: {
            id: userDiscount.id,
            isUse: 0,
            isOver: 0,
            isDel: 0
          }
        }
      );
    } else {
      orderSellPrice = orderTotalPrice;
    }

    // 扣减库存，更新销售量
    let orderProNum = groupProList.reduce((total, curr) => {
      return total + curr.pNum;
    }, 0);
    if (groupProList) {
      let batchBuckleStock = await ctx
        .orm()
        .sequelize.transaction({}, async transaction => {
          for (let i = 0, j = groupProList.length; i < j; i++) {
            let resultBuckleStock = await ctx.orm().ftProducts.update(
              {
                stock: sequelize.literal(`stock - ${groupProList[i].pNum}`),
                saleNum: sequelize.literal(` saleNum + ${groupProList[i].pNum}`)
              },
              {
                where: {
                  id: groupProList[i].proId,
                  stock: {
                    $gte: groupProList[i].pNum
                  }
                },
                transaction
              }
            );

            if (
              resultBuckleStock &&
              resultBuckleStock.length > 0 &&
              resultBuckleStock[0] > 0
            ) {
              // 正常
            } else {
              // 扣库存失败，异常出去
              throw new Error('库存不足！');
            }
          }
        });

      console.log('batchBuckleStock:', batchBuckleStock);
    }

    let oSN = 'O' + date.getTimeStamp() + comm.randNumberCode(4);

    // 添加订单
    let order = await ctx.orm().ftOrders.create({
      oSN,
      userId: param.userId,
      oType: 1,
      oTypeName: dic.orderTypeEnum[`1`],
      parentOSN: '',
      oDisId: userDiscount ? userDiscount.id : 0,
      oDisName: userDiscount ? userDiscount.disTitle : '',
      oDisPrice: orderDisPrice,
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
      originalPrice: orderOriginalPrice,
      sellPrice: orderSellPrice,
      totalPrice: orderTotalPrice,
      isSettlement: 0,
      settlementPrice: 0,
      addTime: date.formatDate(),
      isDel: 0,
      isRevertStock: 0,
      revertStockName: '未还原库存',
      oRemark: param.oRemark,
      oPickDay: pickTime,
      oPickTime: date.formatDate(date.addDay(new Date(), pickTime)),
      proNum: orderProNum,
      payPrice: 0
    });

    // 添加订单商品
    let orderPros = groupProList.map(m => {
      return {
        oId: order.id,
        oSN: order.oSN,
        userId: order.userId,
        proId: m.proId,
        proTitle: m.title,
        proMasterImg: m.masterImg,
        specInfo: m.specInfo,
        proType: m.proType,
        proTypeName: m.proTypeName,
        pickTime: m.pickTime,
        originalPrice: m.originalPrice,
        sellPrice: m.sellPrice,
        costPrice: m.costPrice,
        proProfit: m.proProfit,
        pNum: m.pNum,
        totalPrice: m.sellPrice * m.pNum,
        totalProfit: m.proProfit * m.pNum,
        isLimit: m.isLimit,
        groupId: group.id,
        groupName: group.gName,
        rebateType: m.rebateType,
        rebateTypeName: m.rebateTypeName,
        rebateRate: m.rebateRate,
        rebatePrice: m.rebatePrice,
        totalRebatePrice: m.rebatePrice * m.pNum,
        gProType: m.gProType,
        gProTypeName: m.gProTypeName,
        roundId: m.roundId,
        addTime: date.formatDate(),
        isDel: 0
      };
    });
    await ctx.orm().ftOrderProducts.bulkCreate(orderPros);

    // 添加收货地址
    await ctx.orm().ftOrderRecAddress.create({
      oId: order.id,
      oSn: order.oSN,
      userId: order.userId,
      recName: userRec.recName,
      recPhone: userRec.recPhone,
      recSiteName: group.gSiteName,
      recAddress: userRec.recAddress,
      recPName: userRec.recPName,
      recCName: userRec.recCName,
      recAName: userRec.recAName,
      addTime: date.formatDate(),
      isDel: 0
    });

    // 更新团订单数量
    await ctx.orm().ftGroups.update(
      {
        gOrderNum: sequelize.literal(`gOrderNum + 1`)
      },
      {
        where: {
          id: group.id,
          isDel: 0
        }
      }
    );

    if (orderSellPrice <= 0) {
      // 更新订单支付状态
      let result = await ctx.orm().ftOrders.update(
        {
          isPay: 1,
          payTime: date.formatDate(),
          oStatus: 5,
          oStatusName: dic.orderStatusEnum[`5`],
          oPickTime: date.formatDate(date.addDay(new Date(), order.oPickDay)),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: order.id,
            oStatus: 1,
            isPay: 0,
            isDel: 0
          }
        }
      );

      // 订单状态更新成功
      if (result && result.length > 0 && result[0] > 0) {
        await splitOrder(ctx, order);
      }
    }

    // 更新订单佣金
    let settlementPrice = orderPros.reduce((total, curr) => {
      return total + parseFloat(curr.totalRebatePrice);
    }, 0);
    if (settlementPrice > 0) {
      await ctx.orm().ftOrders.update(
        {
          settlementPrice: settlementPrice
        },
        {
          where: {
            id: order.id
          }
        }
      );
    }

    ctx.body = {
      id: order.id,
      oSn: order.oSN
    };
  },
  cancel: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.oSN);

    let order = await ctx.orm().ftOrders.findOne({
      where: {
        oSN: param.oSN,
        userId: param.userId,
        oStatus: 1,
        isDel: 0
      }
    });

    cp.isNull(order, '订单不存在！');

    let result = await ctx.orm().ftOrders.update(
      {
        oStatus: 999,
        oStatusName: dic.orderStatusEnum[`999`],
        updateTime: date.formatDate()
      },
      {
        where: {
          id: order.id,
          userId: order.userId,
          oStatus: 1,
          isPay: 0,
          isDel: 0
        }
      }
    );

    if (result && result.length > 0 && result[0] > 0) {
      // 退出成团
      let orderGroupProducts = await ctx.orm().ftOrderProducts.findAll({
        where: {
          oId: order.id,
          gProType: 3,
          isDel: 0
        }
      });

      for (let i = 0, j = orderGroupProducts.length; i < j; i++) {
        await ctx.orm().ftGroupProductRounds.update(
          {
            updateTime: date.formatDate(),
            isDel: 1
          },
          {
            where: {
              groupId: orderGroupProducts[i].groupId,
              proId: orderGroupProducts[i].proId,
              roundId: orderGroupProducts[i].roundId,
              userId: orderGroupProducts[i].userId,
              isDel: 0
            }
          }
        );

        ctx.orm().ftGroupProductRounds.update(
          {
            isOver: 0,
            updateTime: date.formatDate()
          },
          {
            where: {
              groupId: orderGroupProducts[i].groupId,
              proId: orderGroupProducts[i].proId,
              roundId: orderGroupProducts[i].roundId,
              isDel: 0
            }
          }
        );
      }

      // 退券
      if (order.oDisId && order.oDisId > 0) {
        // 设置优惠券有效
        ctx.orm().ftUserDiscounts.update(
          {
            isUse: 0,
            updateTime: date.formatDate()
          },
          {
            where: {
              id: order.oDisId,
              userId: order.userId,
              isUse: 1,
              isDel: 0
            }
          }
        );
      }
    }
  },
  generationAliTradeNo: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.oSN);

    let order = await ctx.orm().ftOrders.findOne({
      where: {
        oSN: param.oSN,
        userId: param.userId,
        oStatus: 1,
        isPay: 0,
        isDel: 0
      }
    });

    cp.isNull(order, '订单不存在！');

    let user = await ctx.orm().ftUsers.findOne({
      where: {
        id: order.userId,
        isDel: 0
      }
    });

    cp.isNull(order, '用户不存在！');

    // 获取统一收单交易创建接口
    const resultAli = await ali.exec('alipay.trade.create', {
      notifyUrl: aliPayNotifyUrl,
      bizContent: {
        outTradeNo: order.oSN,
        totalAmount: order.sellPrice,
        subject: '得果且果支付订单',
        buyerId: user.alipayUserId
      }
    });

    if (resultAli && resultAli.tradeNo && resultAli.outTradeNo) {
      ctx.body = {
        tradeNo: resultAli.tradeNo,
        outTradeNo: resultAli.outTradeNo
      };
    } else {
      ctx.body = {};
    }
  },
  notify: async ctx => {
    let param = ctx.request.body || {};

    if (ali.checkNotifySign(param)) {
      let oSn = param.out_trade_no || '';
      let totalAmount = parseFloat(param.total_amount) || 0;
      let receiptAmount = parseFloat(param.receiptAmount) || 0;

      let order = await ctx.orm().ftOrders.findOne({
        where: {
          oSN: oSn,
          sellPrice: totalAmount,
          oStatus: 1,
          isPay: 0,
          isDel: 0
        }
      });

      if (order) {
        // 更新订单支付状态
        let result = await ctx.orm().ftOrders.update(
          {
            isPay: 1,
            payTime: date.formatDate(),
            payPrice: receiptAmount,
            oStatus: 5,
            oStatusName: dic.orderStatusEnum[`5`],
            oPickTime: date.formatDate(date.addDay(new Date(), order.oPickDay)),
            updateTime: date.formatDate()
          },
          {
            where: {
              id: order.id,
              oStatus: 1,
              isPay: 0,
              isDel: 0
            }
          }
        );

        // 订单状态更新成功
        if (result && result.length > 0 && result[0] > 0) {
          await splitOrder(ctx, order);
        }

        // 记录支付信息
        ctx.orm().ftOrderPayInfo.create({
          oSn: oSn,
          payContent: JSON.stringify(param),
          addTime: date.formatDate()
        });
      }
    } else {
      console.log('支付签名验证失败!');
    }
  },
  off: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.groupUserId);
    cp.isEmpty(param.oSN);

    let order = await ctx.orm().ftOrders.findOne({
      where: {
        oSN: param.oSN,
        groupUserId: param.groupUserId,
        oStatus: 2,
        oShipStatus: 4,
        isDel: 0
      }
    });

    if (order) {
      // 更新订单状态
      await ctx.orm().ftOrders.update(
        {
          oStatus: 3,
          oStatusName: dic.orderStatusEnum[`3`],
          settlementTime:
            order.oType === 1
              ? date.formatDate(date.addDay(new Date(), 7))
              : date.formatDate(),
          oStatusTime: date.formatDate(),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: order.id,
            groupUserId: param.groupUserId,
            oStatus: 2,
            oShipStatus: 4,
            isDel: 0
          }
        }
      );
    }
  },
  comment: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.oSN);
    cp.isEmpty(param.userId);
    cp.isEmpty(param.starNum);
    cp.isEmpty(param.commentRemark);

    let order = await ctx.orm().ftOrders.findOne({
      where: {
        oSN: param.oSN,
        userId: param.userId,
        oStatus: 3,
        isDel: 0
      }
    });

    cp.isNull(order, '订单不存在！');

    await ctx.orm().ftOrderComments.create({
      orderId: order.id,
      orderSn: order.oSN,
      userId: order.userId,
      starNum: param.starNum,
      commentRemark: param.commentRemark,
      addTime: date.formatDate(),
      isDel: 0
    });

    await ctx.orm().ftOrders.update(
      {
        oStatus: 4,
        oStatusName: dic.orderStatusEnum[`4`],
        oStatusTime: date.formatDate(),
        updateTime: date.formatDate()
      },
      {
        where: {
          id: order.id,
          userId: order.userId,
          oStatus: 3,
          isDel: 0
        }
      }
    );
  },
  getUserComment: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);

    let comments = await ctx.orm().ftOrderComments.findAll({
      where: {
        userId: param.userId,
        isDel: 0
      },
      order: [['addTime', 'DESC']]
    });

    let orders = await ctx.orm().ftOrders.findAll({
      where: {
        id: {
          $in: comments.map(m => {
            return m.orderId;
          })
        },
        isDel: 0
      }
    });

    let orderPros = await ctx.orm().ftOrderProducts.findAll({
      where: {
        oId: {
          $in: orders.map(m => {
            return m.id;
          })
        },
        isDel: 0
      }
    });

    ctx.body = {
      comments,
      orders,
      orderPros
    };
  },
  getGroupNewOrders: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.groupId);

    let getGroupNewOrderSql = `select u.headImg, u.nickName, op.proTitle, op.pNum from ftOrders o 
    inner join ftOrderProducts op on op.oId = o.id and op.isDel = 0 
    inner join ftUsers u on u.id = o.userId and u.isDel = 0 
    where 
      o.groupId = ${param.groupId} and 
      o.isDel = 0 
    order by o.addTime desc limit 20;`;

    let result = await ctx.orm().query(getGroupNewOrderSql);

    ctx.body = result;
  },
  getNotSettlementPrice: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.groupUserId);

    let getAccountOrderSql = `select groupUserId, convert(sum(settlementPrice), DECIMAL) settlementPrice from ftOrders where groupUserId = ${param.groupUserId} and oStatus in (3,4) and isSettlement = 0 and isDel = 0 group by groupUserId;`;

    let result = await ctx.orm().query(getAccountOrderSql);

    if (result && result.length > 0) {
      ctx.body = {
        groupUserId: result[0].groupUserId,
        settlementPrice: result[0].settlementPrice
      };
    } else {
      ctx.body = {
        groupUserId: param.groupUserId,
        settlementPrice: 0
      };
    }
  }
};
