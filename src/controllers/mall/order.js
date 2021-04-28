/*
 * @Author: Lienren 
 * @Date: 2021-04-27 11:15:17 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-04-27 14:27:23
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  orderList: async (ctx) => {
    let orderSn = ctx.request.body.orderSn || '';
    let receiverKeyword = ctx.request.body.receiverKeyword;
    let status = ctx.request.body.status;
    let orderType = ctx.request.body.orderType;
    let sourceType = ctx.request.body.sourceType;
    let createTime = ctx.request.body.createTime || '';
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      delete_status: 0
    }

    if (orderSn) {
      where.order_sn = orderSn
    }

    if (receiverKeyword) {
      where.$or = [{
        receiver_name: {
          $like: `%${receiverKeyword}%`
        }
      }, {
        receiver_phone: {
          $like: `%${receiverKeyword}%`
        }
      }];
    }

    if (!(status === null || status === undefined || status === '')) {
      where.status = status
    }

    if (!(orderType === null || orderType === undefined || orderType === '')) {
      where.order_type = order_type
    }

    if (!(sourceType === null || sourceType === undefined || sourceType === '')) {
      where.source_type = source_type
    }

    if (createTime) {
      where.create_time = {
        $between: [`${createTime} 00:00:00`, `${createTime} 23:59:59`]
      }
    }

    let result = await ctx.orm().oms_order.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          memberId: m.dataValues.member_id,
          couponId: m.dataValues.coupon_id,
          orderSn: m.dataValues.order_sn,
          createTime: m.dataValues.create_time,
          memberUsername: m.dataValues.member_username,
          totalAmount: m.dataValues.total_amount,
          payAmount: m.dataValues.pay_amount,
          freightAmount: m.dataValues.freight_amount,
          promotionAmount: m.dataValues.promotion_amount,
          integrationAmount: m.dataValues.integration_amount,
          couponAmount: m.dataValues.coupon_amount,
          discountAmount: m.dataValues.discount_amount,
          payType: m.dataValues.pay_type,
          sourceType: m.dataValues.source_type,
          orderType: m.dataValues.order_type,
          deliveryCompany: m.dataValues.delivery_company,
          deliverySn: m.dataValues.delivery_sn,
          autoConfirmDay: m.dataValues.auto_confirm_day,
          promotionInfo: m.dataValues.promotion_info,
          billType: m.dataValues.bill_type,
          billHeader: m.dataValues.bill_header,
          billContent: m.dataValues.bill_content,
          billReceiverPhone: m.dataValues.bill_receiver_phone,
          billReceiverEmail: m.dataValues.bill_receiver_email,
          receiverName: m.dataValues.receiver_name,
          receiverPhone: m.dataValues.receiver_phone,
          receiverPostCode: m.dataValues.receiver_post_code,
          receiverProvince: m.dataValues.receiver_province,
          receiverCity: m.dataValues.receiver_city,
          receiverRegion: m.dataValues.receiver_region,
          receiverDetailAddress: m.dataValues.receiver_detail_address,
          confirmStatus: m.dataValues.confirm_status,
          deleteStatus: m.dataValues.delete_status,
          useIntegration: m.dataValues.use_integration,
          paymentTime: m.dataValues.payment_time,
          deliveryTime: m.dataValues.delivery_time,
          receiveTime: m.dataValues.receive_time,
          commentTime: m.dataValues.comment_time,
          modifyTime: m.dataValues.modify_time
        }
      }),
    };
  },
  orderDetail: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().oms_order.findOne({
      where: {
        id,
        delete_status: 0
      }
    });

    let orderItems = await ctx.orm().oms_order_item.findAll({
      where: {
        order_id: id
      }
    })

    let historys = await ctx.orm().oms_order_operate_history.findAll({
      where: {
        order_id: id
      },
      order: [['id', 'desc']]
    })

    ctx.body = {
      ...result.dataValues,
      memberId: result.dataValues.member_id,
      couponId: result.dataValues.coupon_id,
      orderSn: result.dataValues.order_sn,
      createTime: result.dataValues.create_time,
      memberUsername: result.dataValues.member_username,
      totalAmount: result.dataValues.total_amount,
      payAmount: result.dataValues.pay_amount,
      freightAmount: result.dataValues.freight_amount,
      promotionAmount: result.dataValues.promotion_amount,
      integrationAmount: result.dataValues.integration_amount,
      couponAmount: result.dataValues.coupon_amount,
      discountAmount: result.dataValues.discount_amount,
      payType: result.dataValues.pay_type,
      sourceType: result.dataValues.source_type,
      orderType: result.dataValues.order_type,
      deliveryCompany: result.dataValues.delivery_company,
      deliverySn: result.dataValues.delivery_sn,
      autoConfirmDay: result.dataValues.auto_confirm_day,
      promotionInfo: result.dataValues.promotion_info,
      billType: result.dataValues.bill_type,
      billHeader: result.dataValues.bill_header,
      billContent: result.dataValues.bill_content,
      billReceiverPhone: result.dataValues.bill_receiver_phone,
      billReceiverEmail: result.dataValues.bill_receiver_email,
      receiverName: result.dataValues.receiver_name,
      receiverPhone: result.dataValues.receiver_phone,
      receiverPostCode: result.dataValues.receiver_post_code,
      receiverProvince: result.dataValues.receiver_province,
      receiverCity: result.dataValues.receiver_city,
      receiverRegion: result.dataValues.receiver_region,
      receiverDetailAddress: result.dataValues.receiver_detail_address,
      confirmStatus: result.dataValues.confirm_status,
      deleteStatus: result.dataValues.delete_status,
      useIntegration: result.dataValues.use_integration,
      paymentTime: result.dataValues.payment_time,
      deliveryTime: result.dataValues.delivery_time,
      receiveTime: result.dataValues.receive_time,
      commentTime: result.dataValues.comment_time,
      modifyTime: result.dataValues.modify_time,
      orderItemList: orderItems.map(m => {
        return {
          ...m.dataValues,
          orderId: m.dataValues.order_id,
          orderSn: m.dataValues.order_sn,
          productId: m.dataValues.product_id,
          productPic: m.dataValues.product_pic,
          productName: m.dataValues.product_name,
          productBrand: m.dataValues.product_brand,
          productSn: m.dataValues.product_sn,
          productPrice: m.dataValues.product_price,
          productQuantity: m.dataValues.product_quantity,
          productSkuId: m.dataValues.product_sku_id,
          productSkuCode: m.dataValues.product_sku_code,
          productCategoryId: m.dataValues.product_category_id,
          promotionName: m.dataValues.promotion_name,
          promotionAmount: m.dataValues.promotion_amount,
          couponAmount: m.dataValues.coupon_amount,
          integrationAmount: m.dataValues.integration_amount,
          realAmount: m.dataValues.real_amount,
          giftIntegration: m.dataValues.gift_integration,
          giftGrowth: m.dataValues.gift_growth,
          productAttr: m.dataValues.product_attr
        }
      }),
      historyList: historys.map(m => {
        return {
          ...m.dataValues,
          orderId: m.dataValues.order_id,
          operateMan: m.dataValues.operate_man,
          createTime: m.dataValues.create_time,
          orderStatus: m.dataValues.order_status
        }
      })
    };
  },
  orderClose: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let note = ctx.request.body.note || '';
    let operateMan = ctx.request.body.operateMan || '';

    await ctx.orm().oms_order.update({
      status: 4,
      note,
      modify_time: date.formatDate()
    }, {
      where: {
        id: {
          $in: ids
        }
      }
    });

    let data = ids.map(orderId => {
      return {
        order_id: orderId,
        operate_man: operateMan,
        create_time: date.formatDate(),
        order_status: 4,
        note: '关闭订单'
      };
    });
    ctx.orm().oms_order_operate_history.bulkCreate(data);

    ctx.body = {}
  },
  orderDelete: async (ctx) => {
    let ids = ctx.request.body.ids || [];
    let operateMan = ctx.request.body.operateMan || '';

    await ctx.orm().oms_order.update({
      delete_status: 1,
      modify_time: date.formatDate()
    }, {
      where: {
        id: {
          $in: ids
        }
      }
    });

    let data = ids.map(orderId => {
      return {
        order_id: orderId,
        operate_man: operateMan,
        create_time: date.formatDate(),
        order_status: -1,
        note: '删除订单'
      };
    });
    ctx.orm().oms_order_operate_history.bulkCreate(data);

    ctx.body = {}
  },
  orderDelivery: async (ctx) => {
    let orders = ctx.request.body.orders || [];
    let operateMan = ctx.request.body.operateMan || '';

    for (let i = 0, j = orders.length; i < j; i++) {
      await ctx.orm().oms_order.update({
        status: 2,
        delivery_company: orders[i].deliveryCompany,
        delivery_sn: orders[i].deliverySn,
        modify_time: date.formatDate()
      }, {
        where: {
          id: orders[i].orderId
        }
      });
    }

    let data = orders.map(order => {
      return {
        order_id: order.orderId,
        operate_man: operateMan,
        create_time: date.formatDate(),
        order_status: 2,
        note: '订单发货'
      };
    });
    ctx.orm().oms_order_operate_history.bulkCreate(data);

    ctx.body = {}
  },
  orderEditReceiverInfo: async (ctx) => {
    let orderId = ctx.request.body.orderId || 0;
    let receiverName = ctx.request.body.receiverName || '';
    let receiverPhone = ctx.request.body.receiverPhone || '';
    let receiverPostCode = ctx.request.body.receiverPostCode || '';
    let receiverDetailAddress = ctx.request.body.receiverDetailAddress || '';
    let receiverProvince = ctx.request.body.receiverProvince || '';
    let receiverCity = ctx.request.body.receiverCity || '';
    let receiverRegion = ctx.request.body.receiverRegion || '';
    let status = ctx.request.body.status;
    let operateMan = ctx.request.body.operateMan || '';

    await ctx.orm().oms_order.update({
      status: status,
      receiver_name: receiverName,
      receiver_phone: receiverPhone,
      receiver_province: receiverProvince,
      receiver_city: receiverCity,
      receiver_region: receiverRegion,
      receiver_detail_address: receiverDetailAddress,
      modify_time: date.formatDate()
    }, {
      where: {
        id: orderId
      }
    });

    ctx.orm().oms_order_operate_history.create({
      order_id: orderId,
      operate_man: operateMan,
      create_time: date.formatDate(),
      order_status: status,
      note: '更新订单收货信息'
    })

    ctx.body = {}
  },
  orderEditMoneyInfo: async (ctx) => {
    let orderId = ctx.request.body.orderId || 0;
    let freightAmount = ctx.request.body.freightAmount || 0;
    let discountAmount = ctx.request.body.discountAmount || 0;
    let status = ctx.request.body.status;
    let operateMan = ctx.request.body.operateMan || '';

    await ctx.orm().oms_order.update({
      status: status,
      freight_amount: freightAmount,
      discount_amount: discountAmount,
      pay_amount: sequelize.literal(`total_amount - ${freightAmount} - ${discountAmount}`),
      modify_time: date.formatDate()
    }, {
      where: {
        id: orderId
      }
    });

    ctx.orm().oms_order_operate_history.create({
      order_id: orderId,
      operate_man: operateMan,
      create_time: date.formatDate(),
      order_status: status,
      note: '更新订单金额信息'
    })

    ctx.body = {}
  },
  orderEditNoteInfo: async (ctx) => {
    let orderId = ctx.request.body.id || 0;
    let note = ctx.request.body.note || '';
    let status = ctx.request.body.status;
    let operateMan = ctx.request.body.operateMan || '';

    await ctx.orm().oms_order.update({
      status: status,
      note: note,
      modify_time: date.formatDate()
    }, {
      where: {
        id: orderId
      }
    });

    ctx.orm().oms_order_operate_history.create({
      order_id: orderId,
      operate_man: operateMan,
      create_time: date.formatDate(),
      order_status: status,
      note: '更新订单备注信息'
    })

    ctx.body = {}
  }
}