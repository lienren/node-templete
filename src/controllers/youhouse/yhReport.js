/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:53:41
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-05-12 11:53:42
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');
const sendmsg = require('./yhSendMsg');

const enumReportStatusName = {
  1: '已报备',
  2: '有效客户',
  3: '到访',
  4: '认购',
  5: '签约',
  6: '退房',
};
const enumReportDecoStatusName = {
  1: '已预约',
  2: '已到访',
  3: '已量房',
  4: '已成交',
};

const masterDesoPhone = '18652940112';

module.exports = {
  sumbitReport: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';
    let houseId = ctx.request.body.houseId || 0;
    let cName = ctx.request.body.cName || '';
    let cPhone = ctx.request.body.cPhone || '';
    let cSex = ctx.request.body.cSex || '先生';
    let cGetTime = ctx.request.body.cGetTime || '';

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);
    cp.isNumberGreaterThan0(houseId);
    cp.isEmpty(cName);
    cp.isEmpty(cPhone);
    cp.isEmpty(cSex);
    cp.isEmpty(cGetTime);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let house = await ctx.orm('youhouse').yh_house.findOne({
      where: {
        id: houseId,
        status: 2,
        isDel: 0,
      },
    });
    assert.ok(house !== null, '您选择的楼盘不存在！');

    let report = await ctx.orm('youhouse').yh_report.create({
      hId: house.id,
      hName: house.name,
      hImgUrl: house.imgUrl,
      cName: cName,
      cPhone: cPhone,
      cSex: cSex,
      cGetTime: date.formatDate(cGetTime),
      status: 1,
      statusName: enumReportStatusName[1],
      statusTime: date.formatDate(),
      uId: user.id,
      uName: user.userName,
      uCompName: user.userCompName,
      zc: house.zc,
      zcName: house.zcName,
      addTime: date.formatDate(),
      isDel: 0,
    });

    // 发送驻场人员信息
    sendmsg.create(ctx, {
      smsTitle: '发送驻场人员购房信息',
      smsContent: `【悠房】${user.userCompName}在${date.formatDate(
        new Date(),
        'MM月DD日 HH:mm'
      )}提交购房客户信息，请您及时处理！`,
      smsPhones: house.zc,
    });
    // 发送维护人员信息
    sendmsg.create(ctx, {
      smsTitle: '发送维护人员购房信息',
      smsContent: `【悠房】${user.userCompName}在${date.formatDate(
        new Date(),
        'MM月DD日 HH:mm'
      )}提交购房客户信息，请您及时关注！`,
      smsPhones: house.zc,
    });

    ctx.body = {
      id: report.id,
    };
  },
  getReport: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let result = await ctx.orm('youhouse').yh_report.findAll({
      where: {
        uId: user.id,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let reportItems = [];
    if (result) {
      reportItems = result.map((m) => {
        let data = m.dataValues;
        return {
          id: data.id,
          hName: data.hName,
          hImgUrl: data.hImgUrl,
          cName: data.cName,
          cPhone: data.cPhone,
          cSex: data.cSex,
          cGetTime: date.formatDate(data.cGetTime, 'YYYY年MM月DD日'),
          status: data.status,
          statusName: data.statusName,
          addTime: date.formatDate(data.addTime, 'YYYY年MM月DD日 HH:mm:ss'),
        };
      });
    }

    ctx.body = reportItems;
  },
  getReportByHouse: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';
    let houseId = ctx.request.body.houseId || 0;

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);
    cp.isNumberGreaterThan0(houseId);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let result = await ctx.orm('youhouse').yh_report.findAll({
      where: {
        uId: user.id,
        hId: houseId,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let reportItems = [];
    if (result) {
      reportItems = result.map((m) => {
        let data = m.dataValues;
        return {
          id: data.id,
          hName: data.hName,
          hImgUrl: data.hImgUrl,
          cName: data.cName,
          cPhone: data.cPhone,
          cSex: data.cSex,
          cGetTime: date.formatDate(data.cGetTime, 'YYYY年MM月DD日'),
          status: data.status,
          statusName: data.statusName,
          addTime: date.formatDate(data.addTime, 'YYYY年MM月DD日 HH:mm:ss'),
        };
      });
    }

    ctx.body = reportItems;
  },
  getReportCount: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let countInfo = {
      c1: 0,
      c2: 0,
      c3: 0,
      c4: 0,
    };

    let sql1 = `select count(1) num from yh_report where uid = ${user.id} and isDel = 0;`;
    let result1 = await ctx.orm('youhouse').query(sql1);

    if (result1 && result1.length > 0) {
      countInfo.c1 = result1[0].num;
    }

    let sql2 = `select count(1) num from yh_report_deco where uid = ${user.id} and isDel = 0;`;
    let result2 = await ctx.orm('youhouse').query(sql2);

    if (result2 && result2.length > 0) {
      countInfo.c2 = result2[0].num;
    }

    ctx.body = countInfo;
  },
  submitReportDeco: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';
    let cName = ctx.request.body.cName || '';
    let cPhone = ctx.request.body.cPhone || '';
    let cSex = ctx.request.body.cSex || '先生';
    let cGetTime = ctx.request.body.cGetTime || '';
    let cCost = ctx.request.body.cCost || '';
    let disgId = ctx.request.body.disgId || 0;

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);
    cp.isEmpty(cName);
    cp.isEmpty(cPhone);
    cp.isEmpty(cSex);
    cp.isEmpty(cGetTime);

    let cGetTimeDate = cGetTime.split(' ')[0];
    let cGetTimeTime = cGetTime.split(' ')[1];

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    // 验证这个时间段有没有人预约
    let decoTime = await ctx.orm('youhouse').yh_report_deco.findOne({
      where: {
        cGetTimeDate: date.formatDate(cGetTimeDate),
        cGetTimeTime: cGetTimeTime,
        status: 1,
        statusName: '已预约',
        disgId: disgId,
        isDel: 0,
      },
    });
    assert.ok(decoTime === null, '您选择的预约时间已被占用，请重新选择！');

    let disgUser = null;
    if (disgId > 0) {
      disgUser = await ctx.orm('youhouse').yh_users.findOne({
        where: {
          id: disgId,
          userStatus: 1,
          isDel: 0,
        },
      });
    }

    let report = await ctx.orm('youhouse').yh_report_deco.create({
      cName: cName,
      cPhone: cPhone,
      cSex: cSex,
      cGetTimeDate: date.formatDate(cGetTimeDate),
      cGetTimeTime: cGetTimeTime,
      status: 1,
      statusName: enumReportDecoStatusName[1],
      statusTime: date.formatDate(),
      uId: user.id,
      uName: user.userName,
      cCost: cCost,
      disgId: disgUser ? disgUser.id : 0,
      disgName: disgUser ? disgUser.userName : '',
      addTime: date.formatDate(),
      isDel: 0,
    });

    // 发送朱彦朴信息
    sendmsg.create(ctx, {
      smsTitle: '发送朱彦朴装修信息',
      smsContent: `【悠房】${user.userCompName}在${date.formatDate(
        new Date(),
        'MM月DD日 HH:mm'
      )}提交装修客户信息，请您及时处理！`,
      smsPhones: masterDesoPhone,
    });

    // 发送设计师信息
    if (disgUser && disgUser.id > 0 && disgUser.userPhone !== masterDesoPhone) {
      sendmsg.create(ctx, {
        smsTitle: '发送设计师装修信息',
        smsContent: `【悠房】${user.userCompName}在${date.formatDate(
          new Date(),
          'MM月DD日 HH:mm'
        )}提交装修客户信息，请您及时处理！`,
        smsPhones: disgUser.userPhone,
      });
    }

    ctx.body = {
      id: report.id,
    };
  },
  getReportDeco: async (ctx) => {
    let userId = ctx.request.body.userId || 0;
    let userToken = ctx.request.body.userToken || '';

    cp.isNumberGreaterThan0(userId);
    cp.isEmpty(userToken);

    let user = await ctx.orm('youhouse').yh_users.findOne({
      where: {
        id: userId,
        isDel: 0,
      },
    });
    assert.ok(user !== null, '您的帐号不存在！');
    assert.ok(user.userStatus === 1, '您的帐号被停用，请联系管理员！');
    assert.ok(
      user.userToken === userToken,
      '您的帐号已在别处登录，请退出后重新登录！'
    );

    let result = await ctx.orm('youhouse').yh_report_deco.findAll({
      where: {
        uId: user.id,
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let reportItems = [];
    if (result) {
      reportItems = result.map((m) => {
        let data = m.dataValues;
        return {
          id: data.id,
          cName: data.cName,
          cPhone: data.cPhone,
          cSex: data.cSex,
          cGetTime:
            date.formatDate(data.cGetTimeDate, 'YYYY年MM月DD日') +
            ' ' +
            data.cGetTimeTime,
          cGetTimeDate: date.formatDate(data.cGetTimeDate, 'YYYY年MM月DD日'),
          cGetTimeTime: data.cGetTimeTime,
          status: data.status,
          statusName: data.statusName,
          cCost: data.cCost,
          disgId: data.disgId,
          disgName: data.disgName,
          addTime: date.formatDate(data.addTime, 'YYYY年MM月DD日 HH:mm:ss'),
        };
      });
    }

    ctx.body = reportItems;
  },
  getNoReportDateTime: async (ctx) => {
    let disgId = ctx.request.body.disgId || 0;
    let cGetTime = ctx.request.body.cGetTime || '';

    cp.isEmpty(cGetTime);

    let cGetTimeDate = cGetTime.split(' ')[0];

    let result = await ctx.orm('youhouse').yh_report_deco.findAll({
      where: {
        disgId: disgId,
        cGetTimeDate: date.formatDate(cGetTimeDate),
        status: 1,
        statusName: '已预约',
        isDel: 0,
      },
      order: [['addTime', 'desc']],
    });

    let reportItems = [];
    if (result) {
      reportItems = result.map((m) => {
        return m.dataValues.cGetTimeTime;
      });
    }

    ctx.body = reportItems;
  },
};
