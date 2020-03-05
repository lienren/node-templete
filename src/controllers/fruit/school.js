/*
 * @Author: Lienren
 * @Date: 2020-03-05 09:48:43
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-03-05 14:28:36
 */

const assert = require('assert');
const sequelize = require('sequelize').Sequelize;
const cp = require('./checkParam');
const dic = require('./fruitEnum');
const ali = require('../../extends/ali');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

let mOpenIdDist = {
  xxxxxx: '李恩仁'
};

module.exports = {
  login: async ctx => {
    let openId = ctx.request.body.openId || '';
    let x1 = ctx.request.body.x1 || '';
    let x2 = ctx.request.body.x2 || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';

    cp.isEmpty(openId);
    cp.isEmpty(x1);
    cp.isEmpty(x2);
    cp.isEmpty(imgCode);
    cp.isEmpty(imgCodeToken);

    let now = date.getTimeStamp();

    // 验证图形验证码
    let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
      where: {
        token: imgCodeToken,
        imgCode: imgCode.toLocaleUpperCase(),
        isUse: 0,
        overTime: { $gt: now }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, '验证已过期！');

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      { isUse: 1 },
      {
        where: {
          token: imgCodeToken,
          imgCode: imgCode
        }
      }
    );

    let user = await ctx.orm().school_users.findOne({
      where: {
        x1: x1,
        x2: x2
      }
    });
    assert.notStrictEqual(user, null, '您的信息不存在，请确认后再试！');
    if (user.openId) {
      assert.ok(
        user.openId === openId,
        '您的登录信息已被其它微信号绑定，请更换微信号！'
      );
    }

    if (!user.openId) {
      // 更新openId
      await ctx.orm().school_users.update(
        {
          openId: openId
        },
        {
          where: {
            id: user.id
          }
        }
      );
    }

    ctx.body = {
      id: user.id,
      xIsAdd: user.xIsAdd,
      x19: user.x19
    };
  },
  submitUserInfo: async ctx => {
    let openId = ctx.request.body.openId || '';
    let x3 = ctx.request.body.x3 || '';
    let x4 = ctx.request.body.x4 || '';
    let x5 = ctx.request.body.x5 || '';
    let x6 = ctx.request.body.x6 || '';
    let x7 = ctx.request.body.x7 || '';
    let x8 = ctx.request.body.x8 || '';
    let x9 = ctx.request.body.x9 || '';
    let x10 = ctx.request.body.x10 || '';
    let x11 = ctx.request.body.x11 || '';
    let x12 = ctx.request.body.x12 || '';
    let x13 = ctx.request.body.x13 || 0;
    let x14 = ctx.request.body.x14 || '';
    let x15 = ctx.request.body.x15 || '';
    let x16 = ctx.request.body.x16 || '';
    let x17 = ctx.request.body.x17 || '';
    let x18 = ctx.request.body.x18 || '';

    cp.isEmpty(openId);
    cp.isEmpty(x3);
    cp.isEmpty(x4);
    cp.isEmpty(x5);
    cp.isEmpty(x6);
    cp.isEmpty(x7);
    cp.isEmpty(x8);
    cp.isEmpty(x9);
    // cp.isEmpty(x10);

    cp.isEmpty(x11);
    if (x11 === '自驾') {
      cp.isEmpty(x12);
    }

    cp.isNumber(x13);
    if (x13 > 0) {
      cp.isEmpty(x14);
      cp.isEmpty(x15);
      cp.isEmpty(x16);
      cp.isEmpty(x17);
    }

    // cp.isEmpty(x18);

    let user = await ctx.orm().school_users.findOne({
      where: {
        openId: openId
      }
    });
    assert.notStrictEqual(user, null, '您的信息不存在，请确认后再试！');
    assert.ok(user.xState === 0 && user.xIsAdd === 0, '您的信息已完成登记！');
    assert.ok(user.x3 === x3, '您填写的姓名不正确！');

    await ctx.orm().school_users.update(
      {
        x4,
        x5,
        x6,
        x7,
        x8,
        x9,
        x10,
        x11,
        x12,
        x13,
        x14,
        x15,
        x16,
        x17,
        x18,
        xIsAdd: 1,
        xlsAddTime: date.formatDate()
      },
      {
        where: {
          id: user.id
        }
      }
    );

    ctx.body = {
      id: user.id,
      xIsAdd: 1,
      x19: user.x19
    };
  },
  getUserInfo: async ctx => {
    let openId = ctx.request.body.openId || '';
    let mOpenId = ctx.request.body.mOpenId || '';

    cp.isEmpty(openId);
    cp.isEmpty(mOpenId);

    // TODO:需要验证管理员OpenId

    let user = await ctx.orm().school_users.findOne({
      where: {
        openId: openId
      }
    });
    assert.notStrictEqual(user, null, '您的信息不存在，请确认后再试！');
    assert.ok(user.xIsAdd === 1, '信息未登记，请登记完成后再试！');

    let isBack = 0;
    let backInfo = '报到时间未到，不能入校';

    if (
      user.xState === 0 &&
      user.xIsAdd === 1 &&
      date.formatDate(user.x19, 'YYYYMMDD') ===
        date.formatDate(new Date(), 'YYYYMMDD')
    ) {
      isBack = 1;
      backInfo = '报到时间无误，可以入校';
    } else if (user.xState === 1) {
      isBack = 2;
      backInfo = '已入校签到';
    }

    ctx.body = {
      x1: user.x1,
      x2: user.x2,
      x3: user.x3,
      x5: user.x5,
      x6: user.x6,
      x19: user.x19,
      x11: user.x11,
      x12: user.x12,
      x13: user.x13,
      x14: user.x14,
      x16: user.x16,
      isBack: isBack,
      backInfo: backInfo,
      xBackTime: user.xBackTime
    };
  },
  setUserBackSchool: async ctx => {
    let openId = ctx.request.body.openId || '';
    let mOpenId = ctx.request.body.mOpenId || '';

    cp.isEmpty(openId);
    cp.isEmpty(mOpenId);

    // TODO:需要验证管理员OpenId

    let user = await ctx.orm().school_users.findOne({
      where: {
        openId: openId
      }
    });
    assert.notStrictEqual(user, null, '您的信息不存在，请确认后再试！');
    assert.ok(user.xIsAdd === 1, '信息未登记，请登记完成后再试！');

    if (user.xState === 0) {
      await ctx.orm().school_users.update(
        {
          xState: 1,
          xStateName: '已返校',
          xBackTime: date.formatDate(),
          mOpenId: mOpenId,
          mOpenName: mOpenIdDist[`${mOpenId}`]
        },
        {
          where: {
            id: user.id
          }
        }
      );
    }
  },
  search: async ctx => {}
};
