/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-05-09 16:57:49
 */
'use strict';

console.time('AutoTaskExec');

const schedule = require('node-schedule');
const config = require('../config.js');
const date = require('../utils/date');

// 自动检查二维码
let everyDayJob = null;
let ctx = {};
let next = function () {
  return true;
};

// 每天执行
async function everyDayWork () {
  console.log('everyDayWork is start:%s', date.formatDate());

  let sql = `update info_house_contract set ctype = '合同到期' where ctype = '正常履约' and a2 < current_date()`
  await ctx.orm().query(sql)

  console.log('everyDayWork is over:%s', date.formatDate());
}

async function main () {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  everyDayJob = schedule.scheduleJob('0 1 0 * *', everyDayWork);
}

process.on('SIGINT', function () {
  if (everyDayJob) {
    everyDayJob.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
