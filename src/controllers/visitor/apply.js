/*
 * @Author: Lienren 
 * @Date: 2021-03-21 11:48:45 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-21 22:09:41
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../../utils/comm');
const date = require('../../utils/date');

const statusNameEnum = {
  0: '未知',
  1: '待审核',
  2: '一级审核通过',
  3: '一级审核不通过',
  4: '二级审核通过',
  5: '二级审核不通过',
  6: '已进学校',
  7: '已离开学校',
  999: '作废'
}

module.exports = {
  createApply: async ctx => {
    let openId = ctx.request.body.openId || '';
    let name = ctx.request.body.name || '';
    let idcard = ctx.request.body.idcard || '';
    let phone = ctx.request.body.phone || '';
    let company = ctx.request.body.company || '';
    let campus = ctx.request.body.campus || '';
    let visitTime = ctx.request.body.visitTime || '';
    let visitDay = ctx.request.body.visitDay || 1;
    let car = ctx.request.body.car || '';
    let department = ctx.request.body.department || '';
    let visitReason = ctx.request.body.visitReason || '';
    let img1 = ctx.request.body.img1 || '';
    let img2 = ctx.request.body.img2 || '';

    let code = comm.getGuid();
    let status = 1;

    let admins = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        depName: department,
        isDel: 0
      }
    })

    if (admins && admins.length > 0) {
      let verifyAdminId1 = ',' + admins.map(m => {
        return m.dataValues.id
      }).join(',') + ',';

      let verifyAdminIdName1 = ',' + admins.map(m => {
        return m.dataValues.realName
      }).join(',') + ',';

      let verifyAdminId2 = ',8,';
      let verifyAdminIdName2 = ',8,';

      let result = await ctx.orm().applyInfo.create({
        code,
        openId,
        visitorUserName: name,
        visitorIdcard: idcard,
        visitorPhone: phone,
        visitorCompany: company,
        visitorCampus: campus,
        visitorTime: visitTime,
        visitorDay: visitDay,
        visitorCar: car,
        visitorDepartment: department,
        visitReason,
        img1,
        img2,
        status,
        statusName: statusNameEnum[status],
        verifyAdminId1,
        verifyAdminIdName1,
        verifyAdminIdOver: 0,
        verifyAdminNameOver: '',
        verifyAdminId2: verifyAdminId2,
        verifyAdminIdName2: verifyAdminIdName2,
        verifyAdminIdOver2: 0,
        verifyAdminNameOver2: '',
        isDel: 0
      });

      ctx.body = {
        id: result.id
      }
    } else {
      ctx.body = {
        id: 0
      }
    }
  },
  getApplyList: async ctx => {
    let openId = ctx.request.body.openId || '';
    let verifyAdminId1 = ctx.request.body.verifyAdminId1 || '';
    let verifyAdminId2 = ctx.request.body.verifyAdminId2 || '';
    let status = ctx.request.body.status || [];

    let where = {
      isDel: 0
    }

    if (openId) {
      where.openId = openId
    }

    if (verifyAdminId1) {
      where.verifyAdminId1 = {
        $like: `%,${verifyAdminId1},%`
      }
    }

    if (verifyAdminId2) {
      where.verifyAdminId2 = {
        $like: `%,${verifyAdminId2},%`
      }
    }

    if (status.length > 0) {
      where.status = {
        $in: status
      }
    }

    let result = await ctx.orm().applyInfo.findAll({
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        _visitorTime: m.dataValues.visitorTime,
        visitorTime: date.formatDate(m.dataValues.visitorTime, 'YYYY年MM月DD日')
      }
    });
  },
  getApplyInfo: async ctx => {
    let id = ctx.request.body.id || 0;
    let code = ctx.request.body.code || '';

    let where = {
      isDel: 0
    }

    if (id > 0) {
      where.id = id
    }

    if (code) {
      where.code = code
    }

    let result = await ctx.orm().applyInfo.findOne({
      where
    })

    ctx.body = {
      ...result.dataValues,
      _visitorTime: result.dataValues.visitorTime,
      visitorTime: date.formatDate(result.dataValues.visitorTime, 'YYYY年MM月DD日')
    }
  },
  verifyApply1: async ctx => {
    let id = ctx.request.body.id || 0;
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    let result = await ctx.orm().applyInfo.findOne({
      where: {
        id,
        status: 1,
        verifyAdminId1: {
          $like: `%,${admin.id},%`
        },
        isDel: 0
      }
    })

    if (result) {
      // 更新审核状态
      await ctx.orm().applyInfo.update({
        verifyAdminIdOver: admin.id,
        verifyAdminNameOver: admin.realName,
        status,
        statusName: statusNameEnum[status]
      }, {
        where: {
          id: result.id,
          isDel: 0
        }
      })

      // 记录日志
      ctx.orm().applyLogs.create({
        applyId: result.id,
        adminId: admin.id,
        adminName: admin.realName,
        status,
        statusName: statusNameEnum[status]
      })
    }

    ctx.body = {}
  },
  verifyApply2: async ctx => {
    let id = ctx.request.body.id || 0;
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    let result = await ctx.orm().applyInfo.findOne({
      where: {
        id,
        status: 2,
        verifyAdminId2: {
          $like: `%,${admin.id},%`
        },
        isDel: 0
      }
    })

    if (result) {
      // 更新审核状态
      await ctx.orm().applyInfo.update({
        verifyAdminIdOver2: admin.id,
        verifyAdminNameOver2: admin.realName,
        status,
        statusName: statusNameEnum[status]
      }, {
        where: {
          id: result.id,
          isDel: 0
        }
      })

      // 记录日志
      ctx.orm().applyLogs.create({
        applyId: result.id,
        adminId: admin.id,
        adminName: admin.realName,
        status,
        statusName: statusNameEnum[status]
      })
    }

    ctx.body = {}
  },
  batchVerifyApply1: async ctx => {
    let id = ctx.request.body.id || [];
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    // 更新审核状态
    await ctx.orm().applyInfo.update({
      verifyAdminIdOver: admin.id,
      verifyAdminNameOver: admin.realName,
      status,
      statusName: statusNameEnum[status]
    }, {
      where: {
        id: {
          $in: id
        },
        verifyAdminId1: {
          $like: `%,${admin.id},%`
        },
        isDel: 0
      }
    })

    // 记录日志
    let data = id.map(applyId => {
      return {
        applyId: applyId,
        adminId: admin.id,
        adminName: admin.realName,
        status,
        statusName: statusNameEnum[status]
      };
    });
    ctx.orm().applyLogs.bulkCreate(data);

    ctx.body = {}
  },
  batchVerifyApply2: async ctx => {
    let id = ctx.request.body.id || [];
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    // 更新审核状态
    await ctx.orm().applyInfo.update({
      verifyAdminIdOver2: admin.id,
      verifyAdminNameOver2: admin.realName,
      status,
      statusName: statusNameEnum[status]
    }, {
      where: {
        id: {
          $in: id
        },
        verifyAdminId2: {
          $like: `%,${admin.id},%`
        },
        isDel: 0
      }
    })

    // 记录日志
    let data = id.map(applyId => {
      return {
        applyId: applyId,
        adminId: admin.id,
        adminName: admin.realName,
        status,
        statusName: statusNameEnum[status]
      };
    });
    ctx.orm().applyLogs.bulkCreate(data);

    ctx.body = {}
  }
}