/*
 * @Author: Lienren 
 * @Date: 2021-04-27 11:15:17 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-07-13 09:07:56
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const excel = require('../../utils/excel');
const cp = require('./checkParam');

const statusOptions = {
  0: '待付款',
  1: '待发货',
  2: '已发货',
  3: '已完成',
  4: '已关闭',
  999: '已取消'
}

const payTypeOptions = {
  0: '未选择',
  1: '支付宝',
  2: '微信',
  3: '余额',
  99: '货到付款'
}

const confirmStatusOptions = {
  0: '未确认',
  1: '已确认'
}

module.exports = {
  orderList: async (ctx) => {
    let orderSn = ctx.request.body.orderSn || '';
    let receiverKeyword = ctx.request.body.receiverKeyword;
    let status = ctx.request.body.status;
    let orderType = ctx.request.body.orderType;
    let sourceType = ctx.request.body.sourceType;
    let payType = ctx.request.body.payType;
    let createTime = ctx.request.body.createTime || '';
    let nickName = ctx.request.body.nickName || '';
    let userName = ctx.request.body.userName || '';
    let providerId = ctx.request.body.providerId || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      delete_status: 0
    }

    if (!(payType === null || payType === undefined || payType === '')) {
      where.pay_type = payType
    }

    if (providerId) {
      where.$and = [
        sequelize.literal(`exists (select * from oms_order_item where order_id = oms_order.id and provider_id = ${providerId})`)
      ]
    }

    if (nickName) {
      where.$and = [
        sequelize.literal(`exists (select * from ums_member where id = oms_order.member_id and nickname = '${nickName}')`)
      ]
    }

    if (userName) {
      where.member_username = userName
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
      where.order_type = orderType
    }

    if (!(sourceType === null || sourceType === undefined || sourceType === '')) {
      where.source_type = sourceType
    }

    if (createTime && createTime.length > 1) {
      where.create_time = {
        $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`]
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
          modifyTime: m.dataValues.modify_time,
          billSort: m.dataValues.bill_sort,
          billCompanyName: m.dataValues.bill_company_name,
          billTax: m.dataValues.bill_tax,
          billAccountBank: m.dataValues.bill_account_bank,
          billAccountNum: m.dataValues.bill_account_num,
          billAddress: m.dataValues.bill_address,
          billPhone: m.dataValues.bill_phone,
          billReceiverAddress: m.dataValues.bill_receiver_address,
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
      billSort: result.dataValues.bill_sort,
      billCompanyName: result.dataValues.bill_company_name,
      billTax: result.dataValues.bill_tax,
      billAccountBank: result.dataValues.bill_account_bank,
      billAccountNum: result.dataValues.bill_account_num,
      billAddress: result.dataValues.bill_address,
      billPhone: result.dataValues.bill_phone,
      billReceiverAddress: result.dataValues.bill_receiver_address,
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
          productAttr: m.dataValues.product_attr,
          providerId: m.dataValues.provider_id,
          providerName: m.dataValues.provider_name
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
        delivery_time: date.formatDate(),
        modify_time: date.formatDate()
      }, {
        where: {
          id: orders[i].orderId
        }
      });

      await ctx.orm().oms_order_item.update({
        is_delivery: 1,
        delivery_time: date.formatDate(),
        delivery_company: orders[i].deliveryCompany,
        delivery_sn: orders[i].deliverySn
      }, {
        where: {
          order_id: orders[i].orderId
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
  },
  exportOrders: async (ctx) => {
    let orderSn = ctx.request.body.orderSn || '';
    let receiverKeyword = ctx.request.body.receiverKeyword;
    let status = ctx.request.body.status;
    let orderType = ctx.request.body.orderType;
    let sourceType = ctx.request.body.sourceType;
    let payType = ctx.request.body.payType;
    let createTime = ctx.request.body.createTime || '';
    let nickName = ctx.request.body.nickName || '';
    let userName = ctx.request.body.userName || '';
    let providerId = ctx.request.body.providerId || 0;

    if (!Array.isArray(createTime) && createTime.indexOf(',') >= 0) {
      createTime = createTime.split(',')
    }

    let where = {
      delete_status: 0
    }

    if (!(payType === null || payType === undefined || payType === '')) {
      where.pay_type = payType
    }

    if (providerId) {
      where.$and = [
        sequelize.literal(`exists (select * from oms_order_item where order_id = oms_order.id and provider_id = ${providerId})`)
      ]
    }

    if (nickName) {
      where.$and = [
        sequelize.literal(`exists (select * from ums_member where id = oms_order.member_id and nickname = '${nickName}')`)
      ]
    }

    if (userName) {
      where.member_username = userName
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
      where.order_type = orderType
    }

    if (!(sourceType === null || sourceType === undefined || sourceType === '')) {
      where.source_type = sourceType
    }

    if (createTime && createTime.length > 1) {
      where.create_time = {
        $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`]
      }
    }

    let orders = await ctx.orm().oms_order.findAll({
      where
    });

    let orderProsWhere = {
      order_id: {
        $in: orders.map(m => {
          return m.id
        })
      }
    }
    if (providerId) {
      orderProsWhere.provider_id = providerId
    }

    let orderPros = await ctx.orm().oms_order_item.findAll({
      where: orderProsWhere
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '订单列表',
      data: []
    })
    xlsxObj.push({
      name: '订单商品列表',
      data: []
    })

    xlsxObj[0].data.push([
      '订单号',
      '创建时间',
      '会员帐号',
      '总金额',
      '支付金额',
      '运费金额',
      '促销金额',
      '积分抵扣金额',
      '优惠券抵扣金额',
      '调整折扣金额',
      '支付方式',
      '订单状态',
      '物流公司',
      '物流单号',
      '收货人姓名',
      '收货人电话',
      '收货人省/市/区',
      '收货人详细地址',
      '确认收货状态',
      '支付时间',
      '发货时间',
      '确认收货时间',
      '评价时间',
      '开票种类',
      '发票单位名称',
      '发票单位税号',
      '发票开户行',
      '发票开户行帐号',
      '收票人地址',
      '收票人电话',
      '收票人邮箱'
    ])
    for (let i = 0, j = orders.length; i < j; i++) {
      let order = orders[i];

      let arr = new Array();
      arr.push(order.order_sn || '');
      arr.push(order.create_time || '');
      arr.push(order.member_username || '');
      arr.push(order.total_amount);
      arr.push(order.pay_amount);
      arr.push(order.freight_amount);
      arr.push(order.promotion_amount);
      arr.push(order.integration_amount);
      arr.push(order.coupon_amount);
      arr.push(order.discount_amount);
      arr.push(payTypeOptions[order.pay_type]);
      arr.push(statusOptions[order.status]);
      arr.push(order.delivery_company || '');
      arr.push(order.delivery_sn || '');
      arr.push(order.receiver_name || '');
      arr.push(order.receiver_phone || '');
      arr.push(`${order.receiver_province}/${order.receiver_city}/${order.receiver_region}`);
      arr.push(order.receiver_detail_address || '');
      arr.push(confirmStatusOptions[order.confirm_status]);
      arr.push(order.payment_time || '');
      arr.push(order.delivery_time || '');
      arr.push(order.receive_time || '');
      arr.push(order.comment_time || '');

      // 发票信息
      arr.push(order.bill_sort || '');
      arr.push(order.bill_company_name || '');
      arr.push(order.bill_tax || '');
      arr.push(order.bill_account_bank || '');
      arr.push(order.bill_account_num || '');
      arr.push(order.bill_address || '');
      arr.push(order.bill_receiver_phone || '');
      arr.push(order.bill_receiver_email || '');

      xlsxObj[0].data.push(arr)
    }

    xlsxObj[1].data.push([
      '订单号',
      '商品编号',
      '商品名称',
      '商品条码',
      '商品销售单价',
      '商品购买数量',
      '商品销售总价',
      '商品支付总价',
      '优惠券抵扣金额',
      'SKU编号',
      'SKU条码',
      'SKU属性',
      '供应商名称'
    ])
    for (let i = 0, j = orderPros.length; i < j; i++) {
      let pro = orderPros[i];

      let arr = new Array();
      arr.push(pro.order_sn || '');
      arr.push(pro.product_id);
      arr.push(pro.product_name || '');
      arr.push(pro.product_sn || '');
      arr.push(pro.product_price);
      arr.push(pro.product_quantity);
      arr.push(pro.product_total);
      arr.push(pro.product_pay_amount);
      arr.push(pro.coupon_amount);
      arr.push(pro.product_sku_id);
      arr.push(pro.product_sku_code || '');
      arr.push(pro.product_attr || '');
      arr.push(pro.provider_name || '');

      xlsxObj[1].data.push(arr)
    }

    let excelFile = excel.exportMoreSheetExcel(xlsxObj);

    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  },
  exprotProviderOrders: async (ctx) => {
    let orderSn = ctx.request.body.orderSn || '';
    let receiverKeyword = ctx.request.body.receiverKeyword;
    let status = ctx.request.body.status;
    let orderType = ctx.request.body.orderType;
    let sourceType = ctx.request.body.sourceType;
    let payType = ctx.request.body.payType;
    let createTime = ctx.request.body.createTime || '';
    let nickName = ctx.request.body.nickName || '';
    let userName = ctx.request.body.userName || '';
    let providerId = ctx.request.body.providerId || 0;

    let where = {
      delete_status: 0
    }

    if (!(payType === null || payType === undefined || payType === '')) {
      where.pay_type = payType
    }

    if (providerId) {
      where.$and = [
        sequelize.literal(`exists (select * from oms_order_item where order_id = oms_order.id and provider_id = ${providerId})`)
      ]
    }

    if (nickName) {
      where.$and = [
        sequelize.literal(`exists (select * from ums_member where id = oms_order.member_id and nickname = '${nickName}')`)
      ]
    }

    if (userName) {
      where.member_username = userName
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
      where.order_type = orderType
    }

    if (!(sourceType === null || sourceType === undefined || sourceType === '')) {
      where.source_type = sourceType
    }

    if (createTime && createTime.length > 1) {
      where.create_time = {
        $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`]
      }
    }

    let orders = await ctx.orm().oms_order.findAll({
      where
    });

    let orderProsWhere = {
      order_id: {
        $in: orders.map(m => {
          return m.id
        })
      }
    }
    if (providerId) {
      orderProsWhere.provider_id = providerId
    }

    let orderPros = await ctx.orm().oms_order_item.findAll({
      where: orderProsWhere
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '订单列表',
      data: []
    })

    xlsxObj[0].data.push([
      '供应商名称',
      '商品条码',
      '商品名称',
      'SKU编号',
      'SKU条码',
      'SKU属性',
      '购买数量',
      '商品单价',
      '商品总价',
      '优惠券抵扣金额',
      '支付金额',
      '支付类型',
      '订单状态',
      '支付时间',
      '下单时间',
      '订单号',
      '收货人',
      '收货人电话',
      '收货人省市区',
      '收货人地址'
    ])

    for (let i = 0, j = orderPros.length; i < j; i++) {
      let orderPro = orderPros[i];

      let arr = new Array();
      arr.push(orderPro.provider_name || '');
      arr.push(orderPro.product_sn || '');
      arr.push(orderPro.product_name || '');
      arr.push(orderPro.product_sku_id);
      arr.push(orderPro.product_sku_code || '');
      arr.push(orderPro.product_attr || '');
      arr.push(orderPro.product_quantity);
      arr.push(orderPro.product_price);
      arr.push(orderPro.product_total);
      arr.push(orderPro.coupon_amount);
      arr.push(orderPro.product_pay_amount);

      let order = orders.find(f => f.id === orderPro.order_id);
      if (order) {
        arr.push(payTypeOptions[order.pay_type]);
        arr.push(statusOptions[order.status]);
        arr.push(order.payment_time || '');
        arr.push(order.create_time);
        arr.push(order.order_sn || '');
        arr.push(order.receiver_name || '');
        arr.push(order.receiver_phone || '');
        arr.push(`${order.receiver_province}/${order.receiver_city}/${order.receiver_region}`);
        arr.push(order.receiver_detail_address || '');
      }

      xlsxObj[0].data.push(arr)
    }

    let excelFile = excel.exportMoreSheetExcel(xlsxObj);

    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  }
}