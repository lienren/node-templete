/*
 * @Author: Lienren
 * @Date: 2019-08-26 16:42:34
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-26 16:44:42
 */
'use strict';

const sequelize = require('sequelize');
const date = require('../../utils/date');

module.exports = {
  insertDay: async (db, day) => {
    let result = await db.satStatistics.findOne({
      where: {
        day
      }
    });

    if (!result) {
      let now = date.formatDate();
      // 不存在则插入
      await db.satStatistics.create({
        day,
        s1: 0,
        s2: 0,
        s3: 0,
        s4: 0,
        s5: 0,
        s6: 0,
        addTime: now,
        updateTime: now
      });
    }
  },
  updateDay: async (db, day, key, val) => {
    day = day.replace(/-/g, '');
    // await staHelper.insertDay(db, day);

    let updateVal = {};
    updateVal[key] = sequelize.literal(`${key} + ${val}`);

    db.satStatistics.update(updateVal, {
      where: {
        day
      }
    });
  }
};
