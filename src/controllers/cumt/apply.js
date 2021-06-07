/*
 * @Author: Lienren 
 * @Date: 2021-06-06 11:41:44 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-07 15:47:28
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const stateNameEnum = {
  1: '未处理',
  2: '处理中',
  3: '已处理',
  4: '不用处理'
}

module.exports = {
  createApply: async ctx => {
    let openId = ctx.request.body.openId || '';
    let name = ctx.request.body.name || '';
    let phone = ctx.request.body.phone || '';
    let depname = ctx.request.body.depname || '';
    let remark = ctx.request.body.remark || '';
    let imglist = ctx.request.body.imgList || [];
    let imgCode = ctx.request.body.imgCode || '';
    let imgToken = ctx.request.body.imgToken || '';

    assert.ok(!!imgCode, '请填写正确的图形验证码！');
    assert.ok(!!imgToken, '请填写正确的图形验证码！');

    assert.ok(!!openId, '用户信息异常，请联系管理员！');
    assert.ok(!!name, '请填写您的姓名！');
    assert.ok(!!phone, '请填写您的手机号码！');

    let now = date.getTimeStamp();

    // 验证图形验证码
    let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
      where: {
        token: imgToken,
        imgCode: imgCode.toLocaleUpperCase(),
        isUse: 0,
        overTime: { $gt: now }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, '验证码输入错误！');

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      { isUse: 1 },
      {
        where: {
          id: resultImgCodeToken.id
        }
      }
    );

    let imgcount = imglist ? imglist.length : 0;
    let state = 1;

    ctx.orm().applyInfo.create({
      openId,
      name,
      phone,
      depname,
      remark,
      imgcount,
      imglist: imglist ? JSON.stringify(imglist) : [],
      state,
      stateName: stateNameEnum[state]
    });

    ctx.body = {};
  },
  searchApply: async ctx => {
    let state = ctx.request.body.state || 0;
    let name = ctx.request.body.name || '';
    let phone = ctx.request.body.phone || '';
    let depname = ctx.request.body.depname || '';
    let remark = ctx.request.body.remark || '';
    let stime = ctx.request.body.stime || '';
    let etime = ctx.request.body.etime || '';
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {};

    if (state > 0) {
      where.state = state;
    }

    if (!!name) {
      where.name = {
        $like: `%${name}%`
      };
    }

    if (!!phone) {
      where.phone = {
        $like: `%${phone}%`
      };
    }

    if (!!depname) {
      where.depname = {
        $like: `%${depname}%`
      };
    }

    if (!!remark) {
      where.remark = {
        $like: `%${remark}%`
      };
    }

    if (!!stime && !!etime) {
      where.createTime = {
        $between: [stime, etime]
      }
    }

    let result = await ctx.orm().applyInfo.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = {
      total: result.total,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          imglist: JSON.parse(m.dataValues.imglist)
        }
      }),
      pageIndex,
      pageSize
    };
  },
  editApplyState: async ctx => {
    let id = ctx.request.body.id || 0;
    let state = ctx.request.body.state || 1;
    let opName = ctx.request.body.opName || '';
    let opRemark = ctx.request.body.opRemark || '';

    let stateName = stateNameEnum[state];

    let result = await ctx.orm().applyInfo.update({
      state,
      stateName,
      opName,
      opRemark,
      opTime: date.formatDate()
    }, {
      where: {
        id
      }
    })

    ctx.body = {};
  },
  deleteApply: async ctx => {
    let ids = ctx.request.body.ids || [];

    await ctx.orm().applyInfo.destroy({
      where: {
        id: {
          $in: ids
        }
      }
    })

    ctx.body = {}
  }
}