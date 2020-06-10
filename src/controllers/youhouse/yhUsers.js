/*
 * @Author: Lienren
 * @Date: 2020-04-29 15:22:15
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-10 15:54:39
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
const enumUserTypeName = {
  1: '房产经纪人',
  2: '悠房渠道对接人',
  3: '悠房驻场人员',
  4: '装修设计师',
  5: '悠房项目经理',
  999: '系统人员',
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

async function checkSmsCode(ctx, phone, code) {
  let now = date.formatDate();

  // 验证图形验证码
  let resultSmsCode = await ctx.orm().yh_sms_code.findOne({
    where: {
      phone: phone,
      code: code,
      isUse: 0,
      overTime: {
        $gt: now,
      },
      isDel: 0,
    },
  });

  if (resultSmsCode) {
    // 设置图形验证码已使用
    ctx.orm().yh_sms_code.update(
      {
        isUse: 1,
      },
      {
        where: {
          phone: phone,
          isDel: 0,
        },
      }
    );

    return true;
  }

  return false;
}

module.exports = {
  register: async (ctx) => {
    let userPhone = ctx.request.body.userPhone || '';
    let smsCode = ctx.request.body.smsCode || '';
    let userName = ctx.request.body.userName || '';
    let defId = ctx.request.body.defId || 0;
    let userCompName = ctx.request.body.userCompName || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(userPhone);
    cp.isEmpty(smsCode);
    cp.isEmpty(userName);
    cp.isNumberGreaterThan0(defId);
    cp.isEmpty(userCompName);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let imgCodeResult = await checkImageCode(ctx, imgCodeToken, imgCode);
    assert.ok(imgCodeResult, '图形验证码错误或已过期！');

    let smsCodeResult = await checkSmsCode(ctx, userPhone, smsCode);
    assert.ok(smsCodeResult, '短信验证码错误或已过期！');

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        userPhone: userPhone,
        isDel: 0,
      },
    });

    assert.ok(user === null, '您输入的手机号已被注册过！');

    let defUser = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: defId,
        userStatus: 1,
        isDel: 0,
      },
    });

    assert.ok(defUser !== null, '您选择的维护人不存在！');

    user = await ctx.orm('youhouse').yh_users.create({
      userPhone: userPhone,
      userPwd: '',
      userSalt: '',
      userName: userName,
      defId: defUser.id,
      defName: defUser.userName,
      userCompName: userCompName,
      userStatus: 1,
      userStatusName: enumUserStatusName[1],
      addTime: date.formatDate(),
      userType: 1,
      userTypeName: enumUserTypeName[1],
      isDel: 0,
    });

    ctx.body = {
      userId: user.id,
    };
  },
  login: async (ctx) => {
    let userPhone = ctx.request.body.userPhone || '';
    let smsCode = ctx.request.body.smsCode || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(userPhone);
    cp.isEmpty(smsCode);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let imgCodeResult = await checkImageCode(ctx, imgCodeToken, imgCode);
    assert.ok(imgCodeResult, '图形验证码错误或已过期！');

    let smsCodeResult = await checkSmsCode(ctx, userPhone, smsCode);
    assert.ok(smsCodeResult, '短信验证码错误或已过期！');

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        userPhone: userPhone,
        isDel: 0,
      },
    });

    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');

    let defUser = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: user.defId,
        userStatus: 1,
        isDel: 0,
      },
    });

    assert.ok(defUser !== null, '您选择的维护人不存在，请联系管理员！');

    let userToken = comm.randCode(32);

    ctx.orm('youhouse').yh_users.update(
      {
        userToken: userToken,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    ctx.body = {
      userId: user.id,
      userPhone: user.userPhone,
      userName: user.userName,
      defId: user.defId,
      defName: user.defName,
      defPhone: defUser.userPhone,
      userCompName: user.userCompName,
      userToken: userToken,
      userType: user.userType,
      userTypeName: user.userTypeName,
    };
  },
  getDefUsers: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_users.findAll({
      where: {
        userStatus: 1,
        userType: 2,
        isDel: 0,
      },
    });

    let users = result.map((m) => {
      let data = m.dataValues;
      return {
        id: data.id,
        defName: data.userName,
        defPhone: data.userPhone,
      };
    });

    ctx.body = users;
  },
  getDecoUsers: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_users.findAll({
      where: {
        userStatus: 1,
        userType: 4,
        isDel: 0,
      },
    });

    let users = result.map((m) => {
      let data = m.dataValues;
      return {
        id: data.id,
        userName: data.userName,
        userPhone: data.userPhone,
      };
    });

    ctx.body = users;
  },
  getSysUsers: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_users.findAll({
      where: {
        userStatus: 1,
        userType: {
          $in: [2, 3, 4, 5],
        },
        isDel: 0,
      },
    });

    let users = result.map((m) => {
      let data = m.dataValues;
      return {
        id: data.id,
        userName: data.userName,
        userPhone: data.userPhone,
        userType: data.userType,
        userTypeName: data.userTypeName,
      };
    });

    ctx.body = users;
  },
};
