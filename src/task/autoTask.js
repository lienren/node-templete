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
let upUserToken = '';

function getIdCardSex (idcard) {
  if (idcard.length === 18) {
    //获取性别
    if (parseInt(idcard.substr(16, 1)) % 2 == 1) {
      // 男
      return '1';
    } else {
      // 女
      return '2';
    }
  } else {
    // 未知
    return "0";
  }
}

let postToUpPost = {
  '预检分诊、发热门诊、口腔、眼科、耳鼻喉科医务人员': '2',
  '隔离病区医务人员': '2',
  '定点医院非隔离病区人员': '2',
  '急诊科和采样检验、急救转运人员': '2',
  '其他医务人员（含后勤、护理员）': '1',
  '发热门诊患者': '4',
  '门诊手术患者': '5',
  '急诊手术患者': '6',
  '内镜检查等风险操作患者': '7',
  '普通门诊十大症状者患者': '8',
  '住院患者有发热、呼吸道症状': '9',
  '新住院患者及其陪护': '10',
  '国际交通运输人员（含保洁、地勤）': '17',
  '国内旅客运输相关从业人员': '11',
  '港口、船舶等登临国际航行船舶作业人员': '12',
  '移民、海关及市场监管系统一线人员': '18.1',
  '移民、海关、民航、港口非一线人员': '13',
  '接触进口冷链食品人员': '22.2',
  '接触进口货物人员': '23.1',
  '接触国际邮件快件人员': '24',
  '外卖人员': '26',
  '邮政快递人员': '26',
  '疫情防控流调、消杀、标本采集检测': '27',
  '集中隔离医学观察场所人员': '30',
  '入境旅客接驳转运（含快捷通道）': '29',
  '医废运输处理人员': '31',
  '公安监所工作人员': '32',
  '司法监所监管区外工作人员': '33',
  '养老机构工作人员': '34',
  '婚姻登记工作人员': '35',
  '儿童福利机构工作人员': '35',
  '未成年救助保护机构工作人员': '35',
  '精神卫生福利机构工作人员': '35',
  '流浪乞讨人员救助管理机构工作人员': '35',
  '殡葬服务机构工作人员': '35',
  '社区防控人员（含社工、物业、志愿者）': '36',
  '城市管理（含环卫）人员': '39',
  '药店人员': '40',
  '农贸（集贸）市场人员': '55',
  '中高风险14天的集中隔离期间': '41',
  '中高风险7天居家健康监测期间': '41',
  '境外人员14天的集中隔离期间': '42',
  '境外人员14天居家健康监测期间': '42',
  '密接14天的集中隔离期间': '43',
  '密接7天居家健康监测期间': '43',
  '次密接7天的集中隔离期间': '44',
  '其他经风险研判人群': '60',
  '非国际航行船舶现场执法': '19',
  '“两站一场”社区、集中隔离点十大症状人员转运的人员': '30',
  '国产冷链食品人员': '47',
  '境外人员28 天跟踪健康监测': '42',
  '商超生鲜销售人员': '56',
  '社会窗口服务人员': '37',
  '水电服务保障人员': '37',
  'A级景区及博物馆、展览馆、美术馆、图书馆工作人员': '38',
  '书店工作人员': '49',
  '棋牌室、麻将馆、KTV/影剧院、游艺厅、舞厅、网吧、音乐厅、游泳馆工作人员': '51',
  '建筑工地': '46',
  '商超工作人员': '48',
  '劳动密集型企业、宾馆、招待所工作人员': '49',
  '大型餐饮（饭店）': '50',
  '小餐饮店（饭店）、咖啡厅工作人员': '50',
  '公共浴室、理发店、美容店': '51',
  '往来非疫区货运司机': '54',
  '高速服务区、卡口工作人员': '57'
}

let depToUpDep = {
  '民政部门': 'MZ0',
  '市场监督管理局': 'SJ0',
  '建设与交通局': 'JT0',
  '经济发展局': 'SW0',
  '综合行政执法局': 'CG0',
  '葛塘街道': 'MZ0',
  '卫生健康': 'WJW',
  '盘城街道': 'MZ0',
  '泰山街道': 'MZ0',
  '大厂街道': 'MZ0',
  '顶山街道': 'MZ0',
  '长芦街道': 'MZ0',
  '沿江街道': 'MZ0',
  '生态环境和水务局': 'HJ0',
  '公安分局': 'GA0',
  '科技创新局': '',
  '规划和自然资源局': '',
  '教育和社会保障局': 'JY0',
  '行政审批局': 'ZWB',
  '宣传和统战部': 'WL0',
  '教培机构': '',
  '市场监督管理局': 'SJ0',
  '大厂街道(医)': 'WJW',
  '教育(医)': 'WJW',
  '民政(医)': 'WJW',
  '顶山街道(医)': 'WJW',
  '葛塘街道(医)': 'WJW',
  '盘城街道(医)': 'WJW',
  '泰山街道(医)': 'WJW',
  '沿江街道(医)': 'WJW',
  '长芦街道(医)': 'WJW'
}

let streetToUpStreet = {
  '泰山街道': '320112002000',
  '顶山街道': '320112001000',
  '沿江街道': '320112003000',
  '盘城街道': '320112004000',
  '长芦街道': '320112006000',
  '葛塘街道': '320112007000',
  '大厂街道': '320112005000'
}

