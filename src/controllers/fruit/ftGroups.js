/*
 * @Author: Lienren
 * @Date: 2019-10-17 19:30:18
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-17 19:44:22
 */
'use strict';

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

      let result = await ctx.orm().query(pushDiscountSql);

      ctx.body = result;
    } else {
      ctx.body = [];
    }
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.pName);

    await ctx.orm().ftProvince.create({
      pName: param.pName,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.pName);

    await ctx.orm().ftProvince.update(
      {
        pName: param.pName,
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
  del: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);

    await ctx.orm().ftProvince.update(
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
  }
};
