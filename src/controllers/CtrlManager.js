/*
 * @Author: Lienren
 * @Date: 2018-06-21 19:35:28
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-25 00:01:40
 */
'use strict';

const assert = require('assert');
const comm = require('../utils/comm');
const date = require('../utils/date');
const encrypt = require('../utils/encrypt');
const jwt = require('../utils/jwt');

const configData = require('./ConfigData');
const config = require('../config.js');

function serializeMenu(menus, parentId) {
  let list = [];
  menus.forEach(menu => {
    if (menu.parentId === parentId) {
      let menuObj = {
        title: menu.menuName,
        key: `${menu.id}`,
        id: menu.menuLink,
        icon: menu.menuIcon,
        name: menu.menuName
      };
      menuObj.children = serializeMenu(menus, menu.id);
      list.push(menuObj);
    }
  });

  return list;
}

module.exports = {
  login: async ctx => {
    let loginName = ctx.request.body.loginName || '';
    let loginPwd = ctx.request.body.loginPwd || '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(loginName, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(loginPwd, '', configData.ERROR_KEY_ENUM.InputParamIsNull);

    let resultManager = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        loginname: loginName,
        state: 1,
        isDel: 0
      }
    });
    assert.notStrictEqual(resultManager, null, configData.ERROR_KEY_ENUM.ManagerNotExists);

    // 生成验证密钥
    let encryptPwd = encrypt.getMd5(`${loginPwd}|${resultManager.salt}`);
    assert.ok(resultManager.loginPwd === encryptPwd, configData.ERROR_KEY_ENUM.ManagerPasswordIsFail);

    // 设置Token
    let ManagerTokenOverTime = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerTokenOverTime);

    // 生成Token
    let token = jwt.getToken({
      managerId: resultManager.id,
      managerLoginName: resultManager.loginName,
      managerRealName: resultManager.realName,
      managerPhone: resultManager.phone
    });
    let tokenOverTime = now + ManagerTokenOverTime * 60 * 1000;

    ctx.orm().SuperManagerInfo.update(
      {
        token: token,
        tokenOverTime: tokenOverTime,
        lastTime: now
      },
      {
        where: { id: resultManager.id }
      }
    );

    ctx.body = {
      id: resultManager.id,
      loginName: resultManager.loginName,
      realName: resultManager.realName,
      phone: resultManager.phone,
      token: token
    };
  }
};
