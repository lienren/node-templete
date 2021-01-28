/*
 * @Author: Lienren 
 * @Date: 2021-01-28 20:30:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-28 20:35:51
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  list: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;
    let keyword = ctx.request.body.keyword || null;

    let where = {
      is_del: 0
    }
    if (keyword) {
      where.title = {
        $like: `%${keyword}%`
      }
    }

    let result = await ctx.orm().website_news.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          imgUrl: m.dataValues.img_url,
          createTime: m.dataValues.create_time
        }
      }),
    };
  },
  create: async (ctx) => {
    let title = ctx.request.body.title || 0;
    let imgUrl = ctx.request.body.imgUrl || '';
    let context = ctx.request.body.context || '';
    let status = ctx.request.body.status;

    ctx.orm().website_news.create({
      title: title,
      img_url: imgUrl,
      context: context,
      status: status,
      create_time: date.formatDate(),
      is_del: 0
    });

    ctx.body = {};
  },
  edit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || 0;
    let imgUrl = ctx.request.body.imgUrl || '';
    let context = ctx.request.body.context || '';
    let status = ctx.request.body.status;

    ctx.orm().website_news.update({
      title: title,
      img_url: imgUrl,
      context: context,
      status: status
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  del: async (ctx) => {
    let id = ctx.request.body.id || 0;

    ctx.orm().website_news.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  editState: async ctx => {
    let id = ctx.request.body.id || 0;
    let status = ctx.request.body.status;

    await ctx.orm().website_news.update({
      status: status
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
}