/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-06 00:31:41
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
const sequelize = require('sequelize').Sequelize;
const config = require('../config.js');
const date = require('../utils/date');
const dic = require('../controllers/fruit/fruitEnum');

// 自动更新团购状态
let automaticUpdateGroupStatusJob = null;
// 自动更新团购状态
let automaticUpdateUserDiscountStatusJob = null;
// 自动取消订单
let automaticCancelOrder = null;
// 自动还原订单库存
let automaticOrderRevertStock = null;
// 自动结算佣金
let automaticAccountSettlement = null;
// 自动完成超过30分钟的团购
let automaticCompleteOver30MinutesRounds = null;
let ctx = {};
let next = function() {
  return true;
};

// 更新团购状态
async function updateGroupStatus() {
  // 获取所有未开始和已开始的团购
  let groups = await ctx.orm().ftGroups.findAll({
    where: {
      gStatus: {
        $in: [1, 2]
      },
      isDel: 0
    }
  });

  if (groups && groups.length > 0) {
    for (let i = 0, j = groups.length; i < j; i++) {
      let nowGroupStatus = dic.groupStatusEnum.generationStatus(groups[i].gStartTime, groups[i].gEndTime);

      if (groups[i].gStatus !== nowGroupStatus) {
        // 更新团购状态
        ctx.orm().ftGroups.update(
          {
            gStatus: nowGroupStatus,
            gStatusName: dic.groupStatusEnum[`${nowGroupStatus}`],
            updateTime: date.formatDate()
          },
          {
            where: {
              id: groups[i].id,
              gStatus: {
                $in: [1, 2]
              },
              isDel: 0
            }
          }
        );
      }
    }
  }

  console.log('updateGroupStatus is over:%s', date.formatDate());
}

// 更新用户优惠券状态
async function updateUserDiscount() {
  await ctx.orm().ftUserDiscounts.update(
    {
      isOver: 1,
      updateTime: date.formatDate()
    },
    {
      where: {
        disEndTime: {
          $lt: date.formatDate()
        },
        isUse: 0,
        isOver: 0,
        isDel: 0
      }
    }
  );

  console.log('updateUserDiscount is over:%s', date.formatDate());
}