let communityToUpCommunity = {
  '大华社区': '320112002033',
  '大桥社区': '320112002020',
  '天景社区': '320112002030',
  '宝塔社区': '320112002034',
  '明发社区': '320112002032',
  '柳洲社区': '320112002028',
  '桥北社区': '320112002017',
  '沧波门社区': '320112002027',
  '津浦社区': '320112002005',
  '浦东苑社区': '320112002026',
  '码头社区': '320112002024',
  '花旗村': '320112002200',
  '铁桥社区': '320112002013',
  '锦城社区': '320112002029',
  '七里桥社区': '320112001017',
  '临江社区': '320112001018',
  '临泉社区': '320112001001',
  '南苑社区': '320112001009',
  '吉庆社区': '320112001012',
  '大新社区': '320112001011',
  '珍珠路社区': '320112001015',
  '石佛社区': '320112001014',
  '金汤街社区': '320112001016',
  '龙虎巷社区': '320112001003',
  '京新社区': '320112003005',
  '冯墙社区': '320112003001',
  '启新社区': '320112003008',
  '复兴社区': '320112003004',
  '新化社区': '320112003006',
  '旭日社区': '320112005035',
  '水城社区': '320112003007',
  '润江社区': '320112003009',
  '路西社区': '320112003003',
  '双城社区': '320112004007',
  '新华社区': '320112004003',
  '板桥社区': '320112004004',
  '永丰社区': '320112004005',
  '江北社区': '320112004002',
  '渡桥社区': '320112004009',
  '盘城社区': '320112004001',
  '老幼岗社区': '320112004006',
  '落桥社区': '320112004008',
  '六甲社区': '320112006005',
  '小摆渡村': '320112006201',
  '新犁村': '320112006203',
  '普东社区': '320112006006',
  '滨江村': '320112006204',
  '玉带村': '320112006200',
  '白玉社区': '320112006007',
  '通江集村': '320112006202',
  '陆营社区': '320112006004',
  '中山社区': '320112007001',
  '前程村': '320112007201',
  '官塘河村': '320112007202',
  '工农社区': '320112007007',
  '接待寺社区': '320112007005',
  '芳庭社区': '320112007008',
  '长城村': '320112007200',
  '九龙洼社区': '320112005009',
  '化建社区': '320112005001',
  '十村社区': '320112005025',
  '南化九村社区': '320112005026',
  '吴家洼社区': '320112005004',
  '周洼新村社区': '320112005018',
  '和平社区': '320112005032',
  '四周社区': '320112005033',
  '太子山社区': '320112005020',
  '山潘新村社区': '320112005022',
  '扬子第一社区': '320112005027',
  '扬子第二社区': '320112005028',
  '扬子第三社区': '320112005029',
  '扬子第四社区': '320112005030',
  '新华一村社区': '320112005017',
  '新华五村社区': '320112005023',
  '新华六村社区': '320112005024',
  '新华七村社区': '320112005021',
  '新庄社区': '320112005013',
  '旭东新城社区': '320112005035',
  '晓山社区': '320112005002',
  '欣乐社区': '320112005031',
  '湖滨社区': '320112005010',
  '草芳社区': '320112005034'
}

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

