/*
 * @Author: Lienren 
 * @Date: 2021-04-11 23:48:19 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-07-13 09:00:31
 */
'use strict';

const path = require('path');
const assert = require('assert');
const sequelize = require('sequelize');
const _ = require('lodash');
const date = require('../../utils/date');
const ip = require('../../utils/ip');
const encrypt = require('../../utils/encrypt');
const http = require('../../utils/http');
const tenpay = require('tenpay');
const alipay = require('../../extends/ali/index')
const AlipayFormData = require('alipay-sdk/lib/form').default
const NP = require('number-precision')

/*
微信支付
中车信息
商户号：1610949193
商户名称：南车投资管理有限公司
商家简称：中车智程商旅平台
appId:wx17112a11c395f6e3（中车智程公众号）
mchid:1610949193
partnerKey:06E9561F6D35212879AE5A272FE7D6BA
*/

/*
支付宝支付
appId:2021002161667283
*/

const tenpayAPI = new tenpay({
  appid: 'wx17112a11c395f6e3',
  mchid: '1614558822',
  partnerKey: '06E9561F6D35212879AE5A272FE7D6BA',
  notify_url: 'https://mall.lixianggo.com/mall/notify/weipay'
}, true);

/* const alipayAPI = new Alipay({
  appId: '2021002161667283',
  notifyUrl: 'https://mall.lixianggo.com/mall/notify/alipay',
  rsaPrivate: path.resolve(__dirname, './pem/ali-private-key.pem'),
  rsaPublic: path.resolve(__dirname, './pem/ali-public-key.pem'),
  sandbox: false,
  signType: 'RSA'
}); */


const logisticsCompaniesToCode = {
  '极兔物流': 'jtexpress', '顺丰速运': 'shunfeng', '京东快递': 'jd', '邮政EMS': 'ems', '中通快递': 'shentong', '韵达快递': 'yunda', '圆通快递': 'yuantong', '申通快递': 'zhongtong', '德邦快递': 'debangkuaidi', '百世快递': 'huitongkuaidi', '天天快递': 'tiantian', '跨越速运': 'kuayue'
}

const logisticsStateToCode = {
  "0": "在途", "1": "揽收", "2": "疑难", "3": "签收", "4": "退签", "5": "派件", "6": "退回", "7": "转单", "10": "待清关", "11": "清关中", "12": "已清关", "13": "清关异常", "14": "拒签"
}

