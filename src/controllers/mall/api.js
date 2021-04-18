/*
 * @Author: Lienren 
 * @Date: 2021-04-11 23:48:19 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-04-14 06:44:24
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
  }
};