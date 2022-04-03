/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2022-04-03 12:20:43
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/samp/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const excel = require('../../utils/excel');
const AipOcrClient = require("baidu-aip-sdk").ocr;
const { debugPort } = require('process');

const APP_ID = "25119032";
const API_KEY = "3Hlx41svN2dnAKsjQzMtHnh0";
const SECRET_KEY = "UdOj4Y4DFm4S58G23wzhDGXjgUm7bYpG";

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

/*
每2天一检，固定周期
每周一检，固定周期
每月一检，固定周期
每周2次（间隔2天以上），固定周期
当天，无固定周期
48小时内1次，无固定周期
1、14，无固定周期
2、7，无固定周期
1、4、7、10、14，无固定周期
2、7、14，无固定周期
1、4、7、14，无固定周期
1、4、7，无固定周期
*/

/*
AppID：25119032
API Key：3Hlx41svN2dnAKsjQzMtHnh0
Secret Key：UdOj4Y4DFm4S58G23wzhDGXjgUm7bYpG
*/

function formatDate (num) {
  if (typeof num === 'number') {
    let time = new Date((num - 25567 - 2) * 86400 * 1000 - 8 * 3600 * 1000);

    return date.formatDate(time)
  } else {
    return num.trim().split('.')[0]
  }
}