// 自动取消订单30分钟未支付订单
async function cancelOrder() {
  let orders = await ctx.orm().ftOrders.findAll({
    where: {
      addTime: {
        $lt: date.formatDate(date.getTimeStamp(-30 * 60), 'YYYY-MM-DD HH:mm:ss', true)
      },
      oStatus: 1,
      isPay: 0,
      isDel: 0
    }
  });

  if (orders && orders.length > 0) {
    for (let i = 0, j = orders.length; i < j; i++) {
      let order = orders[i];
      let result = await ctx.orm().ftOrders.update(
        {
          oStatus: 999,
          oStatusName: dic.orderStatusEnum[`999`],
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
    }
  }

  console.log('cancelOrder is over:%s', date.formatDate());
}

// 还原已取消订单库存
async function orderRevertStock() {
  let orders = await ctx.orm().ftOrders.findAll({
    where: {
      oStatus: 999,
      isRevertStock: 0,
      isDel: 0
    }
  });

  if (orders && orders.length > 0) {
    let orderProListSql = `select proId, sum(pNum) pNum from ftOrderProducts 
    where 
      oId in (${orders
        .map(m => {
          return m.id;
        })
        .join(',')}) and 
      isDel = 0 
    group by proId;`;
    let orderProList = await ctx.orm().query(orderProListSql);

    if (orderProList && orderProList.length > 0) {
      for (let i = 0, j = orderProList.length; i < j; i++) {
        // 还原库存
        await ctx.orm().ftProducts.update(
          {
            stock: sequelize.literal(`stock + ${orderProList[i].pNum}`),
            saleNum: sequelize.literal(`saleNum - ${orderProList[i].pNum}`)
          },
          {
            where: {
              id: orderProList[i].proId,
              isDel: 0
            }
          }
        );
      }

      // 更新订单
      await ctx.orm().ftOrders.update(
        {
          isRevertStock: 1,
          revertStockName: '已还原库存'
        },
        {
          where: {
            id: {
              $in: orders.map(m => {
                return m.id;
              })
            }
          }
        }
      );
    }
  }

  console.log('orderRevertStock is over:%s', date.formatDate());
}

// 帐户结算（每天0：10结算7天前订单）
async function accountSettlement() {
  let day = parseInt(date.formatDate(new Date(), 'YYYYMMDD'));
  let today = date.formatDate();

  // 插入结算表
  let insertAccountOrderSql = `insert into ftAccountOrders (day,userId,orderId,orderSN,orderType,orderTypeName,settlementPrice,addTime,isDel) 
  select ${day},groupUserId,id,oSN,oType,oTypeName,settlementPrice,now(),0 from ftOrders where settlementTime <= '${today}' and oStatus in (3,4) and isSettlement = 0 and isDel = 0;`;
  await ctx.orm().query(insertAccountOrderSql, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });

  // 获取团长结算
  let getAccountOrderSql = `select groupUserId, convert(sum(settlementPrice), DECIMAL) settlementPrice from ftOrders where settlementTime <= '${today}' and oStatus in (3,4) and isSettlement = 0 and isDel = 0 group by groupUserId;`;
  let getAccountOrder = await ctx.orm().query(getAccountOrderSql);
  if (getAccountOrder && getAccountOrder.length > 0) {
    for (let i = 0, j = getAccountOrder.length; i < j; i++) {
      // 更新团长结算
      let result = await ctx.orm().ftAccount.update(
        {
          totalBrokerage: sequelize.literal(`totalBrokerage + ${getAccountOrder[i].settlementPrice}`),
          curOverPrice: sequelize.literal(`curOverPrice + ${getAccountOrder[i].settlementPrice}`)
        },
        {
          where: {
            userId: getAccountOrder[i].groupUserId,
            isDel: 0
          }
        }
      );

      if (result && result.length > 0 && result[0] > 0) {
        // 更新订单结算状态
        let updateAccountOrderSql = `update ftOrders set isSettlement = 1 where groupUserId = ${getAccountOrder[i].groupUserId} and settlementTime <= '${today}' and oStatus in (3,4) and isSettlement = 0 and isDel = 0;`;
        await ctx.orm().query(updateAccountOrderSql, {}, { type: ctx.orm().sequelize.QueryTypes.UPDATE });
      }
    }
  }

  console.log('accountSettlement is over:%s', date.formatDate());
}

// 完成超过30分钟的团购
async function completeOver30MinutesRounds() {
  let groupProductRounds = await ctx.orm().ftGroupProductRounds.findAll({
    where: {
      addTime: {
        $lt: date.formatDate(date.getTimeStamp(-30 * 60), 'YYYY-MM-DD HH:mm:ss', true)
      },
      isOver: 0,
      isDel: 0
    }
  });

  if (groupProductRounds && groupProductRounds.length > 0) {
    for (let i = 0, j = groupProductRounds.length; i < j; i++) {
      await ctx.orm().ftGroupProductRounds.update(
        {
          isOver: 1,
          overTime: date.formatDate(),
          updateTime: date.formatDate()
        },
        {
          where: {
            groupId: groupProductRounds[i].groupId,
            proId: groupProductRounds[i].proId,
            roundId: groupProductRounds[i].roundId,
            isOver: 0,
            isDel: 0
          }
        }
      );
    }
  }

  console.log('over30MinutesRounds is over:%s', date.formatDate());
}

async function main() {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 更新团购状态，每10秒执行一次
  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 10 === 0) {
      automaticRule.second.push(i);
    }
  }

  automaticUpdateGroupStatusJob = schedule.scheduleJob(automaticRule, updateGroupStatus);
  automaticUpdateUserDiscountStatusJob = schedule.scheduleJob(automaticRule, updateUserDiscount);
  automaticCancelOrder = schedule.scheduleJob(automaticRule, cancelOrder);
  automaticOrderRevertStock = schedule.scheduleJob(automaticRule, orderRevertStock);
  automaticCompleteOver30MinutesRounds = schedule.scheduleJob(automaticRule, completeOver30MinutesRounds);

  automaticAccountSettlement = schedule.scheduleJob('0 10 0 * * *', accountSettlement);
}

process.on('SIGINT', function() {
  if (automaticUpdateGroupStatusJob) {
    automaticUpdateGroupStatusJob.cancel();
  }

  if (automaticUpdateUserDiscountStatusJob) {
    automaticUpdateUserDiscountStatusJob.cancel();
  }

  if (automaticCancelOrder) {
    automaticCancelOrder.cancel();
  }

  if (automaticOrderRevertStock) {
    automaticOrderRevertStock.cancel();
  }

  if (automaticCompleteOver30MinutesRounds) {
    automaticCompleteOver30MinutesRounds.cancel();
  }

  if (automaticAccountSettlement) {
    automaticAccountSettlement.cancel();
  }

  process.exit(0);
});

process.on('exit', function() {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
