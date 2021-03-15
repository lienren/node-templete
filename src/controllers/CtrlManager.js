/*
 * @Author: Lienren
 * @Date: 2018-06-21 19:35:28
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-15 00:03:36
 */
'use strict';

const assert = require('assert');
const comm = require('../utils/comm');
const date = require('../utils/date');
const encrypt = require('../utils/encrypt');
const jwt = require('../utils/jwt');
const ip = require('../utils/ip');

const configData = require('./ConfigData');
const config = require('../config.js');

function serializeMenu(menus, parentId) {
  let list = [];
  menus.forEach(menu => {
    if (menu.parent_id === parentId) {
      let menuObj = {
        ...menu,
        parentId: menu.parent_id,
        create_time: menu.createTime
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
        overTime: {
          $gt: now
        }
      }
    });
    assert.notStrictEqual(resultImgCodeToken, null, configData.ERROR_KEY_ENUM.ImageCodeIsFail);

    // 设置图形验证码已使用
    ctx.orm().BaseImgCode.update({
      isUse: 1
    }, {
      where: {
        token: imgCodeToken,
        imgCode: imgCode
      }
    });

    let resultManager = await ctx.orm().ums_admin.findOne({
      where: {
        username: loginName,
        status: 1
      }
    });
    assert.notStrictEqual(resultManager, null, configData.ERROR_KEY_ENUM.ManagerNotExists);

    // 生成验证密钥
    let encryptPwd = encrypt.getMd5(`${loginPwd}|${resultManager.salt}`);
    assert.ok(resultManager.password === encryptPwd, configData.ERROR_KEY_ENUM.ManagerPasswordIsFail);

    // 设置Token
    let ManagerTokenOverTime = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerTokenOverTime);

    // 生成Token
    let token = jwt.getToken({
      managerId: resultManager.id,
      managerLoginName: resultManager.username,
      managerRealName: resultManager.nick_name,
      managerEmail: resultManager.email,
      managerPhone: resultManager.phone
    });
    let tokenOverTime = now + ManagerTokenOverTime * 60 * 1000;

    ctx.orm().ums_admin.update({
      token: token,
      token_over_time: tokenOverTime,
      last_time: now,
      login_time: date.formatDate()
    }, {
      where: {
        id: resultManager.id
      }
    });

    ctx.orm().ums_admin_login_log.create({
      admin_id: resultManager.id,
      create_time: date.formatDate(),
      ip: ip.getClientIP(ctx),
      address: '',
      user_agent: JSON.stringify(ctx.userAgent)
    })

    // 获取管理员所有角色
    /* let resultManagerRoles = await ctx.orm().SuperManagerRoleInfo.findAll({
      where: {
        managerId: resultManager.id
      }
    }); */

    ctx.body = {
      id: resultManager.id,
      username: resultManager.username,
      nick_name: resultManager.nick_name,
      email: resultManager.email,
      phone: resultManager.phone,
      icon: resultManager.icon,
      token: token
    };
  },
  logout: async ctx => {
    let now = date.getTimeStamp();

    ctx.orm().ums_admin.update({
      token: '',
      token_over_time: 0
    }, {
      where: {
        id: ctx.work.managerId
      }
    });

    ctx.body = {};
  },
  setPassword: async ctx => {
    let oldPassword = ctx.request.body.oldPassword || '';
    let newPassword = ctx.request.body.newPassword || '';
    let now = date.getTimeStamp();

    assert.notStrictEqual(oldPassword, '', configData.ERROR_KEY_ENUM.InputParamIsNull);
    assert.notStrictEqual(newPassword, '', configData.ERROR_KEY_ENUM.InputParamIsNull);

    let resultManager = await ctx.orm().ums_admin.findOne({
      where: {
        id: ctx.work.managerId,
        status: 1,
        is_del: 0
      }
    });
    assert.notStrictEqual(resultManager, null, configData.ERROR_KEY_ENUM.ManagerNotExists);

    // 生成验证密钥
    let encryptOldPwd = encrypt.getMd5(`${oldPassword}|${resultManager.salt}`);
    assert.ok(resultManager.password === encryptOldPwd, configData.ERROR_KEY_ENUM.ManagerOldPasswordIsFail);

    // 重新生成密钥索引
    let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
    let salt = comm.randCode(ManagerPwdSaleCount);

    ctx.orm().ums_admin.update({
      password: encrypt.getMd5(`${newPassword}|${salt}`),
      salt: salt,
      token: '',
      tokenOverTime: 0
    }, {
      where: {
        id: ctx.work.managerId
      }
    });

    ctx.body = {};
  },
  info: async ctx => {
    let now = date.getTimeStamp();

    let resultManager = await ctx.orm().ums_admin.findOne({
      where: {
        id: ctx.work.managerId,
        token: ctx.work.token,
        status: 1,
        token_over_time: {
          $gte: now
        },
      }
    });
    assert.notStrictEqual(resultManager, null, configData.ERROR_KEY_ENUM.ManagerNotExists);

    let roles = await ctx.orm().query(`
      select r.* from ums_admin_role_relation ar inner join ums_role r on ar.role_id = r.id and r.is_del = 0
      where ar.admin_id = ${resultManager.id}`);

    let menus = await ctx.orm().query(`
      select
          m.id id,
          m.parent_id parentId,
          m.create_time createTime,
          m.title title,
          m.level level,
          m.sort sort,
          m.name name,
          m.icon icon,
          m.hidden hidden
      from ums_admin_role_relation arr
      inner join ums_role r on arr.role_id = r.id and r.status = 1 and r.is_del = 0
      inner join ums_role_menu_relation rmr on r.id = rmr.role_id
      inner join ums_menu m on rmr.menu_id = m.id and m.is_del = 0
      where
        arr.admin_id = ${resultManager.id}
        and m.id is not null
      group by m.id`);

    ctx.body = {
      id: resultManager.id,
      username: resultManager.username,
      icon: resultManager.icon,
      roles,
      menus: menus.length > 0 ? menus[0] : menus
    };
  },
  /***************************** 管理员管理 *************************************/
  getManagers: async ctx => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let keyword = ctx.request.body.keyword || '';
    let userType = ctx.request.body.userType || 1;
    let userCompanyId = ctx.request.body.userCompanyId || 0;

    let where = {
      user_type: userType,
      is_del: 0
    };

    if (userCompanyId > 0) {
      where.user_company_id = userCompanyId
    }

    if (keyword !== '') {
      where.$or = [{
        username: {
          $like: `%${keyword}%`
        }
      }, {
        phone: {
          $like: `%${keyword}%`
        }
      }, {
        nick_name: {
          $like: `%${keyword}%`
        }
      }];
    }

    let result = await ctx.orm().ums_admin.findAndCountAll({
      attributes: ['id', 'username', 'icon', 'email', 'phone', 'nick_name', 'note', 'create_time', 'login_time', 'status', 'user_type', 'user_type_name', 'user_parentid', 'user_company_id', 'user_company_branch_name', 'user_dept_name'],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['create_time', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          nickName: m.dataValues.nick_name,
          createTime: m.dataValues.create_time,
          loginTime: m.dataValues.login_time,
          userType: m.dataValues.user_type,
          userTypeName: m.dataValues.user_type_name,
          userParentid: m.dataValues.user_parentid,
          userCompanyId: m.dataValues.user_company_id,
          userCompanyBranchName: m.dataValues.user_company_branch_name,
          userDeptName: m.dataValues.user_dept_name
        }
      }),
    };
  },
  addManager: async ctx => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password || '';
    let icon = ctx.request.body.icon || '';
    let email = ctx.request.body.email || '';
    let phone = ctx.request.body.phone || '';
    let nickName = ctx.request.body.nickName || '';
    let note = ctx.request.body.note || '';
    let status = ctx.request.body.status;
    let userType = ctx.request.body.userType || 1;
    let userTypeName = ctx.request.body.userTypeName || '管理员';
    let userParentid = ctx.request.body.userParentid || 0;
    let userCompanyId = ctx.request.body.userCompanyId || 0;
    let userCompanyBranchName = ctx.request.body.userCompanyBranchName || '';
    let userDeptName = ctx.request.body.userDeptName || '';

    assert.notStrictEqual(username, '', 'InputParamIsNull');
    assert.notStrictEqual(password, '', 'InputParamIsNull');
    assert.notStrictEqual(nickName, '', 'InputParamIsNull');

    let sameManagerResult = await ctx.orm().ums_admin.findOne({
      where: {
        username: username
      }
    });

    assert.ok(sameManagerResult === null, '帐号名称已存在！');

    // 重新生成密钥索引
    let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
    let salt = comm.randCode(ManagerPwdSaleCount);

    let admin = await ctx.orm().ums_admin.create({
      username: username,
      password: encrypt.getMd5(`${password}|${salt}`),
      salt: salt,
      icon: icon,
      email: email,
      phone: phone,
      nick_name: nickName,
      note: note,
      create_time: date.formatDate(),
      status: status,
      is_del: 0,
      user_type: userType,
      user_type_name: userTypeName,
      user_parentid: userParentid,
      user_company_id: userCompanyId,
      user_company_branch_name: userCompanyBranchName,
      user_dept_name: userDeptName
    });

    if (admin && admin.id > 0 && userType === 2) {
      // 公司管理员，自动添加角色
      // 删除管理员所有角色
      await ctx
        .orm()
        .query(`delete from ums_admin_role_relation where admin_id = ${id}`)
        .spread((results, metadata) => {});

      ctx.orm().ums_admin_role_relation.create({
        admin_id: admin.id,
        role_id: 9
      })
    }

    ctx.body = {};
  },
  editManager: async ctx => {
    let id = ctx.request.body.id || 0;
    let username = ctx.request.body.username;
    let password = ctx.request.body.password || '';
    let icon = ctx.request.body.icon || '';
    let email = ctx.request.body.email || '';
    let phone = ctx.request.body.phone || '';
    let nickName = ctx.request.body.nickName || '';
    let note = ctx.request.body.note || '';
    let status = ctx.request.body.status;
    let userType = ctx.request.body.userType || 1;
    let userTypeName = ctx.request.body.userTypeName || '管理员';
    let userParentid = ctx.request.body.userParentid || 0;
    let userCompanyId = ctx.request.body.userCompanyId || 0;
    let userCompanyBranchName = ctx.request.body.userCompanyBranchName || '';
    let userDeptName = ctx.request.body.userDeptName || '';

    assert.notStrictEqual(id, 0, 'InputParamIsNull');
    assert.notStrictEqual(username, '', 'InputParamIsNull');
    assert.notStrictEqual(nickName, '', 'InputParamIsNull');

    let sameManagerResult = await ctx.orm().ums_admin.findOne({
      where: {
        username: username,
        id: {
          $ne: id
        }
      }
    });

    assert.ok(sameManagerResult === null, '帐号名称已存在！');

    if (password) {
      // 重新生成密钥索引
      let ManagerPwdSaleCount = await configData.getConfig(ctx, configData.CONFIG_KEY_ENUM.ManagerPwdSaleCount);
      let salt = comm.randCode(ManagerPwdSaleCount);

      await ctx.orm().ums_admin.update({
        username: username,
        password: encrypt.getMd5(`${password}|${salt}`),
        salt: salt,
        icon: icon,
        email: email,
        phone: phone,
        nick_name: nickName,
        note: note,
        status: status,
        token: '',
        token_over_time: 0,
        user_type: userType,
        user_type_name: userTypeName,
        user_parentid: userParentid,
        user_company_id: userCompanyId,
        user_company_branch_name: userCompanyBranchName,
        user_dept_name: userDeptName
      }, {
        where: {
          id
        }
      });
    } else {
      await ctx.orm().ums_admin.update({
        username: username,
        icon: icon,
        email: email,
        phone: phone,
        nick_name: nickName,
        note: note,
        status: status,
        token: '',
        token_over_time: 0,
        user_type: userType,
        user_type_name: userTypeName,
        user_parentid: userParentid,
        user_company_id: userCompanyId,
        user_company_branch_name: userCompanyBranchName,
        user_dept_name: userDeptName
      }, {
        where: {
          id
        }
      });
    }

    ctx.body = {};
  },
  editManagerState: async ctx => {
    let id = ctx.request.body.id || 0;
    let status = ctx.request.body.status;

    let now = date.getTimeStamp();

    assert.notStrictEqual(id, 0, 'InputParamIsNull');

    await ctx.orm().ums_admin.update({
      status: status,
      token: '',
      token_over_time: 0
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  delManager: async ctx => {
    let id = ctx.request.body.id || 0;
    let userType = ctx.request.body.userType || 1;

    // 删除时，清除token
    ctx.orm().ums_admin.update({
      token: '',
      token_over_time: 0,
      is_del: 1
    }, {
      where: {
        id,
        user_type: userType
      }
    });

    ctx.body = {};
  },
  getManagerRole: async ctx => {
    let id = ctx.request.body.id || 0;

    let sameManagerResult = await ctx.orm().ums_admin.findOne({
      where: {
        id: id,
        is_del: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    let roles = await ctx.orm().query(`
    select r.* from ums_admin_role_relation ar inner join ums_role r on ar.role_id = r.id and r.is_del = 0
    where ar.admin_id = ${id}`);

    ctx.body = roles.map(m => {
      return {
        ...m,
        adminCount: m.admin_count,
        createTime: m.create_time
      }
    })
  },
  setManagerRole: async ctx => {
    let id = ctx.request.body.id || 0;
    let roleIds = ctx.request.body.roleIds || [];
    let now = date.getTimeStamp();

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperManagerNotUpdate');

    let sameManagerResult = await ctx.orm().ums_admin.findOne({
      where: {
        id: id,
        is_del: 0
      }
    });

    assert.notStrictEqual(sameManagerResult, null, 'ManagerNotExists');

    // 删除管理员所有角色
    await ctx
      .orm()
      .query(`delete from ums_admin_role_relation where admin_id = ${id}`)
      .spread((results, metadata) => {});

    // 添加管理员角色数据
    let data = roleIds.map(role => {
      return {
        admin_id: id,
        role_id: parseInt(role)
      };
    });
    ctx.orm().ums_admin_role_relation.bulkCreate(data);

    ctx.body = {};
  },
  /***************************** 角色管理 *************************************/
  getRoles: async ctx => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;
    let keyword = ctx.request.body.keyword || '';

    let condition = {
      is_del: 0
    };

    if (keyword !== '') {
      condition.name = {
        $like: `%${keyword}%`
      };
    }

    let result = await ctx.orm().ums_role.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where: condition,
      order: [
        ['sort']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          adminCount: m.dataValues.admin_count,
          createTime: m.dataValues.create_time
        }
      }),
    };
  },
  getRoleAll: async ctx => {
    let condition = {
      is_del: 0
    };

    let result = await ctx.orm().ums_role.findAll({
      where: condition,
      order: [
        ['sort']
      ]
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        adminCount: m.dataValues.admin_count,
        createTime: m.dataValues.create_time
      }
    });
  },
  addRole: async ctx => {
    let name = ctx.request.body.name || '';
    let description = ctx.request.body.description || '';
    let status = ctx.request.body.status || 0;
    let sort = ctx.request.body.sort || 0;
    let now = date.getTimeStamp();

    assert.notStrictEqual(name, '', 'InputParamIsNull');

    let sameResult = await ctx.orm().ums_role.findOne({
      where: {
        name: name
      }
    });

    assert.ok(sameResult === null, '角色名称已存在！');

    ctx.orm().ums_role.create({
      name: name,
      description: description,
      admin_count: 0,
      create_time: date.formatDate(),
      status: status,
      sort: sort
    });

    ctx.body = {};
  },
  editRole: async ctx => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let description = ctx.request.body.description || '';
    let status = ctx.request.body.status || 0;
    let sort = ctx.request.body.sort || 0;
    let now = date.getTimeStamp();

    assert.notStrictEqual(id, 0, 'InputParamIsNull');
    assert.notStrictEqual(name, '', 'InputParamIsNull');

    ctx.orm().ums_role.update({
      name: name,
      description: description,
      status: status,
      sort: sort
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  editRoleStatus: async ctx => {
    let id = ctx.request.body.id || 0;
    let status = ctx.request.body.status || 0;
    let now = date.getTimeStamp();

    assert.notStrictEqual(id, 0, 'InputParamIsNull');

    ctx.orm().ums_role.update({
      status: status
    }, {
      where: {
        id
      }
    });

    ctx.body = {};
  },
  delRole: async ctx => {
    let id = ctx.request.body.id || 0;

    // 超级管理员禁止更新
    assert.notStrictEqual(id, 1, 'SuperRoleNotUpdate');

    // 删除时，清除token
    ctx.orm().ums_role.update({
      is_del: 1
    }, {
      where: {
        id: id
      }
    });

    ctx.body = {};
  },
  getRoleMenu: async ctx => {
    let id = ctx.request.body.id || 0;

    let sameResult = await ctx.orm().ums_role.findOne({
      where: {
        id: id,
        is_del: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    let menus = await ctx.orm().query(`
    SELECT
        m.id id,
        m.parent_id parentId,
        m.create_time createTime,
        m.title title,
        m.level level,
        m.sort sort,
        m.name name,
        m.icon icon,
        m.hidden hidden
    FROM
        ums_role_menu_relation rmr
    LEFT JOIN ums_menu m ON rmr.menu_id = m.id and m.is_del = 0
    WHERE
        rmr.role_id = ${id} AND m.id IS NOT NULL
    GROUP BY m.id`);

    ctx.body = menus.length > 0 ? menus[0] : menus
  },
  setRoleMenu: async ctx => {
    let id = ctx.request.body.id || 0;
    let menuIds = ctx.request.body.menuIds || [];
    let now = date.getTimeStamp();

    let sameResult = await ctx.orm().ums_role.findOne({
      where: {
        id: id,
        is_del: 0
      }
    });

    assert.notStrictEqual(sameResult, null, 'RoleNotExists');

    // 删除角色所有菜单
    await ctx
      .orm()
      .query(`delete from ums_role_menu_relation where role_id = ${id}`)
      .spread((results, metadata) => {});

    // 添加角色菜单数据
    let data = menuIds.map(menu => {
      return {
        role_id: id,
        menu_id: parseInt(menu)
      };
    });
    ctx.orm().ums_role_menu_relation.bulkCreate(data);

    ctx.body = {};
  },
  /***************************** 菜单管理 *************************************/
  getMenus: async ctx => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;
    let parentId = ctx.request.body.parentId || 0;

    let result = await ctx.orm().ums_menu.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where: {
        parent_id: parentId,
        is_del: 0
      },
      order: [
        ['sort']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
    };
  },
  getMenuTree: async ctx => {
    let result = await ctx.orm().ums_menu.findAll({
      where: {
        is_del: 0
      },
      order: [
        ['sort']
      ]
    });

    ctx.body = serializeMenu(result.map(m => m.dataValues), 0);
  },
  getMenu: async ctx => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().ums_menu.findOne({
      where: {
        id,
        is_del: 0
      }
    });

    if (result) {
      ctx.body = {
        title: result.title,
        parentId: result.parent_id,
        name: result.name,
        icon: result.icon,
        hidden: result.hidden,
        sort: result.sort
      };
    } else {
      ctx.body = {};
    }
  },
  addMenu: async ctx => {
    let title = ctx.request.body.title || '';
    let parentId = ctx.request.body.parentId || 0;
    let name = ctx.request.body.name || '';
    let icon = ctx.request.body.icon || '';
    let hidden = ctx.request.body.hidden || 0;
    let sort = ctx.request.body.sort || 0;

    let level = 0;

    assert.notStrictEqual(title, '', 'InputParamIsNull');
    assert.notStrictEqual(name, '', 'InputParamIsNull');
    assert.notStrictEqual(icon, '', 'InputParamIsNull');

    let sameResult1 = await ctx.orm().ums_menu.findOne({
      where: {
        title: title
      }
    });

    assert.ok(sameResult1 === null, '菜单名称已经存在！');

    let sameResult2 = await ctx.orm().ums_menu.findOne({
      where: {
        name: name
      }
    });

    assert.ok(sameResult2 === null, '菜单名称已经存在！');

    if (parentId > 0) {
      let parentResult = await ctx.orm().ums_menu.findOne({
        where: {
          id: parentId
        }
      });

      assert.notStrictEqual(parentResult, null, '父级菜单不存在！');

      level = parentResult.level + 1;
    }

    ctx.orm().ums_menu.create({
      parent_id: parentId,
      create_time: date.formatDate(),
      title: title,
      level: level,
      sort: sort,
      name: name,
      icon: icon,
      hidden: hidden
    });

    ctx.body = {};
  },
  editMenu: async ctx => {
    let id = ctx.request.body.id || 0;
    let title = ctx.request.body.title || '';
    let parentId = ctx.request.body.parentId || 0;
    let name = ctx.request.body.name || '';
    let icon = ctx.request.body.icon || '';
    let hidden = ctx.request.body.hidden || 0;
    let sort = ctx.request.body.sort || 0;

    let level = 0;

    assert.notStrictEqual(id, 0, 'InputParamIsNull');
    assert.notStrictEqual(title, '', 'InputParamIsNull');
    assert.notStrictEqual(name, '', 'InputParamIsNull');
    assert.notStrictEqual(icon, '', 'InputParamIsNull');

    if (parentId > 0) {
      let parentResult = await ctx.orm().ums_menu.findOne({
        where: {
          id: parentId
        }
      });

      assert.notStrictEqual(parentResult, null, '父级菜单不存在！');

      level = parentResult.level + 1;
    }

    ctx.orm().ums_menu.update({
      parent_id: parentId,
      create_time: date.formatDate(),
      title: title,
      level: level,
      sort: sort,
      name: name,
      icon: icon,
      hidden: hidden
    }, {
      where: {
        id: id
      }
    });

    ctx.body = {};
  },
  hiddenMenu: async ctx => {
    let id = ctx.request.body.id || 0;
    let hidden = ctx.request.body.hidden || 0;

    assert.notStrictEqual(id, 0, 'InputParamIsNull');

    ctx.orm().ums_menu.update({
      hidden: hidden
    }, {
      where: {
        id: id
      }
    });

    ctx.body = {};
  },
  delMenu: async ctx => {
    let id = ctx.request.body.id || 0;

    ctx.orm().ums_menu.update({
      is_del: 1
    }, {
      where: {
        id: id
      }
    });

    ctx.body = {};
  },
  /***************************** 日志管理 *************************************/
  getLogs: async ctx => {
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

    let resultCount = await ctx.orm().SuperManagerLoginfo.count({
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
      order: [
        ['addTime', 'DESC']
      ]
    });

    ctx.body = {
      total: resultCount,
      list: result,
      current,
      pageSize
    };
  }
};