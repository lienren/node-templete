/*
 * @Author: Lienren
 * @Date: 2018-06-21 19:35:28
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-21 15:41:11
 */
'use strict';

const assert = require('assert');
const comm = require('../utils/comm');
const date = require('../utils/date');
const encrypt = require('../utils/encrypt');
const jwt = require('../utils/jwt');

const configData = require('./ConfigData');
const config = require('../config.js');

const manageIds = [5, 9]

function serializeMenu (menus, parentId) {
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
    let openId = ctx.request.body.openId || '';
    let loginName = ctx.request.body.loginName || '';
    let loginPwd = ctx.request.body.loginPwd || '';
    let imgCode = ctx.request.body.imgCode || '';
    let imgCodeToken = ctx.request.body.imgCodeToken || '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(loginName, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(loginPwd, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(imgCode, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(imgCodeToken, '', configData.ERROR_KEY_ENUM.InputParamIsNull);

    // 验证图形验证码
    let resultImgCodeToken = await ctx.orm().BaseImgCode.findOne({
      where: {
        token: imgCodeToken,
        imgCode: imgCode.toLocaleUpperCase(),
        isUse: 0,
        overTime: { $gt: now }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, configData.ERROR_KEY_ENUM.ImageCodeIsFail);

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update(
      { isUse: 1 },
      {
        where: {
          token: imgCodeToken,
          imgCode: imgCode
        }
      }
    );

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
    console.log('encryptPwd:', encryptPwd);
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
        openId: openId,
        token: token,
        tokenOverTime: tokenOverTime,
        lastTime: now
      },
      {
        where: { id: resultManager.id }
      }
    );

    // 获取管理员所有角色
    let resultManagerRoles = await ctx.orm().SuperManagerRoleInfo.findAll({
      where: {
        managerId: resultManager.id
      }
    });

    ctx.body = {
      id: resultManager.id,
      loginName: resultManager.loginName,
      realName: resultManager.realName,
      phone: resultManager.phone,
      token: token,
      roles: resultManagerRoles,
      depName: resultManager.depName,
      verifyLevel: resultManager.verifyLevel,
      verifyVillages: JSON.parse(resultManager.verifyVillages)
    };
  },
  setPassword: async ctx => {
    let oldPassword = ctx.request.body.oldPassword || '';
    let newPassword = ctx.request.body.newPassword || '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(oldPassword, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(newPassword, '', configData.ERROR_KEY_ENUM.InputParamIsNull);

    let resultManager = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: ctx.work.managerId,
        state: 1,
        isDel: 0
      }
    });
    assert.notStrictEqual(resultManager, null, configData.ERROR_KEY_ENUM.ManagerNotExists);

    // 生成验证密钥
    let encryptOldPwd = encrypt.getMd5(`${oldPassword}|${resultManager.salt}`);
    assert.ok(resultManager.loginPwd === encryptOldPwd, configData.ERROR_KEY_ENUM.ManagerOldPasswordIsFail);

    // 重新生成密钥索引
    let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
    let salt = comm.randCode(ManagerPwdSaleCount);

    ctx.orm().SuperManagerInfo.update(
      {
        loginPwd: encrypt.getMd5(`${newPassword}|${salt}`),
        salt: salt,
        lastTime: now,
        token: '',
        tokenOverTime: now
      },
      {
        where: { id: ctx.work.managerId }
      }
    );

    ctx.body = {};
  },
  /***************************** 管理员管理 *************************************/
  getManagers: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let loginName = ctx.request.body.loginName || '';
    let realName = ctx.request.body.realName || '';
    let phone = ctx.request.body.phone || '';
    let state = ctx.request.body.state;
    let startAddTime = ctx.request.body.startAddTime || 0;
    let endAddTime = ctx.request.body.endAddTime || 0;
    let verifyLevel = ctx.request.body.verifyLevel || 0;
    let verifyType = ctx.request.body.verifyType || '';

    let condition = {
      verifyLevel: verifyLevel
    };

    if (verifyType !== '') {
      condition.verifyType = verifyType
    }

    if (loginName !== '') {
      condition.loginName = {
        $like: `%${loginName}%`
      };
    }
    if (realName !== '') {
      condition.realName = {
        $like: `%${realName}%`
      };
    }
    if (phone !== '') {
      condition.phone = {
        $like: `%${phone}%`
      };
    }
    if (state !== -1) {
      condition.state = state;
    }
    if (startAddTime > 0 && endAddTime > 0) {
      condition.addTime = {
        $between: [startAddTime, endAddTime]
      };
    }

    condition.isDel = 0;

    let result = await ctx.orm().SuperManagerInfo.findAndCountAll({
      attributes: ['id', 'loginName', 'realName', 'phone', 'state', 'depName', 'sex', 'addTime', 'lastTime', 'verifyLevel', 'verifyType', 'verifyVillages'],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where: condition,
      order: [['addTime', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      current,
      pageSize
    };
  },
  addManager: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let loginName = ctx.request.body.loginName || '';
    let loginPwd = ctx.request.body.loginPwd || '';
    let realName = ctx.request.body.realName || '';
    let phone = ctx.request.body.phone || '';
    let state = ctx.request.body.state;
    let sex = ctx.request.body.sex;
    let depName = ctx.request.body.depName || '';
    let verifyLevel = ctx.request.body.verifyLevel || 0;
    let verifyType = ctx.request.body.verifyType || '';
    let verifyVillages = ctx.request.body.verifyVillages || [];

    let now = date.getTimeStamp();

    assert.notStrictEqual(loginName, '', 'InputParamIsNull');
    assert.notStrictEqual(loginPwd, '', 'InputParamIsNull');
    assert.notStrictEqual(realName, '', 'InputParamIsNull');
    assert.notStrictEqual(phone, '', 'InputParamIsNull');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        loginName: loginName,
        isDel: 0
      }
    });

    assert.ok(sameManagerResult === null, 'ManagerLoginNameExists');

    // 重新生成密钥索引
    let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
    let salt = comm.randCode(ManagerPwdSaleCount);

    let result = await ctx.orm().SuperManagerInfo.create({
      loginName: loginName,
      loginPwd: encrypt.getMd5(`${loginPwd}|${salt}`),
      realName: realName,
      phone: phone,
      salt: salt,
      state: state,
      sex: sex,
      depName: depName,
      token: '',
      tokenOverTime: now,
      addTime: now,
      lastTime: now,
      verifyLevel,
      verifyType,
      verifyVillages: JSON.stringify(verifyVillages),
      isDel: 0
    });

    ctx.body = result;
  },
  editManager: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;
    let loginName = ctx.request.body.loginName || '';
    let loginPwd = ctx.request.body.loginPwd || '';
    let realName = ctx.request.body.realName || '';
    let phone = ctx.request.body.phone || '';
    let state = ctx.request.body.state;
    let sex = ctx.request.body.sex;
    let depName = ctx.request.body.depName || '';
    let verifyVillages = ctx.request.body.verifyVillages || [];
    let now = date.getTimeStamp();

    assert.notStrictEqual(id, 0, 'InputParamIsNull');
    assert.notStrictEqual(loginName, '', 'InputParamIsNull');
    assert.notStrictEqual(realName, '', 'InputParamIsNull');
    assert.notStrictEqual(phone, '', 'InputParamIsNull');

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let updateField = {};

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    if (loginPwd !== '') {
      // 重新生成密钥索引
      let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
      let salt = comm.randCode(ManagerPwdSaleCount);
      loginPwd = encrypt.getMd5(`${loginPwd}|${salt}`);

      updateField.salt = salt;
      updateField.loginPwd = loginPwd;
    }

    if (sameManagerResult.id === 1) {
      // 超级管理员只能修改密码、手机号和部门
      updateField.phone = phone;
      updateField.depName = depName;
      updateField.sex = sex;
    } else {
      updateField.realName = realName;
      updateField.phone = phone;
      updateField.state = state;
      updateField.depName = depName;
      updateField.sex = sex;
      if (state === 0) {
        // 关闭状态时，清除token
        updateField.token = '';
      }
    }

    updateField.verifyVillages = JSON.stringify(verifyVillages)
    updateField.lastTime = now;

    ctx.orm().SuperManagerInfo.update(updateField, {
      where: {
        id: id
      }
    });

    ctx.body = {};
  },
  editManagerState: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;
    let state = ctx.request.body.state;

    assert.notStrictEqual(id, 0, 'InputParamIsNull');

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    if (state === 0) {
      // 关闭状态时，清除token
      ctx.orm().SuperManagerInfo.update(
        {
          state: state,
          toke: ''
        },
        {
          where: {
            id: id
          }
        }
      );
    } else {
      ctx.orm().SuperManagerInfo.update(
        {
          state: state
        },
        {
          where: {
            id: id
          }
        }
      );
    }

    ctx.body = {};
  },
  delManager: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    // 删除时，清除token
    ctx.orm().SuperManagerInfo.update(
      {
        token: '',
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getManagerRole: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    let resultManagerRole = await ctx.orm().SuperManagerRoleInfo.findAll({
      where: {
        managerId: id
      }
    });

    let resultRole = await ctx.orm().SuperRoleInfo.findAll({
      where: {
        id: {
          $in: resultManagerRole.map(val => {
            return val.roleId;
          })
        }
      }
    });

    ctx.body = resultRole;
  },
  setManagerRole: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;
    let roleIds = ctx.request.body.roleIds || [];
    let now = date.getTimeStamp();

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    // 删除管理员所有角色
    await ctx
      .orm()
      .query(`delete from SuperManagerRoleInfo where managerId = ${id}`)
      .spread((results, metadata) => { });

    // 添加管理员角色数据
    let data = roleIds.map(role => {
      return { managerId: id, roleId: parseInt(role), addTime: now };
    });
    ctx.orm().SuperManagerRoleInfo.bulkCreate(data);

    ctx.body = {};
  },
  getManagerMenu: async ctx => {
    let id = ctx.work.managerId || 0;

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 0, 'ManagerNotExists');

    let sameManagerResult = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    let resultRoleIds = await ctx.orm().SuperManagerRoleInfo.findAll({
      where: {
        managerId: id
      }
    });

    let resultMenuIds = await ctx.orm().SuperRoleMenuInfo.findAll({
      where: {
        roleId: {
          $in: resultRoleIds.map(val => {
            return val.roleId;
          })
        }
      }
    });

    let menuIds = [];
    resultMenuIds.forEach(menu => {
      menuIds.push(menu.menuId);
      if (!menuIds.includes(menu.menuId.toString().substring(0, 1))) {
        menuIds.push(menu.menuId.toString().substring(0, 1));
      }
    });

    let resultMenus = await ctx.orm().BaseMenu.findAll({
      where: {
        id: {
          $in: menuIds
        },
        isDel: 0
      },
      order: [['sort']]
    });

    ctx.body = serializeMenu(resultMenus, 0);
  },
  /***************************** 角色管理 *************************************/
  getRoles: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let roleName = ctx.request.body.roleName || '';
    let startAddTime = ctx.request.body.startAddTime || 0;
    let endAddTime = ctx.request.body.endAddTime || 0;
    let condition = {};

    if (roleName !== '') {
      condition.roleName = {
        $like: `%${roleName}%`
      };
    }
    if (startAddTime > 0 && endAddTime > 0) {
      condition.addTime = {
        $between: [startAddTime, endAddTime]
      };
    }

    condition.isDel = 0;

    let resultCount = await ctx.orm().SuperRoleInfo.findAndCountAll({
      where: condition
    });
    let result = await ctx.orm().SuperRoleInfo.findAll({
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where: condition,
      order: [['addTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  addRole: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let roleName = ctx.request.body.roleName || '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(roleName, '', 'InputParamIsNull');

    let sameResult = await ctx.orm().SuperRoleInfo.findOne({
      where: {
        roleName: roleName,
        isDel: 0
      }
    });

    assert.ok(sameResult === null, 'RoleNameExists');

    ctx.orm().SuperRoleInfo.create({
      roleName: roleName,
      addTime: now,
      isDel: 0
    });

    ctx.body = {};
  },
  delRole: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperRoleNotUpdate');

    let sameResult = await ctx.orm().SuperRoleInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    // 删除时，清除token
    ctx.orm().SuperRoleInfo.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  getRoleMenu: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;

    let sameResult = await ctx.orm().SuperRoleInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    let result = await ctx.orm().SuperRoleMenuInfo.findAll({
      where: {
        roleId: id
      }
    });

    ctx.body = result.map(val => {
      return `${val.menuId}`;
    });
  },
  setRoleMenu: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;
    let menuIds = ctx.request.body.menuIds || [];
    let now = date.getTimeStamp();

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperRoleNotUpdate');

    let sameResult = await ctx.orm().SuperRoleInfo.findOne({
      where: {
        id: id,
        isDel: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    // 删除角色所有菜单
    await ctx
      .orm()
      .query(`delete from SuperRoleMenuInfo where roleId = ${id}`)
      .spread((results, metadata) => { });

    // 添加角色菜单数据
    let data = menuIds.map(menu => {
      return { roleId: id, menuId: parseInt(menu), addTime: now };
    });
    ctx.orm().SuperRoleMenuInfo.bulkCreate(data);

    ctx.body = {};
  },
  /***************************** 菜单管理 *************************************/
  getMenus: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let result = await ctx.orm().BaseMenu.findAll({
      where: {
        isDel: 0
      },
      order: [['sort']]
    });

    let list = serializeMenu(result, 0);

    ctx.body = list;
  },
  getMenuList: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let menuName = ctx.request.body.menuName || '';
    let startAddTime = ctx.request.body.startAddTime || 0;
    let endAddTime = ctx.request.body.endAddTime || 0;
    let condition = {};

    if (menuName !== '') {
      condition.menuName = {
        $like: `%${menuName}%`
      };
    }
    if (startAddTime > 0 && endAddTime > 0) {
      condition.addTime = {
        $between: [startAddTime, endAddTime]
      };
    }

    condition.isDel = 0;

    let resultCount = await ctx.orm().BaseMenu.findAndCountAll({
      where: condition
    });
    let result = await ctx.orm().BaseMenu.findAll({
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where: condition,
      order: [['id'], ['sort']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  },
  addMenu: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;
    let menuName = ctx.request.body.menuName || '';
    let menuLink = ctx.request.body.menuLink || '';
    let menuIcon = ctx.request.body.menuIcon || '';
    let parentId = ctx.request.body.parentId || 0;
    let sort = ctx.request.body.sort || 0;
    let level = 1;
    let parentName = '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(id, 0, 'InputParamIsNull');
    assert.notStrictEqual(menuName, '', 'InputParamIsNull');
    assert.notStrictEqual(menuLink, '', 'InputParamIsNull');

    let sameResult1 = await ctx.orm().BaseMenu.findOne({
      where: {
        id: id
      }
    });

    assert.ok(sameResult1 === null, 'MenuNameExists');

    let sameResult2 = await ctx.orm().BaseMenu.findOne({
      where: {
        menuName: menuName,
        isDel: 0
      }
    });

    assert.ok(sameResult2 === null, 'MenuNameExists');

    if (parentId > 0) {
      let parentResult = await ctx.orm().BaseMenu.findOne({
        where: {
          id: parentId,
          isDel: 0
        }
      });

      assert.notStrictEqual(parentResult, null, 'ParentMenuExists');

      level = parentResult.level + 1;
      parentName = parentResult.menuName;
    }

    ctx.orm().BaseMenu.create({
      id: id,
      menuName: menuName,
      menuLink: menuLink,
      menuIcon: menuIcon,
      parentId: parentId,
      parentName: parentName,
      level: level,
      sort: sort,
      addTime: now,
      isDel: 0
    });

    ctx.body = {};
  },
  delMenu: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let id = ctx.request.body.id || 0;

    ctx.orm().BaseMenu.update(
      {
        isDel: 1
      },
      {
        where: {
          id: id
        }
      }
    );

    ctx.body = {};
  },
  /***************************** 日志管理 *************************************/
  getLogs: async ctx => {
    if (manageIds.indexOf(ctx.work.managerId) < 0) {
      ctx.body = {}
      return
    }

    let current = ctx.request.body.current || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let pageName = ctx.request.body.pageName || '';
    let eventName = ctx.request.body.eventName || '';
    let activeName = ctx.request.body.activeName || '';
    let startAddTime = ctx.request.body.startAddTime || 0;
    let endAddTime = ctx.request.body.endAddTime || 0;
    let condition = {};

    if (pageName !== '') {
      condition.pageName = {
        $like: `%${pageName}%`
      };
    }
    if (eventName !== '') {
      condition.eventName = {
        $like: `%${eventName}%`
      };
    }
    if (activeName !== '') {
      condition.activeName = {
        $like: `%${activeName}%`
      };
    }
    if (startAddTime > 0 && endAddTime > 0) {
      condition.addTime = {
        $between: [startAddTime, endAddTime]
      };
    }

    let resultCount = await ctx.orm().SuperManagerLoginfo.findAndCountAll({
      where: condition
    });
    let result = await ctx.orm().SuperManagerLoginfo.findAll({
      attributes: [
        'id',
        'pageName',
        'pageUrl',
        'actionName',
        'eventName',
        'activeName',
        'addTime',
        'managerId',
        'managerRealName',
        'managerLoginName',
        'managerPhone',
        'reqParam',
        'repParam'
      ],
      offset: (current - 1) * pageSize,
      limit: pageSize,
      where: condition,
      order: [['addTime', 'DESC']]
    });

    ctx.body = {
      total: resultCount.count,
      list: result,
      current,
      pageSize
    };
  }
};
