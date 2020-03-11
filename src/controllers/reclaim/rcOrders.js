/*
 * @Author: Lienren
 * @Date: 2019-11-21 14:34:07
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-03-11 13:46:13
 */
'use strict';

const assert = require('assert');
const Sequelize = require('sequelize');
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
  },
  sumitOrderByApplet: async ctx => {
    let openId = ctx.request.body.openId || '';
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
    let formId = ctx.request.body.formId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');
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
      // 用户不存在，创建用户
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
      oo_channelName: channelName,
      oo_formid: formId
    });

    ctx.body = {
      id: order.oo_id,
      sn: order.oo_number
    };
  },
  getUserOrders: async ctx => {
    let openId = ctx.request.body.openId || '';

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    if (user) {
      let result = await ctx.orm().ordinary_order.findAll({
        where: {
          u_id: user.u_id
        },
        order: [['oo_time', 'desc']]
      });

      ctx.body = result;
    } else {
      ctx.body = [];
    }
  },
  getGoodList: async ctx => {
    let goods = await ctx.orm().goods.findAll({
      where: {
        g_is_show: 1
      },
      order: [['g_time', 'desc']]
    });

    let goodsList = goods.map(m => {
      return {
        ...m.dataValues,
        g_photo: `https://www.jiangxinzhiyin.com${m.dataValues.g_photo}`,
        g_introduce: m.dataValues.g_introduce.replace(
          /src=\"/g,
          `src=\"https://www.jiangxinzhiyin.com`
        )
      };
    });

    ctx.body = goodsList;
  },
  submitOrderByGoods: async ctx => {
    let openId = ctx.request.body.openId || '';
    let goodsId = ctx.request.body.goodsId || 0;
    let goodsNum = ctx.request.body.goodsNum || 1;
    let receiveName = ctx.request.body.receiveName || '';
    let receivePhone = ctx.request.body.receivePhone || '';
    let receiveAddress = ctx.request.body.receiveAddress || '';
    let receiveDetail = ctx.request.body.receiveDetail || '';
    let remark = ctx.request.body.remark || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');
    assert.notStrictEqual(goodsId, 0, '入参不能为空！');
    assert.notStrictEqual(goodsNum, 0, '入参不能为空！');
    assert.notStrictEqual(receiveName, '', '入参不能为空！');
    assert.notStrictEqual(receivePhone, '', '入参不能为空！');
    assert.notStrictEqual(receiveAddress, '', '入参不能为空！');
    assert.notStrictEqual(receiveDetail, '', '入参不能为空！');
    assert.ok(goodsNum === 1, '商品兑换数据不正确！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    let goods = await ctx.orm().goods.findOne({
      where: {
        g_id: goodsId,
        g_is_show: 1
      },
      order: [['g_time', 'desc']]
    });

    assert.ok(user, '用户不存在！');
    assert.ok(goods, '商品不存在！');

    // 减积分
    let updateResult = await ctx.orm().user.update(
      {
        u_integral: Sequelize.literal(
          `u_integral - ${goodsNum * goods.g_integral}`
        )
      },
      {
        where: {
          u_id: user.u_id,
          u_integral: {
            $gte: goodsNum * goods.g_integral
          }
        }
      }
    );

    assert.ok(updateResult && updateResult.length > 0 && updateResult[0] > 0, '您的积分不足，不能兑换！');

    if (updateResult && updateResult.length > 0 && updateResult[0] > 0) {
      // 更新商品兑换数量
      await ctx.orm().goods.update(
        {
          g_exchange_num: Sequelize.literal(`g_exchange_num + 1`)
        },
        {
          where: {
            g_id: goods.g_id
          }
        }
      );

      // 生成订单号
      let grSn = `GN${date.getTimeStamp()}`;

      let grInfo = await ctx.orm().goods_record.create({
        g_id: goods.g_id,
        g_name: goods.g_name,
        g_photo: goods.g_photo,
        g_spec: goods.g_spec,
        g_integral: goods.g_integral,
        u_id: user.u_id,
        gr_sn: grSn,
        gr_name: receiveName,
        gr_mobile: receivePhone,
        gr_pca: receiveAddress,
        gr_address: receiveDetail,
        gr_number: goodsNum,
        gr_waybill_no: '',
        gr_state: 1,
        gr_time: date.formatDate(),
        gr_remark: remark,
        gr_integral: goodsNum * goods.g_integral
      });
    }

    ctx.body = {};
  },
  getUserOrdersByGoods: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let orders = await ctx.orm().goods_record.findAll({
      where: {
        u_id: user.u_id
      },
      order: [['gr_time', 'desc']]
    });

    let orderList = orders.map(m => {
      return {
        ...m.dataValues,
        g_photo: `https://www.jiangxinzhiyin.com${m.dataValues.g_photo}`
      };
    });

    ctx.body = orderList;
  },
  getUserReceiveAddress: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let order = await ctx.orm().goods_record.findOne({
      where: {
        u_id: user.u_id
      },
      order: [['gr_time', 'desc']]
    });

    ctx.body = {
      receiveName: order ? order.gr_name : null,
      receivePhone: order ? order.gr_mobile : null,
      receiveAddress: order ? order.gr_pca : null,
      receiveDetail: order ? order.gr_address : null
    };
  }
};
