/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2023-09-13 10:42:19
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/bike/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const jwt = require('../../utils/jwt');
const encrypt = require('../../utils/encrypt');
const http = require('../../utils/http');
const config = require('../../config.js');
const WechatAPI = require('co-wechat-api');

let WechatAppId = 'wx8a5063bef4ba0f55';
let WechatAppSecret = '3d819729910365ff100c20563c5965f3';

var wcApi = new WechatAPI(WechatAppId, WechatAppSecret, function () {
  if (fs.existsSync('access_token.txt')) {
    let txt = fs.readFileSync('access_token.txt', 'utf8');
    return JSON.parse(txt);
  } else {
    return {}
  }
}, function (token) {
  fs.writeFileSync('access_token.txt', JSON.stringify(token));
});

module.exports = {
  getWeiXinConfig: async ctx => {
    let debug = ctx.request.body.debug || false;
    let jsApiList = ctx.request.body.jsApiList || [];
    let url = ctx.request.body.url || 'https://bike.billgenius.cn';

    let param = {
      debug: debug,
      jsApiList: jsApiList,
      url: url
    };
    let result = await wcApi.getJsConfig(param);

    ctx.body = result;
  },
  getWeiXinOpenId: async ctx => {
    let code = ctx.request.body.code || '';
    let uri = ctx.request.body.uri || '';

    let result = await http.get({
      url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WechatAppId}&secret=${WechatAppSecret}&code=${code}&grant_type=authorization_code`,
      data: {}
    })

    if (result && result.data && result.data.openid) {
      ctx.response.redirect(`${uri}?openid=${result.data.openid}`)
    }

    ctx.body = {}
  },
  getWeiXinUserInfo: async ctx => {
    let openId = ctx.request.body.openId || ''

    let weiXinUser = await wcApi.getUser(openId)

    ctx.body = {
      weiXinUser
    }
  },
  getUserInfo: async ctx => {
    let openId = ctx.request.body.openId || ''
    let schoolCode = ctx.request.body.schoolCode || ''

    assert.ok(!!openId, '获取用户信息失败')

    let weiXinUser = await wcApi.getUser(openId)

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId: openId
      }
    })

    if (!user) {
      let school = await ctx.orm().info_schools.findOne({
        where: {
          schoolCode
        }
      })
      assert.ok(!!school, '学校信息不存在！')

      user = await ctx.orm().info_users.create({
        openId,
        school: school.schoolName
      })
    }

    let userModels = []
    if (user) {
      userModels = await ctx.orm().info_models.findAll({
        where: {
          userId: user.id
        }
      })
    }

    ctx.body = {
      weiXinUser,
      user: user,
      userModels: userModels
    }
  },
  getUserModel: async ctx => {
    let { openId, modelId } = ctx.request.body;
    assert.ok(!!openId, '获取用户信息失败')
    assert.ok(!!modelId, '获取车辆信息失败')

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId
      }
    })
    assert.ok(!!user, '用户信息不存在！')

    let model = await ctx.orm().info_models.findOne({
      where: {
        userId: user.id,
        id: modelId
      }
    })
    assert.ok(!!model, '车辆信息不存在！')

    let school = await ctx.orm().info_schools.findOne({
      where: {
        schoolName: user.school
      }
    })

    ctx.body = {
      user,
      model,
      school
    }
  },
  getUserModelById: async ctx => {
    let { modelId } = ctx.request.body;
    assert.ok(!!modelId, '获取车辆信息失败')

    let model = await ctx.orm().info_models.findOne({
      where: {
        id: modelId
      }
    })
    assert.ok(!!model, '车辆信息不存在！')

    let user = await ctx.orm().info_users.findOne({
      where: {
        id: model.userId
      }
    })
    assert.ok(!!user, '用户信息不存在！')

    let school = await ctx.orm().info_schools.findOne({
      where: {
        schoolName: user.school
      }
    })

    ctx.body = {
      user,
      model,
      school
    }
  },
  getUserModelByNumOrCode: async ctx => {
    let { modelNum, modelCode } = ctx.request.body;

    let model = null
    if (modelNum) {
      model = await ctx.orm().info_models.findOne({
        where: {
          modelNum
        }
      })
    } else if (modelCode) {
      model = await ctx.orm().info_models.findOne({
        where: {
          modelCode
        }
      })
    }

    let user = null
    if (model) {
      user = await ctx.orm().info_users.findOne({
        where: {
          id: model.userId
        }
      })
    }

    ctx.body = {
      model,
      user
    }
  },
  getSchoolDeps: async ctx => {
    let school = ctx.request.body.school || ''

    assert.ok(!!school, '获取学校信息失败')

    let deps = await ctx.orm().info_school_deps.findAll({
      where: {
        school: school
      }
    })

    ctx.body = deps
  },
  getModelNum: async ctx => {
    let modelCode = ctx.request.body.modelCode || ''

    assert.ok(!!modelCode, '获取车牌码错误')

    console.log('modelCode:', modelCode)

    let num = await ctx.orm().info_model_nums.findOne({
      where: {
        modelCode: modelCode,
        isOver: 0
      }
    })
    assert.ok(!!num, '车牌不存在或已被绑定')

    ctx.body = {
      modelNum: num.modelNum
    }
  },
  submitModel: async ctx => {
    let { openId, name, phone, idcard, postType, depName, specType, studNum, modelType, modelImg, grade } = ctx.request.body;

    assert.ok(!!openId, '获取用户信息失败')

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId
      }
    })
    assert.ok(!!user, '用户信息不存在！')

    // 如果没有填写身份证，就认为信息未完善
    if (!user.idcard) {
      await ctx.orm().info_users.update({
        name, phone, idcard, postType, depName,
        grade: grade ? grade : '',
        specType: specType ? specType : '',
        studNum: studNum ? studNum : ''
      }, {
        where: {
          id: user.id
        }
      })
    }

    let model = await ctx.orm().info_models.create({
      userId: user.id,
      modelType,
      modelNum: '',
      modelImg: JSON.stringify(modelImg),
      modelStatus: '待绑定'
    })

    ctx.body = {
      modelId: model.id
    }
  },
  submitModelNum: async ctx => {
    let { openId, modelId, modelCode } = ctx.request.body;

    assert.ok(!!openId, '获取用户信息失败')

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId
      }
    })
    assert.ok(!!user, '用户信息不存在！')

    let model = await ctx.orm().info_models.findOne({
      where: {
        userId: user.id,
        id: modelId,
        modelStatus: '待绑定'
      }
    })
    assert.ok(!!model, '绑定车辆信息不存在！')

    let num = await ctx.orm().info_model_nums.findOne({
      where: {
        modelCode: modelCode,
        isOver: 0
      }
    })
    assert.ok(!!num, '车牌不存在或已被绑定')

    await ctx.orm().info_model_nums.update({
      isOver: 1,
      overTime: date.formatDate()
    }, {
      where: {
        id: num.id,
        isOver: 0
      }
    })

    await ctx.orm().info_models.update({
      modelStatus: '已绑定',
      modelNum: num.modelNum,
      modelCode: num.modelCode,
      bangTime: date.formatDate()
    }, {
      where: {
        id: modelId,
        modelStatus: '待绑定'
      }
    })

    ctx.body = {}
  },
  submitNotify: async ctx => {
    let { userId, modelId, manageId, notifyType, d1, d2 } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id: userId
      }
    })
    assert.ok(!!user, '用户信息不存在！')

    let model = await ctx.orm().info_models.findOne({
      where: {
        userId: user.id,
        id: modelId
      }
    })
    assert.ok(!!model, '车辆信息不存在！')

    let manage = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: manageId,
        state: 1,
        isDel: 0
      }
    });
    assert.ok(!!manage, '管理员信息不存在！')

    let notifyContent = ''

    switch (notifyType) {
      case '挪车通知':
        notifyContent = `您的车辆目前停放在了${d1}禁停区域，请尽快转移到停放区域内！`
        break;
      case '违停通知':
        notifyContent = `因您的车目前停放在${d1}禁停区域，现已被转移到${d2}处，请尽快前往领取！`
        break;
      case '待报废通知':
        notifyContent = `因您的车目前为待报废状态，现已移至${d1}区域，30天后将进行报废处理，如需取回，请尽快领走！`
        break;
      case '超速通知':
        notifyContent = `您在巡查中发现存在超速行为，本次已记录，定期将同步所在学院及部门，请安全骑行。`
        break;
      case '超载通知':
        notifyContent = `您在巡查中发现存在超载行为，本次已记录，定期将同步所在学院及部门，请安全骑行。`
        break;
    }

    await ctx.orm().info_notifys.create({
      userId: user.id,
      modelId: model.id,
      manageId: manage.id,
      notifyType,
      notifyContent,
      sendPhone: user.phone,
      isSend: 0
    })

    if (notifyType === '待报废通知') {
      let now30 = new Date()
      now30 = now30.setDate(now30.getDate() + 30)
      now30 = new Date(now30)

      await ctx.orm().info_models.update({
        modelStatus: '待报废',
        scrapRemark: notifyContent,
        scrapStartTime: date.formatDate(),
        scrapEndTime: date.formatDate(now30)
      }, {
        where: {
          id: model.id,
          modelStatus: '已绑定'
        }
      })
    }

    ctx.body = {}
  },
  submitBatchNotify: async ctx => {
    let { modelIds, manageId, notifyType, d1, d2 } = ctx.request.body;

    let manage = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: manageId,
        state: 1,
        isDel: 0
      }
    });
    assert.ok(!!manage, '管理员信息不存在！')

    let models = await ctx.orm().info_models.findAll({
      where: {
        id: {
          $in: modelIds
        }
      }
    })

    if (models && models.length > 0) {
      let users = await ctx.orm().info_users.findAll({
        where: {
          id: {
            $in: models.map(m => {
              return m.dataValues.userId
            })
          }
        }
      })

      let notifyContent = ''
      switch (notifyType) {
        case '挪车通知':
          notifyContent = `您的车辆目前停放在了${d1}禁停区域，请尽快转移到停放区域内！`
          break;
        case '违停通知':
          notifyContent = `因您的车目前停放在${d1}禁停区域，现已被转移到${d2}处，请尽快前往领取！`
          break;
        case '待报废通知':
          notifyContent = `因您的车目前为待报废状态，现已移至${d1}区域，30天后将进行报废处理，如需取回，请尽快领走！`
          break;
      }

      let data = models.map(m => {
        let user = users.find(f => f.dataValues.id === m.dataValues.userId)

        return {
          userId: m.dataValues.userId,
          modelId: m.dataValues.id,
          manageId: manage.id,
          notifyType,
          notifyContent,
          sendPhone: user.dataValues.phone,
          isSend: 0
        };
      });

      // 批量添加通知
      await ctx.orm().info_notifys.bulkCreate(data);

      if (notifyType === '待报废通知') {
        let now30 = new Date()
        now30 = now30.setDate(now30.getDate() + 30)
        now30 = new Date(now30)

        await ctx.orm().info_models.update({
          modelStatus: '待报废',
          scrapRemark: notifyContent,
          scrapStartTime: date.formatDate(),
          scrapEndTime: date.formatDate(now30)
        }, {
          where: {
            id: {
              $in: models.map(m => {
                return m.dataValues.id
              })
            },
            modelStatus: '已绑定'
          }
        })
      }
    } else {
      assert.ok(false, '车辆信息不存在！')
    }

    ctx.body = {}
  },
  notifyUserStatistics: async ctx => {
    let { userId } = ctx.request.body;

    let sql = `select notifyType, count(1) num from info_notifys where userId = ${userId} group by notifyType`
    let result = await ctx.orm().query(sql)

    ctx.body = result
  },
};