/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2021-08-25 09:41:40
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/aicy/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const handleStatusNameEnum = {
  '1': '待办理',
  '2': '办理中',
  '3': '已办结',
  '4': '延期'
}

const handleStatusNameEnum2 = {
  '1': '待办理',
  '2': '办理中',
  '3': '已采纳',
  '4': '延期'
}

const verifyStausNameEnum = {
  '1': '待审核',
  '2': '审核通过',
  '3': '审核不通过'
}

module.exports = {
  getUserInfo: async ctx => {
    let userId = ctx.request.body.userId || '';
    let nickName = ctx.request.body.nickName || '';
    let headImg = ctx.request.body.headImg || '';
    let idCardNo = ctx.request.body.idCardNo || '';
    let phoneNo = ctx.request.body.phoneNo || '';
    let userRealName = ctx.request.body.userRealName || '';

    assert.ok(!!userId, '用户信息异常！');

    let user = await ctx.orm().info_user.findOne({
      where: {
        customerId: userId
      }
    })

    if (user) {
      // 用户存在
      await ctx.orm().info_user.update({
        userHeadImg: headImg,
        customerJSON: JSON.stringify(ctx.request.body)
      }, {
        where: {
          id: user.id
        }
      });

      user.userHeadImg = headImg;
      user.customerJSON = JSON.stringify(ctx.request.body);
    } else {
      let userSex = '男';
      if (idCardNo && idCardNo.length === 18) {
        userSex = parseInt(idCardNo.substr(16, 1)) % 2 === 1 ? "男" : "女"
      }

      // 用户不存在
      user = await ctx.orm().info_user.create({
        customerId: userId,
        nickName: nickName,
        userName: userRealName,
        userPhone: phoneNo,
        userIdCard: idCardNo,
        userSex: userSex,
        userHeadImg: headImg,
        streetId: 0,
        communityId: 0,
        villageId: 0,
        isMute: 0,
        userIntegral: 0,
        isComplete: 0,
        customerJSON: JSON.stringify(ctx.request.body)
      });
    }

    ctx.body = user;
  },
  setUserStreet: async ctx => {
    let id = ctx.request.body.id || 0;
    let streetId = ctx.request.body.streetId || 0;
    let streetName = ctx.request.body.streetName || '';
    let communityId = ctx.request.body.communityId || 0;
    let communityName = ctx.request.body.communityName || '';
    let villageId = ctx.request.body.villageId || 0;
    let villageName = ctx.request.body.villageName || '';

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(streetId > 0, '提交信息异常！');
    assert.ok(communityId > 0, '提交信息异常！');
    assert.ok(villageId > 0, '提交信息异常！');

    await ctx.orm().info_user.update({
      streetId: streetId,
      streetName: streetName,
      communityId: communityId,
      communityName: communityName,
      villageId: villageId,
      villageName: villageName
    }, {
      where: {
        id: id
      }
    })

    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id
      }
    })

    ctx.body = user;
  },
  setUserInfo: async ctx => {
    let id = ctx.request.body.id || 0;
    let userPhone = ctx.request.body.userPhone || '';
    let userSex = ctx.request.body.userSex || '男';
    let userAddress = ctx.request.body.userAddress || '';
    let userSpeciality = ctx.request.body.userSpeciality || '';
    let isPartyMember = ctx.request.body.isPartyMember || 0;
    let partyMemberName = ctx.request.body.partyMemberName || '我不是党员';

    assert.ok(id > 0, '提交信息异常！');

    await ctx.orm().info_user.update({
      userSex: userSex,
      userPhone: userPhone,
      userAddress: userAddress,
      userSpeciality: userSpeciality,
      isPartyMember: isPartyMember,
      partyMemberName: partyMemberName,
      isComplete: 1
    }, {
      where: {
        id: id
      }
    })

    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id
      }
    })

    ctx.body = user;
  },
  getStreet: async ctx => {
    let street = await ctx.orm().info_street.findAll();
    let community = await ctx.orm().info_community.findAll();
    let village = await ctx.orm().info_village.findAll({
      order: [['firstLetter']]
    });

    ctx.body = {
      street,
      community,
      village
    }
  },
  getBanners: async ctx => {
    let result = await ctx.orm().cms_banner.findAll({
      limit: 5,
      where: {
        isDel: 0
      },
      order: [['index']]
    });

    ctx.body = result;
  },
  getNews: async ctx => {
    let result = await ctx.orm().cms_news.findAll({
      limit: 20,
      where: {
        isDel: 0
      },
      order: [['id', 'desc']]
    });

    ctx.body = result;
  },
  getVillageData: async ctx => {
    let villageId = ctx.request.body.villageId || 0;
    let dataType = ctx.request.body.dataType || '';

    let data = await ctx.orm().village_data.findAll({
      where: {
        villageId,
        dataType
      }
    })

    ctx.body = data;
  },
  getPlacard: async ctx => {
    let villageId = ctx.request.body.villageId || 0;
    let limit = ctx.request.body.limit || 0;

    let where = {
      isDel: 0,
      $or: [
        { isAll: 1 },
        { $and: [sequelize.literal(`exists (select * from cms_placard_village where pid = cms_placard.id and villageId = ${villageId})`)] }
      ]
    }

    let condition = {
      where,
      order: [['createTime', 'desc']]
    }

    if (limit && limit > 0) {
      condition.limit = limit
    }

    let result = await ctx.orm().cms_placard.findAll(condition);

    ctx.body = result;
  },
  getDynamic: async ctx => {
    let villageId = ctx.request.body.villageId || 0;
    let limit = ctx.request.body.limit || 0;

    let where = {
      isDel: 0,
      reviewerStatus: 2,
      $or: [
        { isAll: 1 },
        { $and: [sequelize.literal(`exists (select * from cms_dynamic_village where did = cms_dynamic.id and villageId = ${villageId})`)] }
      ]
    }

    let condition = {
      where,
      order: [['createTime', 'desc']]
    }

    if (limit && limit > 0) {
      condition.limit = limit
    }

    let result = await ctx.orm().cms_dynamic.findAll(condition);

    ctx.body = result;
  },
  createAppeal: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';
    let title = ctx.request.body.title || '';
    let type = ctx.request.body.type || '';
    let content = ctx.request.body.content || '';
    let imgUrl = ctx.request.body.imgUrl || '';
    let gps = ctx.request.body.gps || '';
    let gpsAddress = ctx.request.body.gpsAddress || '';

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    assert.ok(!!title, '提交信息异常！');
    assert.ok(!!type, '提交信息异常！');
    assert.ok(!!content, '提交信息异常！');

    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');
    assert.ok(user.isComplete > 0, '请完善信息后，再发布诉求，谢谢！');
    assert.ok(user.isMute === 0, '您已被禁言，请联系管理员！');

    let result = await ctx.orm().bus_appeal.create({
      title,
      type,
      content,
      imgUrl,
      gps,
      gpsAddress,
      userId: id,
      handleStatus: 1,
      handleStatusName: handleStatusNameEnum[`1`],
      isDel: 0
    })

    ctx.body = {
      id: result.id
    }
  },
  getAppeal: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';
    let limit = ctx.request.body.limit || 0;

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');

    let result = await ctx.orm().bus_appeal.findAll({
      limit: limit > 0 ? limit : null,
      where: {
        userId: user.id,
        isDel: 0
      },
      order: [['createTime', 'desc']]
    })

    ctx.body = result;
  },
  createProposal: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';
    let title = ctx.request.body.title || '';
    let type = ctx.request.body.type || '';
    let content = ctx.request.body.content || '';
    let imgUrl = ctx.request.body.imgUrl || '';
    let gps = ctx.request.body.gps || '';
    let gpsAddress = ctx.request.body.gpsAddress || '';

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    assert.ok(!!title, '提交信息异常！');
    assert.ok(!!type, '提交信息异常！');
    assert.ok(!!content, '提交信息异常！');

    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');
    assert.ok(user.isComplete > 0, '请完善信息后，再发布诉求，谢谢！');
    assert.ok(user.isMute === 0, '您已被禁言，请联系管理员！');

    let result = await ctx.orm().bus_proposal.create({
      title,
      type,
      content,
      imgUrl,
      gps,
      gpsAddress,
      userId: id,
      handleStatus: 1,
      handleStatusName: handleStatusNameEnum2[`1`],
      isDel: 0
    })

    ctx.body = {
      id: result.id
    }
  },
  getProposal: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';
    let limit = ctx.request.body.limit || 0;

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');

    let result = await ctx.orm().bus_proposal.findAll({
      limit: limit > 0 ? limit : null,
      where: {
        userId: user.id,
        isDel: 0
      },
      order: [['createTime', 'desc']]
    })

    ctx.body = result;
  },
  submitApplyVolunteer: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';
    let serviceContent = ctx.request.body.serviceContent || '';
    let remark = ctx.request.body.remark || '';
    let imgUrl = ctx.request.body.imgUrl || '';

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');

    let apply = await ctx.orm().apply_volunteer.findOne({
      where: {
        userId: user.id,
        isDel: 0
      }
    })

    if (apply) {
      assert.ok(apply.verifyStaus === 3, '申请状态异常！');

      await ctx.orm().apply_volunteer.update({
        serviceContent,
        remark,
        imgUrl,
        verifyStaus: 1,
        verifyStausName: verifyStausNameEnum[`1`]
      }, {
        where: {
          id: apply.id
        }
      })
    } else {
      await ctx.orm().apply_volunteer.create({
        userId: user.id,
        serviceContent,
        remark,
        imgUrl,
        verifyStaus: 1,
        verifyStausName: verifyStausNameEnum[`1`],
        isDel: 0
      })
    }

    ctx.body = {};
  },
  getApplyVolunteer: async ctx => {
    let id = ctx.request.body.id || 0;
    let userId = ctx.request.body.userId || '';

    assert.ok(id > 0, '提交信息异常！');
    assert.ok(!!userId, '提交信息异常！');
    let user = await ctx.orm().info_user.findOne({
      where: {
        id: id,
        customerId: userId
      }
    })

    assert.ok(user !== null, '用户不存在！');

    let result = await ctx.orm().apply_volunteer.findOne({
      where: {
        userId: user.id,
        isDel: 0
      }
    })

    ctx.body = result;
  }
};