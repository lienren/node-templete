/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2021-11-03 16:25:18
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/human/rearend.js
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

const eduLevelEnum = {
  "博士": 9,
  "硕士": 8,
  "本科": 7,
  "大专": 6,
  "中专": 5,
  "职业高中": 4,
  "技工": 3,
  "高中": 2,
  "初中": 1
}

module.exports = {
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { street, community, streets, communitys, name, sex, birthday, nation, political, edu1, edu2, school, major,
      hold, holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
      isresign, toretire, createTime, updateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, name && { name })
    Object.assign(where, sex && { sex })
    Object.assign(where, nation && { nation })
    Object.assign(where, political && { political })
    Object.assign(where, edu1 && { edu1 })
    Object.assign(where, edu2 && { edu2 })
    Object.assign(where, post && { post })
    Object.assign(where, postLevel && { postLevel })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, isretire && { isretire })
    Object.assign(where, isresign && { isresign })

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

    if (birthday && birthday.length > 0) {
      where.birthday = { $between: birthday }
    }

    if (holdTime && holdTime.length > 0) {
      where.holdTime = { $between: holdTime }
    }

    if (workTime && workTime.length > 0) {
      where.workTime = { $between: workTime }
    }

    if (toretire && toretire.length > 0) {
      where.toretire = { $between: toretire }
    }

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: updateTime }
    }

    if (hold) {
      where.hold = {
        $like: `%"${hold}"%`
      }
    }

    if (school) {
      where.school = {
        $like: `%${school}%`
      }
    }

    if (major) {
      where.major = {
        $like: `%${major}%`
      }
    }

    if (specialty) {
      where.specialty = {
        $like: `%${specialty}%`
      }
    }

    if (remark) {
      where.remark = {
        $like: `%${remark}%`
      };
    }

    let result = await ctx.orm().info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let certs = []
    let uplevel = []
    let jobs = []
    if (result && result.count > 0 && result.rows && result.rows.length > 0) {
      certs = await ctx.orm().info_user_cert.findAll({
        where: {
          userId: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['id', 'desc']]
      })

      uplevel = await ctx.orm().info_user_uplevel.findAll({
        where: {
          userId: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['id', 'desc']]
      })

      jobs = await ctx.orm().info_user_job.findAll({
        where: {
          userId: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['id', 'desc']]
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let userId = m.dataValues.id
        let userCerts = certs.length > 0 ? certs.filter(f => f.dataValues.userId === userId) : []
        let userUplevel = uplevel.length > 0 ? uplevel.filter(f => f.dataValues.userId === userId) : []
        let userJobs = jobs.length > 0 ? jobs.filter(f => f.dataValues.userId === userId) : []

        return {
          ...m.dataValues,
          certs: userCerts,
          uplevel: userUplevel,
          jobs: userJobs
        }
      }),
      pageIndex,
      pageSize
    }
  },
  submitUsers: async ctx => {
    let { id, street, community, name, sex, birthday, nation, political, edu1, edu2, school, major,
      hold, holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
      isresign, toretire } = ctx.request.body;

    toretire = !toretire ? null : toretire

    if (!edu2) {
      edu2 = edu1
    }

    if (id && id > 0) {
      await ctx.orm().info_users.update({
        street, community, name, sex, birthday, nation, political, edu1, edu2, school, major,
        hold: JSON.stringify(hold), holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
        isresign, toretire
      }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().info_users.create({
        street, community, name, sex, birthday, nation, political, edu1, edu2, school, major,
        hold: JSON.stringify(hold), holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
        isresign, toretire, isDel: 0
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
    let sql = `select 't1', count(1) num from info_users 
    union all 
    select 't2', count(1) num from info_users where isresign = 1
    union all 
    select 't3', count(1) num from info_users where isresign = 2
    union all 
    select 't4', count(1) num from info_users where isretire = 2
    union all 
    select post, count(1) num from info_users group by post `;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  exportUsers: async ctx => {
    let { street, community, streets, communitys, name, sex, birthday, nation, political, edu1, edu2, school, major,
      hold, holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
      isresign, toretire, createTime, updateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, name && { name })
    Object.assign(where, sex && { sex })
    Object.assign(where, nation && { nation })
    Object.assign(where, political && { political })
    Object.assign(where, edu1 && { edu1 })
    Object.assign(where, edu2 && { edu2 })
    Object.assign(where, post && { post })
    Object.assign(where, postLevel && { postLevel })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, isretire && { isretire })
    Object.assign(where, isresign && { isresign })

    if (streets && streets.length > 0 && streets.indexOf(',') >= 0) {
      streets = streets.split(',')
      where.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0 && communitys.indexOf(',') >= 0) {
      communitys = communitys.split(',')
      where.community = {
        $in: communitys
      }
    }

    if (birthday && birthday.length > 0 && birthday.indexOf(',') >= 0) {
      birthday = birthday.split(',')
      where.birthday = { $between: birthday }
    }

    if (holdTime && holdTime.length > 0 && holdTime.indexOf(',') >= 0) {
      holdTime = holdTime.split(',')
      where.holdTime = { $between: holdTime }
    }

    if (workTime && workTime.length > 0 && workTime.indexOf(',') >= 0) {
      workTime = workTime.split(',')
      where.workTime = { $between: workTime }
    }

    if (toretire && toretire.length > 0 && toretire.indexOf(',') >= 0) {
      toretire = toretire.split(',')
      where.toretire = { $between: toretire }
    }

    if (createTime && createTime.length > 0 && createTime.indexOf(',') >= 0) {
      createTime = createTime.split(',')
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0 && updateTime.indexOf(',') >= 0) {
      updateTime = updateTime.split(',')
      where.updateTime = { $between: updateTime }
    }

    if (hold) {
      where.hold = {
        $like: `%"${hold}"%`
      }
    }

    if (school) {
      where.school = {
        $like: `%${school}%`
      }
    }

    if (major) {
      where.major = {
        $like: `%${major}%`
      }
    }

    if (specialty) {
      where.specialty = {
        $like: `%${specialty}%`
      }
    }

    if (remark) {
      where.remark = {
        $like: `%${remark}%`
      };
    }

    let users = await ctx.orm().info_users.findAll({
      where
    });

    let certs = []
    let uplevel = []
    let jobs = []
    if (users && users.length > 0) {
      certs = await ctx.orm().info_user_cert.findAll({
        where: {
          userId: {
            $in: users.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['userId']]
      })

      uplevel = await ctx.orm().info_user_uplevel.findAll({
        where: {
          userId: {
            $in: users.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['userId']]
      })

      jobs = await ctx.orm().info_user_job.findAll({
        where: {
          userId: {
            $in: users.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['userId']]
      })
    }

    let xlsxObj = [];
    xlsxObj.push({
      name: '社工列表',
      data: []
    })
    xlsxObj.push({
      name: '社工证书',
      data: []
    })
    xlsxObj.push({
      name: '社工调级记录',
      data: []
    })
    xlsxObj.push({
      name: '社工调动记录',
      data: []
    })

    xlsxObj[0].data.push([
      '编号',
      '街道',
      '社区',
      '姓名',
      '性别',
      '手机号',
      '身份证号',
      '出生年月',
      '民族',
      '政治面貌',
      '第一学历',
      '毕业院校',
      '所学专业',
      '最高学历',
      '任职情况',
      '任职年月',
      '工作年月',
      '岗位',
      '岗级',
      '特长',
      '备注',
      '是否退休',
      '是否辞职',
      '辞职日期',
      '辞职描述',
      '即将退休日期',
      '创建时间',
      '最后修改时间'
    ])

    xlsxObj[1].data.push([
      '编号',
      '姓名',
      '手机号',
      '身份证号',
      '证书名称',
      '证书编号',
      '证书描述',
      '获取证书时间',
      '备注',
      '创建时间'
    ])

    xlsxObj[2].data.push([
      '编号',
      '姓名',
      '手机号',
      '身份证号',
      '调整前级别',
      '调整后级别',
      '级别调整原因',
      '备注',
      '创建时间'
    ])

    xlsxObj[3].data.push([
      '编号',
      '姓名',
      '手机号',
      '身份证号',
      '调动前街道',
      '调动前社区',
      '调动后街道',
      '调动后社区',
      '调动人',
      '调动时间',
      '备注',
      '创建时间'
    ])

    for (let i = 0, j = users.length; i < j; i++) {
      let user = users[i];

      let arr = new Array();
      arr.push(user.id || '');
      arr.push(user.street || '');
      arr.push(user.community || '');
      arr.push(user.name);
      arr.push(user.sex);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(user.birthday);
      arr.push(user.nation);
      arr.push(user.political);
      arr.push(user.edu1);
      arr.push(user.school);
      arr.push(user.major);
      arr.push(user.edu2);
      arr.push(JSON.parse(user.hold).map(m => {
        return m;
      }).join(','));
      arr.push(user.holdTime);
      arr.push(user.workTime);
      arr.push(user.post);
      arr.push(user.postLevel);
      arr.push(user.specialty);
      arr.push(user.remark);
      arr.push(user.isretire === 2 ? "已退休" : "未退休");
      arr.push(user.isresign === 2 ? "已辞职" : "未辞职");
      arr.push(user.resignTime);
      arr.push(user.resignRemark);
      arr.push(user.toretire);
      arr.push(user.createTime);
      arr.push(user.updateTime);

      xlsxObj[0].data.push(arr)
    }

    for (let i = 0, j = certs.length; i < j; i++) {
      let cert = certs[i];

      let user = users.find(f => f.dataValues.id === cert.userId);

      let arr = new Array();
      arr.push(cert.id || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(cert.certName);
      arr.push(cert.certNum);
      arr.push(cert.certDesc);
      arr.push(cert.certTime);
      arr.push(cert.remark);
      arr.push(cert.createTime);

      xlsxObj[1].data.push(arr)
    }

    for (let i = 0, j = uplevel.length; i < j; i++) {
      let up = uplevel[i];

      let user = users.find(f => f.dataValues.id === up.userId);

      let arr = new Array();
      arr.push(up.id || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(up.oldPostLevel);
      arr.push(up.newPostLevel);
      arr.push(up.postLevelDesc);
      arr.push(up.remark);
      arr.push(up.createTime);

      xlsxObj[2].data.push(arr)
    }

    for (let i = 0, j = jobs.length; i < j; i++) {
      let job = jobs[i];

      let user = users.find(f => f.dataValues.id === job.userId);

      let arr = new Array();
      arr.push(job.id || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(job.oStreet);
      arr.push(job.oCommunity);
      arr.push(job.nStreet);
      arr.push(job.nCommunity);
      arr.push(job.hanlder);
      arr.push(job.hanldeTime);
      arr.push(job.remark);
      arr.push(job.createTime);

      xlsxObj[3].data.push(arr)
    }

    let excelFile = excel.exportMoreSheetExcel(xlsxObj);

    ctx.set('Content-Type', 'application/vnd.openxmlformats');
    ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  }
};