/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:58:40
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-17 19:45:39
 */
'use strict';

const date = require('../../utils/date');
const ali = require('../../extends/ali');
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

    let total = await ctx.orm().ftUsers.findAndCount({
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

    if (resultAli.alipayUserId) {
      let result = await ctx.orm().ftUsers.findOne({
        where: {
          alipayUserId: resultAli.alipayUserId,
          isDel: 0
        }
      });

      if (!result) {
        // 找不到，新用户注册
        result = await ctx.orm().ftUsers.create({
          alipayUserId: resultAli.alipayUserId,
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
          verfiyRemark: ''
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
              let effectiveTime = dic.disValTypeEnum.generationTime(m.disValType, m.disVal, new Date());
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
      }

      ctx.body = result;
    } else {
      ctx.body = {};
    }
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

    let groupUser = await ctx.orm().ftUsers.update(
      {
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

    if (groupUser.verifyType === 2) {
      // 审核通过
      // 添加帐户
      await ctx.orm().ftAccount.create({
        userId: groupUser.id,
        totalBrokerage: 0,
        totalOverPrice: 0,
        curOverPrice: 0,
        preOccupy: 0,
        handFeeRate: 6, // 手续费比例（6‰）
        taxRate: 5, // 税点（5%）
        addTime: date.formatDate(),
        isDel: 0
      });
    }
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
  }
};
