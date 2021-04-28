/*
 * @Author: Lienren 
 * @Date: 2021-04-11 23:48:19 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-04-27 11:59:18
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

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
    let publishStatus = ctx.request.body.publishStatus;
    let verifyStatus = ctx.request.body.verifyStatus;
    let productSn = ctx.request.body.productSn || '';
    let productCategoryId = ctx.request.body.productCategoryId || 0;
    let brandId = ctx.request.body.brandId || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      delete_status: 0,
      is_del: 0
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
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
  },
  memberProductDetail: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
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
      skuStockList,
      productAttributeValueList
    };
  },
  memberCateList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    let result = await ctx.orm().pms_product_category.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
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
            is_del: 0
          }
        })

        if (product) {
          orderPrice += sku.price * goods[i].num

          orderItems.push({
            order_id: 0,
            order_sn: '',
            product_id: product.id,
            product_pic: product.pic,
            product_name: product.name,
            product_brand: product.brand_name,
            product_sn: product.product_sn,
            product_price: sku.price,
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
            product_attr: JSON.stringify(goods[i].attr)
          })
        } else {
          assert.ok(false, `【${goods[i].goods.name}】已下架`);
        }
      } else {
        assert.ok(false, `【${goods[i].goods.name}】库存不足`);
      }
    }

    // 扣余额
    if (orderPrice > 0) {
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
          state_time: date.formatDate(),
          remark: '用户消费',
          op_admin_id: 0,
          op_admin_name: ''
        });
      } else {
        assert.ok(false, `您的余额不足`);
      }
    } else {
      assert.ok(false, `扣减余额异常，请联系管理员`);
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
    let integrationAmount = orderPrice;
    let couponAmount = 0;
    let useIntegration = orderPrice;
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
      pay_type: 3,
      source_type: 1,
      status: 1,
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
      use_integration: useIntegration,
      payment_time: now
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
        order_status: 1,
        note: `${member.nickname}在${now}成功下单，并用余额支付成功`
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
};