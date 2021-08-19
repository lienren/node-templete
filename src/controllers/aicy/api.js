/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2021-08-18 19:29:24
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/aicy/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

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
        customerJSON: JSON.stringify(ctx.request.body)
      }, {
        where: {
          id: user.id
        }
      });
    } else {
      // 用户不存在
      user = await ctx.orm().info_user.create({
        customerId: userId,
        nickName: nickName,
        userName: userRealName,
        userPhone: phoneNo,
        userIdCard: idCardNo,
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
    let userAddress = ctx.request.body.userAddress || '';
    let userSpeciality = ctx.request.body.userSpeciality || '';
    let isPartyMember = ctx.request.body.isPartyMember || 0;
    let partyMemberName = ctx.request.body.partyMemberName || '我不是党员';

    assert.ok(id > 0, '提交信息异常！');

    await ctx.orm().info_user.update({
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
  }
};