module.exports = {
  memberLogin: async (ctx) => {
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';

    let member = await ctx.orm().ums_member.findOne({
      attributes: ['id', 'member_level_id', 'username', 'nickname', 'phone', 'integration', 'user_company_id'],
      where: {
        username,
        password: encrypt.getMd5(`${password}|${username}`),
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入用户名和密码有误！');

    let company = await ctx.orm().cmp_info.findOne({
      where: {
        id: member.user_company_id,
        is_del: 0
      }
    });

    ctx.body = {
      ...member.dataValues,
      companyName: company ? company.name : ''
    }
  },
  memberInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let member = await ctx.orm().ums_member.findOne({
      attributes: ['id', 'member_level_id', 'username', 'nickname', 'phone', 'integration', 'user_company_id'],
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let company = await ctx.orm().cmp_info.findOne({
      where: {
        id: member.user_company_id,
        is_del: 0
      }
    });

    ctx.body = {
      ...member.dataValues,
      companyName: company ? company.name : ''
    }
  },
  memberProductList: async (ctx) => {
    let keyword = ctx.request.body.keyword || '';
    let proIds = ctx.request.body.proIds || '';
    let publishStatus = ctx.request.body.publishStatus;
    let verifyStatus = ctx.request.body.verifyStatus;
    let productSn = ctx.request.body.productSn || '';
    let productCategoryId = ctx.request.body.productCategoryId || 0;
    let brandId = ctx.request.body.brandId || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      delete_status: 0,
      publish_status: 1,
      is_del: 0
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
      }
    }

    if (proIds) {
      where.id = {
        $in: proIds.split(',')
      }
    }

    if (!(publishStatus === null || publishStatus === undefined || publishStatus === '')) {
      where.publish_status = publishStatus
    }

    if (!(verifyStatus === null || verifyStatus === undefined || verifyStatus === '')) {
      where.verify_status = verifyStatus
    }

    if (productSn) {
      where.product_sn = productSn
    }

    if (productCategoryId) {
      where.product_category_id = productCategoryId
    }

    if (brandId) {
      where.brand_id = brandId
    }

    let result = await ctx.orm().pms_product.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['sort', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          brandId: m.dataValues.brand_id,
          productCategoryId: m.dataValues.product_category_id,
          feightTemplateId: m.dataValues.feight_template_id,
          productAttributeCategoryId: m.dataValues.product_attribute_category_id,
          productSn: m.dataValues.product_sn,
          deleteStatus: m.dataValues.delete_status,
          publishStatus: m.dataValues.publish_status,
          newStatus: m.dataValues.new_status,
          recommandStatus: m.dataValues.recommand_status,
          verifyStatus: m.dataValues.verify_status,
          promotionPrice: m.dataValues.promotion_price,
          giftGrowth: m.dataValues.gift_growth,
          giftPoint: m.dataValues.gift_point,
          usePointLimit: m.dataValues.use_point_limit,
          subTitle: m.dataValues.sub_title,
          originalPrice: m.dataValues.original_price,
          lowStock: m.dataValues.low_stock,
          previewStatus: m.dataValues.preview_status,
          serviceIds: m.dataValues.service_ids,
          albumPics: m.dataValues.album_pics,
          detailTitle: m.dataValues.detail_title,
          detailDesc: m.dataValues.detail_desc,
          detailHtml: m.dataValues.detail_html,
          detailMobileHtml: m.dataValues.detail_mobile_html,
          promotionStartTime: m.dataValues.promotion_start_time,
          promotionEndTime: m.dataValues.promotion_end_time,
          promotionPerLimit: m.dataValues.promotion_per_limit,
          promotionType: m.dataValues.promotion_type,
          brandName: m.dataValues.brand_name,
          productCategoryName: m.dataValues.product_category_name,
          minSaleStock: m.dataValues.min_sale_stock
        }
      }),
    };
  },
  memberProductDetail: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      delete_status: 0,
      publish_status: 1,
      is_del: 0
    }

    let result = await ctx.orm().pms_product.findOne({
      where
    });

    let cateParentId = 0;
    if (result) {
      let cate = await ctx.orm().pms_product_category.findOne({
        where: {
          id: result.product_category_id,
          is_del: 0
        }
      })

      if (cate) {
        cateParentId = cate.parent_id;
      }
    }

    // 获取SKU信息
    let skuStockList = await ctx.orm().pms_sku_stock.findAll({
      where: {
        product_id: id
      }
    });

    if (skuStockList && skuStockList.length > 0) {
      skuStockList = skuStockList.map(m => {
        return {
          ...m.dataValues,
          productId: m.dataValues.product_id,
          skuCode: m.dataValues.sku_code,
          lowStock: m.dataValues.low_stock,
          promotionPrice: m.dataValues.promotion_price,
          lockStock: m.dataValues.lock_stock,
          spData: m.dataValues.sp_data
        }
      });
    } else {
      skuStockList = [];
    }

    // 获取商品属性
    let productAttributeValueList = await ctx.orm().pms_product_attribute_value.findAll({
      where: {
        product_id: id
      }
    })

    if (productAttributeValueList && productAttributeValueList.length > 0) {
      productAttributeValueList = productAttributeValueList.map(m => {
        return {
          ...m.dataValues,
          id: m.dataValues.product_id,
          productAttributeId: m.dataValues.product_attribute_id,
          value: m.value
        }
      })
    } else {
      productAttributeValueList = [];
    }

    ctx.body = {
      ...result.dataValues,
      brandId: result.dataValues.brand_id,
      productCategoryId: result.dataValues.product_category_id,
      cateParentId,
      feightTemplateId: result.dataValues.feight_template_id,
      productAttributeCategoryId: result.dataValues.product_attribute_category_id,
      productSn: result.dataValues.product_sn,
      deleteStatus: result.dataValues.delete_status,
      publishStatus: result.dataValues.publish_status,
      newStatus: result.dataValues.new_status,
      recommandStatus: result.dataValues.recommand_status,
      verifyStatus: result.dataValues.verify_status,
      promotionPrice: result.dataValues.promotion_price,
      giftGrowth: result.dataValues.gift_growth,
      giftPoint: result.dataValues.gift_point,
      usePointLimit: result.dataValues.use_point_limit,
      subTitle: result.dataValues.sub_title,
      originalPrice: result.dataValues.original_price,
      lowStock: result.dataValues.low_stock,
      previewStatus: result.dataValues.preview_status,
      serviceIds: result.dataValues.service_ids,
      albumPics: result.dataValues.album_pics,
      detailTitle: result.dataValues.detail_title,
      detailDesc: result.dataValues.detail_desc,
      detailHtml: result.dataValues.detail_html,
      detailMobileHtml: result.dataValues.detail_mobile_html,
      promotionStartTime: result.dataValues.promotion_start_time,
      promotionEndTime: result.dataValues.promotion_end_time,
      promotionPerLimit: result.dataValues.promotion_per_limit,
      promotionType: result.dataValues.promotion_type,
      brandName: result.dataValues.brand_name,
      productCategoryName: result.dataValues.product_category_name,
      minSaleStock: result.dataValues.min_sale_stock,
      skuStockList,
      productAttributeValueList
    };
  },
  memberCateList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0,
      show_status: 1
    }

    let result = await ctx.orm().pms_product_category.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['sort', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          parentId: m.dataValues.parent_id,
          productCount: m.dataValues.product_count,
          productUnit: m.dataValues.product_unit,
          navStatus: m.dataValues.nav_status,
          showStatus: m.dataValues.show_status
        }
      }),
    };
  },
  memberBrandList: async (ctx) => {
    let keyword = ctx.request.body.keyword || '';
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
      }
    }

    let result = await ctx.orm().pms_brand.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          firstLetter: m.dataValues.first_letter,
          showStatus: m.dataValues.show_status,
          factoryStatus: m.dataValues.factory_status,
          bigPic: m.dataValues.big_pic,
          brandStory: m.dataValues.brand_story,
          productCount: m.dataValues.product_count,
          productCommentCount: m.dataValues.product_comment_count
        }
      }),
    };
  },
  memberAddAddress: async (ctx) => {
    let member_id = ctx.request.body.member_id || 0;
    let name = ctx.request.body.name || '';
    let phone_number = ctx.request.body.phone_number || '';
    let default_status = ctx.request.body.default_status || 0;
    let post_code = ctx.request.body.post_code || '';
    let province = ctx.request.body.province || '';
    let city = ctx.request.body.city || '';
    let region = ctx.request.body.region || '';
    let detail_address = ctx.request.body.detail_address || '';

    await ctx.orm().ums_member_receive_address.create({
      member_id,
      name,
      phone_number,
      default_status,
      post_code,
      province,
      city,
      region,
      detail_address
    });

    ctx.body = {
    };
  },
  memberEditAddress: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let member_id = ctx.request.body.member_id || 0;
    let name = ctx.request.body.name || '';
    let phone_number = ctx.request.body.phone_number || '';
    let default_status = ctx.request.body.default_status || 0;
    let post_code = ctx.request.body.post_code || '';
    let province = ctx.request.body.province || '';
    let city = ctx.request.body.city || '';
    let region = ctx.request.body.region || '';
    let detail_address = ctx.request.body.detail_address || '';

    await ctx.orm().ums_member_receive_address.update({
      member_id,
      name,
      phone_number,
      default_status,
      post_code,
      province,
      city,
      region,
      detail_address
    }, {
      where: {
        id
      }
    });

    ctx.body = {
    };
  },
  memberAddressList: async (ctx) => {
    let member_id = ctx.request.body.member_id || 0;

    let result = await ctx.orm().ums_member_receive_address.findAll({
      where: {
        member_id
      }
    });

    ctx.body = result;
  },
  memberGetAddress: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().ums_member_receive_address.findOne({
      where: {
        id
      }
    });

    ctx.body = result;
  },
  memberSubmitOrder: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let address = ctx.request.body.address || null;
    let goods = ctx.request.body.goods || null;

    assert.ok(address != null, '收货地址信息不能为空！');
    assert.ok(goods != null, '订单商品信息不能为空！');

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    // 获取收货地址信息
    let memberAdd = await ctx.orm().ums_member_receive_address.findOne({
      where: {
        id: address.id
      }
    });


    assert.ok(memberAdd != null, '收货地址不存在！');

    // 拉取商品SKU清单计算金额，比较用户余额是否足够，减去用户余额
    let orderPrice = 0;
    let orderItems = [];
    for (let i = 0, j = goods.length; i < j; i++) {
      let sku = await ctx.orm().pms_sku_stock.findOne({
        where: {
          id: goods[i].id,
          stock: {
            $gte: goods[i].num
          }
        }
      })

      if (sku) {
        let product = await ctx.orm().pms_product.findOne({
          where: {
            id: sku.product_id,
            delete_status: 0,
            publish_status: 1,
            is_del: 0
          }
        })

        if (product) {
          let productTotal = sku.price * goods[i].num;
          let productPayAmount = productTotal;
          orderPrice += productTotal

          orderItems.push({
            order_id: 0,
            order_sn: '',
            product_id: product.id,
            product_pic: product.pic,
            product_name: product.name,
            product_brand: product.brand_name,
            product_sn: product.product_sn,
            product_price: sku.price,
            product_total: productTotal,
            product_pay_amount: productPayAmount,
            product_quantity: goods[i].num,
            product_sku_id: sku.id,
            product_sku_code: sku.sku_code,
            product_category_id: product.product_category_id,
            promotion_name: '',
            promotion_amount: 0,
            coupon_amount: 0,
            integration_amount: 0,
            real_amount: 0,
            gift_integration: 0,
            gift_growth: 0,
            product_attr: JSON.stringify(goods[i].attr),
            is_comment: 0,
            comment_star: null,
            comment_content: null,
            provider_id: product.provider_id,
            provider_name: product.provider_name,
            is_delivery: 0
          })
        } else {
          assert.ok(false, `【${goods[i].goods.name}】已下架`);
        }
      } else {
        assert.ok(false, `【${goods[i].goods.name}】库存不足`);
      }
    }

    // 拉取商品SKU清单，并减库存
    for (let i = 0, j = goods.length; i < j; i++) {
      let updateStock = await ctx.orm().pms_sku_stock.update({
        stock: sequelize.literal(`stock - ${goods[i].num}`),
        sale: sequelize.literal(`sale + ${goods[i].num}`)
      }, {
        where: {
          id: goods[i].id,
          stock: {
            $gte: goods[i].num
          }
        }
      })

      if (updateStock && updateStock.length > 0 && updateStock[0] > 0) {
        // 库存更新成功
        // 更新商品销量
        await ctx.orm().pms_product.update({
          sale: sequelize.literal(`sale + ${goods[i].num}`)
        }, {
          where: {
            id: goods[i].goods.id
          }
        })
      } else {
        // 还原库存
        for (let x = 0, y = i; x < y; x++) {
          await ctx.orm().pms_sku_stock.update({
            stock: sequelize.literal(`stock + ${goods[x].num}`),
            sale: sequelize.literal(`sale - ${goods[x].num}`)
          }, {
            where: {
              id: goods[x].id
            }
          })

          await ctx.orm().pms_product.update({
            sale: sequelize.literal(`sale - ${goods[x].num}`)
          }, {
            where: {
              id: goods[x].goods.id
            }
          })
        }

        // 还原用户余额
        await ctx.orm().ums_member.update({
          integration: sequelize.literal(`integration + ${orderPrice}`)
        }, {
          where: {
            id: member.id
          }
        })

        // 记录还原余额记录
        await ctx.orm().cms_user_currency_log.create({
          cmp_admin_id: 0,
          cmp_admin_name: '',
          cmp_member_id: member.id,
          cmp_member_name: member.nickname,
          state_context: `库存不足归还${orderPrice}`,
          state_time: date.formatDate(),
          remark: '库存不足归还',
          op_admin_id: 0,
          op_admin_name: ''
        });

        assert.ok(false, `【${goods[i].goods.name}】库存不足`);
      }
    }

    // 记录订单
    let now = date.formatDate();
    let couponId = 0;
    let orderSn = date.getTimeStamp() + (Math.round(Math.random() * 1000000)).toString();
    let totalAmount = orderPrice;
    let payAmount = orderPrice;
    let freightAmount = 0;
    let promotionAmount = 0;
    let integrationAmount = 0;
    let couponAmount = 0;
    let useIntegration = 0;
    let promotionInfo = '无优惠';
    let order = await ctx.orm().oms_order.create({
      member_id: member.id,
      coupon_id: couponId,
      order_sn: orderSn,
      create_time: now,
      member_username: member.username,
      total_amount: totalAmount,
      pay_amount: payAmount,
      freight_amount: freightAmount,
      promotion_amount: promotionAmount,
      integration_amount: integrationAmount,
      coupon_amount: couponAmount,
      discount_amount: 0,
      pay_type: 0,
      source_type: 1,
      status: 0,
      order_type: 0,
      delivery_company: '待确认',
      delivery_sn: '',
      auto_confirm_day: 7,
      integration: 0,
      growth: 0,
      promotion_info: promotionInfo,
      bill_type: 0,
      bill_header: '',
      bill_content: '',
      bill_receiver_phone: '',
      bill_receiver_email: '',
      receiver_name: memberAdd.name,
      receiver_phone: memberAdd.phone_number,
      receiver_post_code: memberAdd.post_code,
      receiver_province: memberAdd.province,
      receiver_city: memberAdd.city,
      receiver_region: memberAdd.region,
      receiver_detail_address: memberAdd.detail_address,
      note: '',
      confirm_status: 0,
      delete_status: 0,
      use_integration: useIntegration
    })

    if (order) {
      // 刷新订单号
      orderItems.forEach(f => {
        f.order_id = order.id;
        f.order_sn = order.order_sn;
      })

      await ctx.orm().oms_order_item.bulkCreate(orderItems);

      await ctx.orm().oms_order_operate_history.create({
        order_id: order.id,
        operate_man: '用户',
        create_time: now,
        order_status: 0,
        note: `${member.nickname}在${now}成功下单`
      })

      ctx.body = {
        orderId: order.id,
        orderSn: order.order_sn,
        createTime: now
      }
    } else {
      assert.ok(false, `提交订单失败，请联系管理员`);
    }
  },
  memberOrder: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let orderId = ctx.request.body.orderId || 0;
    let orderSn = ctx.request.body.orderSn || '';

    assert.ok(orderId !== 0 || orderSn !== '', '请选择订单');

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let where = {
      member_id: member.id,
      delete_status: 0
    }

    if (orderId > 0) {
      where.id = orderId;
    }

    if (orderSn !== '') {
      where.order_sn = orderSn;
    }

    let order = await ctx.orm().oms_order.findOne({
      where
    });

    assert.ok(order != null, '订单不存在！');

    let orderItems = await ctx.orm().oms_order_item.findAll({
      where: {
        order_id: order.id
      }
    });

    ctx.body = {
      order,
      orderItems
    }
  },
  memberOrders: async (ctx) => {
    let id = ctx.request.body.id || 0;

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let orders = await ctx.orm().oms_order.findAll({
      where: {
        member_id: member.id,
        delete_status: 0
      },
      order: [['create_time', 'desc']]
    });

    ctx.body = orders;
  },
  memberOrdersItem: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let orderIds = ctx.request.body.orderIds || [];

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let orders = await ctx.orm().oms_order_item.findAll({
      where: {
        order_id: {
          $in: orderIds
        }
      },
      order: [['order_id']]
    });

    ctx.body = orders;
  },
  memberFavorites: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let favorites = await ctx.orm().ums_member_favorite.findAll({
      where: {
        member_id: id
      }
    })

    if (favorites && favorites.length > 0) {
      let where = {
        id: {
          $in: favorites.map(m => {
            return m.dataValues.product_id
          })
        },
        delete_status: 0,
        is_del: 0
      }

      let result = await ctx.orm().pms_product.findAndCountAll({
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
            brandId: m.dataValues.brand_id,
            productCategoryId: m.dataValues.product_category_id,
            feightTemplateId: m.dataValues.feight_template_id,
            productAttributeCategoryId: m.dataValues.product_attribute_category_id,
            productSn: m.dataValues.product_sn,
            deleteStatus: m.dataValues.delete_status,
            publishStatus: m.dataValues.publish_status,
            newStatus: m.dataValues.new_status,
            recommandStatus: m.dataValues.recommand_status,
            verifyStatus: m.dataValues.verify_status,
            promotionPrice: m.dataValues.promotion_price,
            giftGrowth: m.dataValues.gift_growth,
            giftPoint: m.dataValues.gift_point,
            usePointLimit: m.dataValues.use_point_limit,
            subTitle: m.dataValues.sub_title,
            originalPrice: m.dataValues.original_price,
            lowStock: m.dataValues.low_stock,
            previewStatus: m.dataValues.preview_status,
            serviceIds: m.dataValues.service_ids,
            albumPics: m.dataValues.album_pics,
            detailTitle: m.dataValues.detail_title,
            detailDesc: m.dataValues.detail_desc,
            detailHtml: m.dataValues.detail_html,
            detailMobileHtml: m.dataValues.detail_mobile_html,
            promotionStartTime: m.dataValues.promotion_start_time,
            promotionEndTime: m.dataValues.promotion_end_time,
            promotionPerLimit: m.dataValues.promotion_per_limit,
            promotionType: m.dataValues.promotion_type,
            brandName: m.dataValues.brand_name,
            productCategoryName: m.dataValues.product_category_name
          }
        }),
      };
    } else {
      ctx.body = {
        total: 0,
        list: []
      }
    }
  },
  memberProductFavorite: async (ctx) => {
    let member_id = ctx.request.body.member_id || 0;
    let product_id = ctx.request.body.product_id || 0;

    let result = await ctx.orm().ums_member_favorite.findOne({
      where: {
        member_id,
        product_id
      }
    })

    ctx.body = {
      exist: result ? true : false
    }
  },
  memberAddFavorite: async (ctx) => {
    let member_id = ctx.request.body.member_id || 0;
    let product_id = ctx.request.body.product_id || 0;

    ctx.orm().ums_member_favorite.create({
      member_id,
      product_id,
      create_time: date.formatDate()
    })

    ctx.body = {}
  },
  memberDelFavorite: async (ctx) => {
    let member_id = ctx.request.body.member_id || 0;
    let product_id = ctx.request.body.product_id || 0;

    ctx.orm().ums_member_favorite.destroy({
      where: {
        member_id,
        product_id,
      }
    })

    ctx.body = {}
  },
  memberCurrencys: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let result = await ctx.orm().cms_user_currency_log.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where: {
        cmp_member_id: id
      },
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows
    };
  },
  memberOrderReceipt: async (ctx) => {
    let orderId = ctx.request.body.orderId || 0;
    let memberId = ctx.request.body.memberId || 0;

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id: memberId,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    // 更新为签收
    let updateOrder = await ctx.orm().oms_order.update({
      status: 6,
      confirm_status: 1,
      receive_time: date.formatDate(),
      modify_time: date.formatDate()
    }, {
      where: {
        id: orderId,
        member_id: member.id,
        status: 2,
        confirm_status: 0,
        delete_status: 0
      }
    })

    if (updateOrder && updateOrder.length > 0 && updateOrder[0] > 0) {
      ctx.orm().oms_order_operate_history.create({
        order_id: orderId,
        operate_man: `【用户】${member.nickname}`,
        create_time: date.formatDate(),
        order_status: 6,
        note: '订单确认收货'
      })
    }

    ctx.body = {};
  },
  memberOrderComment: async (ctx) => {
    let orderId = ctx.request.body.orderId || 0;
    let orderItemId = ctx.request.body.orderItemId || 0;
    let memberId = ctx.request.body.memberId || 0;
    let commentStar = ctx.request.body.commentStar || 0;
    let commentContent = ctx.request.body.commentContent || '';

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id: memberId,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let order = await ctx.orm().oms_order.findOne({
      where: {
        id: orderId,
        member_id: member.id,
        status: 6
      }
    })

    assert.ok(order != null, '订单不存在！');

    let orderItem = await ctx.orm().oms_order_item.findOne({
      where: {
        id: orderItemId,
        order_id: order.id,
        is_comment: 0
      }
    })

    assert.ok(orderItem != null, '订单商品不存在！');

    // 更新评价数据
    let updateOrderItem = await ctx.orm().oms_order_item.update({
      is_comment: 1,
      comment_star: commentStar,
      comment_content: commentContent
    }, {
      where: {
        id: orderItem.id,
        order_id: order.id,
        is_comment: 0
      }
    })

    if (updateOrderItem && updateOrderItem.length > 0 && updateOrderItem[0] > 0) {
      // 记录评价数据
      await ctx.orm().pms_comment.create({
        product_id: orderItem.product_id,
        member_nick_name: member.nickname,
        product_name: orderItem.product_name,
        star: commentStar,
        member_ip: ip.getClientIP(ctx),
        create_time: date.formatDate(),
        show_status: 0,
        product_attribute: orderItem.product_attr,
        collect_couont: 0,
        read_count: 0,
        content: commentContent,
        pics: '',
        member_icon: member.icon,
        replay_count: 0
      })


      let orderItemNoComment = await ctx.orm().oms_order_item.findAll({
        where: {
          order_id: order.id,
          is_comment: 0
        }
      })

      if (orderItemNoComment.length === 0) {
        // 都评价了
        // 更新订单状态
        await ctx.orm().oms_order.update({
          status: 3,
          comment_time: date.formatDate(),
          modify_time: date.formatDate()
        }, {
          where: {
            id: order.id,
            member_id: member.id,
            status: 6
          }
        })

        ctx.orm().oms_order_operate_history.create({
          order_id: order.id,
          operate_man: `【用户】${member.nickname}`,
          create_time: date.formatDate(),
          order_status: 3,
          note: '订单评价完成'
        })
      }
    }
  },
  memberIndexLayout: async (ctx) => {
    let cmpId = ctx.request.body.cmpId || 0;

    let banners = await ctx.orm().cmp_banners.findAll({
      where: {
        cmp_id: cmpId,
        is_del: 0
      },
      order: [['sort']]
    })

    let layouts = await ctx.orm().cmp_index_layouts.findAll({
      where: {
        cmp_id: cmpId,
        is_del: 0
      },
      order: [['sort']]
    })


    let layoutIndexs = [];
    for (let i = 0, j = layouts.length; i < j; i++) {
      let layoutIndex = {
        ...layouts[i].dataValues,
        pros: []
      }
      let ids = JSON.parse(layouts[i].dataValues.pro_ids);

      for (let x = 0, y = ids.length; x < y; x++) {
        let pro = await ctx.orm().pms_product.findOne({
          where: {
            id: parseInt(ids[x]),
            delete_status: 0,
            publish_status: 1,
            is_del: 0
          }
        });

        if (pro) {
          layoutIndex.pros.push({
            ...pro.dataValues,
            brandId: pro.dataValues.brand_id,
            productCategoryId: pro.dataValues.product_category_id,
            feightTemplateId: pro.dataValues.feight_template_id,
            productAttributeCategoryId: pro.dataValues.product_attribute_category_id,
            productSn: pro.dataValues.product_sn,
            deleteStatus: pro.dataValues.delete_status,
            publishStatus: pro.dataValues.publish_status,
            newStatus: pro.dataValues.new_status,
            recommandStatus: pro.dataValues.recommand_status,
            verifyStatus: pro.dataValues.verify_status,
            promotionPrice: pro.dataValues.promotion_price,
            giftGrowth: pro.dataValues.gift_growth,
            giftPoint: pro.dataValues.gift_point,
            usePointLimit: pro.dataValues.use_point_limit,
            subTitle: pro.dataValues.sub_title,
            originalPrice: pro.dataValues.original_price,
            lowStock: pro.dataValues.low_stock,
            previewStatus: pro.dataValues.preview_status,
            serviceIds: pro.dataValues.service_ids,
            albumPics: pro.dataValues.album_pics,
            detailTitle: pro.dataValues.detail_title,
            detailDesc: pro.dataValues.detail_desc,
            detailHtml: pro.dataValues.detail_html,
            detailMobileHtml: pro.dataValues.detail_mobile_html,
            promotionStartTime: pro.dataValues.promotion_start_time,
            promotionEndTime: pro.dataValues.promotion_end_time,
            promotionPerLimit: pro.dataValues.promotion_per_limit,
            promotionType: pro.dataValues.promotion_type,
            brandName: pro.dataValues.brand_name,
            productCategoryName: pro.dataValues.product_category_name
          })
        }
      }

      layoutIndexs.push(layoutIndex);
    }

    ctx.body = {
      banners,
      layoutIndexs
    }
  },
  memberOrderH5Pay: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let orderId = ctx.request.body.orderId || 0;
    let orderSn = ctx.request.body.orderSn || '';
    let payType = ctx.request.body.payType || 0;
    let billSort = ctx.request.body.billSort || '';
    let billInfo = ctx.request.body.billInfo || null;
    let orderNote = ctx.request.body.orderNote || '';
    let coupon = ctx.request.body.coupon || null;

    assert.ok(payType !== 0, '支付类型不正确！');

    if (payType === 99) {
      assert.ok(billSort === '普票' || billSort === '专票', '货到付款必须填写发票信息')
      assert.ok(billInfo !== '' || billInfo !== null, '货到付款必须填写发票信息')
    }

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    // 获取未支付订单
    let order = await ctx.orm().oms_order.findOne({
      where: {
        id: orderId,
        order_sn: orderSn,
        status: 0,
        member_id: member.id,
        delete_status: 0
      }
    });
    assert.ok(order != null, '订单不存在或已支付！');

    let orderItems = await ctx.orm().oms_order_item.findAll({
      where: {
        order_id: order.id
      }
    });
    assert.ok(orderItems != null && orderItems.length > 0, '订单不存在或已支付！');

    let now = date.formatDate();
    let orderPrice = NP.strip(order.pay_amount);
    let returnUrl = `https://mall.lixianggo.com/mall_shop_mobile/order?orderId=${order.id}&orderSn=${order.order_sn}`;

    if (coupon && coupon.id > 0) {
      // 验证用券
      let memberCoupons = await ctx.orm().query(`
      select h.id, h.member_id, h.coupon_id, c.name, c.amount, c.start_time, c.end_time, c.use_type, c.note from sms_coupon_history h 
      inner join sms_coupon c on c.id = h.coupon_id where h.id = ${coupon.id} and c.id = ${coupon.couponId} and h.member_id = ${member.id} and h.use_status = 0 and c.start_time < '${now}' and '${now}' < c.end_time;`);
      assert.ok(memberCoupons != null && memberCoupons.length > 0, '您使用的优惠券不存在！');

      let memberCoupon = memberCoupons[0];
      let userIds = [];

      let orderCategoryids = orderItems.map(m => m.dataValues.product_category_id)
      let orderProids = orderItems.map(m => m.dataValues.product_id)

      // 验证优惠券使用范围
      if (memberCoupon.userType === 1) {
        // 指定分类
        let categoryids = await ctx.orm().sms_coupon_product_category_relation.findAll({
          where: {
            coupon_id: memberCoupon.coupon_id
          }
        });

        if (categoryids && categoryids.length > 0) {
          userIds = categoryids.map(m => {
            return m.dataValues.product_category_id;
          })
        }

        let result1 = _.intersection(userIds, orderCategoryids);
        assert.ok(result1 != null && result1.length > 0, '订单中商品不在优惠券使用范围！');
      }
      else if (memberCoupon.userType === 2) {
        // 指定商品
        let proids = await ctx.orm().sms_coupon_product_relation.findAll({
          where: {
            coupon_id: memberCoupon.coupon_id
          }
        })

        if (proids && proids.length > 0) {
          userIds = proids.map(m => {
            return m.dataValues.product_id;
          })
        }

        let result2 = _.intersection(userIds, orderProids);
        assert.ok(result2 != null && result2.length > 0, '订单中商品不在优惠券使用范围！');
      }

      // 更新用户优惠券状态为已使用
      await ctx.orm().sms_coupon_history.update({
        use_status: 1,
        use_time: now,
        order_id: order.id,
        order_sn: order.order_sn
      }, {
        where: {
          id: coupon.id,
          member_id: member.id,
          use_status: 0
        }
      })

      // 开始减钱
      // 更新商品使用优惠券
      let memberCouponAmount = NP.strip(memberCoupon.amount);
      let productCouponAmount = 0;

      if (memberCoupon.use_type === 1) {
        // 指定分类
      }
      else if (memberCoupon.use_type === 2) {
        // 指定商品
        for (let i = 0, j = orderItems.length; i < j; i++) {
          let orderItem = orderItems[i];

          if (memberCouponAmount > 0 && userIds.includes(orderItem.product_id) >= 0) {
            let productPayAmount = NP.strip(orderItem.product_pay_amount);
            let couponAmount = productPayAmount > memberCouponAmount ? memberCouponAmount : productPayAmount;
            productPayAmount = productPayAmount - couponAmount;

            // 更新商品销售价格
            await ctx.orm().oms_order_item.update({
              product_pay_amount: productPayAmount,
              coupon_amount: couponAmount
            }, {
              where: {
                id: orderItem.id
              }
            });

            memberCouponAmount -= couponAmount;
            productCouponAmount += couponAmount;
          }
        }
      }

      orderPrice -= orderPrice > productCouponAmount ? productCouponAmount : orderPrice;

      // 更新订单金额
      // 更新订单使用优惠券
      await ctx.orm().oms_order.update({
        coupon_id: coupon.couponId,
        pay_amount: orderPrice,
        coupon_amount: productCouponAmount
      }, {
        where: {
          id: order.id
        }
      });
    }

    let result = null;

    switch (payType) {
      case 1:
        if (orderPrice > 0) {
          // 支付宝
          const formData = new AlipayFormData();
          formData.setMethod('get');
          formData.addField('notifyUrl', 'https://mall.lixianggo.com/mall/notify/alipay');
          formData.addField('returnUrl', returnUrl);
          formData.addField('bizContent', {
            outTradeNo: orderSn,
            productCode: 'FAST_INSTANT_TRADE_PAY',
            totalAmount: orderPrice,
            subject: '商城订单',
            body: '商城商品支付订单',
          });

          result = await alipay.exec('alipay.trade.wap.pay', {}, {
            formData: formData
          });

          // 更新支付类型
          await ctx.orm().oms_order.update({
            pay_type: payType,
            modify_time: now,
            note: orderNote
          }, {
            where: {
              id: order.id
            }
          })

          ctx.body = {
            webPayUrl: result
          }
        } else {
          // 更新支付类型
          await ctx.orm().oms_order.update({
            pay_type: payType,
            status: 1,
            payment_time: date.formatDate(),
            modify_time: now,
            note: orderNote
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
            note: `${member.nickname}在${now}用支付宝支付成功0元`
          })

          ctx.body = {
            replaceUrl: `/order?orderId=${order.id}&orderSn=${order.order_sn}`
          }
        }
        break;
      case 2:
        if (orderPrice > 0) {
          // 微信
          result = await tenpayAPI.unifiedOrder({
            out_trade_no: orderSn,
            body: '商城商品支付订单',
            total_fee: NP.times(orderPrice, 100),
            openid: '',
            trade_type: 'MWEB',
            spbill_create_ip: ip.getClientIP(ctx)
          });

          // 更新支付类型
          await ctx.orm().oms_order.update({
            pay_type: payType,
            modify_time: now,
            note: orderNote
          }, {
            where: {
              id: order.id
            }
          })

          ctx.body = {
            webPayUrl: result.return_code === 'SUCCESS' ? result.mweb_url : ''
          }
        } else {
          // 更新支付类型
          await ctx.orm().oms_order.update({
            pay_type: payType,
            status: 1,
            payment_time: date.formatDate(),
            modify_time: now,
            note: orderNote
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
            note: `${member.nickname}在${now}用微信支付成功0元`
          })

          ctx.body = {
            replaceUrl: `/order?orderId=${order.id}&orderSn=${order.order_sn}`
          }
        }
        break;
      case 3:
        // 余额支付
        // 扣余额
        let updateIntegration = await ctx.orm().ums_member.update({
          integration: sequelize.literal(`integration - ${orderPrice}`)
        }, {
          where: {
            id: member.id,
            integration: {
              $gte: orderPrice
            },
            status: 1,
            is_del: 0
          }
        })

        if (updateIntegration && updateIntegration.length > 0 && updateIntegration[0] > 0) {
          // 余额扣减成功
          // 记录使用余额记录
          await ctx.orm().cms_user_currency_log.create({
            cmp_admin_id: 0,
            cmp_admin_name: '',
            cmp_member_id: member.id,
            cmp_member_name: member.nickname,
            state_context: `用户消费${orderPrice}`,
            state_time: now,
            remark: '用户消费',
            op_admin_id: 0,
            op_admin_name: ''
          });
        } else {
          assert.ok(false, `您的余额不足`);
        }

        // 支付成功
        await ctx.orm().oms_order.update({
          status: 1,
          pay_type: payType,
          integration_amount: orderPrice,
          use_integration: orderPrice,
          payment_time: now,
          modify_time: now,
          note: orderNote
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
          note: `${member.nickname}在${now}用余额支付成功`
        })

        ctx.body = {
          replaceUrl: `/order?orderId=${order.id}&orderSn=${order.order_sn}`
        }
        break;
      case 99:
        // 货到付款，支付成功
        await ctx.orm().oms_order.update({
          status: 1,
          pay_type: payType,
          payment_time: now,
          modify_time: now,
          bill_sort: billSort,
          bill_company_name: billInfo.companyName,
          bill_tax: billInfo.tax,
          bill_account_bank: billSort === '专票' ? billInfo.accountBank : '',
          bill_account_num: billSort === '专票' ? billInfo.accountNum : '',
          bill_address: billSort === '专票' ? billInfo.billAddress : '',
          bill_phone: billSort === '专票' ? billInfo.billPhone : '',
          bill_receiver_address: billSort === '专票' ? billInfo.billReceiveAddress : '',
          bill_receiver_phone: billSort === '专票' ? billInfo.billReceivePhone : '',
          bill_receiver_email: billSort === '专票' ? billInfo.billEmail : '',
          note: orderNote
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
          note: `${member.nickname}在${now}用货到付款支付成功`
        })

        ctx.body = {
          replaceUrl: `/order?orderId=${order.id}&orderSn=${order.order_sn}`
        }
        break;
      default:
        ctx.body = {}
        break;
    }
  },
  memberCouponList: async (ctx) => {
    let id = ctx.request.body.id || 0;

    // 获取会员信息
    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '输入帐号不存在！');

    let memberCoupons = await ctx.orm().query(`
    select h.id, h.member_id, h.coupon_id, c.name, c.amount, c.start_time, c.end_time, c.use_type, c.note from sms_coupon_history h 
    inner join sms_coupon c on c.id = h.coupon_id where h.member_id = ${member.id} and h.use_status = 0;`);

    let couponList = [];
    if (memberCoupons && memberCoupons.length > 0) {
      for (let i = 0, j = memberCoupons.length; i < j; i++) {
        let memberCoupon = memberCoupons[i];

        let available = date.isDateBetween(memberCoupon.start_time, memberCoupon.end_time, new Date()) ? 1 : 0;
        let reason = available === 1 ? '' : '不在使用时间范围内';

        let couponAmout = NP.strip(memberCoupon.amount);

        let coupon = {
          id: memberCoupon.id,
          couponId: memberCoupon.coupon_id,
          available: available,
          condition: `指定商品\n最多优惠${couponAmout}元`,
          description: memberCoupon.note,
          reason: reason,
          value: parseInt(couponAmout * 100),
          name: memberCoupon.name,
          startAt: parseInt(date.timeToTimeStamp(memberCoupon.start_time) / 1000),
          endAt: parseInt(date.timeToTimeStamp(memberCoupon.end_time) / 1000),
          valueDesc: `${couponAmout}`,
          unitDesc: '元',
          userType: memberCoupon.use_type,
          userIds: []
        }

        if (coupon.userType === 1) {
          // 指定分类
          let categoryids = await ctx.orm().sms_coupon_product_category_relation.findAll({
            where: {
              coupon_id: coupon.couponId
            }
          });

          if (categoryids && categoryids.length > 0) {
            coupon.userIds = categoryids.map(m => {
              return m.dataValues.product_category_id;
            })
          }
        }
        else if (coupon.userType === 2) {
          // 指定商品
          let proids = await ctx.orm().sms_coupon_product_relation.findAll({
            where: {
              coupon_id: coupon.couponId
            }
          })

          if (proids && proids.length > 0) {
            coupon.userIds = proids.map(m => {
              return m.dataValues.product_id;
            })
          }
        }

        couponList.push(coupon);
      }
    }

    ctx.body = couponList;
  },
  memberInvoicInfo: async (ctx) => {
    let result = await ctx.orm().invoic_info.findAll();
    ctx.body = result;
  },
  memberOrderOrderExpress: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let orderId = ctx.request.body.orderId || 0;
    let orderSn = ctx.request.body.orderSn || '';

    assert.ok(orderId !== 0 || orderSn !== '', '请选择订单');

    let result = await ctx.orm().oms_order.findOne({
      where: {
        member_id: id,
        id: orderId,
        order_sn: orderSn,
        status: {
          $gte: 2
        },
        delete_status: 0
      }
    });

    if (result && result.delivery_company !== '待确认' && result.delivery_sn) {
      // http://poll.kuaidi100.com/poll/query.do?customer=583609A1CEBEC8EDEBE0423C707F412F&sign=E403A599D367C77812B7AE8ECD6E24EC&param={"com":"yuantong","num":"YT5740637822810","from":"","phone":"","to":"","resultv2":"2","show":"0","order":"desc"}

      if (logisticsCompaniesToCode[result.delivery_company]) {
        let customer = '583609A1CEBEC8EDEBE0423C707F412F';
        let key = 'rIMovAlS65';

        let deliverySn = result.delivery_sn;
        if (deliverySn.indexOf(',')) {
          deliverySn = deliverySn.split(',')[0]
        }

        let data = {
          com: logisticsCompaniesToCode[result.delivery_company],
          num: deliverySn,
          resultv2: '2',
          show: '0',
          order: 'desc'
        };
        let param = JSON.stringify(data);

        let sign = encrypt.getMd5(`${param}${key}${customer}`).toUpperCase();

        let resultPoll = await http.postForm({
          url: 'http://poll.kuaidi100.com/poll/query.do',
          data: {
            customer,
            sign,
            param
          }
        })

        if (resultPoll && resultPoll.data && resultPoll.data.data) {
          ctx.body = {
            state: resultPoll.data.state,
            stateName: logisticsStateToCode[resultPoll.data.state],
            router: resultPoll.data.data
          }
          return
        } else {
          ctx.body = {
            state: resultPoll.data.returnCode,
            stateName: resultPoll.data.message,
            router: []
          }
          return
        }
      }
    }

    ctx.body = {
      state: '-999999',
      stateName: '获取物流信息失败',
      router: []
    }
  }
};