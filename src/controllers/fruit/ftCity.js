/*
 * @Author: Lienren
 * @Date: 2019-10-17 09:05:32
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-23 16:39:07
 */
'use strict';

const pinyin = require('pinyin');
const date = require('../../utils/date');
const cp = require('./checkParam');

module.exports = {
  getAll: async ctx => {
    let param = ctx.request.body || {};
    let pageIndex = param.pageIndex || 1;
    let pageSize = param.pageSize || 20;

    let where = {
      isDel: 0
    };

    if (param.pId && param.pId > 0) {
      where.pId = param.pId;
    }

    let total = await ctx.orm().ftCity.count({
      where
    });
    let list = await ctx.orm().ftCity.findAll({
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

    let result = await ctx.orm().ftCity.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.cName);
    cp.isEmpty(param.pId);
    cp.isEmpty(param.pName);

    let cPinyin = pinyin(param.cName, {
      style: pinyin.STYLE_NORMAL
    });

    let cShortCode = pinyin(param.cName, {
      style: pinyin.STYLE_FIRST_LETTER
    });

    cPinyin = cPinyin.reduce((total, curr) => {
      return total + curr[0];
    }, '');

    cShortCode = cShortCode.length > 0 ? (cShortCode[0].length > 0 ? cShortCode[0][0] : '') : '';
    cShortCode = cShortCode.toUpperCase();

    await ctx.orm().ftCity.create({
      cName: param.cName,
      pId: param.pId,
      pName: param.pName,
      cShortCode: cShortCode,
      cPinyin: cPinyin,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.cName);
    cp.isEmpty(param.pId);
    cp.isEmpty(param.pName);

    await ctx.orm().ftCity.update(
      {
        cName: param.cName,
        pId: param.pId,
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

    await ctx.orm().ftCity.update(
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
