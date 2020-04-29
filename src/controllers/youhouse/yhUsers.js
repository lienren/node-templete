/*
 * @Author: Lienren
 * @Date: 2020-04-29 15:22:15
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-04-29 18:21:48
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const enumDefStatusName = {
  0: '未启用',
  1: '已启用',
};
const enumUserStatusName = {
  0: '待审核',
  1: '已启用',
  2: '已停用',
};

async function checkImageCode(ctx, imgCodeToken, imgCode) {
  let now = date.getTimeStamp();

  // 验证图形验证码
  let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
    where: {
      token: imgCodeToken,
      imgCode: imgCode.toLocaleUpperCase(),
      isUse: 0,
      overTime: {
        $gt: now,
      },
    },
  });

  if (resultImgCodeToken) {
    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      {
        isUse: 1,
      },
      {
        where: {
          token: imgCodeToken,
          imgCode: imgCode,
        },
      }
    );

    return true;
  }

  return false;
}

module.exports = {
  getDefUsers: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_def_users.findAll({
      where: {
        defStatus: 1,
        isDel: 0,
      },
    });

    ctx.body = result;
  },
  register: async (ctx) => {
    let userPhone = ctx.request.body.userPhone || '';
    let userPwd = ctx.request.body.userPwd || '';
    let userName = ctx.request.body.userName || '';
    let defId = ctx.request.body.defId || 0;
    let userCompName = ctx.request.body.userCompName || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(userPhone);
    cp.isEmpty(userPwd);
    cp.isEmpty(userName);
    cp.isNumberGreaterThan0(defId);
    cp.isEmpty(userCompName);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let imgCodeResult = await checkImageCode(ctx, imgCodeToken, imgCode);
    assert.ok(imgCodeResult, '验证码错误或已过期！');

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        userPhone: userPhone,
        isDel: 0,
      },
    });

    assert.ok(user === null, '您输入的手机号已被注册过！');

    let defUser = await ctx.orm('youhouse').yh_def_users.findOne({
      where: {
        id: defId,
        defStatus: 1,
        isDel: 0,
      },
    });

    assert.ok(defUser !== null, '您选择的维护人不存在！');

    let salt = comm.randNumberCode(6);
    let pwd = encrypt.getMd5(userPwd + '|' + salt);
    user = await ctx.orm('youhouse').yh_users.create({
      userPhone: userPhone,
      userPwd: pwd,
      userSalt: salt,
      userName: userName,
      defId: defUser.id,
      defName: defUser.defName,
      userCompName: userCompName,
      userStatus: 1,
      userStatusName: enumUserStatusName[1],
      addTime: date.formatDate(),
      isDel: 0,
    });

    ctx.body = {
      userId: user.id,
    };
  },
  login: async (ctx) => {
    let userPhone = ctx.request.body.userPhone || '';
    let userPwd = ctx.request.body.userPwd || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(userPhone);
    cp.isEmpty(userPwd);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let imgCodeResult = await checkImageCode(ctx, imgCodeToken, imgCode);
    assert.ok(imgCodeResult, '验证码错误或已过期！');

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        userPhone: userPhone,
        isDel: 0,
      },
    });

    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');

    let salt = user.userSalt;
    let pwd = encrypt.getMd5(userPwd + '|' + salt);

    assert.ok(user.userPwd === pwd, '您的密码不正确！');

    let defUser = await ctx.orm('youhouse').yh_def_users.findOne({
      where: {
        id: user.defId,
        defStatus: 1,
        isDel: 0,
      },
    });

    assert.ok(defUser !== null, '您选择的维护人不存在，请联系管理员！');

    ctx.body = {
      userId: user.id,
      userPhone: user.userPhone,
      userName: user.userName,
      defId: user.defId,
      defName: user.defName,
      defPhone: defUser.defPhone,
      userCompName: user.userCompName,
    };
  },
};
