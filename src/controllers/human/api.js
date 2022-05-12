/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2022-05-12 07:42:23
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/human/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const jwt = require('../../utils/jwt');
const encrypt = require('../../utils/encrypt');

module.exports = {
  getQA: async ctx => {
    let result = await ctx.orm().info_qa.findOne({
      where: {
        id: 1
      }
    })

    ctx.body = {
      ...result.dataValues,
      items: result ? JSON.parse(result.dataValues.items) : null
    }
  },
  submitQA: async ctx => {
    let { id, title, desc, items } = ctx.request.body;

    if (id && id > 0) {
      await ctx.orm().info_qa.update({
        title,
        desc,
        items: JSON.stringify(items),
        nowIndex: -1
      }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().info_qa.create({
        title,
        desc,
        items: JSON.stringify(items),
        nowIndex: -1
      })
    }

    ctx.body = {}
  },
  nextQA: async ctx => {
    let { id, nowIndex } = ctx.request.body;

    if (id && id > 0) {
      await ctx.orm().info_qa.update({
        nowIndex
      }, {
        where: {
          id
        }
      })
    }

    ctx.body = {}
  },
  getQAUserCount: async ctx => {
    let { qid } = ctx.request.body;

    let result = await ctx.orm().info_qa_users.count({
      where: {
        qid
      }
    });

    ctx.body = {
      userCount: result
    }
  },
  getQAUsers: async ctx => {
    let { qid } = ctx.request.body;

    let result = await ctx.orm().info_qa_users.findAll({
      where: {
        qid
      }
    });

    ctx.body = result
  },
  submitQAUser: async ctx => {
    let { id, openid, qid, uname, uphone, ucode, uimg } = ctx.request.body;

    if (id && id > 0) {
      await ctx.orm().info_qa_users.update({
        qid, openid, uname, uphone, ucode, uimg
      }, {
        where: {
          id
        }
      })
    } else {
      let result = await ctx.orm().info_qa_users.create({
        qid, openid, uname, uphone, ucode, uimg
      })

      id = result.dataValues.id
    }

    ctx.body = {
      id
    }
  },
  getSolutions: async ctx => {
    let { qid, itemIndex } = ctx.request.body;
    let pageSize = 10;

    let result = await ctx.orm().info_qa_solution.findAll({
      limit: pageSize,
      where: {
        qid,
        itemIndex,
        isok: 1
      },
      order: [['id', 'asc']]
    });

    ctx.body = result
  },
  submitSolution: async ctx => {
    let { qid, uid, itemIndex, itemTitle, itemSolution, qaTitle, solution } = ctx.request.body;

    let isok = parseInt(itemSolution) === parseInt(solution) ? 1 : 0

    let user = await ctx.orm().info_qa_users.findOne({
      where: {
        id: uid
      }
    });

    if (user) {
      let sameUser = await ctx.orm().info_qa_solution.findOne({
        where: {
          qid,
          uid: user.id,
          itemIndex
        }
      });

      if (!sameUser) {
        await ctx.orm().info_qa_solution.create({
          qid, uid,
          openid: user.openid,
          uname: user.uname,
          uphone: user.uphone,
          ucode: user.ucode,
          uimg: user.uimg,
          itemIndex,
          itemTitle,
          itemSolution,
          qaTitle,
          solution,
          isok: isok
        })

        ctx.body = {
          isok: isok,
          solution: solution
        }
      } else {
        ctx.body = {
          errmsg: '您已回答过问题，请等待下一题',
          isok: sameUser.isok,
          solution: sameUser.solution,
        }
      }
    } else {
      ctx.body = {
        errmsg: '您的信息不存在，请先登记'
      }
    }
  }
};