/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-05-09 16:57:49
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
const sequelize = require('sequelize').Sequelize;
const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const date = require('../utils/date');
const wx = require('../controllers/visitor/wx');

// 自动检查二维码
let automaticCheckQCodeJob = null;
let ctx = {};
let next = function () {
  return true;
};

async function getSuccessed () {
  console.log('check QCode is start:%s', date.formatDate());

  let result = await ctx.orm().applyInfo.findAll({
    limit: 20,
    where: {
      status: 4,
      checkQCode: 0
    },
    order: [['id', 'desc']]
  });

  if (result && result.length > 0) {
    // 有未检查的数据
    // 查找文件是否存在或文件过小
    // 如果有，则调用微信重新生成，并依赖下次巡检
    // 如果没有，则更新checkQCode状态为1

    for (let i = 0, j = result.length; i < j; i++) {
      let applyInfo = result[i];
      let filePath = path.resolve(__dirname, '../../assets/uploads/wxacode/', `${applyInfo.code}.jpeg`);

      if (fs.existsSync(filePath) && fs.statSync(filePath).size < 1000) {
        // 提交下载申请
        if (applyInfo.visitorDepartment === '校级访客通道') {
          wx.getwxacode(applyInfo.code, `pages/visitor/applyCheck?code=${applyInfo.code}`, {
            "r": 103,
            "g": 194,
            "b": 58
          })
        } else {
          wx.getwxacode(applyInfo.code, `pages/visitor/applyCheck?code=${applyInfo.code}`, {
            "r": 0,
            "g": 0,
            "b": 0
          })
        }
      } else if (!fs.existsSync(filePath)) {
        // 提交下载申请
        if (applyInfo.visitorDepartment === '校级访客通道') {
          wx.getwxacode(applyInfo.code, `pages/visitor/applyCheck?code=${applyInfo.code}`, {
            "r": 103,
            "g": 194,
            "b": 58
          })
        } else {
          wx.getwxacode(applyInfo.code, `pages/visitor/applyCheck?code=${applyInfo.code}`, {
            "r": 0,
            "g": 0,
            "b": 0
          })
        }
      } else {
        // 更新状态
        ctx.orm().applyInfo.update({
          checkQCode: 1
        }, {
          where: {
            id: applyInfo.id
          }
        });
      }
    }
  }

  console.log('check QCode is over:%s', date.formatDate());
}

async function main () {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 更新团购状态，每10秒执行一次
  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 30 === 0) {
      automaticRule.second.push(i);
    }
  }

  // automaticUpdateGroupStatusJob = schedule.scheduleJob(automaticRule, updateGroupStatus);
  automaticCheckQCodeJob = schedule.scheduleJob(
    automaticRule,
    getSuccessed
  );
}

process.on('SIGINT', function () {
  if (automaticCheckQCodeJob) {
    automaticCheckQCodeJob.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
