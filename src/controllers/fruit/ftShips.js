/*
 * @Author: Lienren
 * @Date: 2019-10-28 22:43:16
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-29 16:32:48
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize').Sequelize;
const cp = require('./checkParam');
const dic = require('./fruitEnum');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

module.exports = {
  getNotShipList: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    cp.isEmpty(param.shipEndTime);

    // 小于昨天23点订单，待发货，未发货，已支付，未删除
    let where = {
      payTime: {
        $lte: param.shipEndTime
      },
      oStatus: 5,
      oShipStatus: 1,
      isPay: 1,
      isDel: 0
    };

    let total = await ctx.orm().ftOrders.count({
      where
    });
    let list = await ctx.orm().ftOrders.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['payTime']]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  generationShip: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.shipEndTime);

    let where = {
      payTime: {
        $lte: param.shipEndTime
      },
      oStatus: 5,
      oShipStatus: 1,
      isPay: 1,
      isDel: 0
    };

    let orders = await ctx.orm().ftOrders.findAll({
      where,
      order: [['payTime']]
    });

    let waitShipOrders = orders.reduce((total, curr) => {
      let find = total.find(f => {
        return f.groupId === curr.groupId && f.groupUserId === curr.groupUserId;
      });

      if (find) {
        find.orders.push({
          id: curr.id,
          oSN: curr.oSN,
          proNum: curr.proNum || 0
        });
      } else {
        total.push({
          groupId: curr.groupId,
          groupUserId: curr.groupUserId,
          orders: [
            {
              id: curr.id,
              oSN: curr.oSN,
              proNum: curr.proNum || 0
            }
          ]
        });
      }

      return total;
    }, []);

    let day = date.formatDate(new Date(), 'YYYYMMDD');
    for (let i = 0, j = waitShipOrders.length; i < j; i++) {
      let waitShipOrder = waitShipOrders[i];

      // 获取团信息
      let group = await ctx.orm().ftGroups.findOne({
        where: {
          id: waitShipOrder.groupId,
          isDel: 0
        }
      });

      // 获取团长信息
      let groupUser = await ctx.orm().ftUsers.findOne({
        where: {
          id: waitShipOrder.groupUserId,
          userType: 2,
          verifyType: 2,
          isDel: 0
        }
      });

      if (group && groupUser) {
        let shipSN = 'S' + date.getTimeStamp() + comm.randNumberCode(4);

        // 生成发货单
        let ship = await ctx.orm().ftShips.create({
          day: parseInt(day),
          shipSN: shipSN,
          groupUserId: groupUser.id,
          groupUserName: groupUser.userName,
          groupUserPhone: groupUser.userPhone,
          groupSiteName: groupUser.siteName,
          groupSitePosition: groupUser.sitePosition,
          groupSiteAddress: groupUser.siteAddress,
          groupSitePickAddress: groupUser.sitePickAddress,
          pName: groupUser.pName,
          cName: groupUser.cName,
          shipStatus: 1,
          shipStatusName: dic.shipStatusEnum[`1`],
          shipTime: date.formatDate(),
          orderNum: waitShipOrder.orders ? waitShipOrder.orders.length : 0,
          productNum:
            waitShipOrder.orders && waitShipOrder.orders.length > 0
              ? waitShipOrder.orders.reduce((total, curr) => {
                  return total + parseInt(curr.proNum);
                }, 0)
              : 0,
          addTime: date.formatDate(),
          isDel: 0,
          groupId: group.id,
          groupName: group.gName
        });

        if (ship) {
          // 生成发货订单表
          let shipOrderList = waitShipOrder.orders.map(m => {
            return {
              shipId: ship.id,
              orderId: m.id,
              orderSn: m.oSN,
              groupUserId: ship.groupUserId,
              groupUserName: ship.groupUserName,
              proNum: m.proNum,
              addTime: date.formatDate(),
              isDel: 0
            };
          });
          await ctx.orm().ftShipOrders.bulkCreate(shipOrderList);

          // 生成发货商品表
          let shipOrderProductSql = `insert into ftShipProducts (shipId, proId, proTitle, specInfo, proNum, originalPrice, sellPrice, costPrice, proProfit, totalSellPrice, totalCostPrice, totalProfit, addTime, isDel) 
        select ${
          ship.id
        }, proId, proTitle, specInfo, sum(pNum), 0, 0, 0, 0, sum(totalPrice), convert(sum(totalPrice), DECIMAL)-convert(sum(totalProfit), DECIMAL), sum(totalProfit), now(), 0 from ftOrderProducts 
        where oId in (${shipOrderList
          .map(m => {
            return m.orderId;
          })
          .join(',')}) and isDel = 0 group by proId, proTitle, specInfo;`;
          await ctx.orm().query(shipOrderProductSql, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });

          // 更新订单发货状态
          await ctx.orm().ftOrders.update(
            {
              oShipStatus: 2,
              oShipStatusName: dic.orderShipStatusEnum[`2`],
              oShipTime: date.formatDate()
            },
            {
              where: {
                id: {
                  $in: shipOrderList.map(m => {
                    return m.orderId;
                  })
                },
                oStatus: 5,
                oShipStatus: 1,
                isPay: 1,
                isDel: 0
              }
            }
          );
        }
      }
    }
  },
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.day && param.day > 0) {
      where.day = param.day;
    }

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (param.shipStatus && param.shipStatus > 0) {
      where.shipStatus = param.shipStatus;
    }

    let total = await ctx.orm().ftShips.count({
      where
    });
    let list = await ctx.orm().ftShips.findAll({
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

    let ship = await ctx.orm().ftShips.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    let shipOrders = await ctx.orm().ftShipOrders.findAll({
      where: {
        shipId: param.id,
        isDel: 0
      }
    });

    let shipProducts = await ctx.orm().ftShipProducts.findAll({
      where: {
        shipId: param.id,
        isDel: 0
      }
    });

    ctx.body = {
      ship,
      shipOrders,
      shipProducts
    };
  },
  startShip: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let ship = await ctx.orm().ftShips.find({
      where: {
        id: param.id,
        shipStatus: 1,
        isDel: 0
      }
    });
    cp.isNull(ship, '发货单不存在!');

    // 更新发货单状态
    await ctx.orm().ftShips.update(
      {
        shipStatus: 2,
        shipStatusName: dic.shipStatusEnum[`2`],
        shipTime: date.formatDate()
      },
      {
        where: {
          id: ship.id,
          shipStatus: 1,
          isDel: 0
        }
      }
    );

    // 更新订单状态
    let orders = await ctx.orm().ftShipOrders.findAll({
      where: {
        shipId: ship.id,
        isDel: 0
      }
    });

    if (orders && orders.length > 0) {
      // 更新订单状态
      await ctx.orm().ftOrders.update(
        {
          oShipStatus: 3,
          oShipStatusName: dic.orderShipStatusEnum[`3`],
          oShipTime: date.formatDate(),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: {
              $in: orders.map(m => {
                return m.orderId;
              })
            },
            isDel: 0
          }
        }
      );
    }
  },
  startSign: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.groupUserId);

    let ship = await ctx.orm().ftShips.find({
      where: {
        id: param.id,
        groupUserId: param.groupUserId,
        shipStatus: 2,
        isDel: 0
      }
    });
    cp.isNull(ship, '发货单不存在!');

    // 更新发货单状态
    await ctx.orm().ftShips.update(
      {
        shipStatus: 3,
        shipStatusName: dic.shipStatusEnum[`3`],
        shipTime: date.formatDate()
      },
      {
        where: {
          id: ship.id,
          groupUserId: ship.groupUserId,
          shipStatus: 2,
          isDel: 0
        }
      }
    );

    // 更新订单状态
    let orders = await ctx.orm().ftShipOrders.findAll({
      where: {
        shipId: ship.id,
        isDel: 0
      }
    });

    if (orders && orders.length > 0) {
      // 更新订单状态
      await ctx.orm().ftOrders.update(
        {
          oShipStatus: 4,
          oShipStatusName: dic.orderShipStatusEnum[`4`],
          oShipTime: date.formatDate(),
          oStatus: 2,
          oStatusName: dic.orderStatusEnum[`2`],
          oStatusTime: date.formatDate(),
          updateTime: date.formatDate()
        },
        {
          where: {
            id: {
              $in: orders.map(m => {
                return m.orderId;
              })
            },
            isDel: 0
          }
        }
      );
    }
  }
};
