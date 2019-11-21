/*
 * @Author: Lienren
 * @Date: 2019-11-21 14:34:07
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-21 16:20:30
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');
const http = require('../../utils/http');

module.exports = {
  getTimeLine: async ctx => {
    let result = await http.post({
      url: 'https://www.jiangxinzhiyin.com/api/time/getList',
      data: {},
      headers: {
        Token: '6a15d977a7b9ecb8960327a0e5d920f2'
      }
    });

    result = result && result.data ? result.data : result;

    if (result && result.code && result.code === '0') {
      ctx.body = result.data;
    } else {
      ctx.body = [];
    }
  },
  getWeightList: async ctx => {
    let result = await http.post({
      url: 'https://www.jiangxinzhiyin.com/api/weight/getList',
      data: {},
      headers: {
        Token: '6a15d977a7b9ecb8960327a0e5d920f2'
      }
    });

    result = result && result.data ? result.data : result;

    if (result && result.code && result.code === '0') {
      ctx.body = result.data;
    } else {
      ctx.body = [];
    }
  },
  sumitOrder: async ctx => {
    let openId = ctx.request.body.userName || '';
    let userName = ctx.request.body.userName || '';
    let userPhone = ctx.request.body.userPhone || '';
    let userSex = ctx.request.body.userSex || 1;
    let projectName = ctx.request.body.projectName || '环保再生';
    let timeLineId = ctx.request.body.timeLineId || 0;
    let weightId = ctx.request.body.weightId || 0;
    let area = ctx.request.body.area || '';
    let address = ctx.request.body.address || '';
    let remark = ctx.request.body.remark || '';
    let channelId = ctx.request.body.channelId || 1;
    let channelName = ctx.request.body.channelName || '衣森林';

    assert.notStrictEqual(userName, '', '入参不能为空！');
    assert.notStrictEqual(userPhone, '', '入参不能为空！');
    assert.notStrictEqual(timeLineId, 0, '入参不能为空！');
    assert.notStrictEqual(weightId, 0, '入参不能为空！');
    assert.notStrictEqual(area, '', '入参不能为空！');
    assert.notStrictEqual(address, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    if (!user) {
      // 查查有没有订单
      let userOrder = await ctx.orm().ordinary_order.findOne({
        where: {
          oo_mobile: userPhone
        },
        order: [['oo_time', 'desc']]
      });

      if (userOrder) {
        // 之前有下过订单
        // 获取用户信息
        user = await ctx.orm().user.findOne({
          where: {
            u_id: userOrder.u_id
          }
        });
      } else {
        // 用户不存在
        user = await ctx.orm().user.create({
          u_nick_name: userName,
          u_head: '/pic/head/default.png',
          u_openid: openId,
          u_qr_code: null,
          u_integral: 0,
          u_token: '',
          u_auth: 0,
          u_time: date.formatDate()
        });
      }
    }

    let osn = date.getTimeStamp();
    let order = await ctx.orm().ordinary_order.create({
      oo_number: osn,
      u_id: user.u_id,
      ti_id: timeLineId,
      wi_id: weightId,
      oo_address: area,
      oo_detailed_address: address,
      oo_remark: remark,
      oo_name: userName,
      oo_mobile: userPhone,
      oo_sex: userSex,
      oo_status: 0,
      oo_time: date.formatDate(),
      oo_channelId: channelId,
      oo_channelName: channelName
    });

    ctx.body = {
      id: order.oo_id,
      sn: order.oo_number
    };
  }
};
