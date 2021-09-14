/*
 * @Author: Lienren
 * @Date: 2020-03-05 09:48:43
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-09-04 13:50:13
 */

const assert = require('assert');
const cp = require('./checkParam');
const date = require('../../utils/date');

const stateEnum = {
  0: '未提交',
  1: '待审核',
  2: '审核通过',
  3: '审核不通过'
}

module.exports = {
  login: async (ctx) => {
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
        overTime: {
          $gt: now,
        },
      },
    });
    assert.notStrictEqual(resultImgCodeToken, null, '验证码已过期！');

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update({
      isUse: 1,
    }, {
      where: {
        token: imgCodeToken,
        imgCode: imgCode,
      },
    });

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        x1: x1,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.x2 === x2, '您输入密码不正确，请重新输入！');
    if (user.openId) {
      assert.ok(
        user.openId === openId,
        '您的登录信息已被其它微信号绑定，请更换微信号！'
      );
    }

    if (!user.openId) {
      // 更新openId
      await ctx.orm().school_users_v2.update({
        openId: openId,
      }, {
        where: {
          id: user.id,
        },
      });
    }

    let isBack =
      parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
      parseInt(date.formatDate(user.x19, 'YYYYMMDD'));

    let backInfo = isBack ?
      '今天可以返校' :
      '今天不可以返校，您的返校时间是：' +
      date.formatDate(user.x19, 'YYYY年MM月DD日');

    ctx.body = {
      id: user.id,
      xIsAdd: user.xIsAdd,
      state: user.state,
      stateName: user.stateName,
      x19: user.x19,
      isBack: isBack,
      backInfo: backInfo,
      x1: user.x1,
      x3: user.x3,
      x5: user.x5,
      x6: user.x6,
      x20: user.x20,
      today: date.formatDate(new Date(), 'YYYY年MM月DD日'),
    };
  },
  submitUserInfo: async (ctx) => {
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
    let x19 = ctx.request.body.x19 || '';
    let x21 = ctx.request.body.x21 || '';
    let skm = ctx.request.body.skm || '';
    let hsjc = ctx.request.body.hsjc || '0';
    let hsjctime = ctx.request.body.hsjctime || '';
    let hsjcaddr = ctx.request.body.hsjcaddr || '';

    cp.isEmpty(openId);
    cp.isEmpty(x4);
    cp.isEmpty(x7);
    cp.isEmpty(x8);
    cp.isEmpty(x9);
    cp.isEmpty(x10);
    cp.isEmpty(x11);
    cp.isEmpty(skm);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0 && user.xIsAdd === 0, '您的信息已完成登记！');

    await ctx.orm().school_users_v2.update({
      x4,
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
      x21,
      xState: 0,
      xStateName: '未返校',
      xIsAdd: 1,
      xlsAddTime: date.formatDate(),
      state: 2,
      stateName: stateEnum[2],
      skm,
      hsjc,
      hsjctime,
      hsjcaddr
    }, {
      where: {
        id: user.id,
      },
    });

    let isBack =
      parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
      parseInt(date.formatDate(user.x19, 'YYYYMMDD'));

    let backInfo = isBack ?
      '今天可以返校' :
      '今天不可以返校，您的返校时间是：' +
      date.formatDate(user.x19, 'YYYY年MM月DD日');

    ctx.body = {
      id: user.id,
      state: user.state,
      backInfo,
      xIsAdd: 1,
      today: date.formatDate(new Date(), 'YYYY年MM月DD日'),
    };
  },
  submitUserInfo1: async (ctx) => {
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
    let x19 = ctx.request.body.x19 || '';
    let x21 = ctx.request.body.x21 || '';

    cp.isEmpty(openId);
    cp.isEmpty(x3);
    cp.isEmpty(x4);
    cp.isEmpty(x7);
    cp.isEmpty(x8);
    cp.isEmpty(x9);
    cp.isEmpty(x19);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0 && user.xIsAdd === 0, '您的信息已完成登记！');
    assert.ok(user.x3 === x3, '您填写的姓名不正确！');

    await ctx.orm().school_users_v2.update({
      x4,
      x7,
      x8,
      x9,
      x11,
      x12,
      x13,
      x14,
      x15,
      x16,
      x17,
      x18,
      x19,
      x21,
      xIsAdd: 0,
      state: 1,
      stateName: stateEnum[1]
    }, {
      where: {
        id: user.id,
      },
    });

    ctx.body = {
      id: user.id,
      state: user.state,
      xIsAdd: 1,
      today: date.formatDate(new Date(), 'YYYY年MM月DD日'),
    };
  },
  submitUserInfo2: async (ctx) => {
    let openId = ctx.request.body.openId || '';
    // let x3 = ctx.request.body.x3 || '';
    // let x4 = ctx.request.body.x4 || '';
    // let x5 = ctx.request.body.x5 || '';
    // let x6 = ctx.request.body.x6 || '';
    // let x7 = ctx.request.body.x7 || '';
    // let x8 = ctx.request.body.x8 || '';
    // let x9 = ctx.request.body.x9 || '';
    let x10 = ctx.request.body.x10 || '';
    let x11 = ctx.request.body.x11 || '';
    let x12 = ctx.request.body.x12 || '';
    let x13 = ctx.request.body.x13 || 0;
    let x14 = ctx.request.body.x14 || '';
    let x15 = ctx.request.body.x15 || '';
    let x16 = ctx.request.body.x16 || '';
    let x17 = ctx.request.body.x17 || '';
    // let x18 = ctx.request.body.x18 || '';
    let x19 = ctx.request.body.x19 || '';
    let x21 = ctx.request.body.x21 || '';
    let x31 = ctx.request.body.x31 || '';

    cp.isEmpty(openId);
    cp.isEmpty(x19);
    cp.isEmpty(x31);

    cp.isEmpty(x11);
    if (x11 === '自驾') {
      cp.isEmpty(x12);
    }

    cp.isNumber(x13);
    if (x13 > 0) {
      // cp.isEmpty(x14);
      // cp.isEmpty(x15);
      // cp.isEmpty(x16);
      // cp.isEmpty(x17);
    }

    // cp.isEmpty(x18);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.state === 2, '您的信息未审核通过，请耐心等待审核结果！');
    assert.ok(user.xState === 0 && user.xIsAdd === 0, '您的信息已完成登记！');

    await ctx.orm().school_users_v2.update({
      x10,
      x11,
      x12,
      x13,
      x14,
      x15,
      x16,
      x17,
      x19,
      x21,
      x31,
      xIsAdd: 1,
      xlsAddTime: date.formatDate(),
    }, {
      where: {
        id: user.id,
      },
    });

    let isBack =
      parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
      parseInt(date.formatDate(user.x19, 'YYYYMMDD'));

    let backInfo = isBack ?
      '今天可以返校' :
      '今天不可以返校，您的返校时间是：' +
      date.formatDate(user.x19, 'YYYY年MM月DD日');

    ctx.body = {
      id: user.id,
      xIsAdd: 1,
      x19: user.x19,
      isBack: isBack,
      backInfo: backInfo,
      state: user.state,
      stateName: user.stateName,
      today: date.formatDate(new Date(), 'YYYY年MM月DD日'),
    };
  },
  submitUserInfoX: async (ctx) => {
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
    let x21 = ctx.request.body.x21 || '';

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
      // cp.isEmpty(x14);
      // cp.isEmpty(x15);
      // cp.isEmpty(x16);
      // cp.isEmpty(x17);
    }

    // cp.isEmpty(x18);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0 && user.xIsAdd === 0, '您的信息已完成登记！');
    assert.ok(user.x3 === x3, '您填写的姓名不正确！');

    await ctx.orm().school_users_v2.update({
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
      x21,
      xIsAdd: 1,
      xlsAddTime: date.formatDate(),
    }, {
      where: {
        id: user.id,
      },
    });

    let isBack =
      parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
      parseInt(date.formatDate(user.x19, 'YYYYMMDD'));

    let backInfo = isBack ?
      '今天可以返校' :
      '今天不可以返校，您的返校时间是：' +
      date.formatDate(user.x19, 'YYYY年MM月DD日');

    ctx.body = {
      id: user.id,
      xIsAdd: 1,
      x19: user.x19,
      isBack: isBack,
      backInfo: backInfo,
      today: date.formatDate(new Date(), 'YYYY年MM月DD日'),
    };
  },
  clearUserInfo: async (ctx) => {
    let openId = ctx.request.body.openId || '';

    cp.isEmpty(openId);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0, '您已报道入校，不能重填信息！');

    await ctx.orm().school_users_v2.update({
      x4: '',
      x7: '',
      x8: '',
      x9: '',
      x10: '',
      x11: '',
      x12: '',
      x13: 0,
      x14: '',
      x15: '',
      x16: '',
      x17: '',
      x18: '',
      x19: null,
      x21: '',
      x22: '',
      xIsAdd: 0,
      xlsAddTime: date.formatDate(),
      state: 0,
      stateName: stateEnum[0]
    }, {
      where: {
        id: user.id,
      },
    });

    ctx.body = {};
  },
  clearUserInfo2: async (ctx) => {
    let openId = ctx.request.body.openId || '';

    cp.isEmpty(openId);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0, '您已报道入校，不能重填信息！');

    await ctx.orm().school_users_v2.update({
      x11: '',
      x12: '',
      x13: 0,
      x14: '',
      x15: '',
      x16: '',
      x17: '',
      x21: '',
      x22: '',
      x31: null,
      xIsAdd: 0,
      xlsAddTime: date.formatDate()
    }, {
      where: {
        id: user.id,
      },
    });

    ctx.body = {};
  },
  clearUserInfoById: async (ctx) => {
    let id = ctx.request.body.id || 0;

    cp.isNumber(id);

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        id: id,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xState === 0, '您已报道入校，不能重填信息！');

    await ctx.orm().school_users_v2.update({
      openId: '',
      x4: '',
      x7: '',
      x8: '',
      x9: '',
      x10: '',
      x11: '',
      x12: '',
      x13: 0,
      x14: '',
      x15: '',
      x16: '',
      x17: '',
      x18: '',
      // x19: null,
      x21: '',
      x22: '',
      x31: null,
      xIsAdd: 0,
      xlsAddTime: date.formatDate(),
      state: 0,
      stateName: stateEnum[0],
      skm: '',
      hsjc: '',
      hsjctime: '',
      hsjcaddr: ''
    }, {
      where: {
        id: user.id,
      },
    });

    ctx.body = {};
  },
  getUserInfo: async (ctx) => {
    let openId = ctx.request.body.openId || '';
    let mOpenId = ctx.request.body.mOpenId || '';

    cp.isEmpty(openId);
    cp.isEmpty(mOpenId);

    // TODO:需要验证管理员OpenId
    let manager = await ctx.orm().school_manager.findOne({
      where: {
        openId: mOpenId,
        isDel: 0,
      },
    });

    assert.notStrictEqual(manager, null, '您不是查验员，无权进入查看信息！');

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xIsAdd === 1, '信息未登记，请登记完成后再试！');

    let isBack = 0;
    let backInfo = '报到时间未到，不能入校';

    if (user.xState === 0 && user.xIsAdd === 1) {
      if (
        parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
        parseInt(date.formatDate(user.x19, 'YYYYMMDD'))
      ) {
        isBack = 1;
        backInfo = '报到时间无误，可以入校';
      } else {
        isBack = 3;
        backInfo = '返校日期是：' + date.formatDate(user.x19, 'YYYY年MM月DD日');
      }
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
      x11: user.x11,
      x12: user.x12,
      x13: user.x13,
      x14: user.x14,
      x16: user.x16,
      x19: user.x19,
      x21: user.x21,
      skm: user.skm,
      hsjc: user.hsjc,
      hsjctime: user.hsjctime,
      hsjcaddr: user.hsjcaddr,
      isBack: isBack,
      backInfo: backInfo,
      xBackTime: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    };
  },
  setUserBackSchool: async (ctx) => {
    let openId = ctx.request.body.openId || '';
    let mOpenId = ctx.request.body.mOpenId || '';

    cp.isEmpty(openId);
    cp.isEmpty(mOpenId);

    // TODO: 需要验证管理员OpenId
    let manager = await ctx.orm().school_manager.findOne({
      where: {
        openId: mOpenId,
        isDel: 0,
      },
    });

    assert.notStrictEqual(manager, null, '您不是查验员，无权设置返校！');

    let user = await ctx.orm().school_users_v2.findOne({
      where: {
        openId: openId,
      },
    });
    assert.notStrictEqual(
      user,
      null,
      '您不在返校名单中，请向辅导员确认是否暂缓/暂不返校！'
    );
    assert.ok(user.xIsAdd === 1, '信息未登记，请登记完成后再试！');

    if (user.xState === 0) {
      let isBack =
        parseInt(date.formatDate(new Date(), 'YYYYMMDD')) >=
        parseInt(date.formatDate(user.x19, 'YYYYMMDD'));

      await ctx.orm().school_users_v2.update({
        xState: 1,
        xStateName: '已返校',
        xBackTime: date.formatDate(),
        mOpenId: manager.openId,
        mOpenName: manager.manageName,
        x22: isBack ? '正常返校' : '提前返校',
      }, {
        where: {
          id: user.id,
        },
      });
    }
  },
  search: async (ctx) => {
    let isAdd = ctx.request.body.isAdd || -1;
    let isAddSTime = ctx.request.body.isAddSTime || '';
    let isAddETime = ctx.request.body.isAddETime || '';
    let state = ctx.request.body.state;
    let verifyState = ctx.request.body.verifyState;
    let backSTime = ctx.request.body.backSTime || '';
    let backETime = ctx.request.body.backETime || '';
    let x1 = ctx.request.body.x1 || '';
    let x2 = ctx.request.body.x2 || '';
    let x3 = ctx.request.body.x3 || '';
    let x4 = ctx.request.body.x4 || '';
    let x5 = ctx.request.body.x5 || '';
    let x6 = ctx.request.body.x6 || '';
    let x7 = ctx.request.body.x7 || '';
    let x8 = ctx.request.body.x8 || '';
    let x9 = ctx.request.body.x9 || '';
    let x11 = ctx.request.body.x11 || '';
    let x12 = ctx.request.body.x12 || '';
    let x13 = ctx.request.body.x13 || -1;
    let x14 = ctx.request.body.x14 || '';
    let x15 = ctx.request.body.x15 || '';
    let x16 = ctx.request.body.x16 || '';
    let x19 = ctx.request.body.x19 || '';
    let x20 = ctx.request.body.x20 || '';
    let x22 = ctx.request.body.x22 || '';
    let area = ctx.request.body.area || '';
    let skm = ctx.request.body.skm || '';
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;

    let where = {};

    if (isAdd > -1) {
      where.xIsAdd = isAdd;
    }

    if (isAddSTime !== '' && isAddETime !== '') {
      where.xlsAddTime = {
        $between: [isAddSTime, isAddETime],
      };
    }

    state = state === undefined || state === null ? -1 : state
    if (state > -1) {
      where.xState = state;
    }

    verifyState = verifyState === undefined || verifyState === null ? -1 : verifyState
    if (verifyState > -1) {
      where.state = verifyState;
    }

    if (backSTime !== '' && backETime !== '') {
      where.xBackTime = {
        $between: [backSTime, backETime],
      };
    }

    if (skm !== '') {
      where.skm = skm;
    }

    if (x1 !== '') {
      where.x1 = x1;
    }
    if (x2 !== '') {
      where.x2 = x2;
    }
    if (x3 !== '') {
      where.x3 = x3;
    }
    if (x4 !== '') {
      where.x4 = x4;
    }
    if (x5 !== '') {
      where.x5 = x5;
    }
    if (x6 !== '') {
      where.x6 = x6;
    }
    if (x7 !== '') {
      where.x7 = x7;
    }
    if (x8 !== '') {
      where.x8 = x8;
    }
    if (x9 !== '') {
      where.x9 = x9;
    }
    if (x11 !== '') {
      where.x11 = x11;
    }
    if (x12 !== '') {
      where.x12 = x12;
    }
    if (x13 > -1) {
      where.x13 = x13;
    }
    if (x14 !== '') {
      where.x14 = x14;
    }
    if (x15 !== '') {
      where.x15 = x15;
    }
    if (x16 !== '') {
      where.x16 = x16;
    }
    if (x19 !== '') {
      where.x19 = {
        $between: [`${x19} 00:00:00`, `${x19} 23:59:59`],
      };
    }
    if (x20 !== '') {
      where.x20 = x20;
    }
    if (x22 != '') {
      where.x22 = x22;
    }

    if (area !== '') {
      where.area = area;
    }

    let list = await ctx.orm().school_users_v2.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
    });

    ctx.body = {
      list: list.rows,
      total: list.count,
      pageIndex,
      pageSize,
    };
  },
  addManager: async (ctx) => {
    let openId = ctx.request.body.openId || '';
    let manageName = ctx.request.body.manageName || '';

    let result = await ctx.orm().school_manager.findOne({
      where: {
        openId: openId,
      },
    });

    assert.ok(result === null, '您已经是管理员！');

    // 管理员不存在，则添加
    await ctx.orm().school_manager.create({
      openId,
      manageName,
      addTime: date.formatDate(),
      isDel: 0,
    });

    ctx.body = {};
  },
  submitVerfiyState: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let verfiyState = ctx.request.body.verfiyState || 0;

    cp.isEmpty(id);

    await ctx.orm().school_users_v2.update({
      state: verfiyState,
      stateName: stateEnum[verfiyState]
    }, {
      where: {
        id: id,
        state: 1
      },
    });

    ctx.body = {};
  },
  submitBatchVerfiyState: async (ctx) => {
    let id = ctx.request.body.id || [];
    let verfiyState = ctx.request.body.verfiyState || 0;

    cp.isArrayLengthGreaterThan0(id);

    await ctx.orm().school_users_v2.update({
      state: verfiyState,
      stateName: stateEnum[verfiyState]
    }, {
      where: {
        id: {
          $in: id
        },
        state: 1
      },
    });

    ctx.body = {};
  }
};