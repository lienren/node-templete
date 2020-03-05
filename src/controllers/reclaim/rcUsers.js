/*
 * @Author: Lienren
 * @Date: 2020-02-23 11:34:17
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-02-28 14:59:23
 */
'use strict';

const assert = require('assert');
const Sequelize = require('sequelize');
const date = require('../../utils/date');

module.exports = {
  getUserInfo: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let headImg = user.u_head;
    if (headImg.indexOf('http') < 0 && headImg.indexOf('https') < 0) {
      headImg = `https://www.jiangxinzhiyin.com${headImg}`;
    }

    ctx.body = {
      nickName: user.u_nick_name,
      integral: user.u_integral,
      headImg: headImg,
      openId: openId,
      uId: user.u_id
    };
  },
  setUserInfo: async ctx => {
    let openId = ctx.request.body.openId || '';
    let nickName = ctx.request.body.nickName || '';
    let headImg = ctx.request.body.headImg || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    // 更新用户昵称和头像
    await ctx.orm().user.update(
      {
        u_nick_name: nickName,
        u_head: headImg
      },
      {
        where: {
          u_id: user.u_id
        }
      }
    );

    ctx.body = {};
  },
  getUserSign: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let sign_time = parseInt(date.formatDate(new Date(), 'YYYYMMDD'));
    let sign = await ctx.orm().user_sign.findOne({
      where: {
        u_id: user.u_id,
        sign_time: sign_time
      }
    });

    ctx.body = {
      isSign: sign && sign.id > 0 ? 1 : 0
    };
  },
  setUserSign: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let sign_time = parseInt(date.formatDate(new Date(), 'YYYYMMDD'));
    let sign = await ctx.orm().user_sign.findOne({
      where: {
        u_id: user.u_id,
        sign_time: sign_time
      }
    });

    assert.ok(!sign, '今天您已经签到过了，明天再来吧！');

    if (!sign) {
      let s_integral = 5;
      let now = date.formatDate();

      // 记录签到
      await ctx.orm().user_sign.create({
        u_id: user.u_id,
        sign_time: sign_time,
        s_integral: s_integral,
        s_time: now
      });

      // 送积分
      await ctx.orm().user.update(
        {
          u_integral: Sequelize.literal(`u_integral + ${s_integral}`)
        },
        {
          where: {
            u_id: user.u_id
          }
        }
      );

      // 添加任务信息
      ctx.orm().user_task_info.create({
        uId: user.u_id,
        taskName: '完成每日签到',
        taskContext: `${now}完成每日签到赠送${s_integral}个环保币`,
        taskIntegral: s_integral,
        uNickName: user.u_nick_name,
        uHeadImg: user.u_head,
        uPosition: '未知',
        addTime: date.formatDate()
      });
    }

    ctx.body = {};
  },
  getUserNewSign: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let sign = await ctx.orm().user_new.findOne({
      where: {
        u_id: user.u_id
      }
    });

    ctx.body = {
      isSign: sign ? 1 : 0
    };
  },
  setUserNewSign: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    assert.ok(user, '用户不存在！');

    let sign = await ctx.orm().user_new.findOne({
      where: {
        u_id: user.u_id
      }
    });

    assert.ok(!sign, '您已经收下见面礼了，快去完成其它任务吧！');

    if (!sign) {
      let sign_time = parseInt(date.formatDate(new Date(), 'YYYYMMDD'));
      let n_integral = 50;
      let now = date.formatDate();

      // 记录新用户收礼
      await ctx.orm().user_new.create({
        u_id: user.u_id,
        sign_time: sign_time,
        n_integral: n_integral,
        n_time: now
      });

      // 送积分
      await ctx.orm().user.update(
        {
          u_integral: Sequelize.literal(`u_integral + ${n_integral}`)
        },
        {
          where: {
            u_id: user.u_id
          }
        }
      );

      // 添加任务信息
      ctx.orm().user_task_info.create({
        uId: user.u_id,
        taskName: '完成新手见面礼',
        taskContext: `${now}完成新手见面礼赠送${n_integral}个环保币`,
        taskIntegral: n_integral,
        uNickName: user.u_nick_name,
        uHeadImg: user.u_head,
        uPosition: '未知',
        addTime: date.formatDate()
      });
    }
  },
  setUserInvite: async ctx => {
    let superiorId = ctx.request.body.superiorId || 0;

    assert.notStrictEqual(superiorId, 0, '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_id: superiorId
      }
    });

    assert.ok(user, '用户不存在！');

    let n_integral = 20;
    let now = date.formatDate();

    // 送积分
    await ctx.orm().user.update(
      {
        u_integral: Sequelize.literal(`u_integral + ${n_integral}`)
      },
      {
        where: {
          u_id: user.u_id
        }
      }
    );

    // 添加任务信息
    ctx.orm().user_task_info.create({
      uId: user.u_id,
      taskName: '成功分享好友',
      taskContext: `${now}成功分享好友赠送${n_integral}个环保币`,
      taskIntegral: n_integral,
      uNickName: user.u_nick_name,
      uHeadImg: user.u_head,
      uPosition: '未知',
      addTime: date.formatDate()
    });
  },
  getTaskNumber: async ctx => {
    let gteOrderCount = await ctx.orm().ordinary_order.count({
      where: {
        oo_weight: { $gte: 15 }
      }
    });

    let gradeCount = await ctx.orm().grade.count();
    let newUserCount = await ctx.orm().user_new.count();
    let taskInfo = await ctx.orm().user_task_info.findAll({
      limit: 10,
      order: [['addTime', 'desc']]
    });

    let taskList = taskInfo.map(m => {
      return {
        ...m.dataValues,
        uHeadImg:
          m.dataValues.uHeadImg &&
          (m.dataValues.uHeadImg.indexOf('http') >= 0 ||
            m.dataValues.uHeadImg.indexOf('https') >= 0)
            ? m.dataValues.uHeadImg
            : `https://www.jiangxinzhiyin.com${m.dataValues.uHeadImg}`
      };
    });

    ctx.body = {
      gteOrderCount,
      gradeCount,
      newUserCount,
      taskInfo: taskList
    };
  },
  getRank: async ctx => {
    let totalRankSql = `select a.u_id, u.u_nick_name, u.u_head, a.oo_weight, (select sum(ir_integral) from integral_record where lower_u_id = a.u_id) ir_integral from (
        select u_id, SUM(oo_weight) oo_weight from ordinary_order where oo_status = 3 group by u_id) a
        inner join user u on u.u_id = a.u_id
        order by a.oo_weight desc limit 5;`;
    let totalRank = await ctx.orm().query(totalRankSql);

    let monthRankSql = `select a.u_id, u.u_nick_name, u.u_head, a.oo_weight, (select sum(ir_integral) from integral_record where lower_u_id = a.u_id) ir_integral from (
        select u_id, SUM(oo_weight) oo_weight from ordinary_order where oo_status = 3 and date_format(oo_time,'%Y')=date_format(now(),'%Y') group by u_id) a
        inner join user u on u.u_id = a.u_id
        order by a.oo_weight desc limit 5;`;
    let monthRank = await ctx.orm().query(monthRankSql);

    let totalRankList = totalRank.map(m => {
      return {
        ...m,
        u_head:
          m.u_head &&
          (m.u_head.indexOf('http') >= 0 || m.u_head.indexOf('https') >= 0)
            ? m.u_head
            : `https://www.jiangxinzhiyin.com${m.u_head}`
      };
    });

    let monthRankList = monthRank.map(m => {
      return {
        ...m,
        u_head:
          m.u_head &&
          (m.u_head.indexOf('http') >= 0 || m.u_head.indexOf('https') >= 0)
            ? m.u_head
            : `https://www.jiangxinzhiyin.com${m.u_head}`
      };
    });

    ctx.body = {
      totalRank: totalRankList,
      monthRank: monthRankList
    };
  }
};
