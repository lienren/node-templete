/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2022-01-14 12:59:51
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
        ['id']
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
        order: [['id']]
      })

      uplevel = await ctx.orm().info_user_uplevel.findAll({
        where: {
          userId: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['id']]
      })

      jobs = await ctx.orm().info_user_job.findAll({
        where: {
          userId: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        },
        order: [['id']]
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map((m, i) => {
        let userId = m.dataValues.id
        let userCerts = certs.length > 0 ? certs.filter(f => f.dataValues.userId === userId) : []
        let userUplevel = uplevel.length > 0 ? uplevel.filter(f => f.dataValues.userId === userId) : []
        let userJobs = jobs.length > 0 ? jobs.filter(f => f.dataValues.userId === userId) : []

        return {
          ...m.dataValues,
          index: (pageIndex - 1) * pageSize + (i + 1),
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
      isresign, toretire, inPartyTime } = ctx.request.body;

    toretire = !toretire ? null : toretire

    if (!edu2) {
      edu2 = edu1
    }

    if (id && id > 0) {
      await ctx.orm().info_users.update({
        street, community, name, sex, birthday, nation, political, edu1, edu2, school, major,
        hold: JSON.stringify(hold), holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
        isresign, toretire, inPartyTime
      }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().info_users.create({
        street, community, name, sex, birthday, nation, political, edu1, edu2, school, major,
        hold: JSON.stringify(hold), holdTime, workTime, post, postLevel, phone, idcard, specialty, remark, isretire,
        isresign, toretire, inPartyTime, isDel: 0
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
    let { street } = ctx.request.body;

    let where = '1=1';
    if (street) {
      where += ` and street = '${street}'`
    }

    let sql = `select 't1', count(1) num from info_users where ${where} 
    union all 
    select 't2', count(1) num from info_users where isresign = 1 and ${where} 
    union all 
    select 't3', count(1) num from info_users where isresign = 2 and ${where} 
    union all 
    select 't4', count(1) num from info_users where isretire = 2 and ${where} 
    union all 
    select post, count(1) num from info_users where ${where} group by post `;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  s2: async ctx => {
    let sql1 = `select a.street, count(a.id) num, sum(a.man) man, sum(a.woman) woman, sum(a.age30) age30, sum(a.age3035) age3035, sum(a.age3545) age3545, sum(a.age45) age45,
    sum(a.partymember) partymember, sum(a.member) member, sum(a.masses) masses, sum(a.probationarymember) probationarymember, 
    sum(a.doctor) doctor, sum(a.postgraduate) postgraduate, sum(a.undergraduate) undergraduate, sum(a.juniorcollege) juniorcollege, sum(a.eduother) eduother, 
    sum(a.post0) post0,
    sum(a.post1) post1,
    sum(a.post2) post2,
    sum(a.post3) post3,
    sum(a.post4) post4,
    sum(a.post5) post5,
    sum(a.post6) post6,
    sum(a.post7) post7,
    sum(a.post8) post8,
    sum(a.post9) post9,
    sum(a.post10) post10,
    sum(a.post11) post11,
    sum(a.post12) post12,
    sum(a.post13) post13,
    sum(a.post14) post14,
    sum(a.post15) post15,
    sum(a.post16) post16,
    sum(a.post17) post17,
    sum(a.post18) post18 
    from (
    select id, street, 
    case sex when '男' then 1 else 0 end man, 
    case sex when '女' then 1 else 0 end woman, 
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) <= 30 then 1 else 0 end age30,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) between 31 and 35 then 1 else 0 end age3035,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) between 36 and 45 then 1 else 0 end age3545,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) > 45 then 1 else 0 end age45,
    case political when '党员' then 1 else 0 end partymember,
    case political when '团员' then 1 else 0 end member,
    case political when '群众' then 1 else 0 end masses,
    case political when '预备党员' then 1 else 0 end probationarymember,
    case edu1 when '博士' then 1 else 0 end doctor,
    case edu1 when '硕士' then 1 else 0 end postgraduate,
    case edu1 when '本科' then 1 else 0 end undergraduate,
    case edu1 when '大专' then 1 else 0 end juniorcollege,
    case edu1 when '博士' then 0 when '硕士' then 0 when '本科' then 0 when '大专' then 0 else 1 end eduother,
    case postLevel when 0 then 1 else 0 end post0,
    case postLevel when 1 then 1 else 0 end post1,
    case postLevel when 2 then 1 else 0 end post2,
    case postLevel when 3 then 1 else 0 end post3,
    case postLevel when 4 then 1 else 0 end post4,
    case postLevel when 5 then 1 else 0 end post5,
    case postLevel when 6 then 1 else 0 end post6,
    case postLevel when 7 then 1 else 0 end post7,
    case postLevel when 8 then 1 else 0 end post8,
    case postLevel when 9 then 1 else 0 end post9,
    case postLevel when 10 then 1 else 0 end post10,
    case postLevel when 11 then 1 else 0 end post11,
    case postLevel when 12 then 1 else 0 end post12,
    case postLevel when 13 then 1 else 0 end post13,
    case postLevel when 14 then 1 else 0 end post14,
    case postLevel when 15 then 1 else 0 end post15,
    case postLevel when 16 then 1 else 0 end post16,
    case postLevel when 17 then 1 else 0 end post17,
    case postLevel when 18 then 1 else 0 end post18 from info_users where isresign = 1) a 
    group by a.street;`
    let sql2 = `select street, hold, count(1) num from info_users group by street, hold;`;
    let sql3 = `select u.street, c.certName, count(1) num from info_users u inner join info_user_cert c on c.userId = u.id group by u.street, c.certName;`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);

    let data = result1.map(m => {
      return {
        ...m,
        cs1: 0,
        cs2: 0,
        cs3: 0,
        cs4: m.num,
        j1: 0,
        j2: 0,
        j3: 0,
        j4: 0,
        j5: 0,
        j6: 0,
        j7: 0
      }
    });

    for (let i = 0, j = result2.length; i < j; i++) {
      let f = data.find(f => f.street === result2[i].street);

      if (f) {
        let hold = JSON.parse(result2[i].hold);
        hold.map(m => {
          switch (m) {
            case '一肩挑':
              f.j1 += result2[i].num;
              break;
            case '书记':
              f.j2 += result2[i].num;
              break;
            case '主任':
              f.j3 += result2[i].num;
              break;
            case '副书记':
              f.j4 += result2[i].num;
              break;
            case '副主任':
              f.j5 += result2[i].num;
              break;
            case '社工':
              f.j6 += result2[i].num;
              break;
            case '其他':
              f.j7 += result2[i].num;
              break;
          }
        })
      }
    }

    for (let i = 0, j = result3.length; i < j; i++) {
      let f = data.find(f => f.street === result3[i].street);

      if (f) {
        switch (result3[i].certName) {
          case '全国高级社会工作师':
            f.cs1 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
          case '全国社会工作师':
            f.cs2 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
          case '全国助理社会工作师':
            f.cs3 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
        }
      }
    }

    let total = data.reduce(function (total, curr) {
      Object.keys(curr).map(m => {
        if (m !== 'street') {
          total[m] += parseInt(curr[m])
        }
      })

      return total
    }, {
      street: '合计',
      age30: 0,
      age45: 0,
      age3035: 0,
      age3545: 0,
      cs1: 0,
      cs2: 0,
      cs3: 0,
      cs4: 0,
      doctor: 0,
      eduother: 0,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      juniorcollege: 0,
      man: 0,
      masses: 0,
      member: 0,
      num: 0,
      partymember: 0,
      post0: 0,
      post1: 0,
      post2: 0,
      post3: 0,
      post4: 0,
      post5: 0,
      post6: 0,
      post7: 0,
      post8: 0,
      post9: 0,
      post10: 0,
      post11: 0,
      post12: 0,
      post13: 0,
      post14: 0,
      post15: 0,
      post16: 0,
      post17: 0,
      post18: 0,
      postgraduate: 0,
      probationarymember: 0,
      undergraduate: 0,
      woman: 0
    })

    data.push(total)

    ctx.body = data;
  },
  s3: async ctx => {
    let { street } = ctx.request.body;

    let sql1 = `select a.community, count(a.id) num, sum(a.man) man, sum(a.woman) woman, sum(a.age30) age30, sum(a.age3035) age3035, sum(a.age3545) age3545, sum(a.age45) age45,
    sum(a.partymember) partymember, sum(a.member) member, sum(a.masses) masses, sum(a.probationarymember) probationarymember, 
    sum(a.doctor) doctor, sum(a.postgraduate) postgraduate, sum(a.undergraduate) undergraduate, sum(a.juniorcollege) juniorcollege, sum(a.eduother) eduother, 
    sum(a.post0) post0,
    sum(a.post1) post1,
    sum(a.post2) post2,
    sum(a.post3) post3,
    sum(a.post4) post4,
    sum(a.post5) post5,
    sum(a.post6) post6,
    sum(a.post7) post7,
    sum(a.post8) post8,
    sum(a.post9) post9,
    sum(a.post10) post10,
    sum(a.post11) post11,
    sum(a.post12) post12,
    sum(a.post13) post13,
    sum(a.post14) post14,
    sum(a.post15) post15,
    sum(a.post16) post16,
    sum(a.post17) post17,
    sum(a.post18) post18 
    from (
    select id, community, 
    case sex when '男' then 1 else 0 end man, 
    case sex when '女' then 1 else 0 end woman, 
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) <= 30 then 1 else 0 end age30,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) between 31 and 35 then 1 else 0 end age3035,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) between 36 and 45 then 1 else 0 end age3545,
    case when YEAR(now()) - YEAR(substring(idcard, 7, 8)) > 45 then 1 else 0 end age45,
    case political when '党员' then 1 else 0 end partymember,
    case political when '团员' then 1 else 0 end member,
    case political when '群众' then 1 else 0 end masses,
    case political when '预备党员' then 1 else 0 end probationarymember,
    case edu1 when '博士' then 1 else 0 end doctor,
    case edu1 when '硕士' then 1 else 0 end postgraduate,
    case edu1 when '本科' then 1 else 0 end undergraduate,
    case edu1 when '大专' then 1 else 0 end juniorcollege,
    case edu1 when '博士' then 0 when '硕士' then 0 when '本科' then 0 when '大专' then 0 else 1 end eduother,
    case postLevel when 0 then 1 else 0 end post0,
    case postLevel when 1 then 1 else 0 end post1,
    case postLevel when 2 then 1 else 0 end post2,
    case postLevel when 3 then 1 else 0 end post3,
    case postLevel when 4 then 1 else 0 end post4,
    case postLevel when 5 then 1 else 0 end post5,
    case postLevel when 6 then 1 else 0 end post6,
    case postLevel when 7 then 1 else 0 end post7,
    case postLevel when 8 then 1 else 0 end post8,
    case postLevel when 9 then 1 else 0 end post9,
    case postLevel when 10 then 1 else 0 end post10,
    case postLevel when 11 then 1 else 0 end post11,
    case postLevel when 12 then 1 else 0 end post12,
    case postLevel when 13 then 1 else 0 end post13,
    case postLevel when 14 then 1 else 0 end post14,
    case postLevel when 15 then 1 else 0 end post15,
    case postLevel when 16 then 1 else 0 end post16,
    case postLevel when 17 then 1 else 0 end post17,
    case postLevel when 18 then 1 else 0 end post18 from info_users where isresign = 1 and street = '${street}') a 
    group by a.community;`
    let sql2 = `select community, hold, count(1) num from info_users where street = '${street}' group by community, hold;`;
    let sql3 = `select u.community, c.certName, count(1) num from info_users u inner join info_user_cert c on c.userId = u.id where u.street = '${street}' group by u.community, c.certName;`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);

    let data = result1.map(m => {
      return {
        ...m,
        cs1: 0,
        cs2: 0,
        cs3: 0,
        cs4: m.num,
        j1: 0,
        j2: 0,
        j3: 0,
        j4: 0,
        j5: 0,
        j6: 0,
        j7: 0
      }
    });

    for (let i = 0, j = result2.length; i < j; i++) {
      let f = data.find(f => f.community === result2[i].community);

      if (f) {
        let hold = JSON.parse(result2[i].hold);
        hold.map(m => {
          switch (m) {
            case '一肩挑':
              f.j1 += result2[i].num;
              break;
            case '书记':
              f.j2 += result2[i].num;
              break;
            case '主任':
              f.j3 += result2[i].num;
              break;
            case '副书记':
              f.j4 += result2[i].num;
              break;
            case '副主任':
              f.j5 += result2[i].num;
              break;
            case '社工':
              f.j6 += result2[i].num;
              break;
            case '其他':
              f.j7 += result2[i].num;
              break;
          }
        })
      }
    }

    for (let i = 0, j = result3.length; i < j; i++) {
      let f = data.find(f => f.community === result3[i].community);

      if (f) {
        switch (result3[i].certName) {
          case '全国高级社会工作师':
            f.cs1 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
          case '全国社会工作师':
            f.cs2 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
          case '全国助理社会工作师':
            f.cs3 += result3[i].num;
            f.cs4 -= result3[i].num;
            break;
        }
      }
    }

    let total = data.reduce(function (total, curr) {
      Object.keys(curr).map(m => {
        if (m !== 'community') {
          total[m] += parseInt(curr[m])
        }
      })

      return total
    }, {
      community: '合计',
      age30: 0,
      age45: 0,
      age3035: 0,
      age3545: 0,
      cs1: 0,
      cs2: 0,
      cs3: 0,
      cs4: 0,
      doctor: 0,
      eduother: 0,
      j1: 0,
      j2: 0,
      j3: 0,
      j4: 0,
      j5: 0,
      j6: 0,
      j7: 0,
      juniorcollege: 0,
      man: 0,
      masses: 0,
      member: 0,
      num: 0,
      partymember: 0,
      post0: 0,
      post1: 0,
      post2: 0,
      post3: 0,
      post4: 0,
      post5: 0,
      post6: 0,
      post7: 0,
      post8: 0,
      post9: 0,
      post10: 0,
      post11: 0,
      post12: 0,
      post13: 0,
      post14: 0,
      post15: 0,
      post16: 0,
      post17: 0,
      post18: 0,
      postgraduate: 0,
      probationarymember: 0,
      undergraduate: 0,
      woman: 0
    })

    data.push(total)

    ctx.body = data;
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