async function getUpUsers () {
  console.log('up user send data:%s', date.formatDate());

  while (true) {
    let removeUsers = await ctx.orm().info_users.findAll({
      limit: 1,
      where: {
        isUp: 0,
        userType: '迁移'
      }
    })

    if (removeUsers && removeUsers.length > 0) {
      if (!upUserToken) {
        // 没有Token，获取Token
        // http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/token?lyxt=320112000000
        let tokenRep = await http.get({
          url: 'http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/token?lyxt=320112000000',
          data: {}
        })

        if (tokenRep && tokenRep.data && tokenRep.data.data) {
          upUserToken = tokenRep.data.data
          console.log('上传人员信息Token:', upUserToken)
        }
      }

      let sendData = {
        token: upUserToken,
        lyxt: '320112000000',
        data: []
      }

      for (let i = 0, j = removeUsers.length; i < j; i++) {
        sendData.data.push({
          xm: removeUsers[i].name,
          xb: getIdCardSex(removeUsers[i].idcard),
          zjlx: removeUsers[i].idcard.length === 18 ? 111 : 14,
          zjhm: removeUsers[i].idcard,
          sjhm: removeUsers[i].phone,
          sfzg: 0,
          zdrqlb: 60,  // 重点人群类别
          zrbm: 'NUL',// 责任部门
          sszrqbh: '320112000000',
          sszrjdbh: streetToUpStreet[removeUsers[i].street],
          sszrsqbh: communityToUpCommunity[removeUsers[i].community],
          tyshxydm: '',
          dwjdbh: streetToUpStreet[removeUsers[i].depStreet],
          gj: removeUsers[i].idcard.length === 18 ? '中国' : '未知'
        })
      }

      if (sendData.data.length > 0) {
        let upRep = await http.post({
          url: 'http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/ryAdd',
          data: sendData
        })

        console.log('upRep.data:', upRep.data)
        if (upRep && upRep.data && upRep.data.code === 0) {
          // 刷新所有isUp状态
          await ctx.orm().info_users.update({
            isUp: 1,
            upTime: date.formatDate(),
            upRep: '更新成功'
          }, {
            where: {
              id: {
                $in: removeUsers.map(m => {
                  return m.dataValues.id
                })
              }
            }
          })
        } else {
          try {
            // 刷新所有isUp状态
            await ctx.orm().info_users.update({
              isUp: 2,
              upTime: date.formatDate(),
              upRep: JSON.stringify(upRep.data)
            }, {
              where: {
                id: {
                  $in: removeUsers.map(m => {
                    return m.dataValues.id
                  })
                }
              }
            })
          } catch (error) {
            await ctx.orm().info_users.update({
              isUp: 2,
              upTime: date.formatDate(),
              upRep: upRep.data
            }, {
              where: {
                id: {
                  $in: removeUsers.map(m => {
                    return m.dataValues.id
                  })
                }
              }
            })
          }
        }
      } else {
        // 刷新所有isUp状态
        await ctx.orm().info_users.update({
          isUp: 1,
          upTime: date.formatDate(),
          upRep: '更新成功'
        }, {
          where: {
            id: {
              $in: users.map(m => {
                return m.dataValues.id
              })
            }
          }
        })
      }
    } else {
      break;
    }
  }

  while (true) {
    let users = await ctx.orm().info_users.findAll({
      limit: 1,
      where: {
        isUp: 0,
        depId: {
          $gt: 2
        }
      },
      order: [['updateTime', 'desc']]
    })

    if (users && users.length > 0) {
      if (!upUserToken) {
        // 没有Token，获取Token
        // http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/token?lyxt=320112000000
        let tokenRep = await http.get({
          url: 'http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/token?lyxt=320112000000',
          data: {}
        })

        if (tokenRep && tokenRep.data && tokenRep.data.data) {
          upUserToken = tokenRep.data.data
          console.log('上传人员信息Token:', upUserToken)
        }
      }

      let sendData = {
        token: upUserToken,
        lyxt: '320112000000',
        data: []
      }

      for (let i = 0, j = users.length; i < j; i++) {
        if (postToUpPost[users[i].postName] && depToUpDep[users[i].depName1]) {
          sendData.data.push({
            xm: users[i].name,
            xb: getIdCardSex(users[i].idcard),
            zjlx: users[i].idcard.length === 18 ? 111 : 214,
            zjhm: users[i].idcard,
            sjhm: users[i].phone,
            sfzg: users[i].userType === '在线' || users[i].userType === '已设置休假' ? 1 : 0,
            zdrqlb: postToUpPost[users[i].postName],  // 重点人群类别
            zrbm: depToUpDep[users[i].depName1],// 责任部门
            sszrqbh: '320112000000',
            sszrjdbh: streetToUpStreet[users[i].street],
            sszrsqbh: communityToUpCommunity[users[i].community],
            tyshxydm: '',
            dwjdbh: streetToUpStreet[users[i].depStreet],
            gj: users[i].idcard.length === 18 ? '中国' : '未知'
          })
        }
      }

      if (sendData.data.length > 0) {
        let upRep = await http.post({
          url: 'http://yjjj.yqfkpt.njga.gov.cn:9088/common/yjjj/ryAdd',
          data: sendData
        })

        console.log('upRep.data:', upRep.data)
        if (upRep && upRep.data && upRep.data.code === 0) {
          // 刷新所有isUp状态
          await ctx.orm().info_users.update({
            isUp: 1,
            upTime: date.formatDate(),
            upRep: '更新成功'
          }, {
            where: {
              id: {
                $in: users.map(m => {
                  return m.dataValues.id
                })
              }
            }
          })
        } else {
          // 刷新所有isUp状态
          try {
            await ctx.orm().info_users.update({
              isUp: 2,
              upTime: date.formatDate(),
              upRep: JSON.stringify(upRep.data)
            }, {
              where: {
                id: {
                  $in: users.map(m => {
                    return m.dataValues.id
                  })
                }
              }
            })
          } catch (error) {
            await ctx.orm().info_users.update({
              isUp: 2,
              upTime: date.formatDate(),
              upRep: upRep.data
            }, {
              where: {
                id: {
                  $in: users.map(m => {
                    return m.dataValues.id
                  })
                }
              }
            })
          }

        }
      } else {
        // 刷新所有isUp状态
        await ctx.orm().info_users.update({
          isUp: 1,
          upTime: date.formatDate(),
          upRep: '更新成功'
        }, {
          where: {
            id: {
              $in: users.map(m => {
                return m.dataValues.id
              })
            }
          }
        })
      }
    } else {
      break;
    }
  }
}

async function getRestUsers () {
  let sql1 = `update info_users set userType = '正在休假', isUp = 0 where userType = '已设置休假' and restStartTime <= now()`
  let sql2 = `update info_users set userType = '在线', isUp = 0 where userType = '正在休假' and restEndTime < DATE_FORMAT(now(),'%Y-%m-%d')`

  await ctx.orm().query(sql1, {}, { type: ctx.orm().sequelize.QueryTypes.UPDATE });
  await ctx.orm().query(sql2, {}, { type: ctx.orm().sequelize.QueryTypes.UPDATE });
}

/*
每天一检，固定周期
每2天一检，固定周期
每3天一检，固定周期
每5天一检，固定周期
每周一检，固定周期
每周2次（间隔2天以上），固定周期
每月一检，固定周期
*/

/*
每天一检，不提醒
每2天一检，前一天提醒
每3天一检，前一天提醒
每5天一检，前一天提醒，结束前2提醒
每周一检，前一天提醒，结束前2天提醒
每周2次（间隔2天以上），前一天提醒，中间提醒或做完中间提醒，结束前2天提醒
每月一检，前一天提醒，中间提醒，结束前3天提醒

一周一次改2次，5天参照一周，3天参照2天

1、感谢您今天及时进行核酸检测，核酸结果未出之前，请勿人群集聚或外出。下次核酸检测时间为2021年11月5日-2021年11月6日期间。
1、您好！为了您与家人健康，请于2021年11月5日-2021年11月6日期间进行核酸检测。感谢配合。
2、
如果是一周一检的人员：您好！今天是您本周期核酸检测的最后2天，请尽快到采样点检测核酸，感谢配合。
如果是一月一检的人员：您好！今天是您本周期核酸检测的最后3天，请尽快到采样点检测核酸，感谢配合。
*/

