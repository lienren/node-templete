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
const moment = require('moment');
const config = require('../config.js');
const date = require('../utils/date');
const http = require('../utils/http');

// 自动检查二维码
let automaticCheckQCodeJob = null;
let ctx = {};
let next = function () {
  return true;
};

async function updateErrorStatus () {
  let result = await ctx.orm().BaseConfig.findOne({
    where: {
      key: 'ErrorSwitch'
    }
  })

  if (result && result.value) {
    let data = JSON.parse(result.value)

    Object.keys(data).map(m => {
      if (data[m].open && data[m].openDate.length === 2) {
        let startTime = date.getTimeStamp()
        let endTime = date.timeToTimeStamp(data[m].openDate[1] + ' 23:59:59')
        
        if (startTime > endTime) {
          data[m].open = false
          data[m].openDate = []
        }
      }
    })

    await ctx.orm().BaseConfig.update({
      value: JSON.stringify(data),
      lasttime: date.getTimeStamp()
    }, {
      where: {
        key: 'ErrorSwitch'
      }
    })
  }
}

async function main () {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 更新团购状态，每30秒执行一次
  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 30 === 0) {
      automaticRule.second.push(i);
    }
  }

  automaticCheckQCodeJob = schedule.scheduleJob(
    automaticRule,
    function () {
      updateErrorStatus()
    }
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
