/*
 * @Author: Lienren
 * @Date: 2019-10-18 13:49:27
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-02 23:29:56
 */
'use strict';

console.time('AutoYhTaskExec');

const schedule = require('node-schedule');
const sequelize = require('sequelize').Sequelize;
const qs = require('querystring');
const config = require('../config.js');
const date = require('../utils/date');
const http = require('../utils/http');

const enumSendStatusName = {
  1: '未发送',
  2: '正在发送',
  3: '已发送',
  4: '发送成功',
  5: '发送失败',
};

const sendSmsUrl = 'https://sms.yunpian.com/v2/sms/single_send.json';
const sendSmsApiKey = '7bfc0759484c0d840f932c45233ada10';
const sendSmsNotifyUrl = 'https://youhouse.billgenius.cn/yh/yhComm/notifySms';

// 自动发短信
let automaticSendSmsJob = null;
let ctx = {};
let next = function () {
  return true;
};

// 更新团购状态
async function automaticSendSms() {
  // 获取未发送和发送失败且发送次数小于3次的短信
  let items = await ctx.orm('youhouse').yh_send_sms.findAll({
    where: {
      sendStatus: {
        $in: [1, 5],
      },
      sendCount: {
        $lt: 3,
      },
      isDel: 0,
    },
  });

  if (items && items.length > 0) {
    // 更新短信状态
    await ctx.orm('youhouse').yh_send_sms.update(
      {
        sendStatus: 2,
        sendStatusName: enumSendStatusName[2],
        sendTime: date.formatDate(),
        sendCount: sequelize.literal(` sendCount + 1`),
      },
      {
        where: {
          id: {
            $in: items.map((m) => {
              return m.dataValues.id;
            }),
          },
          isDel: 0,
        },
      }
    );

    for (let i = 0, j = items.length; i < j; i++) {
      let item = items[i];

      let sendSmsParam = {
        apikey: sendSmsApiKey,
        text: item.smsContent,
        mobile: item.smsPhones,
        uid: `${item.id}`,
        callback_url: sendSmsNotifyUrl,
      };

      // 发送短信
      let result = await http.post({
        url: sendSmsUrl,
        data: qs.stringify(sendSmsParam),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (result && result.data && result.data.code === 0) {
        // 更新短信状态
        ctx.orm('youhouse').yh_send_sms.update(
          {
            sendStatus: 3,
            sendStatusName: enumSendStatusName[3],
            receiveVal:
              typeof result.data === 'object'
                ? JSON.stringify(result.data)
                : result.data,
            receiveTime: date.formatDate(),
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      }
    }
  }

  console.log('automaticSendSms is over:%s', date.formatDate());
}

async function main() {
  // 使用koa-orm中间件，sequelize，mysql
  if (config.databases) {
    const orm = require('koa-orm')(config.databases);
    orm.middleware(ctx, next);
  }

  // 更新发短信，每10秒执行一次
  let automaticRule = new schedule.RecurrenceRule();
  automaticRule.second = [];
  for (let i = 0, j = 60; i < j; i++) {
    if (i % 10 === 0) {
      automaticRule.second.push(i);
    }
  }

  automaticSendSmsJob = schedule.scheduleJob(automaticRule, automaticSendSms);
}

process.on('SIGINT', function () {
  if (automaticSendSmsJob) {
    automaticSendSmsJob.cancel();
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoYhTaskExec');
