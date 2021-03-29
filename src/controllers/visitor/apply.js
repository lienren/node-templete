/*
 * @Author: Lienren 
 * @Date: 2021-03-21 11:48:45 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-30 07:42:45
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const wx = require('./wx');

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
  getDepartmentLeader: async ctx => {
    let result = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        loginName: {
          $ne: 'admin'
        },
        state: 1,
        isDel: 0
      }
    });

    ctx.body = result.map(m => {
      return {
        depName: m.dataValues.depName,
        realName: m.dataValues.realName
      }
    })
  },
  createApply: async ctx => {
    let openId = ctx.request.body.openId || '';
    let name = ctx.request.body.name || '';
    let idcard = ctx.request.body.idcard || '';
    let phone = ctx.request.body.phone || '';
    let company = ctx.request.body.company || '';
    let campus = ctx.request.body.campus || '';
    let visitTime = ctx.request.body.visitTime || '';
    let visitTimeNum = ctx.request.body.visitTimeNum || '';
    let visitEndTime = ctx.request.body.visitEndTime || '';
    let visitEndTimeNum = ctx.request.body.visitEndTimeNum || '';
    let visitDay = ctx.request.body.visitDay || 1;
    let car = ctx.request.body.car || '';
    let department = ctx.request.body.department || '';
    let departmentLeader = ctx.request.body.departmentLeader || '';
    let visitReason = ctx.request.body.visitReason || '';
    let img1 = ctx.request.body.img1 || '';
    let img2 = ctx.request.body.img2 || '';
    let img3 = ctx.request.body.img3 || '';

    let scope = date.dataScope(visitTime, visitEndTime);
    if (scope && scope.length > 1) {
      visitDay = scope.length
    }

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        depName: department,
        realName: departmentLeader,
        isDel: 0
      }
    })

    let admin2s = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        depName: '保卫处',
        isDel: 0
      }
    })

    if (admin && admin2s && admin2s.length > 0) {
      let code = comm.getGuid();
      let status = 1;

      let verifyAdminId1 = ''
      let verifyAdminIdName1 = ''
      let verifyAdminIdOver = 0;
      let verifyAdminNameOver = '';

      let verifyAdminId2 = '';
      let verifyAdminIdName2 = '';

      if (campus === '石湫校区') {
        verifyAdminId2 = ',' + admin2s.filter(f => f.realName !== '马隽').map(m => {
          return m.dataValues.id
        }).join(',') + ',';
        verifyAdminIdName2 = ',' + admin2s.filter(f => f.realName !== '马隽').map(m => {
          return m.dataValues.realName
        }).join(',') + ',';
      } else if (campus === '草场门校区') {
        verifyAdminId2 = ',' + admin2s.filter(f => f.realName !== '宋惠贤').map(m => {
          return m.dataValues.id
        }).join(',') + ',';
        verifyAdminIdName2 = ',' + admin2s.filter(f => f.realName !== '宋惠贤').map(m => {
          return m.dataValues.realName
        }).join(',') + ',';
      }

      if (department === '保卫处' || department === '校级访客通道') {
        status = 2;
        verifyAdminId1 = `,${admin.id},`;
        verifyAdminIdName1 = `,${admin.realName},`;
        verifyAdminIdOver = admin.id;
        verifyAdminNameOver = admin.realName;

        verifyAdminId2 = `,${admin.id},`;
        verifyAdminIdName2 = `,${admin.realName},`;
      } else {
        verifyAdminId1 = `,${admin.id},`;
        verifyAdminIdName1 = `,${admin.realName},`
      }

      let result = await ctx.orm().applyInfo.create({
        code,
        openId,
        visitorUserName: name,
        visitorIdcard: idcard,
        visitorPhone: phone,
        visitorCompany: company,
        visitorCampus: campus,
        visitorTime: visitTime,
        visitorEndTime: visitEndTime,
        visitorTimeNum: visitTimeNum,
        visitorEndTimeNum: visitEndTimeNum,
        visitorDay: visitDay,
        visitorCar: car,
        visitorDepartment: department,
        visitReason,
        img1,
        img2,
        img3,
        status,
        statusName: statusNameEnum[status],
        verifyAdminId1,
        verifyAdminIdName1,
        verifyAdminIdOver: verifyAdminIdOver,
        verifyAdminNameOver: verifyAdminNameOver,
        verifyAdminId2: verifyAdminId2,
        verifyAdminIdName2: verifyAdminIdName2,
        verifyAdminIdOver2: 0,
        verifyAdminNameOver2: '',
        isDel: 0
      });

      if (admin.openId) {
        wx.sendMessage(admin.openId, 'B2MGYS99bH2CoXtXgre0Y3GWMINfCAY94qjcILAbqac', null, {
          "thing1": {
            "value": `${result.visitorUserName}申请访校`
          },
          "thing2": {
            "value": "已提交访校申请"
          },
          "thing3": {
            "value": result.visitReason
          },
          "date4": {
            "value": date.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm')
          }
        })
      }

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
      let admin = ctx.orm().SuperManagerInfo.findOne({
        where: {
          id: parseInt(verifyAdminId2),
          depName: '保卫处',
          isDel: 0
        }
      })

      if (admin != null && status.includes(4)) {
        where.$or = [{
          visitorDepartment: '校级访客通道'
        }, {
          verifyAdminId2: {
            $like: `%,${verifyAdminId2},%`
          }
        }]
      } else {
        where.verifyAdminId2 = {
          $like: `%,${verifyAdminId2},%`
        }
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
        visitorTime: date.formatDate(m.dataValues.visitorTime, 'YYYY年MM月DD日'),
        _visitorEndTime: m.dataValues.visitorEndTime,
        visitorEndTime: date.formatDate(m.dataValues.visitorEndTime, 'YYYY年MM月DD日')
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
      visitorTime: date.formatDate(result.dataValues.visitorTime, 'YYYY年MM月DD日'),
      _visitorEndTime: result.dataValues.visitorEndTime,
      visitorEndTime: date.formatDate(result.dataValues.visitorEndTime, 'YYYY年MM月DD日')
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

      if (status === 2) {
        // 审核通过，提示二级审核人
        let verifyAdminId2 = result.verifyAdminId2.substring(1, result.verifyAdminId2.length - 1).split(',');
        let admin2s = await ctx.orm().SuperManagerInfo.findAll({
          where: {
            id: {
              $in: verifyAdminId2
            },
            state: 1,
            isDel: 0
          }
        });

        if (admin2s && admin2s.length > 0) {
          for (let i = 0, j = admin2s.length; i < j; i++) {
            if (admin2s[i].openId) {
              if (result.visitorCampus === '石湫校区' && admin2s[i].realName === '宋惠贤') {
                wx.sendMessage(admin2s[i].openId, 'B2MGYS99bH2CoXtXgre0Y3GWMINfCAY94qjcILAbqac', null, {
                  "thing1": {
                    "value": `${result.visitorUserName}申请访校`
                  },
                  "thing2": {
                    "value": `${admin.realName}已经审核通过`
                  },
                  "thing3": {
                    "value": result.visitReason
                  },
                  "date4": {
                    "value": date.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm')
                  }
                })
              } else if (result.visitorCampus === '草场门校区' && admin2s[i].realName === '马隽') {
                wx.sendMessage(admin2s[i].openId, 'B2MGYS99bH2CoXtXgre0Y3GWMINfCAY94qjcILAbqac', null, {
                  "thing1": {
                    "value": `${result.visitorUserName}申请访校`
                  },
                  "thing2": {
                    "value": `${admin.realName}已经审核通过`
                  },
                  "thing3": {
                    "value": result.visitReason
                  },
                  "date4": {
                    "value": date.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm')
                  }
                })
              }
            }
          }
        }
      }
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

      if (status === 4) {
        if (result.openId) {
          wx.sendMessage(result.openId, 'qfFp3pDFc_sfmLJPXzfhF5nOYv2begNN4QVx9iRh9ko', null, {
            "thing1": {
              "value": `${result.visitorUserName}`
            },
            "thing2": {
              "value": `访客登记预约成功`
            },
            "character_string3": {
              "value": result.id
            },
            "time4": {
              "value": `${date.formatDate(result.visitorTime, 'YYYY年MM月DD日')} ${result.visitorTimeNum}`
            }
          })
        }

        if (result.visitorDepartment === '校级访客通道') {
          wx.getwxacode(result.code, `pages/visitor/applyCheck?code=${result.code}`, {
            "r": 103,
            "g": 194,
            "b": 58
          })
        } else {
          wx.getwxacode(result.code, `pages/visitor/applyCheck?code=${result.code}`, {
            "r": 0,
            "g": 0,
            "b": 0
          })
        }
      }
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

    if (status === 4) {
      let applyInfos = await ctx.orm().applyInfo.findAll({
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
      if (applyInfos && applyInfos.length > 0) {
        for (let i = 0, j = applyInfos.length; i < j; i++) {
          if (applyInfos[i].visitorDepartment === '校级访客通道') {
            wx.getwxacode(applyInfos[i].code, `pages/visitor/applyCheck?code=${applyInfos[i].code}`, {
              "r": 103,
              "g": 194,
              "b": 58
            })
          } else {
            wx.getwxacode(applyInfos[i].code, `pages/visitor/applyCheck?code=${applyInfos[i].code}`, {
              "r": 0,
              "g": 0,
              "b": 0
            })
          }
        }
      }
    }

    ctx.body = {}
  },
  getApplyInfoByBA: async ctx => {
    let openid = ctx.request.body.openid || '';
    let code = ctx.request.body.code || '';

    let ba = await ctx.orm().baInfo.findOne({
      where: {
        openId: openid
      }
    })

    assert.ok(ba !== null, '无权读取信息！');

    let where = {
      isDel: 0
    }

    if (code) {
      where.code = code
    }

    let result = await ctx.orm().applyInfo.findOne({
      where
    })

    // 记录打开日志
    ctx.orm().baLogs.create({
      baId: ba.id,
      baName: ba.baName,
      applyId: result.id
    })

    ctx.body = {
      ...result.dataValues,
      _visitorTime: result.dataValues.visitorTime,
      visitorTime: date.formatDate(result.dataValues.visitorTime, 'YYYY年MM月DD日'),
      _visitorEndTime: result.dataValues.visitorEndTime,
      visitorEndTime: date.formatDate(result.dataValues.visitorEndTime, 'YYYY年MM月DD日')
    }
  },
}