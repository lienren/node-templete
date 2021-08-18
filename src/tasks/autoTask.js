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

// 自动取消订单，还原订单库存
let automaticOrderRevertStock = null;
let automaticCouponExpired = null;
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
      // 还原商品销售量
      await ctx.orm().pms_product.update({
        sale: sequelize.literal(`sale - ${orderPros[i].product_quantity}`)
      }, {
        where: {
          id: orderPros[i].product_id
        }
      })

      // 还原优惠券


      // 记录订单取消
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

// 自动设置过期优惠券
async function couponExpired () {
  let sql = `select id from sms_coupon where end_time < now();`;

  let coupons = await ctx.orm().query(sql);

  if (coupons && coupons.length > 0) {
    await ctx.orm().sms_coupon_history.update({
      use_status: 2
    }, {
      where: {
        coupon_id: {
          $in: coupons.map(m => m.id)
        },
        use_status: 0
      }
    });
  }

  console.log('couponExpired is over:%s', date.formatDate());
}

// 自动更新商品库存
async function refreshProductStock () {

  // 更新销售量的sql
  /*
  update pms_product p, (
  select m.product_id, sum(m.product_quantity) sale from oms_order o
  inner join oms_order_item m on m.order_id = o.id
  where o.`status` > 0
  group by m.product_id) a
  set p.sale = a.sale
  where p.id = a.product_id; 
  */

  let sql = `update pms_product p, (select product_id, sum(stock) stock from pms_sku_stock group by product_id) a 
  set p.stock = a.stock where p.id = a.product_id`;

  await ctx.orm().query(sql, {}, { type: ctx.orm().sequelize.QueryTypes.UPDATE });

  console.log('refreshProductStock is over:%s', date.formatDate());
}

// 订单自动确认收货
async function autoConfirmOrder () {
  let now = date.formatDate();
  let sql = `select id from oms_order where status = 2 and confirm_status = 0 and delete_status = 0 and DATE_ADD(delivery_time,INTERVAL auto_confirm_day day) < now();`;

  let orders = await ctx.orm().query(sql);

  if (orders && orders.length > 0) {
    for (let i = 0, j = orders.length; i < j; i++) {
      let updateOrder = await ctx.orm().oms_order.update({
        confirm_status: 1,
        receive_time: date.formatDate(),
        modify_time: date.formatDate()
      }, {
        where: {
          id: orders[i].id,
          status: 2,
          confirm_status: 0,
          delete_status: 0
        }
      })

      if (updateOrder && updateOrder.length > 0 && updateOrder[0] > 0) {
        ctx.orm().oms_order_operate_history.create({
          order_id: orders[i].id,
          operate_man: `系统自动`,
          create_time: date.formatDate(),
          order_status: 2,
          note: `系统在${now}订单确认收货`
        })
      }
    }
  }

  console.log('autoConfirmOrder is over:%s', date.formatDate());
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
    async () => {
      await orderRevertStock();
      await refreshProductStock();
      await autoConfirmOrder();
    }
  );

  automaticCouponExpired = schedule.scheduleJob(
    automaticRule,
    couponExpired
  );
}

process.on('SIGINT', function () {
  if (automaticOrderRevertStock) {
    automaticOrderRevertStock.cancel();
  }

  if (automaticCouponExpired) {
    automaticCouponExpired.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
