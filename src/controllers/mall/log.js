/*
 * @Author: Lienren 
 * @Date: 2021-06-16 23:03:15 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-17 00:16:32
 */
'use strict';

const date = require('../../utils/date');
const ip = require('../../utils/ip');

module.exports = {
  record: async (ctx) => {
    let click = ctx.request.body;

    let userAgent = ctx.request.headers['user-agent'] || '';
    let ipAddress = ip.getClientIP(ctx.request);

    let now = date.getTimeStamp();

    // 存储到新的埋点
    ctx.orm().pagelogs.create({
      terminalId: click.terminalId,
      openId: click.openId,
      udcId: click.udcId || 0,
      phone: click.phone,
      fromUdcId: click.fromUdcId || 0,
      prePageUrl: click.prePageUrl,
      prePageName: click.prePageName,
      prePageSort: click.prePageSort || 0,
      pageName: click.pageName,
      pageUrl: click.pageUrl,
      pageSort: click.pageSort || 0,
      eventName: click.eventName,
      activeName: click.activeName,
      eventValue: click.eventValue,
      sourceId: click.sourceId,
      projectCode: click.projectCode,
      projectName: click.projectName,
      trafficSource: click.trafficSource,
      mediumId: click.mediumId,
      classId: click.classId,
      channelId: click.channelId,
      businessCode: click.businessCode,
      applyNo: click.applyNo,
      startTime: click.startTime ? click.startTime : 0,
      useTime: click.useTime ? click.useTime : 0,
      screenSize: click.screenSize,
      screenDPI: click.screenDPI,
      userAgent,
      addTime: now,
      ip: ipAddress
    });

    ctx.body = {}
  }
};

