/*
 * @Author: Lienren
 * @Date: 2019-10-17 19:30:18
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-07 23:41:58
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');
const comm = require('../../utils/comm');
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

    if (param.groupUserId && param.groupUserId > 0) {
      where.groupUserId = param.groupUserId;
    }

    if (param.gType && param.gType > 0) {
      where.gType = param.gType;
    }

    if (param.gStatus && param.gStatus > 0) {
      where.gStatus = param.gStatus;
    }

    let total = await ctx.orm().ftGroups.count({
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

    let group = await ctx.orm().ftGroups.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    let groupPros = await ctx.orm().ftGroupProducts.findAll({
      where: {
        gId: param.id,
        isDel: 0
      }
    });

    let dayDiff = date.dataScope(date.formatDate(), group.gEndTime);
    group.dataValues['dayDiff'] = dayDiff.length || 0;

    ctx.body = {
      group: group,
      groupPros: groupPros
    };
  },
  getGroup: async ctx => {
    let param = ctx.request.body || {};

    let where = {
      gStatus: 2,
      isDel: 0
    };

    if (param.gPId && param.gPId > 0) {
      where.gPId = param.gPId;
    }

    if (param.gCId && param.gCId > 0) {
      where.gCId = param.gCId;
    }

    let groups = await ctx.orm().ftGroups.findAll({
      where,
      order: [['gStartTime', 'DESC']]
    });

    if (groups && groups.length > 0) {
      if (param.position && param.position.length === 2) {
        // 有GPS坐标
        for (let i = 0, j = groups.length; i < j; i++) {
          let gSitePosition = JSON.parse(groups[i].gSitePosition);
          let distance = comm.calcDistance(gSitePosition[0], gSitePosition[1], param.position[0], param.position[1]);
          groups[i].dataValues['distance'] = distance || 0;
        }

        // 返回升序
        ctx.body = groups.sort((a, b) => {
          return b.distance - a.distance;
        });
      } else {
        // 无GPS坐标
        ctx.body = groups;
      }
    } else {
      ctx.body = [];
    }
  },
  getGroupProductSort: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    if (param.id > 0) {
      let sql = `
        select s.id sortId, s.sortName, s.sortImg, count(gp.proId) proNum from ftGroupProducts gp 
        inner join ftProducts p on p.id = gp.proId and p.proVerifyType = 3 and p.isDel = 0 
        inner join ftProductSorts s on s.id = p.sortId and s.isDel = 0 
        where 
          gp.gId = ${param.id} and 
          gp.isDel = 0 
        group by s.id, s.sortName, s.sortImg;`;

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
        p.masterImg, p.subImg, p.groupUserId, p.isRecommend isRec from ftGroupProducts gp 
        inner join ftProducts p on p.id = gp.proId and p.proVerifyType = 3 and p.isDel = 0 
        where 
        gp.gId = ${param.id} and 
        gp.isDel = 0;`;

      let result = await ctx.orm().query(sql);

      ctx.body = result;
    } else {
      ctx.body = [];
    }
  },
  getGroupProductDetail: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.proId);

    let groupProduct = await ctx.orm().ftGroupProducts.findOne({
      where: {
        gId: param.id,
        proId: param.proId,
        isDel: 0
      }
    });

    let product = await ctx.orm().ftProducts.findOne({
      where: {
        id: param.proId,
        proVerifyType: 3,
        isDel: 0
      }
    });

    ctx.body = {
      groupProduct,
      product
    };
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.gType);
    cp.isEmpty(param.groupUserId);
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
          $between: [param.gStartTime, param.gEndTime]
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

    let groupUserGroup = await ctx.orm().ftGroups.findOne({
      where: {
        groupUserId: groupUser.id
      },
      order: [['addTime', 'DESC']]
    });

    let gIndex = 1;
    if (groupUserGroup) {
      gIndex = groupUserGroup.gIndex + 1;
    }
    let gName = `第${gIndex}期团购活动`;

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
      gPId: groupUser.pId,
      gPName: groupUser.pName,
      gCId: groupUser.cId,
      gCName: groupUser.cName,
      groupUserHeadImg: groupUser.headImg,
      isDel: 0
    });

    let groupPros = [];
    pros.forEach(e => {
      let find = param.proList.find(f => {
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
  },
  cancel: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftGroups.update(
      {
        gStatus: 999,
        gStatusName: dic.groupStatusEnum[`999`],
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );
  },
  addNewGroupProductRounds: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.groupId);
    cp.isEmpty(param.proId);
    cp.isEmpty(param.userId);

    // 获取团购
    let group = await ctx.orm().ftGroups.findOne({
      where: {
        id: param.groupId,
        gStatus: 2,
        gStartTime: {
          $lt: date.formatDate()
        },
        gEndTime: {
          $gt: date.formatDate()
        },
        isDel: 0
      }
    });
    cp.isNull(group, '团购不存在或已下线!');

    let groupProduct = await ctx.orm().ftGroupProducts.findOne({
      where: {
        gId: group.id,
        gProType: 3,
        proId: param.proId,
        isDel: 0
      }
    });
    cp.isNull(groupProduct, '此商品不是团购商品!');

    let userRoundOver = await ctx.orm().ftGroupProductRounds.findOne({
      where: {
        groupId: group.id,
        proId: param.proId,
        userId: param.userId,
        isOver: 0,
        isDel: 0
      }
    });

    assert.ok(!userRoundOver, '您已经参加了团还未结束，请勿重复开团！');

    let roundId = comm.getGuid();

    let userRound = await ctx.orm().ftGroupProductRounds.create({
      groupId: group.id,
      groupName: group.gName,
      proId: param.proId,
      roundId,
      userId: param.userId,
      isOver: groupProduct.teamNum === 1 ? 1 : 0,
      overTime: groupProduct.teamNum === 1 ? date.formatDate() : undefined,
      addTime: date.formatDate(),
      isDel: 0
    });

    ctx.body = userRound;
  },
  addOldGroupProductRounds: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.roundId);
    cp.isEmpty(param.groupId);
    cp.isEmpty(param.proId);
    cp.isEmpty(param.userId);

    // 获取团购
    let group = await ctx.orm().ftGroups.findOne({
      where: {
        id: param.groupId,
        gStatus: 2,
        gStartTime: {
          $lt: date.formatDate()
        },
        gEndTime: {
          $gt: date.formatDate()
        },
        isDel: 0
      }
    });
    cp.isNull(group, '团购不存在或已下线!');

    // 获取团购商品
    let groupProduct = await ctx.orm().ftGroupProducts.findOne({
      where: {
        gId: group.id,
        gProType: 3,
        proId: param.proId,
        isDel: 0
      }
    });
    cp.isNull(groupProduct, '此商品不是团购商品!');

    let groupProductRounds = await ctx.orm().ftGroupProductRounds.findAll({
      where: {
        groupId: group.id,
        proId: param.proId,
        roundId: param.roundId,
        isOver: 0,
        isDel: 0
      }
    });

    assert.ok(groupProductRounds.length < groupProduct.teamNum, '此团已满，请开新团！');

    let userRound = await ctx.orm().ftGroupProductRounds.findOne({
      where: {
        groupId: group.id,
        proId: param.proId,
        roundId: param.roundId,
        userId: param.userId,
        isOver: 0,
        isDel: 0
      }
    });

    assert.ok(!userRound, '您已经参加了此团，请勿重复参团！');

    let isOver = groupProduct.teamNum === groupProductRounds.length + 1 ? 1 : 0;

    userRound = await ctx.orm().ftGroupProductRounds.create({
      groupId: group.id,
      groupName: group.gName,
      proId: param.proId,
      roundId: param.roundId,
      userId: param.userId,
      isOver: isOver,
      overTime: isOver === 1 ? date.formatDate() : undefined,
      addTime: date.formatDate(),
      isDel: 0
    });

    if (isOver === 1) {
      await ctx.orm().ftGroupProductRounds.update(
        {
          isOver: isOver,
          overTime: isOver === 1 ? date.formatDate() : undefined,
          updateTime: date.formatDate()
        },
        {
          where: {
            roundId: param.roundId,
            isOver: 0,
            isDel: 0
          }
        }
      );
    }

    ctx.body = userRound;
  },
  delGroupProductRounds: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.roundId);
    cp.isEmpty(param.groupId);
    cp.isEmpty(param.proId);
    cp.isEmpty(param.userId);

    await ctx.orm().ftGroupProductRounds.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          groupId: param.groupId,
          proId: param.proId,
          roundId: param.roundId,
          userId: param.userId,
          isDel: 0
        }
      }
    );

    await ctx.orm().ftGroupProductRounds.update(
      {
        isOver: 0,
        updateTime: date.formatDate()
      },
      {
        where: {
          groupId: param.groupId,
          proId: param.proId,
          roundId: param.roundId,
          isDel: 0
        }
      }
    );
  },
  getGroupProductRounds: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.groupId);
    cp.isEmpty(param.proId);

    let sql = `
        select gpr.*, u.nickName, u.headImg from ftGroupProductRounds gpr 
        inner join ftUsers u on u.id = gpr.userId and u.isDel = 0 
        where 
        gpr.groupId = ${param.groupId} and 
        gpr.proId = ${param.proId} and 
        gpr.isOver = 0 and 
        gpr.isDel = 0;`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  }
};
