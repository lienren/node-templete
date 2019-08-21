/*
 * @Author: Lienren
 * @Date: 2019-08-17 15:04:00
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-19 20:50:11
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');

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

    assert.notStrictEqual(examId, 0, '入参不能为空！');

    let follows = await ctx
      .orm()
      .query(
        `select f.id, f.addTime, f.userId, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicFllows f inner join satUsers u on u.id = f.userId and u.isDel = 0 where f.tId = ${tId} and f.isDel = 0;`
      );

    let msgs = await ctx
      .orm()
      .query(
        `select m.id, m.addTime, m.userId, m.msgContext, u.userPhone, u.userName, u.userHeadImg, u.openId, u.unionId, u.addTime userAddTime from satExamTopicMsgs m inner join satUsers u on u.id = m.userId and u.isDel = 0 where m.tId = ${tId} and m.isDel = 0;`
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
    let result = await ctx.orm().satFeedbacks.findAll({
      where: {
        isDel: 0
      },
      order: [['id', 'DESC']]
    });

    ctx.body = result;
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
    assert.notStrictEqual(tTestCenter, '', '入参不能为空！');
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
  },
  registerUser: async ctx => {
    let openId = ctx.request.body.openId || '';
    let unionId = ctx.request.body.unionId || '';
    let userHeadImg = ctx.request.body.userHeadImg || '';
    let userName = ctx.request.body.userName || '';
    let userPhone = ctx.request.body.userPhone || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');
    assert.notStrictEqual(unionId, '', '入参不能为空！');

    let now = date.formatDate();

    let result = await ctx.orm().satUsers.findOne({
      where: {
        openId,
        isDel: 0
      }
    });

    if (result) {
      ctx.body = result;
    } else {
      let user = await ctx.orm().satUsers.create({
        openId,
        unionId,
        userHeadImg,
        userName,
        userPhone,
        addTime: now,
        isDel: 0
      });

      ctx.body = user;
    }
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

    assert.notStrictEqual(userId, '', '入参不能为空！');

    let result = await ctx.orm().satExamTopicFllows.findAll({
      where: {
        userId,
        isDel: 0
      }
    });

    ctx.body = result;
  },
  getUserMsg: async ctx => {
    let userId = ctx.request.body.userId || 0;

    assert.notStrictEqual(userId, '', '入参不能为空！');

    let result = await ctx.orm().satExamTopicMsgs.findAll({
      where: {
        userId,
        isDel: 0
      }
    });

    ctx.body = result;
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
    assert.notStrictEqual(tTestCenter, '', '入参不能为空！');
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

    await ctx.orm().satExamTopicFllows.create(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
  },
  delExamTopicMsg: async ctx => {
    let id = ctx.request.body.id || 0;

    assert.notStrictEqual(id, 0, '入参不能为空！');

    await ctx.orm().satExamTopicMsgs.update(
      {
        isDel: 1
      },
      {
        where: { id }
      }
    );
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
  }
};
