/*
 * @Author: Lienren
 * @Date: 2019-10-17 14:34:23
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-02 16:47:07
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

    if (param.disSendType && param.disSendType > 0) {
      where.disSendType = param.disSendType;
    }

    if (param.disType && param.disType > 0) {
      where.disType = param.disType;
    }

    if (param.disValType && param.disValType > 0) {
      where.disValType = param.disValType;
    }

    let total = await ctx.orm().ftDiscounts.count({
      where
    });
    let list = await ctx.orm().ftDiscounts.findAll({
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

    let result = await ctx.orm().ftDiscounts.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.disTitle);
    cp.isEmpty(param.disSubTitle);
    cp.isEmpty(param.disSendType);
    cp.isEmpty(param.disType);
    cp.isEmpty(param.disContext);
    cp.isEmpty(param.disValType);
    cp.isEmpty(param.disVal);
    cp.isEmpty(param.disRangeType);
    cp.isEmpty(param.disRange);

    let discount = await ctx.orm().ftDiscounts.create({
      disTitle: param.disTitle,
      disSubTitle: param.disSubTitle,
      disImg: param.disImg,
      disSendType: param.disSendType,
      disSendTypeName: dic.disSendTypeEnum[`${param.disSendType}`],
      disType: param.disType,
      disTypeName: dic.disTypeEnum[`${param.disType}`],
      disContext: param.disContext,
      disValType: param.disValType,
      disValTypeName: dic.disValTypeEnum[`${param.disValType}`],
      disVal: param.disVal,
      disRangeType: param.disRangeType,
      disRangeTypeName: dic.disRangeTypeEnum[`${param.disRangeType}`],
      disRange: param.disRange,
      addTime: date.formatDate(),
      isDel: 0
    });

    // 赠送普发券
    if (discount.disSendType === 3) {
      let effectiveTime = dic.disValTypeEnum.generationTime(discount.disValType, discount.disVal, new Date());

      // 送券Sql
      let pushDiscountSql = `insert into ftUserDiscounts 
      (userId,disId,disTitle,disSubTitle,disType,disTypeName,disContext,disStartTime,disEndTime,isUse,isOver,addTime,isDel)  
      select id,${discount.id},'${discount.disTitle}','${discount.disSubTitle}',${discount.disType},'${discount.disTypeName}','${discount.disContext}','${effectiveTime.startTime}','${effectiveTime.endTime}',0,0,now(),0 
      from ftUsers where isDel = 0;`;

      // 送券
      ctx.orm().query(pushDiscountSql, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });
    }
  },
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftDiscounts.update(
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

    await ctx.orm().ftUserDiscounts.update(
      {
        updateTime: date.formatDate(),
        isDel: 1
      },
      {
        where: {
          disId: param.id,
          isDel: 0
        }
      }
    );
  },
  getUserDiscount: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);

    let sql = `select ud.*, d.disRangeType, d.disRangeTypeName, d.disRange from ftUserDiscounts ud 
    inner join ftDiscounts d on d.id = ud.disId and d.isDel = 0 
    where 
      ud.userId = ${param.userId} and 
      ud.disStartTime < '${date.formatDate()}' and 
      ud.disEndTime > '${date.formatDate()}' and 
      ud.isUse = 0 and 
      ud.isOver = 0 and 
      ud.isDel = 0;`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;

    ctx.body = result;
  },
  getUserNotDiscount: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);

    let sql = `select * from ftDiscounts where 
    disSendType = 2 and 
    id not in (select disId from ftUserDiscounts where userId = ${param.userId} and isDel = 0) and 
    isDel = 0;`;

    let result = await ctx.orm().query(sql);

    ctx.body = result;
  },
  pullDiscount: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.userId);
    cp.isEmpty(param.disId);

    let result = await ctx.orm().ftUserDiscounts.findOne({
      where: {
        userId: param.userId,
        disId: param.disId,
        isDel: 0
      }
    });

    if (result) {
      assert.ok(false, '已领取过该券！');
    } else {
      let discount = await ctx.orm().ftDiscounts.findOne({
        where: {
          id: param.disId,
          isDel: 0
        }
      });

      cp.isNull(discount, '优惠券不存在！');

      let effectiveTime = dic.disValTypeEnum.generationTime(discount.disValType, discount.disVal, new Date());

      await ctx.orm().ftUserDiscounts.create({
        userId: param.userId,
        disId: discount.id,
        disTitle: discount.disTitle,
        disSubTitle: discount.disSubTitle,
        disType: discount.disType,
        disTypeName: discount.disTypeName,
        disContext: discount.disContext,
        disStartTime: effectiveTime.startTime,
        disEndTime: effectiveTime.endTime,
        isUse: 0,
        isOver: 0,
        addTime: date.formatDate(),
        isDel: 0
      });
    }
  },
  getUsersDiscount: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let disId = param.disId || 0;
    let isUse = param.isUse !== undefined && param.isUse !== null ? param.isUse : -1;
    let isOver = param.isOver !== undefined && param.isOver !== null ? param.isOver : -1;

    let sql1 = `select count(1) num from ftUserDiscounts ud 
    inner join ftDiscounts d on d.id = ud.disId and d.isDel = 0 
    inner join ftUsers u on u.id = ud.userId and u.isDel = 0 
    where 
      ud.isUse = 0 and 
      ud.isOver = 0 and 
      ud.isDel = 0 ${disId > 0 ? ` and ud.disId = ${disId} ` : ``} ${isUse > -1 ? ` and ud.isUse=${isUse} ` : ``} ${
      isOver > -1 ? ` and ud.isOver=${isOver} ` : ``
    };`;

    let sql2 = `select ud.*, d.disRangeType, d.disRangeTypeName, d.disRange, u.nickName, u.headImg from ftUserDiscounts ud 
    inner join ftDiscounts d on d.id = ud.disId and d.isDel = 0 
    inner join ftUsers u on u.id = ud.userId and u.isDel = 0 
    where 
      ud.isUse = 0 and 
      ud.isOver = 0 and 
      ud.isDel = 0 ${disId > 0 ? ` and ud.disId = ${disId} ` : ``} ${isUse > -1 ? ` and ud.isUse=${isUse} ` : ``} ${
      isOver > -1 ? ` and ud.isOver=${isOver} ` : ``
    } order by ud.addTime desc limit ${(pageIndex - 1) * pageSize},${pageSize};`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    ctx.body = {
      list: result2,
      total: result1 && result1.length > 0 ? result1[0].num : 0,
      pageIndex,
      pageSize
    };
  }
};
