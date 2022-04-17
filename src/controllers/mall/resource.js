/*
 * @Author: Lienren 
 * @Date: 2021-01-21 14:08:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-21 15:32:22
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
    let categoryId = ctx.request.body.categoryId || null;
    let nameKeyword = ctx.request.body.nameKeyword || null;
    let urlKeyword = ctx.request.body.urlKeyword || null;

    let where = {
      is_del: 0
    }
    if (categoryId) {
      where.category_id = categoryId
    }

    if (nameKeyword) {
      where.nameKeyword = {
        $like: `%${nameKeyword}%`
      }
    }

    if (urlKeyword) {
      where.urlKeyword = {
        $like: `%${urlKeyword}%`
      }
    }

    let result = await ctx.orm().ums_resource.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          categoryId: m.dataValues.category_id,
          createTime: m.dataValues.create_time
        }
      }),
    };
  },
  listAll: async (ctx) => {
    let where = {
      is_del: 0
    }

    let result = await ctx.orm().ums_resource.findAll({
      where
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        categoryId: m.dataValues.category_id,
        createTime: m.dataValues.create_time
      }
    });
  },
  getRoleResource: async (ctx) => {
    let roleId = ctx.request.body.roleId || 0;

    let resources = await ctx.orm().query(`
        SELECT
            r.id id,
            r.create_time createTime,
            r.name name,
            r.url url,
            r.description description,
            r.category_id categoryId
        FROM
            ums_role_resource_relation rrr
        inner JOIN ums_resource r ON rrr.resource_id = r.id and r.is_del = 0
        WHERE
            rrr.role_id = ${roleId} AND r.id IS NOT NULL
        GROUP BY r.id`);

    ctx.body = resources.length > 0 ? resources[0] : resources;
  },
  setRoleResource: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let resourceIds = ctx.request.body.resourceIds || [];
    let now = date.getTimeStamp();

    let sameResult = await ctx.orm().ums_role.findOne({
      where: {
        id: id,
        is_del: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    await ctx
      .orm()
      .query(`delete from ums_role_resource_relation where role_id = ${id}`)
      .spread((results, metadata) => {});

    let data = resourceIds.map(resourceId => {
      return {
        role_id: id,
        resource_id: parseInt(resourceId)
      };
    });
    ctx.orm().ums_role_resource_relation.bulkCreate(data);

    ctx.body = {};
  },
  create: async (ctx) => {
    let categoryId = ctx.request.body.categoryId || 0;
    let description = ctx.request.body.description || '';
    let name = ctx.request.body.name || '';
    let url = ctx.request.body.url || '';

    ctx.orm().ums_resource.create({
      create_time: date.formatDate(),
      name: name,
      url: url,
      description: description,
      category_id: categoryId,
      is_del: 0
    });

    ctx.body = {};
  },
  edit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let categoryId = ctx.request.body.categoryId || 0;
    let description = ctx.request.body.description || '';
    let name = ctx.request.body.name || '';
    let url = ctx.request.body.url || '';

    ctx.orm().ums_resource.update({
      name: name,
      url: url,
      description: description,
      category_id: categoryId
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  del: async (ctx) => {
    let id = ctx.request.body.id || 0;

    ctx.orm().ums_resource.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  categoryList: async (ctx) => {
    let result = await ctx.orm().ums_resource_category.findAll({
      where: {
        is_del: 0
      },
      order: [
        ['sort']
      ]
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        createTime: m.dataValues.create_time
      }
    });
  },
  categoryCreate: async (ctx) => {
    let name = ctx.request.body.name || '';
    let sort = ctx.request.body.sort || 0;

    ctx.orm().ums_resource_category.create({
      create_time: date.formatDate(),
      name: name,
      sort: sort,
      is_del: 0
    });

    ctx.body = {};
  },
  categoryEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let sort = ctx.request.body.sort || 0;

    ctx.orm().ums_resource_category.update({
      name: name,
      sort: sort
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  categoryDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    ctx.orm().ums_resource_category.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
}