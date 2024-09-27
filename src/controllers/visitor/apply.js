/*
 * @Author: Lienren 
 * @Date: 2021-03-21 11:48:45 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-06-22 11:04:51
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

const userTypeEnum = {
  1: '自主申请',
  2: '批量导入'
}

module.exports = {
  getDepartmentLeader: async ctx => {
    let result = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        loginName: {
          $ne: 'admin'
        },
        userType: '访客系统',
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
    let img4 = ctx.request.body.img4 || '';


    let now = date.getTimeStamp();
    let dateStart = date.timeToTimeStamp(`${visitTime} ${visitTimeNum}:00`);
    let dateEnd = date.timeToTimeStamp(`${visitEndTime} ${visitEndTimeNum}:00`);
    let difValue = (dateEnd - dateStart) / (3600000 * 24);

    // assert.ok(now <= dateStart, '来访时间不能小于当前时间')
    // assert.ok(difValue >= 0, '离校时间不能小于来访时间')
    // assert.ok(difValue <= 6, '来访时间不能超过7日')

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
        verifyAdminId2 = ',' + admin2s.filter(f => f.realName !== '史卫东').map(m => {
          return m.dataValues.id
        }).join(',') + ',';
        verifyAdminIdName2 = ',' + admin2s.filter(f => f.realName !== '史卫东').map(m => {
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
        img4,
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
        isDel: 0,
        userType: 1,
        userTypeName: userTypeEnum[1]
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
            "value": `${result.visitReason}`
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
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {
      isDel: 0
    }

    if (openId) {
      where.openId = openId

      let result = await ctx.orm().applyInfo.findAndCountAll({
        offset: (pageIndex - 1) * pageSize,
        limit: pageSize,
        where,
        order: [
          ['createTime', 'desc']
        ]
      });

      // 过滤超期一级未审核和二级未审核
      let data = result.rows.filter((f) => {
        if (f.dataValues.status === 1 || f.dataValues.status === 2) {
          return date.getTimeStamp() <= date.timeToTimeStamp(date.formatDate(f.dataValues.visitorEndTime, 'YYYY-MM-DD') + ' ' + f.dataValues.visitorEndTimeNum + ':00');
        }

        return true;
      });

      ctx.body = data.map(m => {
        return {
          ...m.dataValues,
          _visitorTime: m.dataValues.visitorTime,
          visitorTime: date.formatDate(m.dataValues.visitorTime, 'YYYY年MM月DD日'),
          _visitorEndTime: m.dataValues.visitorEndTime,
          visitorEndTime: date.formatDate(m.dataValues.visitorEndTime, 'YYYY年MM月DD日'),
          createTime: date.formatDate(m.dataValues.createTime, 'YYYY年MM月DD日 HH:mm:ss'),
          updateTime: date.formatDate(m.dataValues.updateTime, 'YYYY年MM月DD日 HH:mm:ss')
        }
      });
    } else {
      ctx.body = [];
    }
  },
  getApplyVerifyList: async ctx => {
    let openId = ctx.request.body.openId || '';
    let verifyAdminId1 = ctx.request.body.verifyAdminId1 || '';
    let verifyAdminId2 = ctx.request.body.verifyAdminId2 || '';
    let status = ctx.request.body.status || [];
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {
      isDel: 0
    }

    if (openId) {
      where.openId = openId
    }

    if (verifyAdminId1 && !verifyAdminId2) {
      where.verifyAdminId1 = {
        $like: `%,${verifyAdminId1},%`
      }
    }

    /* if (verifyAdminId2) {
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
    } */

    if (status.length > 0) {
      where.status = {
        $in: status
      }
    }

    let result = await ctx.orm().applyInfo.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    // 过滤超期一级未审核和二级未审核
    let data = result.rows.filter((f) => {
      if (f.dataValues.status === 1 || f.dataValues.status === 2) {
        return date.getTimeStamp() <= date.timeToTimeStamp(date.formatDate(f.dataValues.visitorEndTime, 'YYYY-MM-DD') + ' ' + f.dataValues.visitorEndTimeNum + ':00');
      }

      return true;
    });

    ctx.body = data.map(m => {
      return {
        ...m.dataValues,
        _visitorTime: m.dataValues.visitorTime,
        visitorTime: date.formatDate(m.dataValues.visitorTime, 'YYYY年MM月DD日'),
        _visitorEndTime: m.dataValues.visitorEndTime,
        visitorEndTime: date.formatDate(m.dataValues.visitorEndTime, 'YYYY年MM月DD日'),
        createTime: date.formatDate(m.dataValues.createTime, 'YYYY年MM月DD日 HH:mm:ss'),
        updateTime: date.formatDate(m.dataValues.updateTime, 'YYYY年MM月DD日 HH:mm:ss')
      }
    });
  },
  getApplyInfo: async ctx => {
    let id = ctx.request.body.id || 0;
    let code = ctx.request.body.code || '';

    assert.ok(!!id, '请入参错误')
    assert.ok(!!code, '请入参错误')

    let where = {
      id,
      openId: code,
      isDel: 0
    }

    let result = await ctx.orm().applyInfo.findOne({
      where
    })

    ctx.body = {
      ...result.dataValues,
      _visitorTime: result.dataValues.visitorTime,
      visitorTime: date.formatDate(result.dataValues.visitorTime, 'YYYY年MM月DD日'),
      _visitorEndTime: result.dataValues.visitorEndTime,
      visitorEndTime: date.formatDate(result.dataValues.visitorEndTime, 'YYYY年MM月DD日'),
      createTime: date.formatDate(result.dataValues.createTime, 'YYYY年MM月DD日 HH:mm:ss'),
      updateTime: date.formatDate(result.dataValues.updateTime, 'YYYY年MM月DD日 HH:mm:ss')
    }
  },
  getApplyInfoVerify: async ctx => {
    let {id, verifyAdminId1, verifyAdminId2} = ctx.request.body;

    assert.ok(!!id, '请入参错误')

    let where = {
      id,
      isDel: 0
    }

    let result = await ctx.orm().applyInfo.findOne({
      where
    })

    ctx.body = {
      ...result.dataValues,
      _visitorTime: result.dataValues.visitorTime,
      visitorTime: date.formatDate(result.dataValues.visitorTime, 'YYYY年MM月DD日'),
      _visitorEndTime: result.dataValues.visitorEndTime,
      visitorEndTime: date.formatDate(result.dataValues.visitorEndTime, 'YYYY年MM月DD日'),
      createTime: date.formatDate(result.dataValues.createTime, 'YYYY年MM月DD日 HH:mm:ss'),
      updateTime: date.formatDate(result.dataValues.updateTime, 'YYYY年MM月DD日 HH:mm:ss')
    }
  },
  delApplyInfo: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().applyInfo.destroy({
      where: {
        id
      }
    })

    ctx.body = {}
  },
  verifyApply1: async ctx => {
    let id = ctx.request.body.id || 0;
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;
    let veriyReason = ctx.request.body.veriyReason || '';
    let parkingType = ctx.request.body.parkingType || '收费';

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    let result = await ctx.orm().applyInfo.findOne({
      where: {
        id,
        /* status: 1,
        verifyAdminId1: {
          $like: `%,${admin.id},%`
        }, */
        isDel: 0
      }
    })

    if (result) {
      status = status === 2 ? 4 : status
      // 更新审核状态
      await ctx.orm().applyInfo.update({
        verifyAdminIdOver: admin.id,
        verifyAdminNameOver: admin.realName,
        status,
        statusName: statusNameEnum[status],
        veriyReason,
        parkingType
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
                    "value": `${result.visitReason}`
                  },
                  "date4": {
                    "value": date.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm')
                  }
                })
              } else if (result.visitorCampus === '草场门校区' && admin2s[i].realName === '史卫东') {
                wx.sendMessage(admin2s[i].openId, 'B2MGYS99bH2CoXtXgre0Y3GWMINfCAY94qjcILAbqac', null, {
                  "thing1": {
                    "value": `${result.visitorUserName}申请访校`
                  },
                  "thing2": {
                    "value": `${admin.realName}已经审核通过`
                  },
                  "thing3": {
                    "value": `${result.visitReason}`
                  },
                  "date4": {
                    "value": date.formatDate(new Date(), 'YYYY年MM月DD日 HH:mm')
                  }
                })
              }
            }
          }
        }
      } else if (status === 4) {
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
  verifyApply2: async ctx => {
    let id = ctx.request.body.id || 0;
    let adminId = ctx.request.body.adminId || 0;
    let status = ctx.request.body.status || 0;
    let veriyReason = ctx.request.body.veriyReason || '';
    let carInCome = ctx.request.body.carInCome || 1;

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
        /* verifyAdminId2: {
          $like: `%,${admin.id},%`
        }, */
        isDel: 0
      }
    })

    if (result) {
      // 更新审核状态
      await ctx.orm().applyInfo.update({
        verifyAdminIdOver2: admin.id,
        verifyAdminNameOver2: admin.realName,
        status,
        statusName: statusNameEnum[status],
        veriyReason,
        carInCome
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
    let veriyReason = ctx.request.body.veriyReason || '';
    let parkingType = ctx.request.body.parkingType || '收费';

    let admin = await ctx.orm().SuperManagerInfo.findOne({
      where: {
        id: adminId,
        isDel: 0
      }
    })

    status = status === 2 ? 4 : status

    // 更新审核状态
    await ctx.orm().applyInfo.update({
      verifyAdminIdOver: admin.id,
      verifyAdminNameOver: admin.realName,
      status,
      statusName: statusNameEnum[status],
      veriyReason,
      parkingType
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

    if (status === 4) {
      let applyInfos = await ctx.orm().applyInfo.findAll({
        where: {
          id: {
            $in: id
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

    assert.ok(ba !== null, '您没有权限打开访客信息！');

    let where = {
      isDel: 0
    }

    if (code) {
      where.code = code
    }

    let result = await ctx.orm().applyInfo.findOne({
      where
    })

    let now = date.getTimeStamp();
    let startTime = date.timeToTimeStamp(`${date.formatDate(result.visitorTime, 'YYYY-MM-DD')} ${result.visitorTimeNum}:00`);
    let endTime = date.timeToTimeStamp(`${date.formatDate(result.visitorEndTime, 'YYYY-MM-DD')} ${result.visitorEndTimeNum}:00`);

    assert.ok(now > startTime - 7200000, '此次访客信息未到时间！')
    // assert.ok(now < endTime + 3600000, '此次访客信息已过期！')

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
  getApplyFetch: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let visitorCampus = ctx.request.body.visitorCampus || '';
    let visitorCompany = ctx.request.body.visitorCompany || '';
    let visitorDepartment = ctx.request.body.visitorDepartment || '';
    let visitorUserName = ctx.request.body.visitorUserName || '';
    let visitorIdcard = ctx.request.body.visitorIdcard || '';
    let visitorPhone = ctx.request.body.visitorPhone || '';
    let status = ctx.request.body.status || 0;
    let visitorSTime = ctx.request.body.visitorSTime || '';
    let visitorETime = ctx.request.body.visitorETime || '';
    let visitorEndSTime = ctx.request.body.visitorEndSTime || '';
    let visitorEndETime = ctx.request.body.visitorEndETime || '';
    let userType = ctx.request.body.userType || 1;
    let keywords = ctx.request.body.keywords || '';

    let where = `isDel = 0 and userType = ${userType}`;

    if (visitorCampus) {
      where += ` and visitorCampus = '${visitorCampus}'`;
    }

    if (visitorCompany) {
      where += ` and visitorCompany = '${visitorCompany}'`;
    }

    if (visitorDepartment) {
      where += ` and visitorDepartment = '${visitorDepartment}'`;
    }

    if (visitorUserName) {
      where += ` and visitorUserName like '%${visitorUserName}%'`;
    }

    if (visitorIdcard) {
      where += ` and visitorIdcard = '${visitorIdcard}'`;
    }

    if (visitorPhone) {
      where += ` and visitorPhone = '${visitorPhone}'`;
    }

    if (status) {
      where += ` and status = ${status}`;
    }

    if (visitorSTime && visitorETime) {
      where += ` and concat(date_format(visitorTime,'%Y-%m-%d'), ' ', visitorTimeNum, ':00') between '${visitorSTime}' and '${visitorETime}'`
    }

    if (visitorEndSTime && visitorEndETime) {
      where += ` and concat(date_format(visitorEndTime,'%Y-%m-%d'), ' ', visitorEndTimeNum, ':00') between '${visitorSTime}' and '${visitorETime}'`
    }

    if (keywords) {
      where += ` and (visitorCompany like '%${keywords}%' or visitorCar like '%${keywords}%')`
    }

    let applyCount = await ctx.orm().query(`select count(1) num from applyInfo where ${where}`);

    let applyList = await ctx.orm().query(`
    select *,
    (select createTime from baLogs where applyId = a.id order by createTime desc limit 1) inTime, 
    (select count(1) from baLogs where applyId = a.id) inCount 
    from (
    select * from applyInfo 
    where ${where} 
    order by createTime desc limit ${pageSize} offset ${(pageIndex - 1) * pageSize}) a`);

    ctx.body = {
      total: applyCount[0].num,
      list: applyList.map(m => {
        return {
          ...m,
          _visitorTime: m.visitorTime,
          visitorTime: date.formatDate(m.visitorTime, 'YYYY年MM月DD日'),
          _visitorEndTime: m.visitorEndTime,
          visitorEndTime: date.formatDate(m.visitorEndTime, 'YYYY年MM月DD日'),
          inTime: m.inTime ? date.formatDate(m.inTime, 'YYYY年MM月DD日 HH:mm:ss') : '',
          createTime: date.formatDate(m.createTime, 'YYYY年MM月DD日 HH:mm:ss'),
          updateTime: date.formatDate(m.updateTime, 'YYYY年MM月DD日 HH:mm:ss')
        }
      }),
      pageIndex,
      pageSize
    };
  },
  importApply: async ctx => {
    let userInfo = ctx.request.body.userInfo || [];
    let company = ctx.request.body.company || '';
    let campus = ctx.request.body.campus || '';
    let visitTime = ctx.request.body.visitTime || '';
    let visitTimeNum = ctx.request.body.visitTimeNum || '';
    let visitEndTime = ctx.request.body.visitEndTime || '';
    let visitEndTimeNum = ctx.request.body.visitEndTimeNum || '';
    let visitReason = ctx.request.body.visitReason || '';
    let parkingType = ctx.request.body.parkingType || '收费';

    let visitDay = 1;
    let car = '无';
    let department = '保卫处';
    let img1 = '';
    let img2 = '';
    let img3 = '';
    let status = 4;
    let userType = 2;

    let verifyAdminId1 = ',139,'
    let verifyAdminIdName1 = ',宋惠贤,'
    let verifyAdminIdOver = 139;
    let verifyAdminNameOver = '宋惠贤';
    let verifyAdminId2 = ',139,';
    let verifyAdminIdName2 = ',宋惠贤,';
    let verifyAdminIdOver2 = 139;
    let verifyAdminNameOver2 = '宋惠贤';

    let scope = date.dataScope(visitTime, visitEndTime);
    if (scope && scope.length > 1) {
      visitDay = scope.length;
    }

    // 添加角色菜单数据
    if (userInfo && userInfo.length > 0) {
      let data = userInfo.map(user => {
        let code = comm.getGuid();
        let openId = comm.getGuid();
        return {
          code,
          openId,
          visitorUserName: user.name,
          visitorIdcard: user.idcard,
          visitorPhone: user.phone,
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
          verifyAdminIdOver,
          verifyAdminNameOver,
          verifyAdminId2,
          verifyAdminIdName2,
          verifyAdminIdOver2,
          verifyAdminNameOver2,
          isDel: 0,
          parkingType,
          userType,
          userTypeName: userTypeEnum[userType]
        };
      });
      await ctx.orm().applyInfo.bulkCreate(data);

      for (let i = 0, j = data.length; i < j; i++) {
        console.log(`data[${i}].code:`, data[i].code)
        wx.getwxacode(data[i].code, `pages/visitor/applyCheck?code=${data[i].code}`, {
          "r": 0,
          "g": 0,
          "b": 0
        })
        await sleep(200);
      }
    }

    ctx.body = {};
  },
  applyLogs: async ctx => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().applyLogs.findAll({
      where: {
        applyId: id
      },
      order: [['createTime', 'desc']]
    })

    ctx.body = result;
  },
  applyBaLogs: async ctx => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().baLogs.findAll({
      where: {
        applyId: id
      },
      order: [['createTime', 'desc']]
    })

    ctx.body = result;
  },
  testApply: async ctx => {
    let result = await ctx.orm().applyInfo.findAll({
      where: {
        userType: 2,
        isDel: 0
      }
    });

    for (let i = 0, j = result.length; i < j; i++) {
      console.log(`result[${i}].code:`, result[i].code)
      wx.getwxacode(result[i].code, `pages/visitor/applyCheck?code=${result[i].code}`, {
        "r": 0,
        "g": 0,
        "b": 0
      })

      await sleep(200);
    }

    ctx.body = {};
  },
  createBa: async ctx => {
    let id = ctx.request.body.id || 0;

    let applyInfo = await ctx.orm().applyInfo.findOne({
      where: {
        id
      }
    });

    assert.ok(applyInfo, '信息不存在！');

    if (applyInfo) {
      let ba = await ctx.orm().baInfo.findOne({
        where: {
          openId: applyInfo.openId
        }
      });

      assert.ok(!ba, '信息已存在，请勿重复添加！');

      await ctx.orm().baInfo.create({
        openId: applyInfo.openId,
        baName: applyInfo.visitorUserName,
        baPhone: applyInfo.visitorPhone
      });
    }

    ctx.body = {};
  },
  getBaList: async ctx => {
    let baName = ctx.request.body.baName || '';
    let baPhone = ctx.request.body.baPhone || '';
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {}

    if (baName) {
      where.baName = {
        $like: `%${baName}%`
      }
    }

    if (baPhone) {
      where.baPhone = {
        $like: `%${baPhone}%`
      }
    }

    let result = await ctx.orm().baInfo.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          createTime: date.formatDate(m.dataValues.createTime, 'YYYY年MM月DD日 HH:mm:ss')
        }
      }),
      pageIndex,
      pageSize
    }
  },
  delBa: async ctx => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().baInfo.destroy({
      where: {
        id
      }
    })

    ctx.body = {}
  },
  getApplyBlackInfo: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { kw, kwType } = ctx.request.body;

    let where = {}

    if (kw) {
      where.kw = {
        $like: `%${kw}%`
      }
    }

    if (kwType) {
      where.kwType = kwType
    }

    let result = await ctx.orm().applyBlackInfo.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['createTime', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitApplyBlackInfo: async ctx => {
    let { id, kw, kwType } = ctx.request.body;

    if (id) {
      await ctx.orm().applyBlackInfo.update({
        kw,
        kwType
      }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().applyBlackInfo.create({
        kw,
        kwType
      })
    }

    ctx.body = {}
  },
  delApplyBlackInfo: async ctx => {
    let { id } = ctx.request.body

    if (id) {
      await ctx.orm().applyBlackInfo.destroy({
        where: {
          id
        }
      })
    }

    ctx.body = {}
  }
}

function sleep (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
