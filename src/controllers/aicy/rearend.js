/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2021-09-08 23:32:57
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/aicy/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const verifyStausEnum = {
  1: '未审核',
  2: '审核通过',
  3: '审核未通过'
}

const reviewerStatusEnum = {
  1: '未审核',
  2: '审核通过',
  3: '审核未通过'
}

module.exports = {
  getVillageData: async ctx => {
    let result1 = await ctx.orm().info_community.findAll();
    let result2 = await ctx.orm().info_village.findAll();

    let data = result1.map(m1 => {
      return {
        value: m1.dataValues.id,
        label: m1.dataValues.communityName,
        children: result2.filter(f => f.communityId === m1.dataValues.id).map(m2 => {
          return {
            value: m2.dataValues.id,
            label: m2.dataValues.villageName
          }
        })
      }
    })

    console.log('data:', JSON.stringify(data));

    ctx.body = {};
  },
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { customerId, userName, nickName, userPhone, userIdCard, userSex, isMute, isPartyMember, villageId, startCreateTime, endCreateTime, startUpdateTime, endUpdateTime } = ctx.request.body;

    let where = {};

    isMute = parseInt(isMute)
    isPartyMember = parseInt(isPartyMember)

    Object.assign(where, customerId && { customerId })
    Object.assign(where, userName && { userName })
    Object.assign(where, nickName && { nickName })
    Object.assign(where, userPhone && { userPhone })
    Object.assign(where, userIdCard && { userIdCard })
    Object.assign(where, userSex && { userSex })
    Object.assign(where, isMute && { isMute })
    Object.assign(where, isPartyMember && { isPartyMember })

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

    let result = await ctx.orm().info_user.findAndCountAll({
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
      (select count(1) from village_data vd where vd.dataType = '物业' and vd.villageId = v.id) wy 
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
};