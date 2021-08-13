/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-18 15:22:29
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
const sequelize = require('sequelize').Sequelize;
const config = require('../config.js');
const date = require('../utils/date');
const dic = require('../controllers/fruit/fruitEnum');

// 自动取消订单，还原订单库存
let automaticOrderRevertStock = null;
let ctx = {};
let next = function () {
  return true;
};

// 自动取消订单，还原订单库存
async function orderRevertStock () {
  let now = date.formatDate();
  let sql = `select m.product_sku_id, m.product_quantity, o.id orderid, o.coupon_id, o.create_time from oms_order_item m 
  inner join oms_order o on o.id = m.order_id 
  where o.status = 0 and now() > DATE_ADD(o.create_time, INTERVAL 24 HOUR);`;

  let orderPros = await ctx.orm().query(sql);

  for (let i = 0, j = orderPros.length; i < j; i++) {
    // 还原库存
    await ctx.orm().pms_sku_stock.update(
      {
        stock: sequelize.literal(`stock + ${orderPros[i].product_quantity}`),
        sale: sequelize.literal(`sale - ${orderPros[i].product_quantity}`)
      },
      {
        where: {
          id: orderPros[i].product_sku_id
        }
      }
    );

    // 取消订单
    let update = await ctx.orm().oms_order.update({
      status: 999,
      modify_time: now
    }, {
      where: {
        id: orderPros[i].orderid,
        status: 0
      }
    })

    if (update && update.length > 0 && update[0] > 0) {
      await ctx.orm().oms_order_operate_history.create({
        order_id: orderPros[i].orderid,
        operate_man: '系统自动',
        create_time: now,
        order_status: 999,
        note: `系统在${now}取消订单`
      })
    }
  }

  console.log('orderRevertStock is over:%s', date.formatDate());
}

async function main () {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 每5分钟执行一次
  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.minute = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 5 === 0) {
      automaticRule.minute.push(i);
    }
  }

  automaticOrderRevertStock = schedule.scheduleJob(
    automaticRule,
    orderRevertStock
  );
}

process.on('SIGINT', function () {
  if (automaticOrderRevertStock) {
    automaticOrderRevertStock.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
