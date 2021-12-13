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
let dayJob = null;
let weekJob = null;
let monthJob = null;
let importJob = null;
let ctx = {};
let next = function () {
  return true;
};

async function getSuccessed () {
  console.log('samp send data:%s', date.formatDate());

  let result = await ctx.orm().info_user_samps.findAll({
    limit: 10,
    where: {
      handleType: {
        $in: ['已采样', '个人上传采样']
      },
      isSend: 0
    }
  });

  if (result && result.length > 0) {
    // 有未同步
    // 并记录信息，将isSend更新为1

    for (let i = 0, j = result.length; i < j; i++) {
      let user = await ctx.orm().info_users.findOne({
        where: {
          id: result[i].userId
        }
      })

      if (user) {
        let rep = await http.post({
          url: 'https://super.51pinzhi.cn/njhealth/jbxq/adminapi/common/hsCheck',
          data: {
            idCard: user.idcard,
            checkResult: '检测中',
            checkTime: result[i].handleTime
          }
        })

        if (rep) {
          await ctx.orm().info_user_samps.update({
            isSend: 1,
            sendTime: date.formatDate(),
            sendRep: JSON.stringify(rep.data)
          }, {
            where: {
              id: result[i].id
            }
          })
        }
      }
    }
  }

  console.log('samp send data:%s', date.formatDate());
}

/*
每2天一检，固定周期
每周一检，固定周期
每月一检，固定周期
每周2次（间隔2天以上），固定周期
*/

