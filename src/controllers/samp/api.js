/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2022-11-09 08:22:03
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/samp/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const sequelize = require('sequelize');
const axios = require('axios');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const jwt = require('../../utils/jwt');
const http = require('../../utils/http');
const encrypt = require('../../utils/encrypt');
const config = require('../../config.js');

const AipOcrClient = require("baidu-aip-sdk").ocr;

const APP_ID = "25119032";
const API_KEY = "3Hlx41svN2dnAKsjQzMtHnh0";
const SECRET_KEY = "UdOj4Y4DFm4S58G23wzhDGXjgUm7bYpG";

const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

module.exports = {
  getPostList: async ctx => {
    let { postName } = ctx.request.body;

    let where = {};
    Object.assign(where, postName && { postName })

    let result = await ctx.orm().info_posts.findAll({
      where
    });

    ctx.body = result;
  },
  getDeptList: async ctx => {
    let result = await ctx.orm().info_deps.findAll({});

    ctx.body = result;
  },
  // 上传文件
  uploadFile: async ctx => {
    if (ctx.req.files && ctx.req.files.length > 0) {
      let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`));
      let image = fs.readFileSync(filePath).toString("base64");
      let user = null;

      let res = await http.post({
        url: `http://192.168.149.97:20005/samp/api/idcardImgToJson`,
        data: {
          image
        }
      })

      if (res.data && res.data.data && res.data.data.idardInfo) {
        let idardInfo = res.data.data.idardInfo
        user = await ctx.orm().info_users.findOne({
          where: {
            idcard: idardInfo.idcard
          }
        })

        if (!user) {
          user = {
            depId: 2,
            depName1: '愿检尽检',
            depName2: '愿检尽检',
            name: idardInfo.name,
            idcard: idardInfo.idcard,
            address: idardInfo.address,
            street: '',
            community: '',
            phone: '',
            tradeType: '',
            postName: '',
            periodType: '',
            sampWay: ''
          }
        }
      }

      // 删除文件
      fs.unlink(filePath, function (error) {
        console.log('delete file error:', error)
        return false
      })

      ctx.body = {
        filePath: config.sys.uploadVirtualFilePath + '/' + ctx.req.files[0].filename,
        info: user
      };
    } else {
      ctx.body = {};
    }
  },
  // 上传文件
  idcardImgToJson: async ctx => {
    let { image } = ctx.request.body;

    if (image) {
      // let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`));
      // let image = fs.readFileSync(filePath).toString("base64");
      let idCardSide = "back";

      let result = await client.idcard(image, idCardSide);

      if (result.words_result &&
        result.words_result.姓名 &&
        result.words_result.民族 &&
        result.words_result.住址 &&
        result.words_result.公民身份号码 &&
        result.words_result.出生 &&
        result.words_result.性别) {
        let idardInfo = {
          name: result.words_result.姓名.words,
          idcard: result.words_result.公民身份号码.words,
          sex: result.words_result.性别.words,
          birthday: result.words_result.出生.words,
          nation: result.words_result.民族.words,
          address: result.words_result.住址.words
        }

        ctx.body = {
          idardInfo: idardInfo
        }
      } else {
        ctx.body = {}
      }

      /* let imgData = image.replace(/^data:image\/\w+;base64,/, '');
      let dataBuffer = Buffer.from(imgData, 'base64');

      const imgPath = path.resolve(path.join(__dirname, `../../../assets/uploads/${Date.now()}.png`));
      fs.writeFileSync(imgPath, dataBuffer);

      let imgFiles = fs.createReadStream(imgPath);
      let formData = new FormData();
      formData.append('file', imgFiles);
      let len = await new Promise((resolve, reject) => {
        return formData.getLength((err, length) => (err ? reject(err) : resolve(length)));
      });

      // let url = 'http://218.94.35.202:3555/api/upload_IDapp'
      let url = 'http://192.168.149.132:3555/api/upload_IDapp'

      let res = await axios({
        url: url,
        method: 'POST',
        params: {
          type: 'image',   // 这里以上图片为例
        },
        data: formData,
        headers: {
          ...formData.getHeaders(), // 小心
          'Content-Length': len,    // 谨慎
        },
      });

      fs.unlink(imgPath, function (error) {
        console.log('delete file error:', error)
        return false
      })

      if (res &&
        res.data &&
        res.data.result &&
        res.data.result.姓名 &&
        res.data.result.民族 &&
        res.data.result.住址 &&
        res.data.result.公民身份号码 &&
        res.data.result.出生年月 &&
        res.data.result.性别) {
        let idardInfo = {
          name: res.data.result.姓名,
          idcard: res.data.result.公民身份号码,
          sex: res.data.result.性别,
          birthday: res.data.result.出生,
          nation: res.data.result.民族,
          address: res.data.result.住址
        }

        ctx.body = {
          idardInfo: idardInfo
        }
      } else {
        console.log('身份证OCR失败，缺少信息：', JSON.stringify(res.data))
        ctx.body = {}
      } */
    } else {
      ctx.body = {}
    }
  },
  idcardSamp: async ctx => {
    let { name, phone, idcard, address, tradeType, postName, periodType, street, community, sampName, sampUserName, imgUrl, remark } = ctx.request.body;

    let now = date.formatDate();
    let today = date.formatDate(new Date(), 'YYYY-MM-DD');

    let user = await ctx.orm().info_users.findOne({
      where: {
        idcard
      }
    })

    if (!user) {
      user = await ctx.orm().info_users.create({
        depId: 2,
        depName1: '愿检尽检',
        depName2: '愿检尽检',
        depStreet: '',
        name,
        phone,
        idcard,
        tradeType,
        postName,
        periodType,
        sampWay: '1:1单管',
        street,
        community,
        address,
        userType: '在线',
        sampStartTime: today,
        sampName,
        sampUserName,
        sampHandleTime: now
      })
    } else {
      await ctx.orm().info_users.update({
        // userType: '在线',
        sampName,
        sampUserName,
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

    if (!sameSamp) {
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
          sampName,
          sampUserName,
          imgUrl,
          imgTime: now,
          remark
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
          sampName,
          sampUserName,
          imgUrl,
          imgTime: now,
          remark
        })
      }
    }

    ctx.body = {}
  },
  idcardSearch: async ctx => {
    let { idcard, name } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        idcard: idcard
      }
    })

    if (!user) {
      user = {
        depId: 2,
        depName1: '愿检尽检',
        depName2: '愿检尽检',
        name: name,
        idcard: idcard,
        address: '',
        street: '',
        community: '',
        phone: '',
        tradeType: '',
        postName: '',
        periodType: '',
        sampWay: ''
      }
    }

    ctx.body = {
      info: user
    };
  },
  getUsers: async ctx => {
    let { openId } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId: openId
      }
    })

    // 获取本次采样时间
    // 获取下次采样时间
    let today = date.formatDate(new Date(), 'YYYY-MM-DD');
    let nowSampTime = '';
    let nextSampTime = '';
    if (user && user.depId > 2) {
      /* let one = await ctx.orm().info_user_samps.findOne({
        where: {
          userId: user.id,
          startTime: {
            $lte: today
          },
          endTime: {
            $gte: today
          }
        }
      })

      if (one) {
        nowSampTime = `${date.formatDate(one.startTime, 'MM月DD日')}-${date.formatDate(one.endTime, 'MM月DD日')}`
      }

      let two = await ctx.orm().info_user_samps.findOne({
        where: {
          userId: user.id,
          handleType: '未采样',
          startTime: {
            $gt: today
          }
        }
      })

      if (two) {
        nextSampTime = `${date.formatDate(one.startTime, 'MM月DD日')}-${date.formatDate(one.endTime, 'MM月DD日')}`
      } */
    }

    ctx.body = {
      state: user ? 1 : 0,
      info: user,
      nowSampTime,
      nextSampTime
    };
  },
  addUser: async ctx => {
    let { openId, name, phone, idcard, street, community, address, imgCode, imgToken } = ctx.request.body;

    assert.notStrictEqual(openId, '', 'InputParamIsNull');
    assert.notStrictEqual(name, '', 'InputParamIsNull');
    assert.notStrictEqual(phone, '', 'InputParamIsNull');
    assert.notStrictEqual(idcard, '', 'InputParamIsNull');
    assert.notStrictEqual(street, '', 'InputParamIsNull');
    assert.notStrictEqual(community, '', 'InputParamIsNull');
    assert.notStrictEqual(address, '', 'InputParamIsNull');
    assert.notStrictEqual(imgCode, '', 'InputParamIsNull');
    assert.notStrictEqual(imgToken, '', 'InputParamIsNull');

    let now = date.formatDate();
    let today = date.formatDate(new Date(), 'YYYY-MM-DD');

    // 验证图形验证码
    let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
      where: {
        token: imgToken,
        imgCode: imgCode.toLocaleUpperCase(),
        isUse: 0,
        overTime: { $gt: now }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, '验证码输入错误');

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      { isUse: 1 },
      {
        where: {
          token: imgToken,
          imgCode: imgCode
        }
      }
    );

    let user = await ctx.orm().info_users.findOne({
      where: {
        idcard: idcard
      }
    })

    if (user) {
      // 身份证存在
      // 更新
      await ctx.orm().info_users.update({
        openId,
        phone,
        street,
        community,
        address,
        userType: '在线',
        isUp: 0
      }, {
        where: {
          id: user.id
        }
      })
    } else {
      // 身份证不存在
      // 注册
      await ctx.orm().info_users.create({
        openId,
        depId: 2,
        depName1: '愿检尽检',
        depName2: '愿检尽检',
        depStreet: '',
        name,
        phone,
        idcard,
        tradeType: '其他',
        postName: '愿检尽检人群',
        periodType: '当天',
        sampWay: '1:1单管',
        street,
        community,
        address,
        userType: '在线',
        sampStartTime: today
      })
    }

    ctx.body = {
      openId: openId
    }
  },
  getUserSamps: async ctx => {
    let { openId } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        openId: openId
      }
    })

    assert.ok(user !== null, '用户信息不存在！')

    let result = await ctx.orm().info_user_samps.findAll({
      where: {
        userId: user.id
      },
      order: [['id', 'desc']]
    })

    ctx.body = result
  }
};