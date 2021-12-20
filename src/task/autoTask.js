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

let idcards = ['130224198011241561',
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
  '620123198311186618']
async function handleTmp () {

  for (let i = 0, j = idcards.length; i < j; i++) {
    let users = await ctx.orm().info_users.findAll({
      where: {
        idcard: idcards[i]
      }
    })

    if (users && users.length === 2) {
      let update = {}

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

  // handleTmp();
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