async function daySamp () {
  console.log('users samp day data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每2天一检',
      depId: {
        $gt: 2
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 今天
  let d1 = now;
  //明天
  let d2 = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

  for (let i = 0, j = users.length; i < j; i++) {
    let user = users[i];

    let samp = await ctx.orm().info_user_samps.findOne({
      where: {
        userId: user.dataValues.id,
        startTime: {
          $lte: now
        },
        endTime: {
          $gte: now
        }
      }
    })

    if (!samp) {
      await ctx.orm().info_user_samps.create({
        userId: user.id,
        startTime: d1,
        endTime: d2,
        dayCount: 1,
        realCount: 1,
        postName: user.dataValues.postName,
        periodType: user.dataValues.periodType,
        handleType: '未采样',
        isPlan: '计划内'
      })
    }
  }

  console.log('users samp day data:%s', date.formatDate());
}

async function weekSamp () {
  console.log('users samp week data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: {
        $in: ['每周一检', '每周2次']
      },
      depId: {
        $gt: 2
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 第一天
  let d1 = now;
  // 最后一天
  let d2 = moment(new Date()).endOf('isoWeek').format('YYYY-MM-DD')

  for (let i = 0, j = users.length; i < j; i++) {
    let user = users[i];

    let samp = await ctx.orm().info_user_samps.findAll({
      where: {
        userId: user.dataValues.id,
        startTime: {
          $lte: now
        },
        endTime: {
          $gte: now
        }
      }
    })

    if (user.periodType === '每周一检') {
      if (samp && samp.length === 0) {
        await ctx.orm().info_user_samps.create({
          userId: user.id,
          startTime: d1,
          endTime: d2,
          dayCount: 7,
          realCount: 1,
          postName: user.dataValues.postName,
          periodType: user.dataValues.periodType,
          handleType: '未采样',
          isPlan: '计划内'
        })
      }
    } else if (user.periodType === '每周2次') {
      if (samp && samp.length === 0) {
        await ctx.orm().info_user_samps.create({
          userId: user.id,
          startTime: d1,
          endTime: d2,
          dayCount: 7,
          realCount: 2,
          postName: user.dataValues.postName,
          periodType: user.dataValues.periodType,
          handleType: '未采样',
          isPlan: '计划内'
        })

        await ctx.orm().info_user_samps.create({
          userId: user.id,
          startTime: d1,
          endTime: d2,
          dayCount: 7,
          realCount: 2,
          postName: user.dataValues.postName,
          periodType: user.dataValues.periodType,
          handleType: '未采样',
          isPlan: '计划内'
        })
      } else if (samp && samp.length === 1) {
        await ctx.orm().info_user_samps.create({
          userId: user.id,
          startTime: d1,
          endTime: d2,
          dayCount: 7,
          realCount: 2,
          postName: user.dataValues.postName,
          periodType: user.dataValues.periodType,
          handleType: '未采样',
          isPlan: '计划内'
        })
      }
    }
  }

  console.log('users samp week data:%s', date.formatDate());
}

async function monthSamp () {
  console.log('users samp month data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每月一检',
      depId: {
        $gt: 2
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 第一天
  let d1 = now;
  // 最后一天
  let d2 = moment(new Date()).endOf('month').format('YYYY-MM-DD')

  // 计算相差天数
  let start_date = moment(d1, 'YYYY-MM-DD')
  let end_date = moment(d2, 'YYYY-MM-DD')
  let dayCount = end_date.diff(start_date, 'days')

  for (let i = 0, j = users.length; i < j; i++) {
    let user = users[i];

    let samp = await ctx.orm().info_user_samps.findOne({
      where: {
        userId: user.dataValues.id,
        startTime: {
          $lte: now
        },
        endTime: {
          $gte: now
        }
      }
    })

    if (!samp) {
      await ctx.orm().info_user_samps.create({
        userId: user.id,
        startTime: d1,
        endTime: d2,
        dayCount: dayCount,
        realCount: 1,
        postName: user.dataValues.postName,
        periodType: user.dataValues.periodType,
        handleType: '未采样',
        isPlan: '计划内'
      })
    }
  }

  console.log('users samp month data:%s', date.formatDate());
}

async function importUsers () {
  console.log('samp import Users data:%s', date.formatDate());

  let result = await ctx.orm().tmp_info_users.findAll({
    limit: 50,
    where: {
      status: 0
    }
  });

  if (result && result.length > 0) {
    // 有未同步
    // 并记录信息，将isSend更新为1

    for (let i = 0, j = result.length; i < j; i++) {
      let data = result[i]

      // 添加部门信息
      let dep = await ctx.orm().info_deps.findOne({
        where: {
          depName: data.depName1,
          depLevel: 1,
          isDel: 0
        }
      })

      if (!dep) {
        await ctx.orm().tmp_info_users.update({
          status: 2,
          remark: '部门不存在！'
        }, {
          where: {
            id: data.id
          }
        })
        continue;
      }

      let dep2 = await ctx.orm().info_deps.findOne({
        where: {
          depName: data.depName2,
          parentId: dep.id,
          depLevel: 2,
          isDel: 0
        }
      })

      if (!dep2) {
        dep2 = await ctx.orm().info_deps.create({
          depName: data.depName2,
          depLevel: 2,
          depStreet: data.depStreet,
          parentId: dep.id
        })
      }

      let post = await ctx.orm().info_posts.findOne({
        where: {
          postName: data.postName,
          tradeType: data.tradeType
        }
      })

      if (!post) {
        await ctx.orm().tmp_info_users.update({
          status: 2,
          remark: '职业信息在字典表中不存在！'
        }, {
          where: {
            id: data.id
          }
        })
        continue;
      }

      let user = await ctx.orm().info_users.findOne({
        where: {
          idcard: data.idcard
        }
      })

      if (user) {
        await ctx.orm().info_users.update({
          depId: dep2.id,
          depName1: dep.depName,
          depName2: dep2.depName,
          depStreet: dep2.depStreet,
          name: data.name,
          phone: data.phone,
          idcard: data.idcard,
          tradeType: post.tradeType,
          postName: post.postName,
          periodType: post.periodType,
          sampWay: post.sampWay,
          userType: '在线'
        }, {
          where: {
            id: user.id
          }
        })

        await ctx.orm().tmp_info_users.update({
          status: 1,
          remark: '老用户，处理成功！'
        }, {
          where: {
            id: data.id
          }
        })
      } else {
        await ctx.orm().info_users.create({
          depId: dep2.id,
          depName1: dep.depName,
          depName2: dep2.depName,
          depStreet: dep2.depStreet,
          name: data.name,
          phone: data.phone,
          idcard: data.idcard,
          tradeType: post.tradeType,
          postName: post.postName,
          periodType: post.periodType,
          userType: '在线',
          sampWay: post.sampWay,
          sampStartTime: date.formatDate(new Date(), 'YYYY-MM-DD')
        })

        await ctx.orm().tmp_info_users.update({
          status: 1,
          remark: '新用户，处理成功！'
        }, {
          where: {
            id: data.id
          }
        })
      }
    }
  }

  console.log('samp import Users data:%s', date.formatDate());
}

async function importSamps () {
  console.log('samp import Samps data:%s', date.formatDate());

  let result = await ctx.orm().tmp_info_samps.findAll({
    limit: 50,
    where: {
      status: 0
    }
  });

  if (result && result.length > 0) {
    // 有未同步
    // 并记录信息，将isSend更新为1

    for (let i = 0, j = result.length; i < j; i++) {
      let data = result[i]

      let now = date.formatDate(data.sampTime);
      let today = date.formatDate(data.sampTime, 'YYYY-MM-DD');

      let user = await ctx.orm().info_users.findOne({
        where: {
          idcard: data.idcard
        }
      })

      if (!user) {
        user = await ctx.orm().info_users.create({
          depId: 2,
          depName1: '愿检尽检',
          depName2: '愿检尽检',
          depStreet: '',
          name: data.name,
          phone: data.phone,
          idcard: data.idcard,
          tradeType: '其他',
          postName: '愿检尽检人群',
          periodType: '当天',
          sampWay: '',
          userType: '在线',
          sampStartTime: today,
          sampName: data.sampName,
          sampUserName: '暂无',
          sampHandleTime: now
        })
      } else {
        await ctx.orm().info_users.update({
          userType: '在线',
          sampName: data.sampName,
          sampUserName: '暂无',
          sampHandleTime: now
        }, {
          where: {
            id: user.id
          }
        })
      }

      let samp = await ctx.orm().info_user_samps.findOne({
        where: {
          userId: user.id,
          handleType: '未采样',
          startTime: {
            $lte: today
          },
          endTime: {
            $gte: today
          }
        }
      })

      if (samp) {
        await ctx.orm().info_user_samps.update({
          handleType: '已采样',
          handleTime: now,
          handleCount: 1,
          sampName: data.sampName,
          sampUserName: '暂无',
          imgUrl: '',
          imgTime: now,
          remark: '批量采样导入'
        }, {
          where: {
            id: samp.id
          }
        })
      } else {
        await ctx.orm().info_user_samps.create({
          userId: user.id,
          startTime: today,
          endTime: today,
          dayCount: 1,
          realCount: 1,
          postName: user.postName,
          periodType: user.periodType,
          sampWay: user.sampWay,
          handleType: '已采样',
          handleTime: now,
          handleCount: 1,
          sampName: data.sampName,
          sampUserName: '暂无',
          imgUrl: '',
          imgTime: now,
          remark: '批量采样导入'
        })
      }

      await ctx.orm().tmp_info_samps.update({
        status: 1,
        remark: '处理成功！'
      }, {
        where: {
          id: data.id
        }
      })
    }
  }

  console.log('samp import Samps data:%s', date.formatDate());
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

  // automaticUpdateGroupStatusJob = schedule.scheduleJob(automaticRule, updateGroupStatus);
  automaticCheckQCodeJob = schedule.scheduleJob(
    automaticRule,
    function () {
      getSuccessed()
      importUsers()
      importSamps()
    }
  );

  dayJob = schedule.scheduleJob('0 0 0 * * *', daySamp)

  weekJob = schedule.scheduleJob('0 0 0 * * 1', weekSamp)

  monthJob = schedule.scheduleJob('0 0 0 1 * *', monthSamp)
}

process.on('SIGINT', function () {
  if (automaticCheckQCodeJob) {
    automaticCheckQCodeJob.cancel();
  }

  if (dayJob) {
    dayJob.cancel()
  }

  if (weekJob) {
    weekJob.cancel()
  }

  if (monthJob) {
    monthJob.cancel()
  }

  process.exit(0);
});

process.on('exit', function () {
  console.log('Auto Task processing is over!');
});

main();

console.timeEnd('AutoTaskExec');
