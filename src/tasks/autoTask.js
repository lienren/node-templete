/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-27 17:48:08
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
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
}

// 自动取消订单30分钟未支付订单
async function cancelOrder() {
  await ctx.orm().ftOrders.update(
    {
      oStatus: 999,
      oStatusName: dic.orderStatusEnum[`999`],
      updateTime: date.formatDate()
    },
    {
      where: {
        addTime: {
          gt: date.formatDate(date.getTimeStamp(-30 * 60), 'YYYY-MM-DD HH:mm:ss', true)
        },
        oStatus: 1,
        isPay: 0,
        isDel: 0
      }
    }
  );
}

// 还原已取消订单库存
async function orderRevertStock() {}

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

  process.exit(0);
});

process.on('exit', function() {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
