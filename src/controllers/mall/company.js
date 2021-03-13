/*
 * @Author: Lienren 
 * @Date: 2021-03-11 15:14:00 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-11 15:53:43
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  cmpList: async (ctx) => {
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

    let result = await ctx.orm().cmp_info.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          contactUsername: m.dataValues.contact_username,
          contactPost: m.dataValues.contact_post,
          contactPhone: m.dataValues.contact_phone,
          contactEmail: m.dataValues.contact_email,
          createTime: m.dataValues.create_time,
          mainBusiness: m.dataValues.main_business,
          createTime: m.dataValues.create_time,
          updateTime: m.dataValues.update_time
        }
      }),
    };
  },
  cmpCreate: async (ctx) => {
    let name = ctx.request.body.name || '';
    let website = ctx.request.body.website || '';
    let phone = ctx.request.body.phone || '';
    let main_business = ctx.request.body.mainBusiness || '';
    let city = ctx.request.body.city || '';
    let address = ctx.request.body.address || '';
    let contact_username = ctx.request.body.contactUsername || '';
    let contact_post = ctx.request.body.contactPost || '';
    let contact_phone = ctx.request.body.contactPhone || '';
    let contact_email = ctx.request.body.contactEmail || '';

    await ctx.orm().cmp_info.create({
      name,
      website,
      phone,
      main_business,
      city,
      address,
      contact_username,
      contact_post,
      contact_phone,
      contact_email,
      is_del: 0
    });

    ctx.body = {}
  },
  cmpEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let website = ctx.request.body.website || '';
    let phone = ctx.request.body.phone || '';
    let main_business = ctx.request.body.mainBusiness || '';
    let city = ctx.request.body.city || '';
    let address = ctx.request.body.address || '';
    let contact_username = ctx.request.body.contactUsername || '';
    let contact_post = ctx.request.body.contactPost || '';
    let contact_phone = ctx.request.body.contactPhone || '';
    let contact_email = ctx.request.body.contactEmail || '';

    await ctx.orm().cmp_info.update({
      name,
      website,
      phone,
      main_business,
      city,
      address,
      contact_username,
      contact_post,
      contact_phone,
      contact_email
    }, {
      where: {
        id
      }
    });

    ctx.body = {}
  },
  cmpDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    // 删除公司
    await ctx.orm().cmp_info.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    // 删除公司员工
    await ctx.orm().ums_admin.update({
      is_del: 1
    }, {
      where: {
        user_company_id: id,
        user_type: 1
      }
    });

    ctx.body = {}
  }
};