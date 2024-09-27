/*
 * @Author: Lienren
 * @Date: 2019-08-17 15:04:00
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-29 10:22:41
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const download = require('../../utils/downloadfile');
const sats = require('./sats');
const config = require('../../config');
const WXBizDataCrypt = require('./WXBizDataCrypt');

const appId = 'wx984e28c5b868e075';

let aboutFilePath = './about.txt';

const examTypeDist = {
  '1': '亚太',
  '2': '北美'
};

const topicTypeDist = {
  '1': '语法',
  '2': '阅读'
};

module.exports = {
  getExams: async ctx => {
    let examType = ctx.request.body.examType || 0;

    let where = {
      isDel: 0
    };

    if (examType !== 0 && examTypeDist[`${examType}`]) {
      where.examType = examType;
    }

    let result = await ctx.orm().satExams.findAll({
      where,
      order: [['examTime', 'DESC'], ['id', 'DESC']]
    });

    ctx.body = result;
  },
  getExamTopics: async ctx => {
    let examId = ctx.request.body.examId || 0;

    assert.notStrictEqual(examId, 0, '入参不能为空！');

    let result = await ctx.orm().satExamTopics.findAll({
      where: {
        examId: examId,
        isDel: 0
      },
      order: [['tIndex']]
    });

    ctx.body = result;
  },
  getExamTopicFollowAndMsg: async ctx => {
    let tId = ctx.request.body.tId || 0;

    assert.notStrictEqual(tId, 0, '入参不能为空！');

    let follows = await ctx
      .orm()
      .query(
        `select f.id, f.addTime, f.userId, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicFllows f inner join satUsers u on u.id = f.userId and u.isDel = 0 where f.tId = ${tId} and f.isDel = 0 order by f.addTime desc;`
      );

    let msgs = await ctx
      .orm()
      .query(
        `select m.id, m.addTime, m.userId, m.msgContext, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicMsgs m inner join satUsers u on u.id = m.userId and u.isDel = 0 where m.tId = ${tId} and m.isDel = 0 order by m.addTime desc;`
      );

    ctx.body = {
      follows,
      msgs
    };
  },
  getExamTopicFollow: async ctx => {
    let follows = await ctx
      .orm()
      .query(
        `select f.id, f.addTime, f.userId, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicFllows f inner join satUsers u on u.id = f.userId and u.isDel = 0 where f.isDel = 0;`
      );

    ctx.body = follows;
  },
  getExamTopicMsg: async ctx => {
    let msgs = await ctx
      .orm()
      .query(
        `select m.id, m.addTime, m.userId, m.msgContext, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicMsgs m inner join satUsers u on u.id = m.userId and u.isDel = 0 where m.isDel = 0;`
      );

    ctx.body = msgs;
  },
  getBanners: async ctx => {
    let result = await ctx.orm().satBanners.findAll({
      where: {
        isDel: 0
      },
      order: [['id', 'DESC']]
    });

    ctx.body = result;
  },
  getFeedbacks: async ctx => {
    let feedbacks = await ctx
      .orm()
      .query(
        `select f.id, f.addTime, f.userId, f.msgContext, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satFeedbacks f inner join satUsers u on u.id = f.userId and u.isDel = 0 where f.isDel = 0 order by f.id desc;`
      );

    ctx.body = feedbacks;
  },
  getUsers: async ctx => {
    let result = await ctx.orm().satUsers.findAll({
      where: {
        isDel: 0
      },
      order: [['id', 'DESC']]
    });

    ctx.body = result;
  },
  getAbout: async ctx => {
    let context = '';
    if (fs.existsSync(path.resolve(__dirname, aboutFilePath))) {
      context = fs.readFileSync(path.resolve(__dirname, aboutFilePath), { encoding: 'utf8' });
    }

    ctx.body = {
      context: context
    };
  },
  setAbout: async ctx => {
    let context = ctx.request.body.context || '';

    fs.writeFileSync(path.resolve(__dirname, aboutFilePath), context, { encoding: 'utf8' });

    ctx.body = {};
  },
  createExam: async ctx => {
    let examType = ctx.request.body.examType || 1;
    let title = ctx.request.body.title || '';
    let examTime = ctx.request.body.examTime || '';

    assert.notStrictEqual(title, '', '入参不能为空！');
    assert.notStrictEqual(examTime, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExams.create({
      examType,
      examTypeName: examTypeDist[`${examType}`],
      title,
      examTime,
      tFollowNum: 0,
      tMsgNum: 0,
      addTime: now,
      isDel: 0
    });
  },
  createExamTopic: async ctx => {
    let examId = ctx.request.body.examId || 0;
    let topicTypeId = ctx.request.body.topicTypeId || 1;
    let tIndex = ctx.request.body.tIndex || 0;
    let tAnswer = ctx.request.body.tAnswer || '';
    let tTestCenter = ctx.request.body.tTestCenter || '';
    let tAnalysis = ctx.request.body.tAnalysis || '';

    assert.notStrictEqual(examId, 0, '入参不能为空！');
    assert.notStrictEqual(topicTypeId, 0, '入参不能为空！');
    assert.notStrictEqual(tIndex, 0, '入参不能为空！');
    assert.notStrictEqual(tAnswer, '', '入参不能为空！');
    assert.notStrictEqual(tAnalysis, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExamTopics.create({
      examId,
      tIndex,
      topicTypeId,
      topicTypeName: topicTypeDist[`${topicTypeId}`],
      tAnswer,
      tTestCenter,
      tAnalysis,
      tFollowNum: 0,
      tMsgNum: 0,
      addTime: now,
      isDel: 0
    });
  },
  createExamTopicFollow: async ctx => {
    let tId = ctx.request.body.tId || 0;
    let userId = ctx.request.body.userId || 0;

    assert.notStrictEqual(tId, 0, '入参不能为空！');
    assert.notStrictEqual(userId, 0, '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExamTopicFllows.create({
      tId,
      userId,
      addTime: now,
      isDel: 0
    });

    ctx.orm().satExamTopics.update(
      {
        tFollowNum: sequelize.literal(`tFollowNum + 1`)
      },
      {
        where: {
          id: tId
        }
      }
    );

    // 记录用户进入
    sats.updateDay(ctx.orm(), date.formatDate(new Date(), 'YYYYMMDD'), 's4', 1);
  },
  createExamTopicMsg: async ctx => {
    let tId = ctx.request.body.tId || 0;
    let userId = ctx.request.body.userId || 0;
    let msgContext = ctx.request.body.msgContext || '';

    assert.notStrictEqual(tId, 0, '入参不能为空！');
    assert.notStrictEqual(userId, 0, '入参不能为空！');
    assert.notStrictEqual(msgContext, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExamTopicMsgs.create({
      tId,
      userId,
      msgContext,
      addTime: now,
      isDel: 0
    });

    ctx.orm().satExamTopics.update(
      {
        tMsgNum: sequelize.literal(`tMsgNum + 1`)
      },
      {
        where: {
          id: tId
        }
      }
    );

    // 记录用户进入
    sats.updateDay(ctx.orm(), date.formatDate(new Date(), 'YYYYMMDD'), 's3', 1);
  },
  createBanner: async ctx => {
    let title = ctx.request.body.title || '';
    let imgUrl = ctx.request.body.imgUrl || '';
    let imgLink = ctx.request.body.imgLink || '';

    assert.notStrictEqual(title, '', '入参不能为空！');
    assert.notStrictEqual(imgUrl, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satBanners.create({
      title,
      imgUrl,
      imgLink,
      addTime: now,
      isDel: 0
    });
  },
  createFeedback: async ctx => {
    let userId = ctx.request.body.userId || 0;
    let msgContext = ctx.request.body.msgContext || '';

    assert.notStrictEqual(userId, 0, '入参不能为空！');
    assert.notStrictEqual(msgContext, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satFeedbacks.create({
      userId,
      msgContext,
      addTime: now,
      isDel: 0
    });

    // 记录用户进入
    sats.updateDay(ctx.orm(), date.formatDate(new Date(), 'YYYYMMDD'), 's6', 1);
  },
  registerUser: async ctx => {
    let id = ctx.request.body.id || 0;
    let unionId = ctx.request.body.unionId || '';
    let userHeadImg = ctx.request.body.userHeadImg || '';
    let userName = ctx.request.body.userName || '';
    let userInfo = ctx.request.body.userInfo || '';

    assert.notStrictEqual(id, 0, '入参不能为空！');

    let headFilePath = '../../../assets/uploads/headimgs/';
    let headFileName = comm.getGuid() + '.jpg';

    let virstualPath = config.sys.uploadVirtualFilePath + '/headimgs/' + headFileName;
    download.downImage(userHeadImg, path.resolve(__dirname, headFilePath + headFileName));

    await ctx.orm().satUsers.update(
      {
        unionId,
        userHeadImg: virstualPath,
        userName,
        userInfo,
        isDel: 0
      },
      {
        where: {
          id
        }
      }
    );

    ctx.body = {};
  },
  registerUserPhone: async ctx => {
    let id = ctx.request.body.id || 0;
    let encryptedData = ctx.request.body.encryptedData || '';
    let sessionKey = ctx.request.body.sessionKey || '';
    let iv = ctx.request.body.iv || '';

    assert.notStrictEqual(id, 0, '入参不能为空！');
    assert.notStrictEqual(encryptedData, '', '入参不能为空！');
    assert.notStrictEqual(sessionKey, '', '入参不能为空！');
    assert.notStrictEqual(iv, '', '入参不能为空！');

    let pc = new WXBizDataCrypt(appId, sessionKey);
    let data = pc.decryptData(encryptedData, iv);
    let phone = data && data.purePhoneNumber ? data.purePhoneNumber : '';

    if (phone) {
      await ctx.orm().satUsers.update(
        {
          userPhone: phone
        },
        {
          where: {
            id
          }
        }
      );
    }

    ctx.body = {
      id,
      userPhone: phone
    };
  },
  getUserByOpenId: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    let result = await ctx.orm().satUsers.findOne({
      where: {
        openId,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  getUserFollow: async ctx => {
    let userId = ctx.request.body.userId || 0;

    assert.notStrictEqual(userId, 0, '入参不能为空！');

    let follows = await ctx.orm().query(
      `select 
            f.id, f.addTime, f.userId,
            t.tIndex, t.examId, t.topicTypeId, t.topicTypeName, t.tAnswer, t.tTestCenter, t.tAnalysis,
            e.title, e.examTypeName, e.examType, e.examTime 
          from satExamTopicFllows f 
          inner join satExamTopics t on t.id = f.tId and t.isDel = 0 
          inner join satExams e on e.id = t.examId and e.isDel = 0 
          where 
            f.isDel = 0 and f.userId = ${userId} 
          order by f.addTime desc;`
    );

    ctx.body = follows;
  },
  getUserMsg: async ctx => {
    let userId = ctx.request.body.userId || 0;

    assert.notStrictEqual(userId, 0, '入参不能为空！');

    let msgs = await ctx.orm().query(
      `select 
            m.id, m.addTime, m.userId, m.msgContext,
            t.tIndex, t.examId, t.topicTypeId, t.topicTypeName, t.tAnswer, t.tTestCenter, t.tAnalysis,
            e.title, e.examTypeName, e.examType, e.examTime 
          from satExamTopicMsgs m 
          inner join satExamTopics t on t.id = m.tId and t.isDel = 0 
          inner join satExams e on e.id = t.examId and e.isDel = 0 
          where 
            m.isDel = 0 and m.userId = ${userId} 
          order by m.addTime desc;`
    );

    ctx.body = msgs;
  },
  editExam: async ctx => {
    let id = ctx.request.body.id || 0;
    let examType = ctx.request.body.examType || 1;
    let title = ctx.request.body.title || '';
    let examTime = ctx.request.body.examTime || '';

    assert.notStrictEqual(id, 0, '入参不能为空！');
    assert.notStrictEqual(title, '', '入参不能为空！');
    assert.notStrictEqual(examTime, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExams.update(
      {
        examType,
        examTypeName: examTypeDist[`${examType}`],
        title,
        examTime
      },
      {
        where: {
          id
        }
      }
    );
  },
  editExamTopic: async ctx => {
    let id = ctx.request.body.id || 0;
    let topicTypeId = ctx.request.body.topicTypeId || 1;
    let examId = ctx.request.body.examId || 0;
    let tIndex = ctx.request.body.tIndex || 0;
    let tAnswer = ctx.request.body.tAnswer || '';
    let tTestCenter = ctx.request.body.tTestCenter || '';
    let tAnalysis = ctx.request.body.tAnalysis || '';

    assert.notStrictEqual(id, 0, '入参不能为空！');
    assert.notStrictEqual(examId, 0, '入参不能为空！');
    assert.notStrictEqual(tIndex, 0, '入参不能为空！');
    assert.notStrictEqual(tAnswer, '', '入参不能为空！');
    assert.notStrictEqual(tAnalysis, '', '入参不能为空！');

    let now = date.formatDate();

    await ctx.orm().satExamTopics.update(
      {
        examId,
        tIndex,
        topicTypeId,
        topicTypeName: topicTypeDist[`${topicTypeId}`],
        tAnswer,
        tTestCenter,
        tAnalysis
      },
      {
        where: {
          id
        }
      }
    );
  },
  delExam: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satExams.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  delExamTopic: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satExamTopics.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  delExamTopicFollow: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    let result = await ctx.orm().satExamTopicFllows.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    if (result) {
      await ctx.orm().satExamTopicFllows.update(
        {
          isDel: 1
        },
        {
          where: { id }
        }
      );

      ctx.orm().satExamTopics.update(
        {
          tFollowNum: sequelize.literal(`tFollowNum - 1`)
        },
        {
          where: {
            id: result.tId,
            tFollowNum: {
              $gt: 0
            }
          }
        }
      );
    }
  },
  delExamTopicFollowByOwn: async ctx => {
    let tId = ctx.request.body.tId || 0;
    let userId = ctx.request.body.userId || 0;

    assert.notStrictEqual(tId, 0, '入参不能为空！');
    assert.notStrictEqual(userId, 0, '入参不能为空！');

    let result = await ctx.orm().satExamTopicFllows.findOne({
      where: {
        tId: tId,
        userId: userId,
        isDel: 0
      }
    });

    if (result) {
      await ctx.orm().satExamTopicFllows.update(
        {
          isDel: 1
        },
        {
          where: {
            id: result.id
          }
        }
      );

      ctx.orm().satExamTopics.update(
        {
          tFollowNum: sequelize.literal(`tFollowNum - 1`)
        },
        {
          where: {
            id: result.tId,
            tFollowNum: {
              $gt: 0
            }
          }
        }
      );
    }
  },
  delExamTopicMsg: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    let result = await ctx.orm().satExamTopicMsgs.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    if (result) {
      await ctx.orm().satExamTopicMsgs.update(
        {
          isDel: 1
        },
        {
          where: { id }
        }
      );

      ctx.orm().satExamTopics.update(
        {
          tMsgNum: sequelize.literal(`tMsgNum - 1`)
        },
        {
          where: {
            id: result.tId,
            tMsgNum: {
              $gt: 0
            }
          }
        }
      );
    }
  },
  delBanner: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satBanners.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  delFeedback: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satFeedbacks.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  delUser: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satUsers.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  getAllSTA: async ctx => {
    let sta = await ctx
      .orm()
      .query(
        `select CONVERT(sum(s1),SIGNED) s1, CONVERT(sum(s2),SIGNED) s2, CONVERT(sum(s3),SIGNED) s3, CONVERT(sum(s4),SIGNED) s4, CONVERT(sum(s5),SIGNED) s5, CONVERT(sum(s6),SIGNED) s6 from satStatistics;`
      );

    ctx.body = sta[0];
  },
  getTimeSTA: async ctx => {
    let stime = ctx.request.body.stime || 0;
    let etime = ctx.request.body.etime || 0;

    assert.notStrictEqual(stime, 0, '入参不能为空！');
    assert.notStrictEqual(etime, 0, '入参不能为空！');

    let sta = await ctx
      .orm()
      .query(
        `select day, s1, s2, s3, s4, s5, s6 from satStatistics where day between ${stime.replace(
          /-/g,
          ''
        )} and ${etime.replace(/-/g, '')} order by day;`
      );

    ctx.body = sta;
  },
  getExamsByOwn: async ctx => {
    let examType = ctx.request.body.examType || 0;

    let where = {
      isDel: 0
    };

    if (examType !== 0 && examTypeDist[`${examType}`]) {
      where.examType = examType;
    }

    let result = await ctx.orm().satExams.findAll({
      where,
      order: [['examTime', 'DESC'], ['id', 'DESC']]
    });

    ctx.body = result;
  },
  getExamTopicsByOwn: async ctx => {
    let examId = ctx.request.body.examId || 0;

    assert.notStrictEqual(examId, 0, '入参不能为空！');

    let result = await ctx.orm().satExamTopics.findAll({
      where: {
        examId: examId,
        isDel: 0
      },
      order: [['tIndex']]
    });

    // 记录用户进入
    sats.updateDay(ctx.orm(), date.formatDate(new Date(), 'YYYYMMDD'), 's2', 1);

    ctx.body = result;
  },
  log: async ctx => {
    let code = ctx.request.body.code || 's5';
    // 记录用户进入
    sats.updateDay(ctx.orm(), date.formatDate(new Date(), 'YYYYMMDD'), code, 1);

    ctx.body = {};
  }
};
