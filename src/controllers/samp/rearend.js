/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2021-11-16 17:03:29
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/samp/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const excel = require('../../utils/excel');
const AipOcrClient = require("baidu-aip-sdk").ocr;

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

module.exports = {
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
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
  submitUsers: async ctx => {
    let { id, depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, address, userType, sampStartTime } = ctx.request.body;

    if (id && id > 0) {
      await ctx.orm().info_users.update({
        depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, address, userType, sampStartTime
      }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().info_users.create({
        depId, depName1, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, address, userType, sampStartTime
      })
    }

    ctx.body = {}
  },
  submitPostLevel: async ctx => {
    let { id, postLevelId, postLevelDesc, certNum, certTime, remark } = ctx.request.body;

    postLevelId = parseInt(postLevelId)

    assert.ok(id > 0, '调级参数异常')

    let user = await ctx.orm().info_users.findOne({
      where: { id, isDel: 0 }
    })

    assert.ok(user !== null, '社工不存在，请联系管理员')

    let userCert = await ctx.orm().info_user_cert.findAll({
      where: {
        userId: user.id
      }
    })

    let userUpLevel = await ctx.orm().info_user_uplevel.findAll({
      where: {
        userId: user.id
      }
    })

    let maxPostLevel = 18
    let userPostLeveUp = 0
    let userPostLevel = user.postLevel

    switch (user.post) {
      case '社区正职':
        maxPostLevel = 18;
        break;
      case '社区副职':
        maxPostLevel = 15;
        break;
      case '普通社工':
      case '其他':
        maxPostLevel = 12;
        break;
    }

    let tmpEduLevel = ''
    let eduLevel = ''
    let filter = []

    switch (postLevelId) {
      case 1:
        userPostLeveUp = 1
        break;
      case 2:
        userPostLeveUp = 1
        break;
      case 3:
        tmpEduLevel = eduLevelEnum['本科']
        eduLevel = eduLevelEnum[user.edu2]

        if (tmpEduLevel > eduLevel) {

          filter = userCert.filter(f => {
            return f.dataValues.certName === '全国助理社会工作师' ||
              f.dataValues.certName === '全国社会工作师' ||
              f.dataValues.certName === '全国高级社会工作师';
          })

          if (filter.length === 0) {
            userPostLeveUp = 1
          }

          await ctx.orm().info_users.update({
            edu2: '本科'
          }, {
            where: {
              id: user.id
            }
          })
        }
        break;
      case 4:
        tmpEduLevel = eduLevelEnum['硕士']
        eduLevel = eduLevelEnum[user.edu2]

        if (tmpEduLevel > eduLevel) {

          if (user.edu2 === '本科') {
            userPostLeveUp = 1
          } else {
            userPostLeveUp = 2
          }

          if (userCert.filter(f => { return f.dataValues.certName === '全国助理社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp
          }
          if (userCert.filter(f => { return f.dataValues.certName === '全国社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp
          }
          if (userCert.filter(f => { return f.dataValues.certName === '全国高级社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp
          }

          await ctx.orm().info_users.update({
            edu2: '硕士'
          }, {
            where: {
              id: user.id
            }
          })
        }
        break;
      case 5:
        tmpEduLevel = eduLevelEnum['博士']
        eduLevel = eduLevelEnum[user.edu2]

        if (tmpEduLevel > eduLevel) {

          if (user.edu2 === '本科') {
            userPostLeveUp = 2
          } else if (user.edu2 === '硕士') {
            userPostLeveUp = 1
          } else {
            userPostLeveUp = 3
          }

          if (userCert.filter(f => { return f.dataValues.certName === '全国助理社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 2 ? 2 : userPostLeveUp;
          }
          if (userCert.filter(f => { return f.dataValues.certName === '全国社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp;
          }
          if (userCert.filter(f => { return f.dataValues.certName === '全国高级社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp;
          }

          await ctx.orm().info_users.update({
            edu2: '博士'
          }, {
            where: {
              id: user.id
            }
          })
        }
        break;
      case 6:
        filter = userCert.filter(f => {
          return f.dataValues.certName === '全国助理社会工作师' ||
            f.dataValues.certName === '全国社会工作师' ||
            f.dataValues.certName === '全国高级社会工作师';
        })

        if (filter.length === 0) {

          if (user.edu2 === '本科' ||
            user.edu2 === '硕士' ||
            user.edu2 === '博士') {
            userPostLeveUp = 0
          }

          await ctx.orm().info_user_cert.create({
            userId: user.id,
            certName: '全国助理社会工作师',
            certNum: certNum,
            certDesc: `在${certTime}获得了全国助理社会工作师`,
            certTime: certTime,
            remark: remark
          })
        }
        break;
      case 7:
        filter = userCert.filter(f => {
          return f.dataValues.certName === '全国社会工作师' ||
            f.dataValues.certName === '全国高级社会工作师';
        })

        if (filter.length === 0) {
          userPostLeveUp = 2

          if (userCert.filter(f => { return f.dataValues.certName === '全国助理社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp;
          }
          if (user.edu2 === '本科') {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp;
          }
          if (user.edu2 === '硕士') {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp;
          }
          if (user.edu2 === '博士') {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp;
          }

          await ctx.orm().info_user_cert.create({
            userId: user.id,
            certName: '全国社会工作师',
            certNum: certNum,
            certDesc: `在${certTime}获得了全国社会工作师`,
            certTime: certTime,
            remark: remark
          })
        }
        break;
      case 8:
        filter = userCert.filter(f => {
          return f.dataValues.certName === '全国高级社会工作师';
        })

        if (filter.length === 0) {
          userPostLeveUp = 3

          if (userCert.filter(f => { return f.dataValues.certName === '全国助理社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 2 ? 2 : userPostLeveUp;
          }
          if (userCert.filter(f => { return f.dataValues.certName === '全国社会工作师'; }).length > 0) {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp;
          }
          if (user.edu2 === '本科') {
            userPostLeveUp = userPostLeveUp > 2 ? 2 : userPostLeveUp;
          }
          if (user.edu2 === '硕士') {
            userPostLeveUp = userPostLeveUp > 1 ? 1 : userPostLeveUp;
          }
          if (user.edu2 === '博士') {
            userPostLeveUp = userPostLeveUp > 0 ? 0 : userPostLeveUp;
          }

          await ctx.orm().info_user_cert.create({
            userId: user.id,
            certName: '全国高级社会工作师',
            certNum: certNum,
            certDesc: `在${certTime}获得了全国高级社会工作师`,
            certTime: certTime,
            remark: remark
          })
        }
        break;
      case 9:
        if (userUpLevel.filter(f => f.dataValues.postLevelDesc === '受到市级及以上党委、政府表彰（+1级）').length === 0) {
          userPostLeveUp = 1
        }
        break;
      case 10:
        if (userUpLevel.filter(f => f.dataValues.postLevelDesc === '获得市级及以上劳模称号（+1级）').length === 0) {
          userPostLeveUp = 1
        }
        break;
    }

    // 最大级别限制
    userPostLevel = userPostLevel + userPostLeveUp > maxPostLevel ? maxPostLevel : userPostLevel + userPostLeveUp

    // 记录调级
    await ctx.orm().info_user_uplevel.create({
      userId: user.id,
      oldPostLevel: user.postLevel,
      newPostLevel: userPostLevel,
      postLevelDesc: postLevelDesc,
      remark: remark
    })

    /* await ctx.orm().info_users.update({
      postLevel: userPostLevel
    }, {
      where: {
        id: user.id
      }
    }) */

    ctx.body = {}
  },
  submitResign: async ctx => {
    let { id, resignTime, resignRemark } = ctx.request.body;

    await ctx.orm().info_users.update({
      isresign: 2,
      resignTime: resignTime,
      resignRemark: resignRemark
    }, {
      where: {
        id,
        isDel: 0
      }
    })

    ctx.body = {}
  },
  submitJob: async ctx => {
    let { id, nStreet, nCommunity, hanlder, hanldeTime, remark } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: { id, isDel: 0 }
    })

    assert.ok(user !== null, '社工不存在，请联系管理员')

    await ctx.orm().info_user_job.create({
      userId: user.id,
      oStreet: user.street,
      oCommunity: user.community,
      nStreet,
      nCommunity,
      hanlder,
      hanldeTime,
      remark
    })

    await ctx.orm().info_users.update({
      street: nStreet,
      community: nCommunity
    }, {
      where: {
        id: user.id
      }
    })

    ctx.body = {}
  },
  s1: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, createTime, updateTime } = ctx.request.body;

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

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    let sql1 = `select b.depName1, b.depName2, count(b.id) num, sum(b.oknum) oknum, sum(b.shouldSampNum) shouldSampNum, sum(b.sampNum) sampNum, sum(b.noSampNum) noSampNum from (
      select a.id, a.depName1, a.depName2, if(sum(a.shouldSampNum)=sum(a.sampNum), 1, 0) oknum, sum(a.shouldSampNum) shouldSampNum, sum(a.sampNum) sampNum, sum(a.noSampNum) noSampNum from (
      select u.id, u.depName1, u.depName2, 1 shouldSampNum, 
      case handleType 
      when '已采样' then 1 
      when '个人上传采样' then 1 
      else 0 end sampNum,
      case handleType 
      when '未采样' then 1 
      else 0 end noSampNum 
      from info_users u 
      inner join info_user_samps s on s.userId = u.id 
      where u.depId > 2 ${where}) a 
      group by a.id, a.depName1, a.depName2) b 
      group by b.depName1, b.depName2`;

    let sql2 = `select a.depName1, a.depName2, count(a.id) num, sum(a.noSampNum) noSampNum from (
      select u.id, u.depName1, u.depName2, count(1) noSampNum 
      from info_users u 
      inner join info_user_samps s on s.userId = u.id 
      where u.depId > 2 and s.handleType = '未采样' ${where} 
      group by u.id, u.depName1, u.depName2) a
      group by a.depName1, a.depName2`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    let data = result1.map(m => {
      let f = result2.find(f => f.depName1 === m.depName1 && f.depName2 === m.depName2)
      return {
        ...m,
        t1: f && f.num === 1 ? f.num : 0,
        t2: f && f.num === 2 ? f.num : 0,
        t3: f && f.num === 3 ? f.num : 0,
        t4: f && f.num === 4 ? f.num : 0,
        t5: f && f.num === 5 ? f.num : 0,
        t6: f && f.num >= 6 ? f.num : 0,
        crate: Math.floor(parseInt(m.oknum) / m.num * 10000) / 100,
        trate: Math.floor(parseInt(m.noSampNum) / m.shouldSampNum * 10000) / 100
      }
    })

    ctx.body = data;
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

    if (sampStartTime.indexOf(',')) {
      sampStartTime = sampStartTime.splite(',')
    }

    if (sampHandleTime.indexOf(',')) {
      sampHandleTime = sampHandleTime.splite(',')
    }

    if (createTime.indexOf(',')) {
      createTime = createTime.splite(',')
    }

    if (updateTime.indexOf(',')) {
      updateTime = updateTime.splite(',')
    }

    if (tradeTypes.indexOf(',')) {
      tradeTypes = tradeTypes.splite(',')
    }

    if (postNames.indexOf(',')) {
      postNames = postNames.splite(',')
    }

    if (depName1s.indexOf(',')) {
      depName1s = depName1s.splite(',')
    }

    if (depName2s.indexOf(',')) {
      depName2s = depName2s.splite(',')
    }

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
      samps = await ctx.orm().info_user_samps.findAll({
        where: {
          userId: {
            $in: users.map(m => {
              return m.dataValues.id
            })
          }
        }
      });
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
      let user = users.find(f => f.id === samp.dataValues.userId)

      let arr = new Array();
      arr.push(samp.id || '');
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.depStreet || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(samp.postName);
      arr.push(samp.periodType);
      arr.push(user.street);
      arr.push(user.community);
      arr.push(user.address);
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

    let excelFile = excel.exportMoreSheetExcel(xlsxObj);

    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  }
};