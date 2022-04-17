/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:58:40
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-04-29 15:25:08
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize').Sequelize;
const date = require('../../utils/date');
const jwt = require('../../utils/jwt');
const ali = require('../../extends/ali');
const cp = require('./checkParam');
const dic = require('./fruitEnum');

async function addGroup(ctx, groupUserId) {
  // 验证团长
  let groupUser = await ctx.orm().ftUsers.findOne({
    where: {
      id: groupUserId,
      userType: 2,
      verifyType: 2
    }
  });

  cp.isNull(groupUser);

  let groupUserGroup = await ctx.orm().ftGroups.findOne({
    where: {
      groupUserId: groupUser.id
    }
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
    gStartTime: date.formatDate(),
    gEndTime: '9999-12-31 23:59:59',
    gStatus: 2,
    gStatusName: dic.groupStatusEnum[`2`],
    gProductNum: 0,
    gOrderNum: 0,
    gType: 1,
    gTypeName: dic.groupTypeEnum[`1`],
    addTime: date.formatDate(),
    gPId: groupUser.pId,
    gPName: groupUser.pName,
    gCId: groupUser.cId,
    gCName: groupUser.cName,
    groupUserHeadImg: groupUser.headImg,
    isDel: 0
  });

  if (group) {
    // 注入平台商品
    let proList = await ctx.orm().ftProducts.findAll({
      where: {
        proType: 2,
        proVerifyType: 3,
        isDel: 0
      }
    });

    let groupPros = proList.map(m => {
      let groupInfo =
        m.groupInfo && m.groupInfo.length > 0
          ? JSON.parse(m.groupInfo)
          : {
              gProType: 1,
              startTime: null,
              endTime: null,
              teamNum: 0,
              isRecommend: m.isRecommend
            };

      return {
        gId: group.id,
        gProType: groupInfo.gProType,
        gProTypeName: dic.groupProTypeEnum[`${groupInfo.gProType}`],
        proId: m.id,
        startTime: groupInfo.startTime,
        endTime: groupInfo.endTime,
        teamNum: groupInfo.teamNum || 0,
        isRecommend: groupInfo.isRecommend || 0,
        addTime: date.formatDate(),
        isDel: 0
      };
    });

    // 添加平台商品
    await ctx.orm().ftGroupProducts.bulkCreate(groupPros);
  }
}

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.userType && param.userType > 0) {
      where.userType = param.userType;
    }

    if (param.verifyType && param.verifyType > 0) {
      where.verifyType = param.verifyType;
    }

    let total = await ctx.orm().ftUsers.count({
      where
    });
    let list = await ctx.orm().ftUsers.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['addTime', 'DESC']]
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

    let result = await ctx.orm().ftUsers.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  getByAlipayUserId: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.alipayUserId);

    let result = await ctx.orm().ftUsers.findOne({
      where: {
        alipayUserId: param.alipayUserId,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  getByAlipayCode: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.code);

    // 获取支付宝信息
    const resultAli = await ali.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code: param.code,
      refreshToken: 'token'
    });

    if (resultAli.userId) {
      let result = await ctx.orm().ftUsers.findOne({
        where: {
          alipayUserId: resultAli.userId,
          isDel: 0
        }
      });

      if (!result) {
        // 找不到，新用户注册
        result = await ctx.orm().ftUsers.create({
          alipayUserId: resultAli.userId,
          nickName: '',
          userName: '',
          userPhone: '',
          headImg: '',
          addTime: date.formatDate(),
          isDel: 0,
          userType: 1,
          userTypeName: dic.userTypeEnum[`1`],
          userIdCard: '',
          pId: 0,
          pName: '',
          cId: 0,
          cName: '',
          siteName: '',
          sitePosition: '[]',
          siteAddress: '',
          sitePickAddress: '',
          verifyType: 0,
          verifyTypeName: dic.verifyTypeEnum[`0`],
          verfiyRemark: '',
          currGId: 0,
          currGName: ''
        });

        // 查询新人券
        let discounts = await ctx.orm().ftDiscounts.findAll({
          where: {
            disSendType: 1,
            isDel: 0
          }
        });

        if (discounts && discounts.length > 0) {
          // 送新人券
          ctx.orm().ftUserDiscounts.bulkCreate(
            discounts.map(m => {
              let effectiveTime = dic.disValTypeEnum.generationTime(
                m.disValType,
                m.disVal,
                new Date()
              );
              return {
                userId: result.id,
                disId: m.id,
                disTitle: m.disTitle,
                disSubTitle: m.disSubTitle,
                disType: m.disType,
                disTypeName: m.disTypeName,
                disContext: m.disContext,
                disStartTime: effectiveTime.startTime,
                disEndTime: effectiveTime.endTime,
                isUse: 0,
                isOver: 0,
                addTime: date.formatDate(),
                isDel: 0
              };
            })
          );
        }
      } else {
        // 验证团在不在
        if (result.currGId && result.currGId > 0) {
          let group = await ctx.orm().ftGroups.findOne({
            where: {
              id: result.currGId,
              gStatus: 2,
              isDel: 0
            }
          });

          if (!group) {
            // 团不在了，清用户所有团
            await ctx.orm().ftUsers.update(
              {
                currGId: 0,
                currGName: '',
                currGTime: date.formatDate(),
                updateTime: date.formatDate()
              },
              {
                where: {
                  id: result.id,
                  isDel: 0
                }
              }
            );

            result.dataValues['currGId'] = 0;
            result.dataValues['currGName'] = '';
            result.dataValues['currGTime'] = date.formatDate();
            result.dataValues['updateTime'] = date.formatDate();
          }
        }
      }

      // 生成Token
      let now = date.getTimeStamp();
      let token = jwt.getToken({
        userId: result.id,
        alipayUserId: result.alipayUserId
      });
      let tokenOverTime = now + 3600000 * 4; // Token有效期4小时

      // 刷新Token
      await ctx.orm().ftUsers.update(
        {
          token: token,
          tokenOverTime: tokenOverTime,
          updateTime: date.formatDate()
        },
        {
          where: {
            id: result.id,
            isDel: 0
          }
        }
      );

      result.dataValues['token'] = token;

      ctx.body = {
        id: result.id,
        alipayUserId: result.alipayUserId,
        nickName: result.nickName,
        userName: result.userName,
        userPhone: result.userPhone,
        headImg: result.headImg,
        addTime: result.addTime,
        userType: result.userType,
        userTypeName: result.userTypeName,
        pId: result.pId,
        pName: result.pName,
        cId: result.cId,
        cName: result.cName,
        siteName: result.siteName,
        sitePosition: result.sitePosition,
        siteAddress: result.siteAddress,
        sitePickAddress: result.sitePickAddress,
        currGId: result.currGId,
        currGName: result.currGName,
        currGTime: result.currGTime,
        verifyType: result.verifyType,
        verifyTypeName: result.verifyTypeName,
        token: result.token
      };
    } else {
      ctx.body = {};
    }
  },
  setUserGoInGroup: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.currGId);
    cp.isEmpty(param.currGName);

    await ctx.orm().ftUsers.update(
      {
        currGId: param.currGId,
        currGName: param.currGName,
        currGTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          isDel: 0
        }
      }
    );
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftUsers.update(
      {
        nickName: param.nickName,
        headImg: param.headImg,
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
  submitGroupUserVerify: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.userName);
    cp.isEmpty(param.userPhone);
    cp.isEmpty(param.userIdCard);
    cp.isEmpty(param.pId);
    cp.isEmpty(param.pName);
    cp.isEmpty(param.cId);
    cp.isEmpty(param.cName);
    cp.isEmpty(param.siteName);
    cp.isArray(param.sitePosition);
    cp.isEmpty(param.siteAddress);
    cp.isEmpty(param.sitePickAddress);

    await ctx.orm().ftUsers.update(
      {
        userName: param.userName,
        userPhone: param.userPhone,
        userIdCard: param.userIdCard,
        pId: param.pId,
        pName: param.pName,
        cId: param.cId,
        cName: param.cName,
        siteName: param.siteName,
        sitePosition: JSON.stringify(param.sitePosition),
        siteAddress: param.siteAddress,
        sitePickAddress: param.sitePickAddress,
        updateTime: date.formatDate(),
        verifyType: 1,
        verifyTypeName: dic.verifyTypeEnum[`1`],
        verfiyRemark: '',
        verifyTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          userType: 1,
          verifyType: {
            $in: [0, 3]
          },
          isDel: 0
        }
      }
    );
  },
  submitGroupUserVerifyOver: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.verifyType);

    await ctx.orm().ftUsers.update(
      {
        userType: 2,
        userTypeName: dic.userTypeEnum[`${2}`],
        updateTime: date.formatDate(),
        verifyType: param.verifyType,
        verifyTypeName: dic.verifyTypeEnum[`${param.verifyType}`],
        verfiyRemark: param.verfiyRemark,
        verifyTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          userType: 1,
          verifyType: 1,
          isDel: 0
        }
      }
    );

    if (param.verifyType === 2) {
      // 审核通过
      // 添加帐户

      let account = await ctx.orm().ftAccount.findOne({
        where: {
          userId: param.id
        }
      });

      if (account) {
        await ctx.orm().ftAccount.update(
          {
            handFeeRate: param.handFeeRate || 6, // 手续费比例（6‰）
            taxRate: param.taxRate || 0, // 税点（5%）
            updateTime: date.formatDate(),
            isDel: 0
          },
          {
            where: {
              userId: account.userId,
              isDel: 1
            }
          }
        );
      } else {
        await ctx.orm().ftAccount.create({
          userId: param.id,
          totalBrokerage: 0,
          totalOverPrice: 0,
          curOverPrice: 0,
          preOccupy: 0,
          handFeeRate: param.handFeeRate || 6, // 手续费比例（6‰）
          taxRate: param.taxRate || 0, // 税点（5%）
          addTime: date.formatDate(),
          isDel: 0
        });
      }

      // 添加长期大团
      await addGroup(ctx, param.id);
    }
  },
  updateGroupUser: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.userName);
    cp.isEmpty(param.userPhone);
    cp.isEmpty(param.userIdCard);
    cp.isEmpty(param.siteName);
    cp.isEmpty(param.siteAddress);
    cp.isEmpty(param.sitePickAddress);

    let result = await ctx.orm().ftUsers.update(
      {
        userName: param.userName,
        userPhone: param.userPhone,
        userIdCard: param.userIdCard,
        siteName: param.siteName,
        siteAddress: param.siteAddress,
        sitePickAddress: param.sitePickAddress,
        updateTime: date.formatDate()
      },
      {
        where: {
          id: param.id,
          userType: 2,
          verifyType: 2,
          isDel: 0
        }
      }
    );

    if (result && result.length > 0 && result[0] > 0) {
      // 修改成功
      ctx.orm().ftGroups.update(
        {
          groupUserName: param.userName,
          groupUserPhone: param.userPhone,
          gSiteName: param.siteName,
          gSiteAddress: param.siteAddress,
          gSitePickAddress: param.sitePickAddress
        },
        {
          where: {
            groupUserId: param.id,
            isDel: 0
          }
        }
      );

      ctx.orm().ftOrders.update(
        {
          groupUserName: param.userName,
          groupUserPhone: param.userPhone
        },
        {
          where: {
            groupUserId: param.id,
            isDel: 0
          }
        }
      );

      ctx.orm().ftShips.update(
        {
          groupUserName: param.userName,
          groupUserPhone: param.userPhone,
          groupSiteName: param.siteName,
          groupSiteAddress: param.siteAddress,
          groupSitePickAddress: param.sitePickAddress
        },
        {
          where: {
            groupUserId: param.id,
            isDel: 0
          }
        }
      );

      ctx.orm().ftShipOrders.update(
        {
          groupUserName: param.userName
        },
        {
          where: {
            groupUserId: param.id,
            isDel: 0
          }
        }
      );
    }
  },
  updateGroupUserHandFeeAndTax: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftAccount.update(
      {
        handFeeRate: param.handFeeRate || 0, // 手续费比例（6‰）
        taxRate: param.taxRate || 0, // 税点（5%）
        updateTime: date.formatDate()
      },
      {
        where: {
          userId: param.id,
          isDel: 0
        }
      }
    );
  },
  editGroupUserHandFeeAndTax: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.handFeeRate);
    cp.isEmpty(param.taxRate);

    if (groupUser.verifyType === 2) {
      // 审核通过
      // 添加帐户
      await ctx.orm().ftAccount.create(
        {
          handFeeRate: param.handFeeRate,
          taxRate: param.taxRate,
          updateTime: date.formatDate()
        },
        {
          where: {
            userId: param.userId,
            isDel: 0
          }
        }
      );
    }
  },
  closeGroupUser: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let result = await ctx.orm().ftUsers.update(
      {
        userType: 1,
        userTypeName: dic.userTypeEnum[`${1}`],
        updateTime: date.formatDate(),
        verifyType: 0,
        verifyTypeName: dic.verifyTypeEnum[`0`],
        verfiyRemark: '关闭团长'
      },
      {
        where: {
          id: param.id,
          userType: 2,
          verifyType: 2,
          isDel: 0
        }
      }
    );

    if (result && result.length > 0 && result[0] > 0) {
      await ctx.orm().ftAccount.update(
        {
          updateTime: date.formatDate(),
          isDel: 1
        },
        {
          where: {
            userId: param.id,
            isDel: 0
          }
        }
      );

      await ctx.orm().ftGroups.update(
        {
          gStatus: 999,
          gStatusName: dic.groupStatusEnum[`999`],
          updateTime: date.formatDate()
        },
        {
          where: {
            groupUserId: param.id,
            gStatus: {
              $in: [1, 2]
            },
            isDel: 0
          }
        }
      );
    }
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    // 删除用户表
    await ctx.orm().ftUsers.update(
      {
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

    // 删除帐户表
    await ctx.orm().ftAccount.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          userId: param.id,
          isDel: 0
        }
      }
    );
  },
  getAccount: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    let result = await ctx.orm().ftAccount.findOne({
      where: {
        userId: param.id
      }
    });

    ctx.body = {
      totalBrokerage: result.totalBrokerage,
      totalOverPrice: result.totalOverPrice,
      curOverPrice: result.curOverPrice,
      preOccupy: result.preOccupy,
      handFeeRate: result.handFeeRate,
      taxRate: result.taxRate
    };
  },
  getAccountOrder: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    cp.isEmpty(param.id);

    let where = {
      userId: param.id,
      isDel: 0
    };

    if (param.orderType && param.orderType > 0) {
      where.orderType = param.orderType;
    }

    let total = await ctx.orm().ftAccountOrders.count({
      where
    });
    let list = await ctx.orm().ftAccountOrders.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['addTime', 'DESC']]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  getPickCashAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.userId && param.userId > 0) {
      where.userId = param.userId;
    }

    if (param.pickCashType && param.pickCashType > 0) {
      where.pickCashType = param.pickCashType;
    }

    if (param.pickCashStatus && param.pickCashStatus > 0) {
      where.pickCashStatus = param.pickCashStatus;
    }

    let total = await ctx.orm().ftPickCashs.count({
      where
    });
    let list = await ctx.orm().ftPickCashs.findAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['addTime', 'DESC']]
    });

    ctx.body = {
      list,
      total,
      pageIndex,
      pageSize
    };
  },
  addPickCashs: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.pickCashType);
    cp.isEmpty(param.pickPrice);
    cp.isEmpty(param.pickCashContext);

    // 获取团长
    let groupUser = await ctx.orm().ftUsers.findOne({
      where: {
        id: param.userId,
        userType: 2,
        verifyType: 2,
        isDel: 0
      }
    });
    cp.isNull(groupUser, '团长不存在!');

    let groupAccount = await ctx.orm().ftAccount.findOne({
      where: {
        userId: groupUser.id,
        isDel: 0
      }
    });
    cp.isNull(groupAccount, '团长帐户不存在!');

    let totalPickPrice = param.pickPrice;
    let handFeePrice = (param.pickPrice * groupAccount.handFeeRate) / 1000;
    let taxPrice = (param.pickPrice * groupAccount.taxRate) / 1000;
    let pickPrice = param.pickPrice - handFeePrice - taxPrice;

    let result = await ctx.orm().ftAccount.update(
      {
        curOverPrice: sequelize.literal(`curOverPrice - ${pickPrice}`),
        preOccupy: sequelize.literal(`preOccupy + ${pickPrice}`)
      },
      {
        where: {
          userId: groupUser.id,
          curOverPrice: {
            $gte: pickPrice
          },
          isDel: 0
        }
      }
    );

    if (result && result.length > 0 && result[0] > 0) {
      await ctx.orm().ftPickCashs.create({
        userId: groupUser.id,
        userName: groupUser.userName,
        pickCashType: param.pickCashType,
        pickCashTypeName: dic.pickCashTypeEnum[`${param.pickCashType}`],
        pickPrice: pickPrice,
        handFeePrice: handFeePrice,
        taxPrice: taxPrice,
        totalPickPrice: totalPickPrice,
        pickCashContext: param.pickCashContext,
        pickCashStatus: 1,
        pickCashStatusName: dic.pickCashStatusEnum[`1`],
        pickCashStatusTime: date.formatDate(),
        addTime: date.formatDate(),
        isDel: 0
      });
    } else {
      assert.ok(false, '您的余额不足！');
    }
  },
  submitPickCashVerifyOver: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.pickCashStatus);

    let pickCash = await ctx.orm().ftPickCashs.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });
    cp.isNull(pickCash, '提现单不存在!');

    let result = await ctx.orm().ftPickCashs.update(
      {
        pickCashStatus: param.pickCashStatus,
        pickCashStatusName: dic.pickCashStatusEnum[`${param.pickCashStatus}`],
        remark: param.remark,
        pickCashStatusTime: date.formatDate()
      },
      {
        where: {
          id: pickCash.id,
          isDel: 0
        }
      }
    );

    if (result && result.length > 0 && result[0] > 0) {
      if (pickCash.pickCashType === 1 && param.pickCashStatus === 2) {
        // 支付宝转帐
      }

      await ctx.orm().ftAccount.update(
        {
          preOccupy: sequelize.literal(
            `preOccupy - ${pickCash.totalPickPrice}`
          ),
          updateTime: date.formatDate()
        },
        {
          where: {
            userId: pickCash.userId,
            preOccupy: {
              $gte: pickCash.totalPickPrice
            },
            isDel: 0
          }
        }
      );
    }
  },
  getGroupUserLeaderboard: async ctx => {
    let sql = `select a.userId, a.totalBrokerage, u.userName, u.headImg, u.pName, u.cName, u.siteName, u.siteAddress from ftAccount a 
    inner join ftUsers u on u.id = a.userId and u.isDel = 0 
    where 
      a.isDel = 0 
    order by a.totalBrokerage desc;`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  getGroupUserAccount: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let groupUserId = param.groupUserId || 0;

    let sql1 = `select count(1) num from ftAccount a inner join ftUsers u on u.id = a.userId and u.isDel = 0 where a.isDel = 0 ${
      groupUserId > 0 ? ` and a.userId = ${groupUserId}` : ``
    };`;
    let sql2 = `select a.*, u.* from ftAccount a inner join ftUsers u on u.id = a.userId and u.isDel = 0 where a.isDel = 0 ${
      groupUserId > 0 ? ` and a.userId = ${groupUserId}` : ``
    } order by a.addTime desc limit ${(pageIndex - 1) * pageSize},${pageSize};`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    ctx.body = {
      list: result2,
      total: result1 && result1.length > 0 ? result1[0].num : 0,
      pageIndex,
      pageSize
    };
  },
  aliGateWay: async ctx => {
    let param = ctx.request.body || {};
    console.log('param:', param);

    ctx.body = {
      ...param
    };
  }
};
