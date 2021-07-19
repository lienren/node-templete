/*
 * @Author: Lienren
 * @Date: 2021-07-19 10:14:03
 * @LastEditTime: 2021-07-19 11:51:07
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/mall/notify.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const date = require("../../utils/date");

module.exports = {
  weipay: async (ctx) => {
    let info = ctx.request.weixin;
    console.log('weixin:', info);

    let orderSn = info.out_trade_no || '';
    let payMoney = parseInt(info.total_fee) / 100.00

    let order = await ctx.orm().oms_order.findOne({
      where: {
        order_sn: orderSn,
        status: 0
      }
    });

    if (order) {
      let now = date.formatDate();

      // 查询用户信息
      let member = await ctx.orm().ums_member.findOne({
        where: {
          id: order.member_id
        }
      });

      if (order.pay_amount <= payMoney) {
        // 支付成功
        await ctx.orm().oms_order.update({
          status: 1,
          payment_time: date.formatDate(),
          modify_time: date.formatDate()
        }, {
          where: {
            id: order.id
          }
        })

        await ctx.orm().oms_order_operate_history.create({
          order_id: order.id,
          operate_man: '用户',
          create_time: now,
          order_status: 1,
          note: `${member.nickname}在${now}用微信支付成功`
        })
      }

      ctx.reply('');
    } else {
      ctx.reply('订单号不存在!');
    }
  }
};