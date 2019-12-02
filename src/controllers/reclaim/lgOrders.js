/*
 * @Author: Lienren
 * @Date: 2019-12-02 17:37:30
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-12-03 00:21:15
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');
const http = require('../../utils/http');

let orderStatusEnum = {
  '0': '未处理',
  '1': '运送中',
  '2': '已完成',
  '3': '已取消',
  '4': '待受理',
  '5': '已受理',
  '6': '异常'
};

module.exports = {
  searchOrder: async ctx => {
    let cusCode = ctx.request.body.cusCode || '';
    let userPhone = ctx.request.body.userPhone || '';

    assert.ok(!(cusCode === '' && userPhone === ''), '入参不能为空！');

    let where = {};
    if (cusCode !== '') {
      where.o_cus_code = cusCode;
    }

    if (userPhone !== '') {
      where.o_send_tel = userPhone;
    }

    // 获取用户
    let orders = await ctx.orm('logistics').orders.findAll({
      where
    });

    let data = [];

    for (let i = 0, j = orders.length; i < j; i++) {
      let w_order = await ctx.orm('logistics').warehouse.findOne({
        where: {
          w_id: orders[i].dataValues.w_id
        }
      });

      data.push({
        ...orders[i].dataValues,
        o_state_name: orderStatusEnum[`${orders[i].dataValues.o_state}`] || '未知状态',
        w_name: w_order ? w_order.dataValues.w_name : '未分配'
      });
    }

    ctx.body = data;
  }
};
