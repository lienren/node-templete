/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2021-11-01 06:59:40
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
  setUserMute: async ctx => {
    let id = ctx.request.body.id || 0;
    let isMute = ctx.request.body.isMute || 1;
    let muteDay = ctx.request.body.muteDay || 7;

    let muteTime = date.formatDate(new Date(), 'YYYY-MM-DD') + ' 00:00:00';
    let muteEndTime = '';
    if (isMute === 2) {
      muteEndTime = date.timestampToTime(date.timeToTimeStamp(muteTime) + (muteDay + 1) * 24 * 3600 * 1000);
    }

    await ctx.orm().info_user.update({
      isMute: isMute,
      muteTime: isMute === 2 ? muteTime : null,
      muteEndTime: isMute === 2 ? muteEndTime : null,
    }, {
      where: {
        id: id
      }
    })

    ctx.body = {};
  },
  getVillageData: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { title, name, phone, dataType, villageId, startCreateTime, endCreateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, title && { title })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, dataType && { dataType })

    if (villageId && villageId.length > 0) {
      where.villageId = {
        $in: villageId
      }
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    let result = await ctx.orm().village_data.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let communitys = await ctx.orm().info_community.findAll({});
    let villages = await ctx.orm().info_village.findAll({});

    let rows = result.rows.map(m => {
      let c = villages.find(f => f.id === m.dataValues.villageId)
      let cinfo = c ? communitys.find(f => f.id === c.communityId) : null

      return {
        ...m.dataValues,
        communityId: cinfo ? cinfo.id : 0,
        communityName: cinfo ? cinfo.communityName : '',
        villageId: cinfo ? [cinfo.id, m.dataValues.villageId] : m.dataValues.villageId
      }
    })

    ctx.body = {
      total: result.count,
      list: rows,
      pageIndex,
      pageSize
    };
  },
  delVillageData: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().village_data.destroy({
      where: {
        id
      }
    });

    ctx.body = {};
  },
  submitVillageData: async ctx => {
    let { id, villageId, villageName, dataType, title, name, phone, headImg, d1, d2, d3 } = ctx.request.body;

    if (villageId && Array.isArray(villageId) && villageId.length === 2) {
      villageId = villageId[1]

      let result = await ctx.orm().info_village.findOne({
        where: {
          id: villageId
        }
      })

      if (result) {
        villageName = result.villageName
      }
    }

    if (id && id > 0) {
      // 更新
      await ctx.orm().village_data.update({
        villageId,
        villageName,
        dataType,
        title,
        name,
        phone,
        headImg,
        d1,
        d2,
        d3
      }, {
        where: {
          id
        }
      })
    } else {
      // 新增
      await ctx.orm().village_data.create({
        villageId,
        villageName,
        dataType,
        title,
        name,
        phone,
        headImg,
        d1,
        d2,
        d3
      })
    }

    ctx.body = {}
  },
  getApplyVolunteer: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      verifyStaus: 1,
      isDel: 0
    };

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().apply_volunteer.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where
    });

    let rows = result.rows;

    if (rows && rows.length > 0) {
      let users = await ctx.orm().info_user.findAll({
        where: {
          id: {
            $in: rows.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      if (users) {
        rows = rows.map(m => {
          let u = users.find(f => f.dataValues.id === m.dataValues.userId);

          return {
            ...m.dataValues,
            userHeadImg: m.dataValues.imgUrl,
            customerId: u.customerId,
            nickName: u.nickName,
            userName: u.userName,
            userPhone: u.userPhone,
            userIdCard: u.userIdCard,
            userSex: u.userSex,
            userAddress: u.userAddress,
            userSpeciality: u.userSpeciality,
            isPartyMember: u.isPartyMember,
            partyMemberName: u.partyMemberName,
            streetId: u.streetId,
            streetName: u.streetName,
            communityId: u.communityId,
            communityName: u.communityName,
            villageId: u.villageId,
            villageName: u.villageName,
            customerJSON: u.customerJSON
          }
        })
      }
    }

    ctx.body = {
      total: result.count,
      list: rows,
      pageIndex,
      pageSize
    };
  },
  setApplyVolunteer: async ctx => {
    let id = ctx.request.body.id || 0;
    let verifyStaus = ctx.request.body.verifyStaus || 1;
    let verifyRemark = ctx.request.body.verifyRemark || '';

    let verifyStausName = verifyStausEnum[verifyStaus];

    let applyVolunteer = await ctx.orm().apply_volunteer.findOne({
      where: {
        id,
        isDel: 0
      }
    })

    assert.ok(applyVolunteer !== null, '申请不存在！');

    await ctx.orm().apply_volunteer.update({
      verifyStaus,
      verifyStausName,
      verifyRemark,
      verifyTime: date.formatDate()
    }, {
      where: {
        id: applyVolunteer.id,
        isDel: 0
      }
    });

    if (verifyStaus === 2) {
      // 审核通过
      let user = await ctx.orm().info_user.findOne({
        where: {
          id: applyVolunteer.userId
        }
      })

      if (user) {
        await ctx.orm().village_data.create({
          villageId: user.villageId,
          villageName: user.villageName,
          dataType: '志愿者',
          title: '',
          name: user.userName,
          phone: user.userPhone,
          headImg: applyVolunteer.imgUrl,
          d1: applyVolunteer.serviceContent
        })
      }
    }

    ctx.body = {};
  },
  getPlacard: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { title, villageId, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, title && { title })

    if (villageId && villageId.length > 0) {
      where.$and = [sequelize.literal(`exists (select * from cms_placard_village where pid = cms_placard.id and villageId in (${villageId.map(m => { return m }).join(',')}))`)]
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().cms_placard.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    let resultVillage = await ctx.orm().cms_placard_village.findAll({
      where: {
        pid: {
          $in: result.rows.map(m => {
            return m.dataValues.id
          })
        }
      }
    })

    let rows = result.rows.map(m => {
      let vinfo = resultVillage.filter(f => f.dataValues.pid === m.dataValues.id)

      return {
        ...m.dataValues,
        villageId: vinfo.map(m1 => {
          return [m1.dataValues.communityId, m1.dataValues.villageId]
        })
      }
    })

    ctx.body = {
      total: result.count,
      list: rows,
      pageIndex,
      pageSize
    };
  },
  delPlacard: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().cms_placard.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  submitPlacard: async ctx => {
    let { id, villageId, title, content, isAll } = ctx.request.body;

    let villageInfo = null;
    if (villageId && Array.isArray(villageId)) {
      villageInfo = await ctx.orm().info_village.findAll({
        where: {
          id: {
            $in: villageId
          }
        }
      })
    }

    if (villageInfo) {
      if (id && id > 0) {
        // 更新
        await ctx.orm().cms_placard.update({
          title,
          content,
          isAll: isAll ? isAll : 0
        }, {
          where: {
            id
          }
        })

        // 删除小区
        await ctx.orm().cms_placard_village.destroy({
          where: {
            pid: id
          }
        });
      } else {
        // 新增
        let result = await ctx.orm().cms_placard.create({
          title,
          content,
          isAll: isAll ? isAll : 0,
          viewCount: 0,
          isDel: 0
        })

        id = result.id
      }

      // 新增小区
      let data = villageInfo.map(m => {
        return { pid: id, streetId: m.dataValues.streetId, communityId: m.dataValues.communityId, villageId: m.dataValues.id };
      });
      ctx.orm().cms_placard_village.bulkCreate(data);
    }

    ctx.body = {};
  },
  getDynamic: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { title, publisherId, villageId, addr, reviewerStatus, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, publisherId && { publisherId })
    Object.assign(where, title && { title })
    Object.assign(where, addr && { addr })
    Object.assign(where, reviewerStatus && { reviewerStatus })

    if (villageId && villageId.length > 0) {
      where.$and = [sequelize.literal(`exists (select * from cms_dynamic_village where pid = cms_dynamic.id and villageId in (${villageId.map(m => { return m }).join(',')}))`)]
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().cms_dynamic.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    let resultVillage = await ctx.orm().cms_dynamic_village.findAll({
      where: {
        did: {
          $in: result.rows.map(m => {
            return m.dataValues.id
          })
        }
      }
    })

    let rows = result.rows.map(m => {
      let vinfo = resultVillage.filter(f => f.dataValues.did === m.dataValues.id)

      return {
        ...m.dataValues,
        villageId: vinfo.map(m1 => {
          return [m1.dataValues.communityId, m1.dataValues.villageId]
        })
      }
    })

    ctx.body = {
      total: result.count,
      list: rows,
      pageIndex,
      pageSize
    };
  },
  delDynamic: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().cms_dynamic.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  submitDynamic: async ctx => {
    let { id, villageId, title, masterImg, addr, content, isAll, publisherId, publisherName, reviewerStatus } = ctx.request.body;

    let villageInfo = null;
    if (villageId && Array.isArray(villageId)) {
      villageInfo = await ctx.orm().info_village.findAll({
        where: {
          id: {
            $in: villageId
          }
        }
      })
    }

    if (villageInfo) {
      if (id && id > 0) {
        // 更新
        await ctx.orm().cms_dynamic.update({
          title,
          masterImg,
          addr,
          content,
          isAll: isAll ? isAll : 0,
          publisherId,
          publisherName,
          reviewerStatus,
          reviewerStatusName: reviewerStatusEnum[reviewerStatus]
        }, {
          where: {
            id
          }
        })

        // 删除小区
        await ctx.orm().cms_dynamic_village.destroy({
          where: {
            did: id
          }
        });
      } else {
        // 新增
        let result = await ctx.orm().cms_dynamic.create({
          title,
          masterImg,
          addr,
          content,
          isAll: isAll ? isAll : 0,
          publisherId,
          publisherName,
          reviewerStatus,
          reviewerStatusName: reviewerStatusEnum[reviewerStatus],
          viewCount: 0,
          isDel: 0
        })

        id = result.id
      }

      // 新增小区
      let data = villageInfo.map(m => {
        return { did: id, streetId: m.dataValues.streetId, communityId: m.dataValues.communityId, villageId: m.dataValues.id };
      });
      ctx.orm().cms_dynamic_village.bulkCreate(data);
    }

    ctx.body = {};
  },
  verfiyDynamic: async ctx => {
    let { id, reviewerId, reviewerName, reviewerStatus } = ctx.request.body;

    await ctx.orm().cms_dynamic.update({
      reviewerId,
      reviewerName,
      reviewerStatus,
      reviewerStatusName: reviewerStatusEnum[reviewerStatus],
      reviewerTime: date.formatDate()
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  getNews: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { title, source, author, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, title && { title })
    Object.assign(where, source && { source })
    Object.assign(where, author && { author })

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().cms_news.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    };
  },
  submitNews: async ctx => {
    let { id, title, content, source, author } = ctx.request.body;

    if (id && id > 0) {
      // 更新
      await ctx.orm().cms_news.update({
        title,
        content,
        source,
        author
      }, {
        where: {
          id
        }
      })
    } else {
      // 新增
      await ctx.orm().cms_news.create({
        title,
        content,
        source,
        author,
        viewCount: 0,
        isDel: 0
      })
    }

    ctx.body = {};
  },
  delNews: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().cms_news.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  getBanners: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { name, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, name && { name })

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().cms_banner.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    };
  },
  submitBanners: async ctx => {
    let { id, name, link, imgUrl, index } = ctx.request.body;

    if (id && id > 0) {
      // 更新
      await ctx.orm().cms_banner.update({
        name,
        link,
        imgUrl,
        index
      }, {
        where: {
          id
        }
      })
    } else {
      // 新增
      await ctx.orm().cms_banner.create({
        name,
        link,
        imgUrl,
        index,
        isDel: 0
      })
    }

    ctx.body = {};
  },
  delBanners: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().cms_banner.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  t1: async ctx => {
    let sql = `select 
      v.id, v.villageName,
      c.communityName,
      (select count(1) from info_user u where u.villageId = v.id) uv,
      (select count(1) from info_user u where u.villageId = v.id and u.isPartyMember = 2) pm,
      (select count(1) from village_data vd where vd.dataType = '志愿者' and vd.villageId = v.id) zyz,
      (select count(1) from village_data vd where vd.dataType = '楼栋长' and vd.villageId = v.id) ldz,
      (select count(1) from village_data vd where vd.dataType = '业委会' and vd.villageId = v.id) ywh,
      (select count(1) from village_data vd where vd.dataType = '三官一律' and vd.villageId = v.id) sgyl,
      (select count(1) from village_data vd where vd.dataType = '支部' and vd.villageId = v.id) zb,
      (select count(1) from village_data vd where vd.dataType = '物业' and vd.villageId = v.id) wy,
      (select 1) zbs 
    from info_village v 
    inner join info_community c on c.id = v.communityId 
    order by c.id, v.id`;

    let result = await ctx.orm().query(sql);

    let cindex = -1;
    let rows = [];
    for (let i = 0, j = result.length; i < j; i++) {
      if (cindex >= 0 && rows[cindex].communityName === result[i].communityName) {
        rows[cindex].uv += result[i].uv;
        rows[cindex].pm += result[i].pm;
        rows[cindex].zyz += result[i].zyz;
        rows[cindex].ldz += result[i].ldz;
        rows[cindex].ywh += result[i].ywh;
        rows[cindex].sgyl += result[i].sgyl;
        rows[cindex].zbs += result[i].zbs;
        rows[cindex].zb += result[i].zb;
        rows[cindex].wy += result[i].wy;
        rows[cindex].v.push({
          ...result[i]
        })
      } else {
        rows.push({
          communityName: result[i].communityName,
          uv: result[i].uv,
          pm: result[i].pm,
          zyz: result[i].zyz,
          ldz: result[i].ldz,
          ywh: result[i].ywh,
          sgyl: result[i].sgyl,
          zbs: result[i].zbs,
          zb: result[i].zb,
          wy: result[i].wy,
          v: []
        });
        cindex++;

        rows[cindex].v.push({
          ...result[i]
        })
      }
    }

    ctx.body = rows;
  },
  t2: async ctx => {
    let { startCreateTime, endCreateTime } = ctx.request.body;

    let where = '';

    if (startCreateTime && endCreateTime) {
      where = ` and createTime between '${startCreateTime}' and '${endCreateTime}' `
    }

    let sql = `select
      a.type,
      a.num,
      (select count(1) from bus_appeal where type = a.type and handleStatus != 3 ${where}) notover,
      (select count(1) from bus_appeal where type = a.type and handleStatus = 3 ${where}) over,
      (select count(1) from bus_appeal where type = a.type and assess in ('基本满意', '十分满意') ${where}) assess
    from (
      select 
        type, count(1) num
      from 
      bus_appeal where 1=1 ${where} group by type
    ) a`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  t3: async ctx => {
    let { startCreateTime, endCreateTime } = ctx.request.body;

    let where = '';

    if (startCreateTime && endCreateTime) {
      where = ` and createTime between '${startCreateTime}' and '${endCreateTime}' `
    }

    let sql = `select
      a.type,
      a.num,
      (select count(1) from bus_proposal where type = a.type and handleStatus != 3 ${where}) notover,
      (select count(1) from bus_proposal where type = a.type and handleStatus = 3 ${where}) over,
      (select count(1) from bus_proposal where type = a.type and assess in ('基本满意', '十分满意') ${where}) assess
    from (
      select 
        type, count(1) num
      from 
      bus_proposal where 1=1 ${where} group by type
    ) a`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  t4: async ctx => {
    let { startCreateTime, endCreateTime } = ctx.request.body;

    let where = '';

    if (startCreateTime && endCreateTime) {
      where = ` and a.createTime between '${startCreateTime}' and '${endCreateTime}' `
    }

    let sql = `select 
        v.id, v.villageName,
        c.communityName,
        (select count(1) from cms_placard a inner join cms_placard_village b on b.pid = a.id where b.villageId = v.id ${where}) pcount,
        (select count(1) from cms_dynamic a inner join cms_dynamic_village b on b.did = a.id where a.reviewerStatus = 2 and b.villageId = v.id ${where}) dcount 
      from info_village v 
      inner join info_community c on c.id = v.communityId 
      order by c.id, v.id`;

    let result = await ctx.orm().query(sql);

    let cindex = -1;
    let rows = [];
    for (let i = 0, j = result.length; i < j; i++) {
      if (cindex >= 0 && rows[cindex].communityName === result[i].communityName) {
        rows[cindex].pcount += result[i].pcount;
        rows[cindex].dcount += result[i].dcount;
        rows[cindex].v.push({
          ...result[i]
        })
      } else {
        rows.push({
          communityName: result[i].communityName,
          pcount: result[i].pcount,
          dcount: result[i].dcount,
          v: []
        });
        cindex++;

        rows[cindex].v.push({
          ...result[i]
        })
      }
    }

    ctx.body = rows;
  },
  t5: async ctx => {
    let sql = `select 
      ((select count(1) from bus_appeal) + (select count(1) from bus_proposal)) 't1',
      ((select count(1) from bus_appeal where handleStatus > 1) + (select count(1) from bus_proposal where handleStatus > 1)) 't2',
      ((select count(1) from bus_appeal where handleStatus = 3) + (select count(1) from bus_proposal where handleStatus = 3)) 't3',
      ((select count(1) from bus_appeal where assess in ('基本满意','十分满意')) + (select count(1) from bus_proposal where assess in ('基本满意','十分满意'))) 't4',
      (select count(1) from info_user) 't5',
      (select count(1) from cms_placard) 't6',
      (select count(1) from cms_dynamic where reviewerStatus = 2) 't7', 
      (select count(1) from info_village) 't8'`;

    let result = await ctx.orm().query(sql);

    ctx.body = result[0];
  },
  t6: async ctx => {
    let sql = `select '新用户' type, date_format(createTime, '%Y-%m-%d') date, count(1) num from info_user where createTime between date_add(now(), INTERVAL -30 day) and now() group by date_format(createTime, '%Y-%m-%d') 
    union all 
    select '诉求' type, date_format(createTime, '%Y-%m-%d') date, count(1) num from bus_appeal where isDel = 0 and createTime between date_add(now(), INTERVAL -30 day) and now() group by date_format(createTime, '%Y-%m-%d') 
    union all 
    select '建议' type, date_format(createTime, '%Y-%m-%d') date, count(1) num from bus_proposal where isDel = 0 and createTime between date_add(now(), INTERVAL -30 day) and now() group by date_format(createTime, '%Y-%m-%d')
    `;

    let result = await ctx.orm().query(sql);

    let now = new Date()
    let agoDate = new Date(now)
    agoDate.setDate(now.getDate() - 30)
    let scope = date.dataScope(agoDate, now);

    let data = {};
    scope.map(m => {
      let a = result.find(f => f.type === '新用户' && f.date === m)
      let b = result.find(f => f.type === '诉求' && f.date === m)
      let c = result.find(f => f.type === '建议' && f.date === m)

      data[m] = {
        a: a ? a.num : 0,
        b: b ? b.num : 0,
        c: c ? c.num : 0
      }
    });

    ctx.body = data;
  },
  getAppeal: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { type, handleStatus, assess, userName, userPhone, userIdCard, villageId, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime, startHandleTime, endHandleTime, startAssessTime, endAssessTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    let userWhere = ``;
    if (userName) { userWhere += ` and userName = '${userName}' ` }
    if (userPhone) { userWhere += ` and userPhone = '${userPhone}' ` }
    if (userIdCard) { userWhere += ` and userIdCard = '${userIdCard}' ` }
    if (userWhere !== '') {
      where.$and = [sequelize.literal(`exists (select * from info_user where id = bus_appeal.userId ${userWhere})`)]
    }

    Object.assign(where, type && { type })
    Object.assign(where, handleStatus && { handleStatus })
    Object.assign(where, assess && { assess })

    if (villageId && villageId.length > 0) {
      where.villageId = {
        $in: villageId
      }
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    if (startHandleTime && endHandleTime) {
      where.handleTime = {
        $between: [startHandleTime, endHandleTime]
      }
    }

    if (startAssessTime && endAssessTime) {
      where.assessTime = {
        $between: [startAssessTime, endAssessTime]
      }
    }

    let result = await ctx.orm().bus_appeal.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    if (result && result.rows.length > 0) {
      let communitys = await ctx.orm().info_community.findAll({});
      let villages = await ctx.orm().info_village.findAll({});
      let users = await ctx.orm().info_user.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      let works = await ctx.orm().query(`select max(id) id, typeId from work_orders where type = '诉求' and typeId in (select id from bus_appeal where handleStatus != 3 and id in (` + result.rows.map(m => {
        return m.dataValues.id
      }).join(',') + `)) group by typeId;`);

      let rows = result.rows.map(m => {
        let c = villages.find(f => f.id === m.dataValues.villageId)
        let cinfo = c ? communitys.find(f => f.id === c.communityId) : null
        let u = users ? users.find(f => f.id === m.dataValues.userId) : null
        let w = works ? works.find(f => f.typeId === m.dataValues.id) : null

        return {
          ...m.dataValues,
          communityId: cinfo ? cinfo.id : 0,
          communityName: cinfo ? cinfo.communityName : '',
          villageName: c ? c.villageName : '',
          userName: u ? u.userName : '',
          userPhone: u ? u.userPhone : '',
          workId: w ? w.id : 0
        }
      })

      ctx.body = {
        total: result.count,
        list: rows,
        pageIndex,
        pageSize
      };
    } else {
      ctx.body = {
        total: 0,
        list: [],
        pageIndex,
        pageSize
      };
    }
  },
  delAppeal: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().bus_appeal.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    await ctx.orm().work_orders.update({
      isDel: 1
    }, {
      where: {
        type: '诉求',
        typeId: id
      }
    });

    ctx.body = {};
  },
  getProposal: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { type, handleStatus, assess, userName, userPhone, userIdCard, villageId, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime, startHandleTime, endHandleTime, startAssessTime, endAssessTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    let userWhere = ``;
    if (userName) { userWhere += ` and userName = '${userName}' ` }
    if (userPhone) { userWhere += ` and userPhone = '${userPhone}' ` }
    if (userIdCard) { userWhere += ` and userIdCard = '${userIdCard}' ` }
    if (userWhere !== '') {
      where.$and = [sequelize.literal(`exists (select * from info_user where id = bus_proposal.userId ${userWhere})`)]
    }

    Object.assign(where, type && { type })
    Object.assign(where, handleStatus && { handleStatus })
    Object.assign(where, assess && { assess })

    if (villageId && villageId.length > 0) {
      where.villageId = {
        $in: villageId
      }
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    if (startHandleTime && endHandleTime) {
      where.handleTime = {
        $between: [startHandleTime, endHandleTime]
      }
    }

    if (startAssessTime && endAssessTime) {
      where.assessTime = {
        $between: [startAssessTime, endAssessTime]
      }
    }

    let result = await ctx.orm().bus_proposal.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    if (result && result.rows.length > 0) {
      let communitys = await ctx.orm().info_community.findAll({});
      let villages = await ctx.orm().info_village.findAll({});
      let users = await ctx.orm().info_user.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      let works = await ctx.orm().query(`select max(id) id, typeId from work_orders where type = '建议' and typeId in (select id from bus_proposal where handleStatus != 3 and id in (` + result.rows.map(m => {
        return m.dataValues.id
      }).join(',') + `)) group by typeId;`);

      let rows = result.rows.map(m => {
        let c = villages.find(f => f.id === m.dataValues.villageId)
        let cinfo = c ? communitys.find(f => f.id === c.communityId) : null
        let u = users ? users.find(f => f.id === m.dataValues.userId) : null
        let w = works ? works.find(f => f.typeId === m.dataValues.id) : null

        return {
          ...m.dataValues,
          communityId: cinfo ? cinfo.id : 0,
          communityName: cinfo ? cinfo.communityName : '',
          villageName: c ? c.villageName : '',
          userName: u ? u.userName : '',
          userPhone: u ? u.userPhone : '',
          workId: w ? w.id : 0
        }
      })

      ctx.body = {
        total: result.count,
        list: rows,
        pageIndex,
        pageSize
      };
    } else {
      ctx.body = {
        total: 0,
        list: [],
        pageIndex,
        pageSize
      };
    }
  },
  delProposal: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().bus_proposal.update({
      isDel: 1
    }, {
      where: {
        id
      }
    });

    await ctx.orm().work_orders.update({
      isDel: 1
    }, {
      where: {
        type: '建议',
        typeId: id
      }
    });

    ctx.body = {};
  },
  getWorkOrder: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let orderby = ctx.request.body.orderby || [['createTime', 'desc']];
    let { type, typeId, opUserId, opUserType, opUserLevel, opUserDepName, state, userName, userPhone, userIdCard, villageId, isOver, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    let userWhere = ``;
    if (userName) { userWhere += ` and userName = '${userName}' ` }
    if (userPhone) { userWhere += ` and userPhone = '${userPhone}' ` }
    if (userIdCard) { userWhere += ` and userIdCard = '${userIdCard}' ` }
    if (userWhere !== '') {
      where.$and = [sequelize.literal(`exists (select * from info_user where id = work_orders.userId ${userWhere})`)]
    }

    Object.assign(where, type && { type })
    Object.assign(where, typeId && { typeId })
    Object.assign(where, opUserId && { opUserId })
    Object.assign(where, opUserType && { opUserType })
    Object.assign(where, opUserLevel && { opUserLevel })
    Object.assign(where, opUserDepName && { opUserDepName })
    Object.assign(where, isOver && { isOver })
    Object.assign(where, state && { state })

    if (villageId && villageId.length > 0) {
      where.villageId = {
        $in: villageId
      }
    }

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    if (startUpdateTime && endUpdateTime) {
      where.updateTime = {
        $between: [startUpdateTime, endUpdateTime]
      }
    }

    let result = await ctx.orm().work_orders.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: orderby
    });

    if (result && result.rows.length > 0) {
      let communitys = await ctx.orm().info_community.findAll({});
      let villages = await ctx.orm().info_village.findAll({});
      let users = await ctx.orm().info_user.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      let appealIds = result.rows.filter(f => f.dataValues.type === '诉求').map(m => { return m.dataValues.typeId })
      let appeals = null
      if (appealIds && appealIds.length > 0) {
        appeals = await ctx.orm().bus_appeal.findAll({
          where: {
            id: {
              $in: appealIds
            }
          }
        })
      }

      let proposalIds = result.rows.filter(f => f.dataValues.type === '建议').map(m => { return m.dataValues.typeId })
      let proposals = null
      if (proposalIds && proposalIds.length > 0) {
        proposals = await ctx.orm().bus_proposal.findAll({
          where: {
            id: {
              $in: proposalIds
            }
          }
        })
      }

      let rows = result.rows.map(m => {
        let c = villages.find(f => f.id === m.dataValues.villageId)
        let cinfo = c ? communitys.find(f => f.id === c.communityId) : null
        let u = users ? users.find(f => f.id === m.dataValues.userId) : null

        let data = null
        if (m.dataValues.type === '诉求') {
          data = appeals ? appeals.find(f => f.dataValues.id === m.dataValues.typeId) : null
        } else if (m.dataValues.type === '建议') {
          data = proposals ? proposals.find(f => f.dataValues.id === m.dataValues.typeId) : null
        }

        return {
          ...m.dataValues,
          communityId: cinfo ? cinfo.id : 0,
          communityName: cinfo ? cinfo.communityName : '',
          villageName: c ? c.villageName : '',
          userName: u ? u.userName : '',
          userPhone: u ? u.userPhone : '',
          detail: data ? data : {}
        }
      })

      ctx.body = {
        total: result.count,
        list: rows,
        pageIndex,
        pageSize
      };
    } else {
      ctx.body = {
        total: 0,
        list: [],
        pageIndex,
        pageSize
      };
    }
  },
  submitWorkOrder: async ctx => {
    let id = ctx.request.body.id || 0;
    let adminId = ctx.request.body.adminId || 0;
    let opRemark = ctx.request.body.opRemark || '';
    let state = ctx.request.body.state || 1;
    let workDesc = ctx.request.body.workDesc || '';

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        state: 1,
        isDel: 0
      }
    })
    assert.ok(admin !== null, '管理员信息不存在!');

    let workorder = await ctx.orm().work_orders.findOne({
      where: {
        id,
        isDel: 0
      }
    })
    assert.ok(workorder !== null, '工单不存在!');

    await ctx.orm().work_orders.update({
      opRemark: opRemark,
      state: state,
      stateName: workOrderStateEnum[state],
      stateEndTime: date.formatDate(),
      isOver: 2,
      overTime: date.formatDate(),
      workDesc: workDesc
    }, {
      where: {
        id: workorder.id
      }
    });

    // 更新诉求和建议
    if (workorder.type === '诉求') {
      await ctx.orm().bus_appeal.update({
        handleStatus: state,
        handleStatusName: appealStateEnum[state],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    } else if (workorder.type === '建议') {
      await ctx.orm().bus_proposal.update({
        handleStatus: state,
        handleStatusName: proposalStateEnum[state],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    }

    if (state === 4) {
      // 延期办理
      // 新增一条工单办理记录
      await ctx.orm().work_orders.create({
        type: workorder.type,
        typeId: workorder.typeId,
        opUserId: admin.id,
        opUserName: admin.realName,
        opUserType: admin.verifyType,
        opUserLevel: admin.verifyLevel,
        opUserDepName: admin.depName,
        userId: workorder.userId,
        villageId: workorder.villageId,
        state: state,
        stateName: workOrderStateEnum[state],
        stateStartTime: date.formatDate(),
        isOver: 1,
        parentId: workorder.id,
        isDel: 0
      })
    }

    ctx.body = {};
  },
  transferWorkOrder: async ctx => {
    let id = ctx.request.body.id || 0;
    let opUserId = ctx.request.body.opUserId || 0;
    let workDesc = ctx.request.body.workDesc || '';
    let state = ctx.request.body.state || 5;
    let stateNew = ctx.request.body.stateNew || 1;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: opUserId,
        state: 1,
        isDel: 0
      }
    })
    assert.ok(admin !== null, '管理员信息不存在!');

    let workorder = await ctx.orm().work_orders.findOne({
      where: {
        id,
        isDel: 0
      }
    })
    assert.ok(workorder !== null, '工单不存在!');

    let opRemark = `由${workorder.opUserDepName}${workorder.opUserName}交办`

    // 更新老工单
    await ctx.orm().work_orders.update({
      opRemark: opRemark,
      state: state,
      stateName: workOrderStateEnum[state],
      stateEndTime: date.formatDate(),
      isOver: 2,
      overTime: date.formatDate(),
      workDesc: workDesc
    }, {
      where: {
        id: workorder.id
      }
    })

    // 新增工单
    await ctx.orm().work_orders.create({
      type: workorder.type,
      typeId: workorder.typeId,
      opUserId: admin.id,
      opUserName: admin.realName,
      opUserType: admin.verifyType,
      opUserLevel: admin.verifyLevel,
      opUserDepName: admin.depName,
      userId: workorder.userId,
      villageId: workorder.villageId,
      state: stateNew,
      stateName: workOrderStateEnum[stateNew],
      stateStartTime: date.formatDate(),
      isOver: 1,
      parentId: workorder.id,
      isDel: 0
    })

    // 更新诉求和建议
    if (workorder.type === '诉求') {
      await ctx.orm().bus_appeal.update({
        handleStatus: stateNew,
        handleStatusName: appealStateEnum[stateNew],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    } else if (workorder.type === '建议') {
      await ctx.orm().bus_proposal.update({
        handleStatus: stateNew,
        handleStatusName: proposalStateEnum[stateNew],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    }

    ctx.body = {};
  },
  receiveWorkOrder: async ctx => {
    let id = ctx.request.body.id || 0;
    let opUserId = ctx.request.body.opUserId || 0;
    let state = ctx.request.body.state || 2;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: opUserId,
        state: 1,
        isDel: 0
      }
    })
    assert.ok(admin !== null, '管理员信息不存在!');

    let workorder = await ctx.orm().work_orders.findOne({
      where: {
        id,
        isDel: 0
      }
    })
    assert.ok(workorder !== null, '工单不存在!');

    await ctx.orm().work_orders.update({
      state: state,
      stateName: workOrderStateEnum[state],
      stateStartTime: date.formatDate(),
      opUserId: admin.id,
      opUserName: admin.realName,
      opUserType: admin.verifyType,
      opUserLevel: admin.verifyLevel,
      opUserDepName: admin.depName
    }, {
      where: {
        id
      }
    })

    let opRemark = `由${admin.depName}${admin.realName}签收`;

    // 更新诉求和建议
    if (workorder.type === '诉求') {
      await ctx.orm().bus_appeal.update({
        handleStatus: state,
        handleStatusName: appealStateEnum[state],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    } else if (workorder.type === '建议') {
      await ctx.orm().bus_proposal.update({
        handleStatus: state,
        handleStatusName: proposalStateEnum[state],
        handleTime: date.formatDate(),
        handlerId: admin.id,
        handlerName: admin.realName,
        handlerDeptName: admin.depName,
        handlerRemark: opRemark
      }, {
        where: {
          id: workorder.typeId
        }
      })
    }

    ctx.body = {};
  },
  getWorkUsers: async ctx => {
    let admins = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        state: 1,
        isDel: 0,
        verifyLevel: {
          $gt: 0
        }
      },
      order: [['verifyLevel', 'asc']]
    })

    ctx.body = admins.map(m => {
      return {
        id: m.dataValues.id,
        realName: m.dataValues.realName,
        depName: m.dataValues.depName,
        verifyLevel: m.dataValues.verifyLevel,
        verifyType: m.dataValues.verifyType,
        verifyVillages: JSON.parse(m.dataValues.verifyVillages)
      }
    })
  },
  getSuggest: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { userName, userPhone, userIdCard, startCreateTime, endCreateTime } = ctx.request.body;

    let where = {};

    let userWhere = ``;
    if (userName) { userWhere += ` and userName = '${userName}' ` }
    if (userIdCard) { userWhere += ` and userIdCard = '${userIdCard}' ` }
    if (userWhere !== '') {
      where.$and = [sequelize.literal(`exists (select * from info_user where id = info_suggest.userId ${userWhere})`)]
    }

    Object.assign(where, userPhone && { phone: userPhone })

    if (startCreateTime && endCreateTime) {
      where.createTime = {
        $between: [startCreateTime, endCreateTime]
      }
    }

    let result = await ctx.orm().info_suggest.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    if (result && result.rows.length > 0) {
      let users = await ctx.orm().info_user.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      let rows = result.rows.map(m => {
        let u = users ? users.find(f => f.id === m.dataValues.userId) : null

        return {
          ...m.dataValues,
          communityId: u ? u.communityId : 0,
          communityName: u ? u.communityName : '',
          villageName: u ? u.villageName : '',
          userName: u ? u.userName : '',
          userPhone: m.dataValues.phone
        }
      })

      ctx.body = {
        total: result.count,
        list: rows,
        pageIndex,
        pageSize
      };
    } else {
      ctx.body = {
        total: 0,
        list: [],
        pageIndex,
        pageSize
      };
    }
  }
};