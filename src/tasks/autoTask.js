/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-18 16:45:49
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
const config = require('../config.js');
const date = require('../utils/date');
const dic = require('../controllers/fruit/fruitEnum');

// 自动更新团购状态
let automaticUpdateGroupStatusJob = null;
let ctx = {};
let next = function() {
  return true;
};

async function updateGroupStatus() {
  // 获取所有未开始和已开始的团购
  let groups = await ctx.orm().ftGroups.findAll({
    where: {
      gStatus: {
        $in: [1, 2]
      },
      isDel: 0
    }
  });

  if (groups && groups.length > 0) {
    for (let i = 0, j = groups.length; i < j; i++) {
      let nowGroupStatus = dic.groupStatusEnum.generationStatus(groups[i].gStartTime, groups[i].gEndTime);

      if (groups[i].gStatus !== nowGroupStatus) {
        // 更新团购状态
        ctx.orm().ftGroups.update(
          {
            gStatus: nowGroupStatus,
            gStatusName: dic.groupStatusEnum[`${nowGroupStatus}`],
            updateTime: date.formatDate()
          },
          {
            where: {
              id: groups[i].id,
              gStatus: {
                $in: [1, 2]
              },
              isDel: 0
            }
          }
        );
      }
    }
  }
}

async function main() {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 更新团购状态，每10秒执行一次
  let automaticUpdateGroupRule = new schedule.RecurrenceRule();
  automaticUpdateGroupRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 10 === 0) {
      automaticUpdateGroupRule.second.push(i);
    }
  }
  automaticUpdateGroupStatusJob = schedule.scheduleJob(automaticUpdateGroupRule, updateGroupStatus);
}

process.on('SIGINT', function() {
  if (automaticUpdateGroupStatusJob) {
    automaticUpdateGroupStatusJob.cancel();
  }

  process.exit(0);
});

process.on('exit', function() {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
