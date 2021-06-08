/*
 * @Author: Lienren 
 * @Date: 2021-06-08 10:00:29 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-08 11:41:12
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const ip = require('../../utils/ip');
const encrypt = require('../../utils/encrypt');
const jwt = require('../../utils/jwt');
const cp = require('./checkParam');

module.exports = {
  login: async (ctx) => {
    let appid = ctx.request.body.appid || '';
    let ucode = ctx.request.body.ucode || '';
    let uname = ctx.request.body.uname || '';
    let uphone = ctx.request.body.uphone || '';
    let uidcard = ctx.request.body.uidcard || '';
    let uorgs = ctx.request.body.uorgs || '';
    let udepts = ctx.request.body.udepts || '';
    let utype = ctx.request.body.utype || '';
    let sign = ctx.request.body.sign || '';

    assert.ok(!!appid, '入参不正确！');
    assert.ok(appid === 'crrcgc', 'appId参数异常！');
    assert.ok(!!ucode, '入参不正确！');
    assert.ok(!!uname, '入参不正确！');
    assert.ok(!!uphone, '入参不正确！');
    assert.ok(!!uidcard, '入参不正确！');
    assert.ok(!!uorgs, '入参不正确！');
    assert.ok(!!udepts, '入参不正确！');
    assert.ok(!!utype, '入参不正确！');
    assert.ok(!!sign, '入参不正确！');

    let appsecret = `35B64A4C8F0FD7F1A0E71D12A338B9D5`;

    let param = {
      appid,
      appsecret,
      ucode,
      uname,
      uphone,
      uidcard,
      uorgs,
      udepts,
      utype
    }

    let sort = Object.keys(param)
      .sort()
      .map(key => {
        return `${key}:${param[key]}`;
      })
      .join('|');

    let encryptSign = encrypt.getMd5(sort).toLowerCase();
    assert.ok(sign === encryptSign, '签名不正确！');

    let userCompanyId = 1;

    // 验证当前用户是否存在
    // 存在则返回token进行登录
    // 不存在则新增用户信息，返回token进行登录

    let member = await ctx.orm().ums_member.findOne({
      where: {
        username: ucode,
        user_company_id: userCompanyId
      }
    });

    if (member) {
      // 会员已存在
      assert.ok(member.is_del === 0, '您的帐号已被关闭，请联系400客服！');
      assert.ok(member.status === 1, '您的帐号已被停用，请联系400客服！');
    } else {
      // 会员不已存在
      let admin = await ctx.orm().ums_admin.findOne({
        where: {
          status: 1,
          user_type: 2,
          user_company_id: userCompanyId,
          is_del: 0
        }
      });
      assert.ok(!!admin, '创建帐号异常，请联系400客服！');

      let password = ucode;

      member = await ctx.orm().ums_member.create({
        member_level_id: 4,
        username: ucode,
        password: encrypt.getMd5(`${password}|${ucode}`),
        nickname: uname,
        phone: uphone,
        status: 1,
        create_time: date.formatDate(),
        icon: '',
        gender: 1,
        birthday: '1970-01-01',
        city: '',
        job: '',
        personalized_signature: '',
        source_type: 1,
        integration: 0,
        growth: 0,
        luckey_count: 0,
        history_integration: 0,
        user_company_id: userCompanyId,
        is_del: 0,
        cmp_admin_id: admin.id,
        cmp_admin_name: admin.nick_name
      })
    }

    // 生成Token
    let token = jwt.getToken({
      memberId: member.id,
      username: member.username
    });

    // 更新token
    await ctx.orm().ums_member.update({
      token: token
    }, {
      where: {
        id: member.id
      }
    });

    // 查询联合登录扩展信息
    let member_extend = await ctx.orm().ums_member_extend.findOne({
      where: {
        member_id: member.id
      }
    });

    if (member_extend) {
      // 存在更新
      ctx.orm().ums_member_extend.update({
        member_extend: JSON.stringify(param)
      }, {
        where: {
          id: member_extend.id
        }
      })
    } else {
      // 不存在
      ctx.orm().ums_member_extend.create({
        member_id: member.id,
        member_extend: JSON.stringify(param)
      })
    }

    ctx.body = {
      callback: `https://mall.lixianggo.com/mall_shop_mobile/auth?key=${token}`
    }
  },
  signLogin: async (ctx) => {
    let token = ctx.request.body.token || '';

    let member = await ctx.orm().ums_member.findOne({
      attributes: ['id', 'member_level_id', 'username', 'nickname', 'phone', 'integration', 'user_company_id'],
      where: {
        token: token,
        status: 1,
        is_del: 0
      }
    });

    assert.ok(member != null, '用户信息不存在！');

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
  }
};

