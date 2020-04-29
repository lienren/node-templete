/*
 * @Author: Lienren
 * @Date: 2020-04-29 18:25:38
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-04-29 18:40:06
 */
'use strict';

const assert = require('assert');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const enumHouseStatusName = {
  0: '待审核',
  1: '已通过',
  2: '已上线',
  3: '已下线',
};
module.exports = {
  getHouse: async (ctx) => {
    let result = await ctx.orm('youhouse').yh_house.findAll({
      where: {
        status: 2,
        isDel: 0,
      },
    });

    let houseItems = [];
    if (result) {
      houseItems = result.map((m) => {
        let data = m.dataValues;
        let jians =
          data.jians && data.jians.length > 0 ? JSON.parse(data.jians) : [];
        return {
          ...data,
          yj: data.yj && data.yj.length > 0 ? JSON.parse(data.yj) : ['无'],
          jians: jians.map((jm) => {
            return `root://assets/img/icons/${jm}.png`;
          }),
          jiansKeys: jians,
          stopTime: date.formatDate(data.stopTime, 'YYYY年MM月DD日'),
        };
      });
    }

    ctx.body = houseItems;
  },
};
