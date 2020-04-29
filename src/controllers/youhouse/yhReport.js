/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:53:41
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-04-29 19:37:47
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const enumReportStatusName = {
  1: '已报备',
  2: '有效客户',
  3: '到访',
  4: '认购',
  5: '签约',
  6: '退房',
};
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
};
