/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:58:40
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-23 16:53:45
 */
'use strict';

const pinyin = require('pinyin');
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

    let total = await ctx.orm().ftProvince.count({
      where
    });
    let list = await ctx.orm().ftProvince.findAll({
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

    let result = await ctx.orm().ftProvince.findOne({
      where: {
        id: param.id,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  add: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.pName);

    let pPinyin = pinyin(param.pName, {
      style: pinyin.STYLE_NORMAL
    });

    let pShortCode = pinyin(param.pName, {
      style: pinyin.STYLE_FIRST_LETTER
    });

    pPinyin = pPinyin.reduce((total, curr) => {
      return total + curr[0];
    }, '');

    pShortCode = pShortCode.length > 0 ? (pShortCode[0].length > 0 ? pShortCode[0][0] : '') : '';
    pShortCode = pShortCode.toUpperCase();

    await ctx.orm().ftProvince.create({
      pName: param.pName,
      pShortCode: pShortCode,
      pPinyin: pPinyin,
      addTime: date.formatDate(),
      isDel: 0
    });
  },
  edit: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.id);
    cp.isEmpty(param.pName);

    let pPinyin = pinyin(param.pName, {
      style: pinyin.STYLE_NORMAL
    });

    let pShortCode = pinyin(param.pName, {
      style: pinyin.STYLE_FIRST_LETTER
    });

    pPinyin = pPinyin.reduce((total, curr) => {
      return total + curr[0];
    }, '');

    pShortCode = pShortCode.length > 0 ? (pShortCode[0].length > 0 ? pShortCode[0][0] : '') : '';
    pShortCode = pShortCode.toUpperCase();

    await ctx.orm().ftProvince.update(
      {
        pName: param.pName,
        pShortCode: pShortCode,
        pPinyin: pPinyin,
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
