/*
 * @Author: Lienren
 * @Date: 2020-06-17 11:27:21
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-17 14:54:30
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const cpStatusNameEnum = {
  1: '未打标',
  2: '已打标',
};

const cpTypeNameEnum = {
  1: '沪深300',
  999: '其它',
};

module.exports = {
  get300Companys: async (ctx) => {
    let result = await ctx.orm('ocs_stock').hs300history.findAll({
      where: {
        date: '2020-06-01',
      },
    });

    let cmpMark = await ctx.orm('manual_marking').mk_company.findAll({
      where: {
        status: 2,
        isDel: 0,
      },
    });

    let cmp = result.map((m) => {
      let mark = cmpMark.find((f) => {
        return (f.cpCode = m.new_code);
      });
      return {
        id: m.dataValues.id,
        code: m.dataValues.code,
        name: m.dataValues.display_name,
        newCode: m.dataValues.new_code,
        type: 1,
        isMark: mark ? true : false,
      };
    });

    ctx.body = cmp;
  },
  getOtherCompanys: async (ctx) => {
    let cpAll = await ctx.orm('ocs_stock').stock_basic.findAll({});

    let cp300 = await ctx.orm('ocs_stock').hs300history.findAll({
      where: {
        date: '2020-06-01',
      },
    });

    let cp300Code = cp300.map((m) => {
      return m.new_code;
    });
    let cpOther = cpAll.filter((f) => {
      return cp300Code.indexOf(f.symbol) < 0;
    });

    let cmpMark = await ctx.orm('manual_marking').mk_company.findAll({
      where: {
        status: 2,
        isDel: 0,
      },
    });

    let cmp = cpOther.map((m) => {
      let mark = cmpMark.find((f) => {
        return (f.cpCode = m.symbol);
      });
      return {
        id: m.dataValues.id,
        code: m.dataValues.ts_code,
        name: m.dataValues.name,
        newCode: m.dataValues.symbol,
        type: 999,
        isMark: mark ? true : false,
      };
    });

    ctx.body = cmp;
  },
  getHasMarkCompanys: async (ctx) => {
    let result = await ctx.orm('manual_marking').mk_company.findAll({
      where: {
        status: 2,
        isDel: 0,
      },
    });

    ctx.body = result;
  },
};