module.exports = {
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, createTime, updateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })
    Object.assign(where, depName2 && { depName2 })
    Object.assign(where, periodType && { periodType })
    Object.assign(where, userType && { userType })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, sampName && { sampName })
    Object.assign(where, sampUserName && { sampUserName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (streets && streets.length > 0) {
      where.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where.community = {
        $in: communitys
      }
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where.sampStartTime = { $between: sampStartTime }
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where.sampHandleTime = { $between: sampHandleTime }
    }

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: updateTime }
    }

    if (address) {
      where.address = {
        $like: `%"${address}"%`
      }
    }

    let result = await ctx.orm().info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getUserSamps: async ctx => {
    let { id } = ctx.request.body;

    let result = await ctx.orm().info_user_samps.findAll({
      where: {
        userId: id
      },
      order: [['createTime', 'desc']]
    })

    ctx.body = result
  },
  getUserSampsS1: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, startEndTime, createTime, updateTime } = ctx.request.body;

    let where = '';

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2) {
      where += ` and u.depName2 = '${depName2}' `;
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
    }

    if (startEndTime && startEndTime.length > 0) {
      where += ` and s.startTime between '${startEndTime[0]}' and '${startEndTime[1]}'`;
    }

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    let sql = `select count(1) num from (
      select a.userId from (
      select s.userId from info_user_samps s
      inner join info_users u on u.id = s.userId
      where u.depId > 2 ${where} 
      ) a
      group by a.userId ) b `

    let sql1 = `select u1.depName1, u1.depName2, u1.name, u1.idcard, u1.phone, u1.tradeType, u1.postName, u1.periodType, b.*, concat(format(b.sampNum/b.shouldSampNum*100,2), '%') srate, concat(format(b.noSampNum/b.shouldSampNum*100,2),'%') nrate from (
      select a.userId, sum(a.shouldSampNum) shouldSampNum, sum(a.sampNum) sampNum, sum(a.noSampNum) noSampNum from (
      select s.userId, u.depId, 1 shouldSampNum, 
      case handleType 
        when '已采样' then 1 
        when '个人上传采样' then 1 
        else 0 end sampNum,
      case handleType 
        when '未采样' then 1 
        else 0 end noSampNum from info_user_samps s
      inner join info_users u on u.id = s.userId
      where u.depId > 2 ${where}
      ) a
      group by a.userId order by a.depId limit ${(pageIndex - 1) * pageSize},${pageSize}) b
      inner join info_users u1 on u1.id = b.userId `;

    let result = await ctx.orm().query(sql);
    let result1 = await ctx.orm().query(sql1);

    ctx.body = {
      total: result && result.length > 0 ? result[0].num : 0,
      list: result1,
      pageIndex,
      pageSize
    }
  },
  exportUserSampsS1: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, startEndTime, createTime, updateTime } = ctx.request.body;

    let where = '';

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
    }

    if (startEndTime && startEndTime.length > 0) {
      where += ` and s.startTime between '${startEndTime[0]}' and '${startEndTime[1]}'`;
    }

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    let sql1 = `select u1.depName1, u1.depName2, u1.name, u1.idcard, u1.phone, u1.tradeType, u1.postName, u1.periodType, b.*, concat(format(b.sampNum/b.shouldSampNum*100,2), '%') srate, concat(format(b.noSampNum/b.shouldSampNum*100,2),'%') nrate from (
      select a.userId, sum(a.shouldSampNum) shouldSampNum, sum(a.sampNum) sampNum, sum(a.noSampNum) noSampNum from (
      select s.userId, u.depId, 1 shouldSampNum, 
      case handleType 
        when '已采样' then 1 
        when '个人上传采样' then 1 
        else 0 end sampNum,
      case handleType 
        when '未采样' then 1 
        else 0 end noSampNum from info_user_samps s
      inner join info_users u on u.id = s.userId
      where u.depId > 2 ${where} 
      ) a
      group by a.userId order by a.depId ) b
      inner join info_users u1 on u1.id = b.userId `;

    let result1 = await ctx.orm().query(sql1);

    let xlsxObj = [];
    xlsxObj.push({
      name: '重点人群采样情况',
      data: []
    })

    xlsxObj[0].data.push([
      '部门',
      '单位',
      '姓名',
      '手机号',
      '身份证号',
      '行业类别',
      '职业名称',
      '采样周期',
      '应采次数',
      '采样次数',
      '脱落次数',
      '采样完成率',
      '脱落率'
    ])

    for (let i = 0, j = result1.length; i < j; i++) {
      let user = result1[i];

      let arr = new Array();
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(user.tradeType);
      arr.push(user.postName);
      arr.push(user.periodType);
      arr.push(user.shouldSampNum);
      arr.push(user.sampNum);
      arr.push(user.noSampNum);
      arr.push(user.srate);
      arr.push(user.nrate);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    ctx.body = excelFile;
  },
  getUserSampsS2: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampName, sampUserName } = ctx.request.body;

    let where = '';

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2) {
      where += ` and u.depName2 = '${depName2}' `;
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    let sql = `select count(1) num from info_user_samps s
    inner join info_users u on u.id = s.userId
    where 
      u.depId > 2 and 
      u.userType in ('在线', '已设置休假') and 
      s.handleType = '未采样' and 
      s.startTime <= DATE_FORMAT(now(),'%Y-%m-%d') and 
      DATE_FORMAT(now(),'%Y-%m-%d') <= s.endTime ${where};`

    let sql1 = `select u.id, u.depName1, u.depName2, u.name, u.idcard, u.phone, u.tradeType, u.postName, u.periodType, current_date() startTime, s.endTime from info_user_samps s 
    inner join info_users u on u.id = s.userId 
    where 
      u.depId > 2 and 
      u.userType in ('在线', '已设置休假') and 
      s.handleType = '未采样' and 
      s.startTime <= DATE_FORMAT(now(),'%Y-%m-%d') and 
      DATE_FORMAT(now(),'%Y-%m-%d') <= s.endTime ${where} 
    order by u.depName1, u.depName2 limit ${(pageIndex - 1) * pageSize},${pageSize}`;

    let result = await ctx.orm().query(sql);
    let result1 = await ctx.orm().query(sql1);

    ctx.body = {
      total: result && result.length > 0 ? result[0].num : 0,
      list: result1,
      pageIndex,
      pageSize
    }
  },
  exportUserSampsS2: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampName, sampUserName } = ctx.request.body;

    let where = '';

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    let sql = `select u.id, u.depName1, u.depName2, u.name, u.idcard, u.phone, u.tradeType, u.postName, u.periodType, current_date() startTime, s.endTime from info_user_samps s 
    inner join info_users u on u.id = s.userId 
    where 
      u.depId > 2 and 
      u.userType in ('在线', '已设置休假') and 
      s.handleType = '未采样' and 
      s.startTime <= DATE_FORMAT(now(),'%Y-%m-%d') and 
      DATE_FORMAT(now(),'%Y-%m-%d') <= s.endTime ${where} 
    order by u.depName1, u.depName2`;

    let result = await ctx.orm().query(sql);

    let xlsxObj = [];
    xlsxObj.push({
      name: '核酸采样提醒',
      data: []
    })

    xlsxObj[0].data.push([
      '部门',
      '单位',
      '姓名',
      '手机号',
      '身份证号',
      '行业类别',
      '职业名称',
      '采样周期',
      '下一次采样时间段'
    ])

    for (let i = 0, j = result.length; i < j; i++) {
      let user = result[i];

      let arr = new Array();
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(user.tradeType);
      arr.push(user.postName);
      arr.push(user.periodType);
      arr.push(user.startTime === user.endTime ? user.endTime : `${user.startTime}至${user.endTime}`);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    ctx.body = excelFile;
  },
  submitUsers: async ctx => {
    let { id, depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, sampWay, street, community, address, userType, sampStartTime } = ctx.request.body;

    let post = await ctx.orm().info_posts.findOne({
      where: {
        postName: postName,
        tradeType: tradeType
      }
    })

    if (id && id > 0) {
      let user1 = await ctx.orm().info_users.findOne({
        where: {
          idcard: idcard
        }
      })

      if (user1.id === id) {
        await ctx.orm().info_users.update({
          depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType,
          sampWay: post.sampWay, street, community, address, userType, sampStartTime, isUp: 0
        }, {
          where: {
            id
          }
        })
      } else {
        // 新记录更新
        await ctx.orm().info_users.update({
          depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType,
          sampWay: post.sampWay, street, community, address, userType, sampStartTime, isUp: 0
        }, {
          where: {
            id
          }
        })

        // 更新老的采样数据
        await ctx.orm().info_user_samps.update({
          userId: id
        }, {
          where: {
            userId: user1.id
          }
        })

        // 删除老的用户
        await ctx.orm().info_users.destroy({
          where: {
            id: user1.id
          }
        })
      }
    } else {
      let user = await ctx.orm().info_users.findOne({
        where: {
          idcard: idcard
        }
      })

      if (user) {
        await ctx.orm().info_users.update({
          depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType,
          sampWay: post.sampWay, street, community, address, userType, sampStartTime, isUp: 0
        }, {
          where: {
            id: user.id
          }
        })
      } else {
        await ctx.orm().info_users.create({
          depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType,
          sampWay: post.sampWay, street, community, address, userType, sampStartTime
        })
      }
    }

    ctx.body = {}
  },
  submitUserRemove: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_users.update({
      depId: 2,
      depName1: '愿检尽检',
      depName2: '愿检尽检',
      depStreet: '',
      tradeType: '其他',
      postName: '愿检尽检人群',
      periodType: '当天',
      sampWay: '1:1单管',
      userType: '迁移',
      isUp: 0
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  s1: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, startEndTime, createTime, updateTime } = ctx.request.body;

    let where = '';

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2) {
      where += ` and u.depName2 = '${depName2}' `;
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
    }

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    if (startEndTime && startEndTime.length > 0) {
      where += ` and s.startTime >= '${startEndTime[0]}' and s.endTime <= '${startEndTime[1]}'`;
    }

    let sql1 = `select b.depName1, b.depName2, count(b.id) num, sum(b.oknum) oknum, sum(b.shouldSampNum) shouldSampNum, sum(b.sampNum) sampNum, sum(b.noSampNum) noSampNum, sum(b.inPlanNum) inPlanNum, sum(b.outPlanNum) outPlanNum from (
      select a.id, a.depName1, a.depName2, if(sum(a.shouldSampNum)=sum(a.sampNum), 1, 0) oknum, sum(a.shouldSampNum) shouldSampNum, sum(a.sampNum) sampNum, sum(a.noSampNum) noSampNum, sum(a.inPlanNum) inPlanNum, sum(a.outPlanNum) outPlanNum from (
      select u.id, u.depName1, u.depName2, 1 shouldSampNum, 
      case handleType when '已采样' then 1 when '个人上传采样' then 1 else 0 end sampNum,
      case handleType when '未采样' then 1 else 0 end noSampNum, 
      case when handleType = '已采样' and isPlan = '计划内' then 1 else 0 end inPlanNum, 
      case when handleType = '已采样' and isPlan = '计划外' then 1 else 0 end outPlanNum 
      from info_users u 
      inner join info_user_samps s on s.userId = u.id 
      where u.depId > 2 ${where}) a 
      group by a.id, a.depName1, a.depName2) b 
      group by b.depName1, b.depName2`;

    let sql2 = `select a.depName1, a.depName2, sum(a.num1) num1, sum(a.num2) num2, sum(a.num3) num3, sum(a.num4) num4, sum(a.num5) num5, sum(a.num6) num6, sum(a.noSampNum) noSampNum from (
      select x.id, x.depName1, x.depName2, x.noSampNum,
        case when x.noSampNum = 1 then 1 else 0 end as num1,
        case when x.noSampNum = 2 then 1 else 0 end as num2,
        case when x.noSampNum = 3 then 1 else 0 end as num3,
        case when x.noSampNum = 4 then 1 else 0 end as num4,
        case when x.noSampNum = 5 then 1 else 0 end as num5,
        case when x.noSampNum > 5 then 1 else 0 end as num6 
      from (
        select u.id, u.depName1, u.depName2, count(1) noSampNum 
        from info_users u 
        inner join info_user_samps s on s.userId = u.id 
        where 
          u.depId > 2 and 
          s.handleType = '未采样' and s.isPlan = '计划内' ${where} 
        group by u.id, u.depName1, u.depName2
      ) x
    ) a
    group by a.depName1, a.depName2`;

    let sql3 = `select a.depName1, a.depName2, count(a.id) isPlanNum, sum(a.isPlanSampNum) isPlanSampNum from (
      select y.id, y.depName1, y.depName2, sum(y.num1) isPlanSampNum from (
        select x.id, x.depName1, x.depName2, sum(x.num1) num1, sum(x.num2) num2 from (
          select
            u.id, u.depName1, u.depName2, 
            case when s.handleType = '已采样' then 1 else 0 end as num1,
            case when s.handleType = '未采样' then 1 else 0 end as num2
          from info_users u 
          inner join info_user_samps s on s.userId = u.id 
          where 
            u.depId > 2 and s.isPlan = '计划内'  ${where}
        ) x 
        group by x.id, x.depName1, x.depName2
      ) y
      where y.num2 = 0
      group by y.id, y.depName1, y.depName2
    ) a
    group by a.depName1, a.depName2`;

    let sql4 = `select a.depName1, a.depName2, count(a.id) isPlanNum, sum(a.isPlanSampNum) isPlanSampNum from (
      select u.id, u.depName1, u.depName2, count(1) isPlanSampNum 
      from info_users u 
      inner join info_user_samps s on s.userId = u.id 
      where 
        u.depId > 2 and 
        s.isPlan = '计划内' ${where} 
      group by u.id, u.depName1, u.depName2
    ) a
    group by a.depName1, a.depName2`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);
    let result4 = await ctx.orm().query(sql4);

    let data = result1.map(m => {
      let f = result2.find(f => f.depName1 === m.depName1 && f.depName2 === m.depName2)
      let f1 = result3.find(f => f.depName1 === m.depName1 && f.depName2 === m.depName2)
      let f2 = result4.find(f => f.depName1 === m.depName1 && f.depName2 === m.depName2)
      return {
        ...m,
        shouldSampNum: parseInt(m.shouldSampNum),
        t1: f ? f.num1 : 0,
        t2: f ? f.num2 : 0,
        t3: f ? f.num3 : 0,
        t4: f ? f.num4 : 0,
        t5: f ? f.num5 : 0,
        t6: f ? f.num6 : 0,
        noSampNum: parseInt(m.noSampNum),
        isPlanNum: f1 ? parseInt(f1.isPlanNum) : 0,
        isPlanSampNum: f1 ? parseInt(f1.isPlanSampNum) : 0,
        isShouldPlanNum: f2 ? parseInt(f2.isPlanNum) : 0,
        isShouldPlanSampNum: f2 ? parseInt(f2.isPlanSampNum) : 0,
        crate: Math.floor(parseInt(m.oknum) / m.num * 10000) / 100,
        trate: Math.floor(parseInt(m.noSampNum) / (f2 ? parseInt(f2.isPlanSampNum) : 0) * 10000) / 100,
        prate: Math.floor(parseInt(f1 ? f1.isPlanNum : 0) / (f2 ? parseInt(f2.isPlanNum) : 0) * 10000) / 100
      }
    })

    let sum = data.reduce((total, curr) => {
      total.num += parseInt(curr.num)
      total.shouldSampNum += parseInt(curr.shouldSampNum)
      total.oknum += parseInt(curr.oknum)
      total.t1 += parseInt(curr.t1)
      total.t2 += parseInt(curr.t2)
      total.t3 += parseInt(curr.t3)
      total.t4 += parseInt(curr.t4)
      total.t5 += parseInt(curr.t5)
      total.t6 += parseInt(curr.t6)
      total.inPlanNum += parseInt(curr.inPlanNum)
      total.outPlanNum += parseInt(curr.outPlanNum)
      total.sampNum += parseInt(curr.sampNum)
      total.noSampNum += parseInt(curr.noSampNum)
      total.isPlanNum += parseInt(curr.isPlanNum)
      total.isPlanSampNum += parseInt(curr.isPlanSampNum)
      total.isShouldPlanNum += parseInt(curr.isShouldPlanNum)
      total.isShouldPlanSampNum += parseInt(curr.isShouldPlanSampNum)
      total.crate = Math.floor(parseInt(total.oknum) / total.num * 10000) / 100,
        total.trate = Math.floor(parseInt(total.noSampNum) / total.isShouldPlanSampNum * 10000) / 100,
        total.prate = Math.floor(parseInt(total.isPlanNum) / total.isShouldPlanNum * 10000) / 100

      return total
    }, {
      depName1: '合计',
      num: 0,
      shouldSampNum: 0,
      oknum: 0,
      t1: 0,
      t2: 0,
      t3: 0,
      t4: 0,
      t5: 0,
      t6: 0,
      inPlanNum: 0,
      outPlanNum: 0,
      sampNum: 0,
      isPlanNum: 0,
      isPlanSampNum: 0,
      isShouldPlanNum: 0,
      isShouldPlanSampNum: 0,
      noSampNum: 0,
      crate: 0,
      trate: 0,
      prate: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  s2: async ctx => {
    let sampName = ctx.request.body.sampName || '';
    let depName1 = ctx.request.body.depName1 || '';
    let depName2 = ctx.request.body.depName2 || '';
    let where1 = ''
    let where2 = ''
    let where3 = ''

    if (sampName) {
      where1 += ` and sampName = '${sampName}'`
      where2 += ` and sampName = '${sampName}'`
      where3 += ` and sampName = '${sampName}'`
    }

    if (depName1) {
      where1 += ` and depName1 = '${depName1}'`
      where2 += ` and exists(select * from info_users where depName1 = '${depName1}' and id = info_user_samps.userId)`
    }

    if (depName2) {
      where1 += ` and depName2 = '${depName2}'`
      where2 += ` and exists(select * from info_users where depName2 = '${depName2}' and id = info_user_samps.userId)`
    }

    let sql1 = `select DATE_FORMAT(handleTime,'%Y-%m-%d') 日期, count(1) 采样人数 from info_user_samps 
    where handleType != '未采样' and handleTime >= DATE_ADD(now(),INTERVAL -8 day) ${where2}
    group by DATE_FORMAT(handleTime,'%Y-%m-%d')`

    let sql2 = `select 't1' title, count(1) num from info_users where 1=1 ${where1} 
    union all 
    select 't2' title, count(1) num from info_users where depId > 2 ${where1} 
    union all 
    select 't3' title, count(1) num from info_users where depId <= 2 ${where1} 
    union all 
    select 't4' title, count(1) num from info_user_samps where handleType != '未采样'  ${where2} 
    union all 
    select 't5' title, count(1) num from info_users where createTime >= DATE_FORMAT(now(),'%Y-%m-%d')  ${where1} 
    union all 
    select 't6' title, count(1) num from info_user_samps where handleTime >= DATE_FORMAT(now(),'%Y-%m-%d') and handleType != '未采样'  ${where2} 
    union all 
    select 't7' title, count(1) num from info_samps where 1=1 ${where3} 
    union all 
    select 't8' title, count(1) num from SuperManagerInfo where verifyLevel = 1 and isDel = 0 ${sampName ? ` and depName = '${sampName}'` : ''}`

    let sql3 = `select * from (
      select sampName 采样点, count(1) 采样人数 from info_user_samps where handleType != '未采样' and handleTime >= DATE_ADD(now(),INTERVAL -8 day) ${where2} group by sampName
      ) a order by a.采样人数 desc `


    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);

    ctx.body = {
      line: result1,
      stat2: result2,
      line1: result3
    };
  },
  s3: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampType, sampName, sampUserName, sampHandleTime, startEndTime, createTime, updateTime } = ctx.request.body;

    let where = '';

    if (sampType && sampType.length > 0) {
      where += ` and ss.sampType = '${sampType}'`;
    }

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2) {
      where += ` and u.depName2 = '${depName2}' `;
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
    }

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    if (startEndTime && startEndTime.length > 0) {
      where += ` and s.startTime >= '${startEndTime[0]}' and s.endTime <= '${startEndTime[1]}'`;
    }

    let sql1 = `select a.sampName, a.userType, count(1) num from (
      select 
      s.sampName, 
      case when u.depId = 2 then '愿检尽检' else '重点人群' end userType from info_user_samps s 
      inner join info_users u on u.id = s.userId 
      inner join info_samps ss on ss.sampName = s.sampName 
      where 1=1 and s.handleType in ('已采样', '个人上传采样') ${where}) a 
      group by a.sampName, a.userType`;

    let result1 = await ctx.orm().query(sql1);

    let data = [];
    result1.map(m => {
      let f = data.find(f => f.name === m.sampName);

      if (f) {
        if (m.userType === '愿检尽检') {
          f.d1 = m.num;
        } else {
          f.d2 = m.num;
        }
      } else {
        data.push({
          name: m.sampName,
          d1: m.userType === '愿检尽检' ? m.num : 0,
          d2: m.userType === '重点人群' ? m.num : 0
        })
      }
    });

    let sum = data.reduce((total, curr) => {
      total.d1 += parseInt(curr.d1)
      total.d2 += parseInt(curr.d2)
      return total
    }, {
      name: '合计',
      d1: 0,
      d2: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  s4: async ctx => {
    let { selectTime } = ctx.request.body;

    if (!selectTime) {
      selectTime = date.formatDate(new Date(), 'YYYY-MM-DD');
    }
    
    let sql1 = `select postName, count(1) num from info_users where depId > 2 and postName != '愿检尽检人群' group by postName`;
    let sql2 = `select u.postName, count(1) num from (
      select userId from info_user_samps 
      where 
        startTime <= '${selectTime}' and 
        endTime >= '${selectTime}' and 
        handleType = '未采样' and 
        userId in (select id from info_users where depId > 2)
      ) a
      inner join info_users u on u.id = a.userId
      group by u.postName`;
    let sql3 = `select postName, count(1) num from info_user_samps where handleType in ('已采样', '个人上传采样') group by postName`;
    let sql4 = `select u.postName, count(1) num from (
      select userId from info_user_samps 
      where 
        DATE_FORMAT(handleTime,'%Y-%m-%d') = '${selectTime}' and  
        handleType in ('已采样', '个人上传采样') and 
        userId in (select id from info_users where depId > 2)
      ) a
      inner join info_users u on u.id = a.userId
      group by u.postName`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);
    let result4 = await ctx.orm().query(sql4);

    let data = result1.map(m => {
      let f2 = result2.find(f => f.postName === m.postName);
      let f3 = result3.find(f => f.postName === m.postName);
      let f4 = result4.find(f => f.postName === m.postName);
      return {
        postName: m.postName,
        n1: m.num,
        n2: f2 ? parseInt(f2.num) : 0,
        n3: f3 ? parseInt(f3.num) : 0,
        n4: f4 ? parseInt(f4.num) : 0
      }
    })

    let sum = data.reduce((total, curr) => {
      total.n1 += parseInt(curr.n1)
      total.n2 += parseInt(curr.n2)
      total.n3 += parseInt(curr.n3)
      total.n4 += parseInt(curr.n4)
      return total
    }, {
      postName: '合计',
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  importUsers: async ctx => {
    if (ctx.req.files && ctx.req.files.length > 0) {
      let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`));

      let xlsx = excel.readExcel(filePath);

      let data = xlsx.filter(f => f.length === 9).map(m => {
        return {
          depName1: m[1].trim(),
          depName2: m[2].trim(),
          depStreet: m[3].trim(),
          name: m[4].trim(),
          tradeType: m[5].trim(),
          postName: m[6].trim(),
          idcard: m[7].toString().trim(),
          phone: m[8].toString().trim(),
          status: 0
        }
      });

      // 删除首行
      data.shift();

      ctx.orm().tmp_info_users.bulkCreate(data);

      // 删除文件
      fs.unlink(filePath, function (error) {
        console.log('delete import excel file error:', error)
        return false
      })

      ctx.body = {};
    } else {
      ctx.body = {};
    }
  },
  importSamp: async ctx => {
    let sampName = ctx.headers['sampname'] || ''
    sampName = decodeURIComponent(sampName)

    if (ctx.req.files && ctx.req.files.length > 0) {
      let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`))

      let xlsx = excel.readExcel(filePath)

      let data = xlsx.filter(f => f.length >= 5).map(m => {
        return {
          name: m[1].toString().trim(),
          idcard: m[2].toString().trim(),
          phone: m[3] ? m[3].toString().trim() : '',
          sampName: sampName,
          sampTime: formatDate(m[4]),
          status: 0
        }
      })

      // 删除首行
      data.shift()

      ctx.orm().tmp_info_samps.bulkCreate(data)

      // 删除文件
      fs.unlink(filePath, function (error) {
        console.log('delete import samp excel file error:', error)
        return false
      })

      ctx.body = {};
    } else {
      ctx.body = {};
    }
  },
  exportUsers: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, createTime, updateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })
    Object.assign(where, periodType && { periodType })
    Object.assign(where, userType && { userType })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, sampName && { sampName })
    Object.assign(where, sampUserName && { sampUserName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (streets && streets.length > 0) {
      where.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where.community = {
        $in: communitys
      }
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where.sampStartTime = { $between: sampStartTime }
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where.sampHandleTime = { $between: sampHandleTime }
    }

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: updateTime }
    }

    if (address) {
      where.address = {
        $like: `%"${address}"%`
      }
    }

    let users = await ctx.orm().info_users.findAll({
      where
    });

    let samps = []
    if (users && users.length > 0) {
      let where1 = '';

      if (tradeTypes && tradeTypes.length > 0) {
        where1 += ' and u.tradeType in (' + tradeTypes.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (postNames && postNames.length > 0) {
        where1 += ' and u.postName in (' + postNames.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depName1s && depName1s.length > 0) {
        where1 += ' and u.depName1 in (' + depName1s.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depName2s && depName2s.length > 0) {
        where1 += ' and u.depName2 in (' + depName2s.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depStreet) {
        where1 += ` and u.depStreet = '${depStreet}'`;
      }

      if (name) {
        where1 += ` and u.name = '${name}'`;
      }

      if (phone) {
        where1 += ` and u.phone = '${phone}'`;
      }

      if (idcard) {
        where1 += ` and u.idcard = '${idcard}'`;
      }

      if (tradeType) {
        where1 += ` and u.tradeType = '${tradeType}'`;
      }

      if (postName) {
        where1 += ` and u.postName = '${postName}'`;
      }

      if (periodType) {
        where1 += ` and u.periodType = '${periodType}'`;
      }

      if (street) {
        where1 += ` and u.street = '${street}'`;
      }

      if (community) {
        where1 += ` and u.community = '${community}'`;
      }

      if (streets && streets.length > 0) {
        where1 += ' and u.street in (' + streets.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (communitys && communitys.length > 0) {
        where1 += ' and u.community in (' + communitys.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (address) {
        where1 += ` and u.address like '%${address}%'`;
      }

      if (userType) {
        where1 += ` and u.userType = '${userType}'`;
      }

      if (sampStartTime && sampStartTime.length > 0) {
        where1 += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
      }

      if (sampName) {
        where1 += ` and u.sampName = '${sampName}'`;
      }

      if (sampUserName) {
        where1 += ` and u.sampUserName = '${sampUserName}'`;
      }

      if (sampHandleTime && sampHandleTime.length > 0) {
        where1 += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
      }

      if (createTime && createTime.length > 0) {
        where1 += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
      }

      if (updateTime && updateTime.length > 0) {
        where1 += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
      }

      let sql1 = `select s.*, u.depName1, u.depName2, u.depStreet, u.name, u.phone, u.idcard, u.street, u.community, u.address from info_user_samps s 
      inner join info_users u on u.id = s.userId 
      where 1=1 ${where1}`;
      samps = await ctx.orm().query(sql1);
    }

    let xlsxObj = [];
    xlsxObj.push({
      name: '采样人员列表',
      data: []
    })

    xlsxObj.push({
      name: '采样信息列表',
      data: []
    })

    xlsxObj[0].data.push([
      '编号',
      '部门',
      '单位',
      '单位所在街道',
      '姓名',
      '手机号',
      '身份证号',
      '行业类别',
      '职业名称',
      '采样周期',
      '街道',
      '社区',
      '住址',
      '用户类型',
      '采集开始时间',
      '最新采样点名称',
      '最新采样人姓名',
      '最新采样时间',
      '创建时间',
      '最后修改时间'
    ])

    xlsxObj[1].data.push([
      '编号',
      '部门',
      '单位',
      '单位所在街道',
      '姓名',
      '手机号',
      '身份证号',
      '职业名称',
      '采样周期',
      '街道',
      '社区',
      '住址',
      '应采样开始时间',
      '应采样结束时间',
      '采样状态',
      '实际采样时间',
      '采样点',
      '采样人',
      '创建时间',
      '最后修改时间'
    ])


    for (let i = 0, j = users.length; i < j; i++) {
      let user = users[i];

      let arr = new Array();
      arr.push(user.id || '');
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.depStreet || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(user.tradeType);
      arr.push(user.postName);
      arr.push(user.periodType);
      arr.push(user.street);
      arr.push(user.community);
      arr.push(user.address);
      arr.push(user.userType);
      arr.push(user.sampStartTime);
      arr.push(user.sampName);
      arr.push(user.sampUserName);
      arr.push(user.sampHandleTime);
      arr.push(user.createTime);
      arr.push(user.updateTime);

      xlsxObj[0].data.push(arr)
    }

    for (let i = 0, j = samps.length; i < j; i++) {
      let samp = samps[i];
      // let user = users.find(f => f.id === samp.dataValues.userId)

      let arr = new Array();
      arr.push(samp.id || '');
      arr.push(samp.depName1 || '');
      arr.push(samp.depName2 || '');
      arr.push(samp.depStreet || '');
      arr.push(samp.name);
      arr.push(samp.phone);
      arr.push(samp.idcard);
      arr.push(samp.postName);
      arr.push(samp.periodType);
      arr.push(samp.street);
      arr.push(samp.community);
      arr.push(samp.address);
      arr.push(samp.startTime);
      arr.push(samp.endTime);
      arr.push(samp.handleType);
      arr.push(samp.handleTime);
      arr.push(samp.sampName);
      arr.push(samp.sampUserName);
      arr.push(samp.createTime);
      arr.push(samp.updateTime);

      xlsxObj[1].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    // ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    // ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  },
  tmpImportSamp: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sampName, name, phone, idcard, status } = ctx.request.body;

    let where = {};

    Object.assign(where, sampName && { sampName })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_samps.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  tmpImportUser: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, status } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  exportTmpImportUser: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, status } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_users.findAll({
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '重点人员导入列表',
      data: []
    })

    xlsxObj[0].data.push([
      '编号',
      '部门',
      '单位',
      '单位所在街道',
      '姓名',
      '手机号',
      '身份证号',
      '行业类别',
      '职业名称',
      '状态',
      '导入情况',
      '导入时间'
    ])

    for (let i = 0, j = result.length; i < j; i++) {
      let user = result[i];

      let arr = new Array();
      arr.push(user.id);
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.depStreet || '');
      arr.push(user.name || '');
      arr.push(user.phone || '');
      arr.push(user.idcard || '');
      arr.push(user.tradeType || '');
      arr.push(user.postName || '');
      arr.push(user.status === 0 ? '待导入' : user.status === 1 ? '导入成功' : '导入失败');
      arr.push(user.remark);
      arr.push(user.createTime);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)
    ctx.body = excelFile;
  },
  submitDep: async ctx => {
    let { id, depName, depStreet, parentDepName } = ctx.request.body;

    assert.ok(!!depName, 'InputParamIsNull');
    assert.ok(!!depStreet, 'InputParamIsNull');
    assert.ok(!!parentDepName, 'InputParamIsNull');

    let parentDep = await ctx.orm().info_deps.findOne({
      where: {
        depName: parentDepName,
        depLevel: 1,
        parentId: 0
      }
    })
    assert.ok(!!parentDep, '部门不存在');

    if (id) {
      let dep = await ctx.orm().info_deps.findOne({
        where: {
          id
        }
      })
      assert.ok(!!dep, '单位不存在');

      await ctx.orm().info_deps.update({
        depName,
        depStreet
      }, {
        where: {
          id: dep.id
        }
      })

      if (dep.depName !== depName) {
        await ctx.orm().info_users.update({
          depName2: depName,
          isUp: 0
        }, {
          where: {
            depName2: dep.depName
          }
        })
      }
    } else {
      await ctx.orm().info_deps.create({
        depName,
        depLevel: 2,
        depStreet,
        parentId: parentDep.id,
        isDel: 0
      })
    }

    ctx.body = {}
  },
  updateUserRest: async ctx => {
    let { id, restTime } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id,
        userType: {
          $in: ['在线', '已设置休假']
        },
        depId: {
          $gt: 2
        }
      }
    })

    assert.ok(!!user, '用户不存在');

    let userType = '在线'
    var oDate1 = new Date(restTime[0]);
    var oDate2 = new Date(date.formatDate(new Date(), 'YYYY-MM-DD'));
    if (oDate1.getTime() <= oDate2.getTime()) {
      userType = '正在休假'
    } else {
      userType = '已设置休假'
    }

    await ctx.orm().info_users.update({
      userType: userType,
      restStartTime: restTime[0],
      restEndTime: restTime[1]
    }, {
      where: {
        id: user.id
      }
    })
  },
  cancelUserRest: async ctx => {
    let { id } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id,
        userType: {
          $in: ['正在休假', '已设置休假']
        },
        depId: {
          $gt: 2
        }
      }
    })

    assert.ok(!!user, '用户不存在');

    await ctx.orm().info_users.update({
      userType: '在线',
      restStartTime: null,
      restEndTime: null
    }, {
      where: {
        id: user.id
      }
    })
  }
};