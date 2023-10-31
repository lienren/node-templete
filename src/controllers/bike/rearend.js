/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2023-10-31 09:20:27
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/bike/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');

module.exports = {
  getSchools: async ctx => {
    let where = {};

    let result = await ctx.orm().info_schools.findAll({
      where
    });

    ctx.body = result
  },
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { schoolName, phone, idcard, grade, modelNum, campus } = ctx.request.body;

    assert.ok(!!schoolName, '请输入学校名称')

    let where = {};
    Object.assign(where, schoolName && { school: schoolName })
    Object.assign(where, phone && { phone: phone })
    Object.assign(where, idcard && { idcard: idcard })
    Object.assign(where, grade && { grade: grade })
    Object.assign(where, campus && { campus: campus })
    Object.assign(where, modelNum && { id: {
      $in:sequelize.literal(`(select userId from info_models where modelNum = '${modelNum}')`)
    } })

    let result = await ctx.orm().info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  delUser: async ctx => {
    let { id } = ctx.request.body

    await ctx.orm().info_users.destroy({
      where: {
        id
      }
    })

    ctx.body = {}
  },
  getUserModels: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { userId, schoolName, phone, idcard, grade, modelNum, campus } = ctx.request.body;

    let where = {};
    Object.assign(where, userId && { userId })
    Object.assign(where, modelNum && { modelNum })
    Object.assign(where, schoolName && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where school = '${schoolName}')`)
      }
    })
    Object.assign(where, phone && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where phone = '${phone}')`)
      }
    })
    Object.assign(where, idcard && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where idcard = '${idcard}')`)
      }
    })
    Object.assign(where, grade && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where grade = '${grade}')`)
      }
    })
    Object.assign(where, campus && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where campus = '${campus}')`)
      }
    })

    let result = await ctx.orm().info_models.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    if (result && result.rows && result.rows.length > 0) {
      let users = await ctx.orm().info_users.findAll({
        where: {
          id: {
            $in: result.rows.map(m => { return m.dataValues.userId })
          }
        }
      })

      ctx.body = {
        total: result.count,
        list: result.rows.map(m => {
          let f = users.find(f => f.id === m.dataValues.userId)
          return {
            ...m.dataValues,
            userInfo: f
          }
        }),
        pageIndex,
        pageSize
      }
    } else {
      ctx.body = {
        total: result.count,
        list: result.rows,
        pageIndex,
        pageSize
      }
    }
  },
  delUserModel: async ctx => {
    let { id } = ctx.request.body

    await ctx.orm().info_models.destroy({
      where: {
        id
      }
    })

    ctx.body = {}
  },
  getNotifys: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let { userId, schoolName } = ctx.request.body;

    let where = {};
    Object.assign(where, userId && { userId })
    Object.assign(where, schoolName && {
      userId: {
        $in: sequelize.literal(`(select id from info_users where school = '${schoolName}')`)
      }
    })

    let result = await ctx.orm().info_notifys.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    if (result && result.rows && result.rows.length > 0) {
      let users = await ctx.orm().info_users.findAll({
        where: {
          id: {
            $in: result.rows.map(m => { return m.dataValues.userId })
          }
        }
      })

      ctx.body = {
        total: result.count,
        list: result.rows.map(m => {
          let f = users.find(f => f.id === m.dataValues.userId)
          return {
            ...m.dataValues,
            userInfo: f
          }
        }),
        pageIndex,
        pageSize
      }
    } else {
      ctx.body = {
        total: result.count,
        list: result.rows,
        pageIndex,
        pageSize
      }
    }
  }
};