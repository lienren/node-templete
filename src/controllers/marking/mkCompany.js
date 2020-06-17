/*
 * @Author: Lienren
 * @Date: 2020-06-17 11:27:21
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-17 12:13:36
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

    ctx.body = result;
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

    ctx.body = cpOther;
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
