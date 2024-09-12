/*
 * @Author: Lienren
 * @Date: 2021-07-19 10:14:03
 * @LastEditTime: 2021-08-05 16:07:09
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/mall/notify.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const path = require('path');
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
  },
  alipay: async (ctx) => {
    let info = ctx.request.body;
    console.log('alipay:', info);

    let orderSn = info.out_trade_no || '';
    let payMoney = Math.floor(parseFloat(info.total_amount) * 100) / 100

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
          note: `${member.nickname}在${now}用支付宝支付成功`
        })
      }

      /*
       { gmt_create: '2021-08-05 16:03:04',
        charset: 'utf-8',
        seller_email: '383999809@qq.com',
        subject: '商城订单',
        sign:
          'PdAqHcSmT4JeOaDhephItYGS430P4ZP2uyuHC8zMkGV142PnOjG1GD5bhftgZ2UT/kV1pnKuKTk67xX0fEmp1tBkgQrUHcGbhz84YQ/TDgrva/2zcsSAMD0lE6KVwhcAsd8MlluLEQpwkmWXQHbDZsgtyfYhVQ+1mOIRmE3/8FKp/xTrb3vn9ZFyscTBX+R54t2aVdzZyO+qOkUvPYo9OxrNLTsnjC2oj1XWirBFDapEaVYC/s3dASafa66jxJqHY09N0DnEdPSPflBqie/LvvDRQz3ybABUSj38IQy8RrI/MLKE+4d8rutBOaw2TF1lt9S5w1pGNniX1vPhfZZVBg==',
        body: '商城商品支付订单',
        buyer_id: '2088102100167493',
        invoice_amount: '0.01',
        notify_id: '2021080500222160305067491432106242',
        fund_bill_list: '[{"amount":"0.01","fundChannel":"PCREDIT"}]',
        notify_type: 'trade_status_sync',
        trade_status: 'TRADE_SUCCESS',
        receipt_amount: '0.01',
        buyer_pay_amount: '0.01',
        app_id: '2021002161667283',
        sign_type: 'RSA2',
        seller_id: '2088141744130267',
        gmt_payment: '2021-08-05 16:03:04',
        notify_time: '2021-08-05 16:03:05',
        version: '1.0',
        out_trade_no: '1628033475998442923',
        total_amount: '0.01',
        trade_no: '2021080522001467491455625433',
        auth_app_id: '2021002161667283',
        buyer_logon_id: 'lie***@vip.qq.com',
        point_amount: '0.00' }
      */
    }
  }
}