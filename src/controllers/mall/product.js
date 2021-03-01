/*
 * @Author: Lienren 
 * @Date: 2021-03-01 21:22:47 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-01 22:57:18
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  attrCategoryList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute_category.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          attributeCount: m.dataValues.attribute_count,
          paramCount: m.dataValues.param_count
        }
      }),
    };
  },
  attrCategoryCreate: async (ctx) => {
    let name = ctx.request.body.name || '';

    ctx.orm().pms_product_attribute_category.create({
      name: name,
      attribute_count: 0,
      param_count: 0,
      is_del: 0
    });

    ctx.body = {};
  },
  attrCategoryEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';

    ctx.orm().pms_product_attribute_category.update({
      name: name
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  attrCategoryDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    ctx.orm().pms_product_attribute_category.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  attrList: async (ctx) => {
    let cid = ctx.request.body.cid || 0;
    let type = ctx.request.body.type || 0;
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      product_attribute_category_id: cid,
      type,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          inputList: m.dataValues.input_list,
          selectType: m.dataValues.select_type,
          inputType: m.dataValues.input_type
        }
      }),
    };
  },
  attrInfo: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let where = {
      id,
      is_del: 0
    }

    let result = await ctx.orm().pms_product_attribute.findOne({
      where
    });

    ctx.body = {
      ...result.dataValues,
      inputList: result.dataValues.input_list,
      selectType: result.dataValues.select_type,
      inputType: result.dataValues.input_type,
      filterType: result.dataValues.filter_type,
      handAddStatus: result.dataValues.hand_add_status,
      productAttributeCategoryId: result.dataValues.product_attribute_category_id,
      relatedStatus: result.dataValues.related_status,
      searchType: result.dataValues.search_type
    };
  },
  attrCreate: async (ctx) => {
    let filterType = ctx.request.body.filterType || 0;
    let handAddStatus = ctx.request.body.handAddStatus || 0;
    let inputList = ctx.request.body.inputList || 0;
    let inputType = ctx.request.body.inputType || 0;
    let name = ctx.request.body.name || '';
    let productAttributeCategoryId = ctx.request.body.productAttributeCategoryId || 0;
    let relatedStatus = ctx.request.body.relatedStatus || 0;
    let searchType = ctx.request.body.searchType || 0;
    let selectType = ctx.request.body.selectType || 0;
    let sort = ctx.request.body.sort || 0;
    let type = ctx.request.body.type || 0;


    await ctx.orm().pms_product_attribute.create({
      product_attribute_category_id: productAttributeCategoryId,
      name: name,
      select_type: selectType,
      input_type: inputType,
      input_list: inputList,
      sort: sort,
      filter_type: filterType,
      search_type: searchType,
      related_status: relatedStatus,
      hand_add_status: handAddStatus,
      type: type,
      is_del: 0
    });

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    ctx.body = {};
  },
  attrEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let filterType = ctx.request.body.filterType || 0;
    let handAddStatus = ctx.request.body.handAddStatus || 0;
    let inputList = ctx.request.body.inputList || 0;
    let inputType = ctx.request.body.inputType || 0;
    let name = ctx.request.body.name || '';
    let productAttributeCategoryId = ctx.request.body.productAttributeCategoryId || 0;
    let relatedStatus = ctx.request.body.relatedStatus || 0;
    let searchType = ctx.request.body.searchType || 0;
    let selectType = ctx.request.body.selectType || 0;
    let sort = ctx.request.body.sort || 0;
    let type = ctx.request.body.type || 0;


    await ctx.orm().pms_product_attribute.update({
      product_attribute_category_id: productAttributeCategoryId,
      name: name,
      select_type: selectType,
      input_type: inputType,
      input_list: inputList,
      sort: sort,
      filter_type: filterType,
      search_type: searchType,
      related_status: relatedStatus,
      hand_add_status: handAddStatus,
      type: type,
      is_del: 0
    }, {
      where: {
        id
      }
    });

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    await ctx
      .orm()
      .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
        type: ctx.orm().sequelize.QueryTypes.UPDATE
      })

    ctx.body = {};
  },
  attrDel: async (ctx) => {
    let ids = ctx.request.body.ids || [];

    if (ids.length > 0) {
      await ctx
        .orm()
        .query(`update pms_product_attribute set is_del = 1 where id in (${ids.map(m=>{
          return m
        }).join(',')})`)
        .spread((results, metadata) => {});

      await ctx
        .orm()
        .query(`update pms_product_attribute_category set attribute_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 0 and is_del = 0) where is_del = 0`, {}, {
          type: ctx.orm().sequelize.QueryTypes.UPDATE
        })

      await ctx
        .orm()
        .query(`update pms_product_attribute_category set param_count = (select count(1) from pms_product_attribute where product_attribute_category_id = pms_product_attribute_category.id and type = 1 and is_del = 0) where is_del = 0`, {}, {
          type: ctx.orm().sequelize.QueryTypes.UPDATE
        })
    }

    ctx.body = {};
  },
}