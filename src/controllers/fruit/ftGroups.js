/*
 * @Author: Lienren
 * @Date: 2019-10-17 19:30:18
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-18 16:54:54
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');
const cp = require('./checkParam');
const dic = require('./fruitEnum');

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.gType && param.gType > 0) {
      where.gType = param.gType;
    }

    if (param.gStatus && param.gStatus > 0) {
      where.gStatus = param.gStatus;
    }

    let total = await ctx.orm().ftGroups.findAndCount({
      where
    });
    let list = await ctx.orm().ftGroups.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['gStartTime', 'DESC']]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  get: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let result = await ctx.orm().ftGroups.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  getGroupProductSort: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    if (param.id > 0) {
      let sql = `
        select p.sortId, p.sortName, count(gp.proId) proNum from ftGroupProducts gp 
        inner join ftProducts p on p.id = gp.proId and p.proVerifyType = 3 and p.isDel = 0 
        where 
        gp.gId = ${param.id} and 
        gp.isDel = 0 
        group by p.sortId, p.sortName;`;

      let result = await ctx.orm().query(sql);

      ctx.body = result;
    } else {
      ctx.body = [];
    }
  },
  getGroupProduct: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    if (param.id > 0) {
      let sql = `
        select gp.*, p.sortId, p.sortName, p.title, p.subTitle, p.originalPrice, p.sellPrice, 
        p.isLimit, p.limitNum, p.pickTime, p.specInfo, p.isOnline, p.content, p.stock, p.saleNum, p.saleNumV, 
        p.masterImg, p.subImg, p.groupUserId from ftGroupProducts gp 
        inner join ftProducts p on p.id = gp.proId and p.proVerifyType = 3 and p.isDel = 0 
        where 
        gp.gId = ${param.id} and 
        gp.isDel = 0`;

      let result = await ctx.orm().query(sql);

      ctx.body = result;
    } else {
      ctx.body = [];
    }
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.gType);
    cp.isEmpty(param.groupUserId);
    cp.isEmpty(param.gSiteName);
    cp.isEmpty(param.gSiteAddress);
    cp.isEmpty(param.gSitePickAddress);
    cp.isEmpty(param.gSitePosition);
    cp.isEmpty(param.gStartTime);
    cp.isEmpty(param.gEndTime);
    cp.isArrayLengthGreaterThan0(param.proList);

    // 验证团长
    let groupUser = await ctx.orm().ftUsers.findOne({
      where: {
        id: param.groupUserId,
        userType: 2,
        verifyType: 2
      }
    });

    cp.isNull(groupUser);

    // 验证团购交叉时间
    let existGroupCrossTime = await ctx.orm().ftGroups.findOne({
      where: {
        groupUserId: groupUser.id,
        gStartTime: {
          $between: [gStartTime, gEndTime]
        },
        gStatus: {
          $in: [1, 2]
        },
        isDel: 0
      }
    });

    assert.ok(existGroupCrossTime === null, '该团购时间和其它团购时间有交叉，请重新选择时间！');

    // 获取已审核，在线商品
    let pros = await ctx.orm().ftProducts.findAll({
      where: {
        id: {
          $in: param.proList.map(m => {
            return m.proId;
          })
        },
        proVerifyType: 3,
        isOnline: 1
      }
    });

    cp.isArrayLengthGreaterThan0(pros);

    let gIndex = 1;
    let gName = '第1期团购活动';

    let groupUserGroup = await ctx.orm().ftGroups.findOne({
      where: {
        groupUserId: groupUser.id
      },
      order: [['addTime', 'DESC']]
    });

    if (groupUserGroup) {
      gIndex = groupUserGroup.gIndex + 1;
      gName = `第${gIndex}期团购活动`;
    }

    // 添加团购
    let group = await ctx.orm().ftGroups.create({
      gIndex: gIndex,
      gName: gName,
      groupUserId: groupUser.id,
      groupUserName: groupUser.userName,
      groupUserPhone: groupUser.userPhone,
      gSiteName: groupUser.siteName,
      gSiteAddress: groupUser.siteAddress,
      gSitePickAddress: groupUser.sitePickAddress,
      gSitePosition: groupUser.sitePosition,
      gStartTime: param.gStartTime,
      gEndTime: param.gEndTime,
      gStatus: 1,
      gStatusName: dic.groupStatusEnum[`1`],
      gProductNum: pros.length,
      gOrderNum: 0,
      gType: param.gType,
      gTypeName: dic.groupTypeEnum[`${param.gType}`],
      addTime: date.formatDate(),
      isDel: 0
    });

    let groupPros = [];
    pros.forEach(e => {
      let find = proList.find(f => {
        return f.proId === e.id;
      });

      if (find) {
        groupPros.push({
          gId: group.id,
          gProType: find.gProType,
          gProTypeName: dic.groupProTypeEnum[`${find.gProType}`],
          proId: e.id,
          startTime: find.startTime,
          endTime: find.endTime,
          teamNum: find.teamNum || 0,
          isRecommend: find.isRecommend || 0,
          addTime: date.formatDate(),
          isDel: 0
        });
      }
    });

    // 添加团购商品
    await ctx.orm().ftGroupProducts.bulkCreate(groupPros);
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    // 删除团购
    await ctx.orm().ftGroups.update(
      {
        gStatus: 999,
        gStatusName: dic.groupStatusEnum[`999`],
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );

    // 删除团购商品
    await ctx.orm().ftGroupProducts.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          gId: param.id,
          isDel: 0
        }
      }
    );
  }
};
