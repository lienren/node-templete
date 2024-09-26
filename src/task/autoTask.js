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
const http = require('../utils/http');

let automaticSendSMSJob = null;
let automaticAutoScrapJob = null;
let ctx = {};
let next = function () {
  return true;
};

async function sendSMS () {
  let result = await ctx.orm().info_notifys.findAll({
    limit: 20,
    where: {
      isSend: 0
    }
  });

  if (result && result.length > 0) {
    console.log('bike Send SMS data:%s', date.formatDate());

    for (let i = 0, j = result.length; i < j; i++) {

      const params = new URLSearchParams()
      params.append('apikey', 'ee4e3df36ffa8273fce271c85ed8f86d')
      params.append('mobile', result[i].dataValues.sendPhone)
      params.append('text', result[i].dataValues.notifyContent)

      let rep = await http.post({
        url: 'https://sms.yunpian.com/v2/sms/single_send.json',
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      if (rep) {
        await ctx.orm().info_notifys.update({
          isSend: 1,
          sendTime: date.formatDate(),
          sendResult: JSON.stringify(rep.data)
        }, {
          where: {
            id: result[i].dataValues.id
          }
        });
      }
    }

    console.log('bike Send SMS:%s', date.formatDate());
  }
}

async function autoScrap () {
  console.log('bike Auto Scrap data:%s', date.formatDate());

  // update info_models set modelStatus = '已报废' where modelStatus = '待报废' and scrapEndTime <= now();
  await ctx.orm().info_models.update({
    modelStatus: '已报废'
  }, {
    where: {
      modelStatus: '待报废',
      scrapEndTime: {
        $lte: date.formatDate()
      }
    }
  })

  console.log('bike Auto Scrap:%s', date.formatDate());
}

async function main () {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 10 === 0) {
      automaticRule.second.push(i);
    }
  }

  automaticSendSMSJob = schedule.scheduleJob(automaticRule, sendSMS);
  automaticAutoScrapJob = schedule.scheduleJob('0 0 0 * * *', autoScrap);
}

process.on('SIGINT', function () {
  if (automaticSendSMSJob) {
    automaticSendSMSJob.cancel();
  }

  if (automaticAutoScrapJob) {
    automaticAutoScrapJob.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