async function oneDaySamp () {
  console.log('users samp day data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每天一检',
      depId: {
        $gt: 2
      },
      userType: {
        $in: ['在线', '已设置休假']
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 今天
  let d1 = now;
  //明天
  let d2 = now;

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

async function twoDaySamp () {
  console.log('users samp day data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每2天一检',
      depId: {
        $gt: 2
      },
      userType: {
        $in: ['在线', '已设置休假']
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

async function threeDaySamp () {
  console.log('users samp day data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每3天一检',
      depId: {
        $gt: 2
      },
      userType: {
        $in: ['在线', '已设置休假']
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 今天
  let d1 = now;
  //明天
  let d2 = moment(new Date()).add(2, 'days').format('YYYY-MM-DD');

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

async function fiveDaySamp () {
  console.log('users samp day data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    where: {
      sampStartTime: {
        $lte: date.formatDate()
      },
      periodType: '每5天一检',
      depId: {
        $gt: 2
      },
      userType: {
        $in: ['在线', '已设置休假']
      }
    }
  });

  let now = date.formatDate(new Date(), 'YYYY-MM-DD')

  // 今天
  let d1 = now;
  //明天
  let d2 = moment(new Date()).add(4, 'days').format('YYYY-MM-DD');

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
      },
      userType: {
        $in: ['在线', '已设置休假']
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
      },
      userType: {
        $in: ['在线', '已设置休假']
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
    limit: 100,
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
    limit: 2000,
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
          sampWay: '1:1单管',
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

      // 查找采样当天有没有已采样
      let sameSamp = await ctx.orm().info_user_samps.findOne({
        where: {
          userId: user.id,
          handleType: '已采样',
          handleTime: {
            $between: [`${today} 00:00:00`, `${today} 23:59:59`]
          }
        }
      })

      if (sameSamp) {
        await ctx.orm().tmp_info_samps.update({
          status: 1,
          remark: '处理成功！有重复！'
        }, {
          where: {
            id: data.id
          }
        })
      } else {
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
  }

  console.log('samp import Samps data:%s', date.formatDate());
}

// 发送提醒短信
async function autoWarnSendMsg () {
  let sql1 = `select a.*, u.phone from (
    select max(id) id, userId, startTime, endTime, periodType from info_user_samps 
      where 
        endTime = '${date.formatDate(new Date(), 'YYYY-MM-DD')}' and 
        periodType != '每天一检' and 
        postName != '愿检尽检人群' and 
        isPlan = '计划内' 
      group by userId, startTime, endTime, periodType 
    ) a 
    inner join info_users u on u.id = a.userId and u.userType = '在线'`;

  let result1 = await ctx.orm().query(sql1);

  for (let i = 0, j = result1.length; i < j; i++) {
    let send = result1[i];
    let sendTime = new Date();

    let sendMsg = ''
    // let sendMsg = `您属于核酸应检尽检重点人员，请于${date.formatDate(new Date(), 'YYYY年MM月DD日')}-${date.formatDate(send.endTime, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
    switch (send.periodType) {
      case '每2天一检':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-2, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      case '每3天一检':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-3, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      case '每5天一检':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-5, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      case '每周一检':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-7, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      case '每周2次':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-7, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      case '每月一检':
        sendMsg = `您属于核酸应检尽检重点人员，请于${date.getTodayToPreDay(-1, 'YYYY年MM月DD日')}-${date.getTodayToPreDay(-30, 'YYYY年MM月DD日')}期间进行下一周期核酸检测，两次以上应检未检会给您工作、生活带来不便，特别提醒。`;
        break;
      default:
        break;
    }

    if (sendMsg) {
      let rep = await http.get({
        url: `http://59.83.223.109:8513/sms/Api/Send.do?SpCode=1037&LoginName=jbxq_hsjc&Password=62E79c7Rk&MessageContent=${encodeURIComponent(sendMsg)}&UserNumber=${send.phone}&templateId=123456&SerialNumber=&ScheduleTime=&f=1`
      })

      await ctx.orm().info_sendmsg.create({
        sid: send.id,
        userId: send.userId,
        startTime: send.startTime,
        endTime: send.endTime,
        periodType: send.periodType,
        sendPhone: send.phone,
        sendTime: date.formatDate(sendTime, 'YYYY-MM-DD HH:mm:ss'),
        sendContent: sendMsg,
        repContent: rep.data,
        repTime: date.formatDate()
      })
    }
  }
}

// 发送短信
async function autoSendMsg () {
  console.log('samp send msg data:%s', date.formatDate());

  let sql2 = `select a.*, u.phone from (
    select * from (
      select id, userId, startTime, endTime, TIMESTAMPDIFF(DAY,startTime,endTime) t1, TIMESTAMPDIFF(DAY,startTime,now()) t2, periodType from info_user_samps 
      where 
        startTime <= now() and 
        endTime > now() and 
        handleType = '未采样' and 
        postName != '愿检尽检人群' and 
        periodType in ('每月一检')	
    ) b where b.t1 / 2 = b.t2 ) a 
    inner join info_users u on u.id = a.userId and u.userType = '在线'`

  let result2 = await ctx.orm().query(sql2);

  for (let i = 0, j = result2.length; i < j; i++) {
    let send = result2[i];

    let sendTime = new Date();
    let sendMsg = `您好！为了您与家人健康，请于${date.formatDate(new Date(), 'YYYY年MM月DD日')}-${date.formatDate(send.endTime, 'YYYY年MM月DD日')}期间进行核酸检测。感谢配合。`;
    let rep = await http.get({
      url: `http://59.83.223.109:8513/sms/Api/Send.do?SpCode=1037&LoginName=jbxq_hsjc&Password=62E79c7Rk&MessageContent=${encodeURIComponent(sendMsg)}&UserNumber=${send.phone}&templateId=123456&SerialNumber=&ScheduleTime=&f=1`
    })

    await ctx.orm().info_sendmsg.create({
      sid: send.id,
      userId: send.userId,
      startTime: send.startTime,
      endTime: send.endTime,
      periodType: send.periodType,
      sendPhone: send.phone,
      sendTime: date.formatDate(sendTime, 'YYYY-MM-DD HH:mm:ss'),
      sendContent: sendMsg,
      repContent: rep.data,
      repTime: date.formatDate()
    })
  }

  let sql3 = `select a.*, u.phone from (
    select * from (
      select id, userId, startTime, endTime, TIMESTAMPDIFF(DAY,startTime,endTime) t1, TIMESTAMPDIFF(DAY,startTime,now()) t2, periodType from info_user_samps 
      where 
        startTime <= now() and 
        endTime > now() and 
        handleType = '未采样' and 
        postName != '愿检尽检人群' and 
        periodType in ('每5天一检', '每周一检', '每周2次', '每月一检') 
    ) b where b.t1 = b.t2 + 2) a 
    inner join info_users u on u.id = a.userId and u.userType = '在线'`

  let result3 = await ctx.orm().query(sql3);

  for (let i = 0, j = result3.length; i < j; i++) {
    let send = result3[i];

    let sendTime = new Date();
    let sendMsg = `您好！今天是您本周期核酸检测的最后2天，请尽快到采样点检测核酸，感谢配合。`;
    let rep = await http.get({
      url: `http://59.83.223.109:8513/sms/Api/Send.do?SpCode=1037&LoginName=jbxq_hsjc&Password=62E79c7Rk&MessageContent=${encodeURIComponent(sendMsg)}&UserNumber=${send.phone}&templateId=123456&SerialNumber=&ScheduleTime=&f=1`
    })

    await ctx.orm().info_sendmsg.create({
      sid: send.id,
      userId: send.userId,
      startTime: send.startTime,
      endTime: send.endTime,
      periodType: send.periodType,
      sendPhone: send.phone,
      sendTime: date.formatDate(sendTime, 'YYYY-MM-DD HH:mm:ss'),
      sendContent: sendMsg,
      repContent: rep.data,
      repTime: date.formatDate()
    })
  }

  let sql4 = `select a.*, u.phone from (
    select id, userId, startTime, endTime, periodType from info_user_samps 
      where 
        endTime = '${date.getTodayToPreDay(1, 'YYYY-MM-DD')}' and 
        handleType = '未采样' and 
        postName != '愿检尽检人群'
    ) a 
    inner join info_users u on u.id = a.userId and u.userType = '在线'`

  let result4 = await ctx.orm().query(sql4);

  for (let i = 0, j = result4.length; i < j; i++) {
    let send = result4[i];

    let sendTime = new Date();
    let sendMsg = ''
    if (send.periodType === '每天一检') {
      sendMsg = `您属于核酸应检尽检重点人员，在${date.formatDate(send.startTime, 'YYYY年MM月DD日')}未检测核酸，请及时进行下一次检测，两次以上应检未检会给您工作、生活带来不便。如果已检请忽略。`
    } else {
      sendMsg = `您属于核酸应检尽检重点人员，在${date.formatDate(send.startTime, 'YYYY年MM月DD日')}-${date.formatDate(send.endTime, 'YYYY年MM月DD日')}未检测核酸，请及时进行下一次检测，两次以上应检未检会给您工作、生活带来不便。如果已检请忽略。`
    }
    let rep = await http.get({
      url: `http://59.83.223.109:8513/sms/Api/Send.do?SpCode=1037&LoginName=jbxq_hsjc&Password=62E79c7Rk&MessageContent=${encodeURIComponent(sendMsg)}&UserNumber=${send.phone}&templateId=123456&SerialNumber=&ScheduleTime=&f=1`
    })

    await ctx.orm().info_sendmsg.create({
      sid: send.id,
      userId: send.userId,
      startTime: send.startTime,
      endTime: send.endTime,
      periodType: send.periodType,
      sendPhone: send.phone,
      sendTime: date.formatDate(sendTime, 'YYYY-MM-DD HH:mm:ss'),
      sendContent: sendMsg,
      repContent: rep.data,
      repTime: date.formatDate()
    })
  }

  console.log('samp send msg data:%s', date.formatDate());
}

async function autoRegular () {
  console.log('samp regular data:%s', date.formatDate());

  let users = await ctx.orm().info_users.findAll({
    attributes: ['id'],
    where: {
      depId: {
        $gt: 2
      },
      userType: {
        $in: ['在线', '已设置休假']
      }
    }
  })

  if (users && users.length > 0) {
    for (let i = 0, j = users.length; i < j; i++) {
      let id = users[i].id

      // 获取上个阶段采样情况
      let samp = await ctx.orm().info_user_samps.findOne({
        attributes: ['handleType'],
        where: {
          userId: id,
          isPlan: '计划内',
          endTime: {
            $lt: date.formatDate(new Date(), 'YYYY-MM-DD')
          }
        },
        limit: 1,
        order: [['endTime', 'desc']]
      })

      // 更新合格率
      if (samp) {
        await ctx.orm().info_users.update({
          isRegular: samp.handleType === '已采样' ? 1 : 0,
          regularTime: date.formatDate()
        }, {
          where: {
            id: id
          }
        })
      } else {
        await ctx.orm().info_users.update({
          isRegular: -1,
          regularTime: date.formatDate()
        }, {
          where: {
            id: id
          }
        })
      }
    }
  }

  await ctx.orm().info_users.update({
    isRegular: -1,
    regularTime: date.formatDate()
  }, {
    where: {
      depId: {
        $gt: 2
      },
      userType: {
        $ne: '在线'
      }
    }
  })

  let sql1 = `insert into stat_regular 
  (regularDate, regularType, regularName, regularSum, regularNum, regularNoNum, regularRate) 
  select CURRENT_DATE(), '部门', b.depName1, b.regularSum, b.regularNum, b.regularNoNum, convert(b.regularNum/b.regularSum*100,decimal(10,2)) regularRate from (
  select a.depName1, sum(a.regularSum) regularSum, sum(a.regularNum) regularNum, sum(a.regularNoNum) regularNoNum from (
  select 
    depName1, 
    1 regularSum, 
    case when isRegular > 0 then 1 else 0 end regularNum, 
    case when isRegular = 0 then 1 else 0 end regularNoNum 
  from info_users 
  where depId > 2 and isRegular > -1) a 
  group by a.depName1) b`
  let sql2 = `insert into stat_regular 
  (regularDate, regularType, regularName, regularSum, regularNum, regularNoNum, regularRate) 
  select CURRENT_DATE(), '职业', b.postName, b.regularSum, b.regularNum, b.regularNoNum, convert(b.regularNum/b.regularSum*100,decimal(10,2)) regularRate from (
  select a.postName, sum(a.regularSum) regularSum, sum(a.regularNum) regularNum, sum(a.regularNoNum) regularNoNum from (
  select 
    postName, 
    1 regularSum, 
    case when isRegular > 0 then 1 else 0 end regularNum, 
    case when isRegular = 0 then 1 else 0 end regularNoNum 
  from info_users 
  where depId > 2 and isRegular > -1) a 
  group by a.postName) b`

  await ctx.orm().query(sql1, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });
  await ctx.orm().query(sql2, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });

  console.log('samp regular data:%s', date.formatDate());
}

async function autoSysSamp () {
  let sql1 = `truncate table samp.sys_samp_user`;
  let sql2 = `insert into samp.sys_samp_user (date, user_name, user_idcard) 
  select DATE_ADD(CURRENT_DATE(),INTERVAL -1 DAY), name, idcard from info_users where depId > 2 and userType = '在线'`;

  await ctx.orm().query(sql1, {}, { type: ctx.orm().sequelize.QueryTypes.DELETE });
  await ctx.orm().query(sql2, {}, { type: ctx.orm().sequelize.QueryTypes.INSERT });
}

async function autoSysSampUpdate () {
  console.log('auto sys samp update data:%s', date.formatDate());

  let samps = await ctx.orm().info_user_samps.findAll({
    where: {
      handleType: '未采样',
      isPlan: '计划内',
      createTime: {
        $between: ['2022-06-01', date.formatDate(new Date(), 'YYYY-MM-DD')]
      }
    }
  })

  if (samps) {
    for (let i = 0, j = samps.length; i < j; i++) {
      let samp = samps[i]
      let user = await ctx.orm().info_users.findOne({
        where: {
          id: samp.userId
        }
      })

      if (user && user.depId > 2) {
        let sql = `select * from samp.sys_samp_data where user_idcard = '${user.idcard}' and samp_date between '${samp.startTime} 00:00:00' and '${samp.endTime} 23:59:59' limit 1`;

        let result = await ctx.orm().query(sql);
        if (result && result.length > 0) {
          console.log('更新采样数据（根据省系统数据）:%s, %s, %s, %s', user.idcard, result[0].samp_date, samp.id, date.formatDate());
          await ctx.orm().info_user_samps.update({
            sampWay: result[0].samp_mode,
            handleType: '已采样',
            handleTime: result[0].samp_date,
            handleCount: 1,
            sampName: result[0].test_facility,
            sampUserName: result[0].if_user_name,
            remark: '获取省系统数据自动更新'
          }, {
            where: {
              id: samp.id,
              handleType: '未采样'
            }
          })
        }
      }
    }
  }

  console.log('auto sys samp update data:%s', date.formatDate());
}

let idcards = [
  /*'130224198011241561',
  '142601197301297375',
  '210113198605240553',
  '21020319630706652X',
  '220104199308112221',
  '230125198702183713',
  '230206199302200730',
  '230421199011022625',
  '23071019860627041x',
  '320102197007221215',
  '320102197112033611',
  '320102199207161228',
  '320103196711140517',
  '320103197909021817',
  '320104196011282457',
  '320104196711022410',
  '320105196205011619',
  '320106196708092031',
  '320106199007302829',
  '320107196804264215',
  '32010719790521182X',
  '320107198512214215',
  '320111196302203636',
  '320111196403160428',
  '32011119641206442X',
  '320111196603054814',
  '320111196812024486',
  '320111196905173624',
  '320111197007111223',
  '320111197112014820',
  '320111197201144811',
  '320111197212104823',
  '320111197307114426',
  '320111197802274427',
  '320111198110033248',
  '320111199012070015',
  '320111199107103617',
  '320111199306263226',
  '320111199503210422',
  '320111199610244820',
  '320111199802265212',
  '320111199807254811',
  '320112195903160418',
  '320112196206120028',
  '320112196206251220',
  '320112196208211214',
  '320112196306100411',
  '320112196310230817',
  '320112196407220826',
  '320112196408011217',
  '32011219650428002X',
  '320112196608050448',
  '320112196611221615',
  '320112196704121613',
  '320112196707271633',
  '320112196710250016',
  '320112196812081671',
  '320112197008160824',
  '320112197103161614',
  '320112197205250415',
  '320112197209231211',
  '320112197411070829',
  '320112197510220829',
  '320112197601200444',
  '320112197708110852',
  '320112197709240421',
  '32011219771103001X',
  '320112197805021624',
  '320112197806291220',
  '320112197809230466',
  '320112197907141221',
  '320112198109051613',
  '320112198112101626',
  '320112198212250434',
  '320112198503290022',
  '320112198504290016',
  '320112198610181227',
  '320112198803160465',
  '320112199011020426',
  '320112199208211672',
  '320112199401121636',
  '320112199712200817',
  '320112199801221636',
  '320113196303072415',
  '320113196801291215',
  '320113197208130810',
  '32011319760802403x',
  '32011419761109211x',
  '32011419900707212x',
  '32012119680217351X',
  '320121199208184148',
  '320122196308204022',
  '320122196503054445',
  '320122196705131226',
  '320122197002160033',
  '32012219710202010x',
  '320122197109280027',
  '320122198604051234',
  '320122198607011625',
  '320122200105202827',
  '320123196307261216',
  '320123196311051633',
  '32012319640417101X',
  '320123196502181211',
  '320123196601101619',
  '320123196611164058',
  '320123196709222623',
  '320123196807241035',
  '320123196812041011',
  '320123196905230647',
  '320123196907081016',
  '32012319701223061X',
  '320123197104120610',
  '320123197109210615',
  '320123197207311217',
  '320123197611090225',
  '320123197710081017',
  '320123197903181647',
  '320123198201044810',
  '320123198512051014',
  '320123198604090029',
  '320123198706054424',
  '320123198810151822',
  '320123198811081010',
  '320123198910131044',
  '320123198911101218',
  '320123198912154012',
  '320123199104203423',
  '320123199207081238',
  '320123199208015216',
  '320123199310100054',
  '320123199408181817',
  '320123199412090045',
  '320123199508141011',
  '320123199509133021',
  '32012319960116121X',
  '320123199710172014',
  '320123199807154840',
  '320123199808212029',
  '320123199811010612',
  '320123199909093022',
  '320123200206125214',
  '320124197202033226',
  '320124199707300827',
  '320125196906164832',
  '320321199006231226',
  '320322199004015921',
  '320323199809304014',
  '32032419640121654x',
  '320324198903061874',
  '320324199211230635',
  '320381199411230020',
  '320382199403186521',
  '320411198706132841',
  '320481198201141047',
  '320481198204045472',
  '320481198204060824',
  '320483199601250944',
  '320622196109106603',
  '320623198009114695',
  '32062319870112606X',
  '320682199407068289',
  '320705199408022015',
  '320721198810150643',
  '320721198908292615',
  '320723198005202052',
  '320821199806100520',
  '320823196512092632',
  '32082319670312561X',
  '320825196901263338',
  '320825197001112184',
  '320827196307183012',
  '320827196905210826',
  '320827197109241415',
  '32082719730507401x',
  '320827197805134170',
  '32082919680327221X',
  '320829197112230656',
  '320829197408070639',
  '320830196812015675',
  '320831197802280265',
  '320882199309042211',
  '320911197709153720',
  '320922198605223089',
  '32092219901212686X',
  '320922199808183026',
  '320923195410240914',
  '320923199008163912',
  '320925199804237444',
  '32098119980321222X',
  '321023196305251052',
  '321023199803083227',
  '321081198509201519',
  '321083197506256811',
  '32108319770403454X',
  '321102197302070545',
  '321102199002011526',
  '321119197001232368',
  '321283198205180011',
  '32128319920722721X',
  '321283199307063822',
  '321322197201242738',
  '321322197912071218',
  '321323199306295313',
  '321324198105020024',
  '321324198604163433',
  '321324199405184236',
  '340311197211190621',
  '34032119840112530X',
  '340321198803085304',
  '340321198810101237',
  '340323198706290018',
  '340402199108060413',
  '340405199211150213',
  '340502198501150010',
  '340503197607200356',
  '340602198307222813',
  '340621198703216019',
  '340702199012221047',
  '340826199410118711',
  '341102198410230436',
  '341122197710043617',
  '341122198211282423',
  '341124198703134024',
  '341124199112170220',
  '341124199510014813',
  '341125195808083078',
  '341125198902116888',
  '341125199009180953',
  '34112619960508282X',
  '341127196807122829',
  '34112819810916121X',
  '341181199308192015',
  '341202199612062506',
  '341224197803153514',
  '341224198604258238',
  '341225198509190016',
  '341225199310060040',
  '341282198810166100',
  '342128197304018116',
  '342222199008036092',
  '342222200003270061',
  '342224198202161709',
  '342301196705142018',
  '342321196701136214',
  '342322196210032820',
  '34232219681202182X',
  '342322197102180433',
  '342322197111124038',
  '342322197112061825',
  '342422198912027289',
  '342626199712105060',
  '410323198506101014',
  '410727199411209622',
  '411702199602162947',
  '412726198404074118',
  '420325197211185126',
  '422301197812060928',
  '510212197302087032',
  '511021196907263205',
  '51302519670215159X',
  '532925196501281189',
  '620123198311186618'*/
  '320102196409121212',
  '320106199810260429',
  '320111200103074025',
  '320112196512160810',
  '320112198101191611',
  '320112200006111222',
  '320122199811220840',
  '320123195407151239',
  '320123195411301615',
  '320123196502021218',
  '320123197207101252',
  '320123197211151033',
  '320421196712034715',
  '320830195410041059',
  '32083019901122522X',
  '320926198110260043',
  '32132419910918002X',
  '340123198208058063',
  '340211198001280628',
  '341122195609151411',
  '342626199810156427',
  '362525198412193633']
async function handleTmp () {

  for (let i = 0, j = idcards.length; i < j; i++) {
    let users = await ctx.orm().info_users.findAll({
      where: {
        idcard: idcards[i]
      }
    })

    if (users && users.length === 2) {
      let update = {
        isUp: 0
      }

      if (users[0].depId === 2 && users[1].depId > 2) {
        if (!users[1].openId && users[0].openId) {
          update.openId = users[0].openId;
        }
        if (!users[1].street && users[0].street) {
          update.street = users[0].street;
        }
        if (!users[1].community && users[0].community) {
          update.community = users[0].community;
        }
        if (!users[1].address && users[0].address) {
          update.address = users[0].address;
        }
        if (!users[1].userType) {
          update.userType = '在线';
        }
        if (!users[1].sampName && users[0].sampName) {
          update.sampName = users[0].sampName;
        }
        if (!users[1].sampUserName && users[0].sampUserName) {
          update.sampUserName = users[0].sampUserName;
        }
        if (!users[1].sampHandleTime && users[0].sampHandleTime) {
          update.sampHandleTime = users[0].sampHandleTime;
        }

        // 更新1用户
        await ctx.orm().info_users.update(update, {
          where: {
            id: users[1].id
          }
        })

        // 更新samps
        await ctx.orm().info_user_samps.update({
          userId: users[1].id
        }, {
          where: {
            userId: users[0].id
          }
        })

        // 删除用户
        await ctx.orm().info_users.destroy({
          where: {
            id: users[0].id
          }
        })
      } else if (users[1].depId === 2 && users[0].depId > 2) {
        if (!users[0].openId && users[1].openId) {
          update.openId = users[1].openId;
        }
        if (!users[0].street && users[1].street) {
          update.street = users[1].street;
        }
        if (!users[0].community && users[1].community) {
          update.community = users[1].community;
        }
        if (!users[0].address && users[1].address) {
          update.address = users[1].address;
        }
        if (!users[0].userType) {
          update.userType = '在线';
        }
        if (!users[0].sampName && users[1].sampName) {
          update.sampName = users[1].sampName;
        }
        if (!users[0].sampUserName && users[1].sampUserName) {
          update.sampUserName = users[1].sampUserName;
        }
        if (!users[0].sampHandleTime && users[1].sampHandleTime) {
          update.sampHandleTime = users[1].sampHandleTime;
        }

        // 更新1用户
        await ctx.orm().info_users.update(update, {
          where: {
            id: users[0].id
          }
        })

        // 更新samps
        await ctx.orm().info_user_samps.update({
          userId: users[0].id
        }, {
          where: {
            userId: users[1].id
          }
        })

        // 删除用户
        await ctx.orm().info_users.destroy({
          where: {
            id: users[1].id
          }
        })
      } else if (users[0].depId === 2 && users[1].depId === 2) {
        if (users[0].id < users[1].id) {
          await ctx.orm().info_user_samps.update({
            userId: users[0].id
          }, {
            where: {
              userId: users[1].id
            }
          })

          // 删除用户
          await ctx.orm().info_users.destroy({
            where: {
              id: users[1].id
            }
          })
        } else {
          await ctx.orm().info_user_samps.update({
            userId: users[1].id
          }, {
            where: {
              userId: users[0].id
            }
          })

          // 删除用户
          await ctx.orm().info_users.destroy({
            where: {
              id: users[0].id
            }
          })
        }
      } else if (users[0].depId > 2 && users[1].depId > 2) {
        if (users[0].id < users[1].id) {
          await ctx.orm().info_user_samps.update({
            userId: users[0].id
          }, {
            where: {
              userId: users[1].id
            }
          })

          // 删除用户
          await ctx.orm().info_users.destroy({
            where: {
              id: users[1].id
            }
          })
        } else {
          await ctx.orm().info_user_samps.update({
            userId: users[1].id
          }, {
            where: {
              userId: users[0].id
            }
          })

          // 删除用户
          await ctx.orm().info_users.destroy({
            where: {
              id: users[0].id
            }
          })
        }
      }
    }
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
      // getSuccessed()
      importUsers()
      importSamps()
    }
  );

  // 每10分钟重置一次上传人员信息的Token
  schedule.scheduleJob('0 0/10 * * * *', function () {
    upUserToken = '';
    console.log('每10分钟重置一次上传人员信息的Token')
  })

  schedule.scheduleJob('0 0 0 * * *', function () {
    getRestUsers()
  })

  dayJob = schedule.scheduleJob('0 10 0 * * *', function () {
    oneDaySamp()
    twoDaySamp()
    threeDaySamp()
    fiveDaySamp()
    getUpUsers()
  })

  weekJob = schedule.scheduleJob('0 10 0 * * 1', weekSamp)

  monthJob = schedule.scheduleJob('0 10 0 1 * *', monthSamp)

  schedule.scheduleJob('0 0 2 * * *', function () {
    autoSysSamp()
  })

  schedule.scheduleJob('0 0 3/12 * * *', function () {
    autoRegular()
  })

  // 每天9点自动发送短信
  schedule.scheduleJob('0 0 9 * * *', function () {
    autoSendMsg()
  })

  // 每天16点自动发送短信
  // schedule.scheduleJob('0 0 16 * * *', function () {
  // autoWarnSendMsg()
  // })

  // 每天12点自动更新采样数据（根据省系统数据）
  schedule.scheduleJob('0 0 12 * * *', function () {
    autoSysSampUpdate()
  })

  // handleTmp();
  // getUpUsers()
  autoSysSampUpdate()
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
