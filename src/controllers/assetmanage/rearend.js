/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2022-04-25 07:39:08
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/assetmanage/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const excel = require('../../utils/excel');

module.exports = {
  getHouses: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sn, street, community, streets, communitys, a4, a5, a7, a13, a14, remark, createTime, modifyTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, sn && { sn })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, a4 && { a4 })
    Object.assign(where, a5 && { a5 })
    Object.assign(where, a7 && { a7 })
    Object.assign(where, a13 && { a13 })
    Object.assign(where, a14 && { a14 })

    if (streets && streets.length > 0) {
      where.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where.community = {
        $in: communitys
      }
    }

    if (remark) {
      where.remark = {
        $like: `%${remark}%`
      };
    }

    if (createTime && createTime.length === 2) {
      where.createTime = { $between: createTime }
    }

    if (modifyTime && modifyTime.length === 2) {
      where.modifyTime = { $between: modifyTime }
    }

    let result = await ctx.orm().info_house.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['id', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getHouseHaving: async ctx => {
    let { hid } = ctx.request.body;

    let where = {
      a9: {
        $gte: date.formatDate()
      }
    };

    Object.assign(where, hid && { hid })

    let result = await ctx.orm().info_house_having.findAll({
      where
    })

    let yearrent = null
    if (result && result.length > 0) {
      yearrent = await ctx.orm().info_house_yearrent.findAll({
        where: {
          hid: hid,
          hhid: {
            $in: result.map(m => {
              return m.dataValues.id
            })
          }
        }
      })
    }

    ctx.body = result.map(m => {
      let fy = yearrent && yearrent.length > 0 ? yearrent.filter(f => f.hid === m.dataValues.hid && f.hhid === m.dataValues.id) : []
      return {
        ...m.dataValues,
        yearrent: fy
      }
    })
  },
  submitHouse: async ctx => {
    let { id, sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark } = ctx.request.body;

    if (id && id > 0) {
      let findHouse = await ctx.orm().info_house.findOne({
        where: {
          sn: sn,
          id: {
            $en: id
          },
          isDel: 0
        }
      })
      assert.ok(findHouse === null, '此资产编号已存在，请更换！')

      await ctx.orm().info_house.update({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark
      }, {
        where: {
          id,
          isDel: 0
        }
      })
    } else {
      await ctx.orm().info_house.create({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark,
        isDel: 0
      })
    }

    ctx.body = {}
  },
  submitHouseHaving: async ctx => {
    let { id, hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, yearrent } = ctx.request.body;

    let now = date.getTimeStamp()
    if (id && id > 0) {
      // 计算a3 年租金
      // 计算a6 下一期收款提醒
      if (a1 === '出租') {
        yearrent.map(m => {
          if (date.timeToTimeStamp(m.a1) <= now && now <= date.timeToTimeStamp(m.a2)) {
            a3 = m.a3
          }
        })
      }

      await ctx.orm().info_house_having.update({
        hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14
      }, {
        where: {
          id
        }
      })
    } else {
      // 计算a3 年租金
      // 计算a6 下一期收款提醒
      if (a1 === '出租') {
        yearrent.map(m => {
          if (date.timeToTimeStamp(m.a1) <= now && now <= date.timeToTimeStamp(m.a2)) {
            a3 = m.a3
          }
        })
      }

      let having = await ctx.orm().info_house_having.create({
        hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14
      })

      if (having.id && having.id > 0) {
        if (yearrent && yearrent.length > 0) {

          let data = yearrent.map(m => {
            return {
              ...m,
              hid: having.hid,
              hhid: having.id,
              a4: having.a4,
              a5: having.a5
            };
          });
          ctx.orm().info_house_yearrent.bulkCreate(data);
        }
      }
    }

    ctx.body = {}
  },
};