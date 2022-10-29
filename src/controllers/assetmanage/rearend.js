/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2022-10-29 11:48:26
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/assetmanage/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const moment = require('moment');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const excel = require('../../utils/excel');

module.exports = {
  getHouses: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sn, street, community, streets, communitys, a4, a5, a7, a13, a14, remark, createTime, modifyTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, sn && { sn })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, a4 && { a4 })
    Object.assign(where, a5 && { a5 })
    Object.assign(where, a7 && { a7 })
    Object.assign(where, a13 && { a13 })
    Object.assign(where, a14 && { a14 })

    if (streets && streets.length > 0) {
      where.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where.community = {
        $in: communitys
      }
    }

    if (remark) {
      where.remark = {
        $like: `%${remark}%`
      };
    }

    if (createTime && createTime.length === 2) {
      where.createTime = { $between: createTime }
    }

    if (modifyTime && modifyTime.length === 2) {
      where.modifyTime = { $between: modifyTime }
    }

    let result = await ctx.orm().info_house.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['id', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  delHouse: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_house.destroy({
      where: {
        id: id
      }
    })

    await ctx.orm().info_house_having.destroy({
      where: {
        hid: id
      }
    })

    await ctx.orm().info_house_yearrent.destroy({
      where: {
        hid: id
      }
    })

    ctx.body = { }
  },
  getHouseHaving: async ctx => {
    let { hid } = ctx.request.body;

    let where = {
      a9: {
        $gte: date.formatDate()
      }
    };

    Object.assign(where, hid && { hid })

    let result = await ctx.orm().info_house_having.findAll({
      where
    })

    let yearrent = null
    if (result && result.length > 0) {
      yearrent = await ctx.orm().info_house_yearrent.findAll({
        where: {
          hid: hid,
          hhid: {
            $in: result.map(m => {
              return m.dataValues.id
            })
          }
        }
      })
    }

    ctx.body = result.map(m => {
      let fy = yearrent && yearrent.length > 0 ? yearrent.filter(f => f.hid === m.dataValues.hid && f.hhid === m.dataValues.id) : []
      return {
        ...m.dataValues,
        yearrent: fy
      }
    })
  },
  getHouseHavings: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {
      a9: {
        $gte: date.formatDate()
      }
    };

    let result = await ctx.orm().info_house_having.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['id', 'desc']]
    });

    let yearrent = null
    if (result && result.rows.length > 0) {
      yearrent = await ctx.orm().info_house_yearrent.findAll({
        where: {
          hhid: {
            $in: result.rows.map(m => {
              return m.dataValues.id
            })
          }
        }
      })
    }

    let house = null
    if (result && result.rows.length > 0) {
      house = await ctx.orm().info_house.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.hid
            })
          }
        }
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let fy = yearrent && yearrent.length > 0 ? yearrent.filter(f => f.hid === m.dataValues.hid && f.hhid === m.dataValues.id) : []
        let fh = house && house.length > 0 ? house.find(f => f.id === m.dataValues.hid) : {}
        return {
          ...m.dataValues,
          yearrent: fy,
          house: fh
        }
      }),
      pageIndex,
      pageSize
    }
  },
  delHouseHaving: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_house_having.destroy({
      where: {
        id: id
      }
    })

    await ctx.orm().info_house_yearrent.destroy({
      where: {
        hhid: id
      }
    })

    ctx.body = {}
  },
  submitHouse: async ctx => {
    let { id, sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark } = ctx.request.body;

    if (id && id > 0) {
      let findHouse = await ctx.orm().info_house.findOne({
        where: {
          sn: sn,
          id: {
            $en: id
          },
          isDel: 0
        }
      })
      assert.ok(findHouse === null, '此资产编号已存在，请更换！')

      await ctx.orm().info_house.update({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark
      }, {
        where: {
          id,
          isDel: 0
        }
      })
    } else {
      await ctx.orm().info_house.create({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, street, community, remark,
        isDel: 0
      })
    }

    ctx.body = {}
  },
  submitHouseHaving: async ctx => {
    let { id, hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, yearrent } = ctx.request.body;

    let now = date.getTimeStamp()
    if (id && id > 0) {
      // 计算a3 年租金
      // 计算a6 下一期收款提醒
      if (a1 === '出租') {
        yearrent.map(m => {
          if (date.timeToTimeStamp(m.a1) <= now && now <= date.timeToTimeStamp(m.a2)) {
            a3 = m.a3
          }
        })

        // 删除已有的租赁信息
        await ctx.orm().info_house_yearrent.destroy({
          where: {
            hid: hid,
            hhid: id
          }
        })

        if (yearrent && yearrent.length > 0) {
          let data = yearrent.map(m => {
            return {
              ...m,
              hid: hid,
              hhid: id,
              a4: a4,
              a5: a5
            };
          });
          ctx.orm().info_house_yearrent.bulkCreate(data);
        }
      }

      await ctx.orm().info_house_having.update({
        hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15
      }, {
        where: {
          id
        }
      })
    } else {
      // 计算a3 年租金
      // 计算a6 下一期收款提醒
      if (a1 === '出租') {
        yearrent.map(m => {
          if (date.timeToTimeStamp(m.a1) <= now && now <= date.timeToTimeStamp(m.a2)) {
            a3 = m.a3
          }
        })
      }

      let having = await ctx.orm().info_house_having.create({
        hid, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15
      })

      if (having.id && having.id > 0) {
        if (yearrent && yearrent.length > 0) {

          let data = yearrent.map(m => {
            return {
              ...m,
              hid: having.hid,
              hhid: having.id,
              a4: having.a4,
              a5: having.a5
            };
          });
          ctx.orm().info_house_yearrent.bulkCreate(data);
        }
      }
    }

    ctx.body = {}
  },
  getProjectCode: async ctx => {
    let project = await ctx.orm().info_projects.findOne({
      where: {
        create_time: {
          $between: [
            moment(new Date()).startOf('month').format('YYYY-MM-DD 00:00:00'),
            moment(new Date()).endOf('month').format('YYYY-MM-DD 23:59:59')]
        }
      },
      order: [['create_time', 'desc']]
    })

    if (project) {
      let number = parseInt(project.pro_code.substring(6)) + 1
      number = number ? number : 1

      ctx.body = {
        pro_code: `${date.formatDate(new Date(), 'YYYYMM')}` + (number > 99 ? `${number}` : number > 9 ? `0${number}` : `00${number}`)
      }
    } else {
      ctx.body = {
        pro_code: `${date.formatDate(new Date(), 'YYYYMM')}001`
      }
    }
  },
  submitProjects: async ctx => {
    let { id, pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let project = await ctx.orm().info_projects.findOne({
        where: {
          id
        }
      })

      assert.ok(!!project, '项目不存在!')

      await ctx.orm().info_projects.update({
        pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, manage_id, manage_user
      }, {
        where: {
          id: project.id
        }
      })

      project = await ctx.orm().info_projects.findOne({
        where: {
          id: project.id
        }
      })

      await ctx.orm().info_project_update.create({
        sub_title: '更新项目资料',
        pro_id: project.id,
        pro_sub_verify: JSON.stringify(project.dataValues)
      })
    } else {
      await ctx.orm().info_projects.create({
        pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source,
        a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21,
        manage_id, manage_user
      })
    }

    ctx.body = {}
  },
  getProjects: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { pro_code, pro_name, pro_level, pro_status, pro_type, pro_source, verify_status, verify_num, create_time, update_time } = ctx.request.body;

    let where = {};

    Object.assign(where, pro_code && { pro_code })
    Object.assign(where, pro_name && { pro_name })
    Object.assign(where, pro_level && { pro_level })
    Object.assign(where, pro_type && { pro_type })
    Object.assign(where, pro_source && { pro_source })
    Object.assign(where, verify_status && { verify_status })
    Object.assign(where, verify_num && { verify_num })

    if (pro_status && pro_status.length > 0) {
      where.pro_status = { $in: pro_status }
    }

    if (create_time && create_time.length === 2) {
      where.create_time = { $between: create_time }
    }

    if (update_time && update_time.length === 2) {
      where.update_time = { $between: update_time }
    }

    let result = await ctx.orm().info_projects.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['id', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitProgress: async ctx => {
    let { id, pro_id, p_type, p_level, p_status, p_source, p_mtype, a1, a2, a2stime, a2etime, a3, a3stime, a3etime, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let iprogress = await ctx.orm().info_progress.findOne({
        where: {
          id
        }
      })

      assert.ok(!!iprogress, '项目进展不存在!')

      await ctx.orm().info_progress.update({
        p_type, p_level, p_status, p_source, p_mtype, a1, a2, a2stime, a2etime, a3, a3stime, a3etime, manage_id, manage_user
      }, {
        where: {
          id: iprogress.id
        }
      })
    } else {
      await ctx.orm().info_progress.create({
        pro_id, p_type, p_level, p_status, p_source, p_mtype,
        a1, a2, a2stime, a2etime, a3, a3stime, a3etime,
        manage_id, manage_user
      })
    }
  },
  getProgress: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { pro_id } = ctx.request.body;

    let where = {};

    Object.assign(where, pro_id && { id: pro_id })

    let projects = await ctx.orm().info_projects.findAll({
      attributes: ['id'],
      where
    })

    let where1 = {};
    Object.assign(where1, projects.length > 0 && {
      pro_id: {
        $in: projects.map(m => {
          return m.dataValues.id
        })
      }
    })

    let result = await ctx.orm().info_progress.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where: where1,
      order: [['id', 'desc']]
    })

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  searchProgress: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let result = await ctx.orm().info_progress.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'desc']]
    })

    let projects = []
    if (result && result.rows && result.rows.length > 0) {
      projects = await ctx.orm().info_projects.findAll({
        where: {
          id: {
            $in: result.rows.map(m => {
              return m.dataValues.pro_id
            })
          }
        }
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let project = projects.find(f => f.dataValues.id === m.dataValues.pro_id)
        return {
          ...m.dataValues,
          project: project
        }
      }),
      pageIndex,
      pageSize
    }
  },
  submitProjectGoInVerify: async ctx => {
    let { id, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, verify_sub_manageid, verify_sub_manageuser } = ctx.request.body;

    let project = await ctx.orm().info_projects.findOne({
      where: {
        id,
        pro_status: '投前跟进'
      }
    })

    assert.ok(!!project, '项目不存在!')

    let pro_status = '投后审核中'
    let verify_status = '一审中'
    let verify_num = b1 === '盛世融合' ? 2 : 3

    await ctx.orm().info_projects.update({
      pro_status, verify_status, verify_num, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, verify_sub_manageid, verify_sub_manageuser
    }, {
      where: {
        id: project.id
      }
    })

    project = await ctx.orm().info_projects.findOne({
      where: {
        id: project.id
      }
    })

    await ctx.orm().info_project_update.create({
      sub_title: '提交审核',
      pro_id: project.id,
      pro_sub_verify: JSON.stringify(project.dataValues)
    })

    ctx.body = {}
  },
  submitProjectVerify: async ctx => {
    let { id, verify_num, verify, verify_manage_id, verify_manage_user, verify_remark } = ctx.request.body;

    let project = await ctx.orm().info_projects.findOne({
      where: {
        id,
        pro_status: '投后审核中'
      }
    })

    assert.ok(!!project, '项目不存在!')

    let sub_title = ''
    let update = {}
    if (verify_num === 1) {
      assert.ok(project.verify_status === '一审中', '项目不存在!')
      sub_title = verify === '通过' ? '投后一审通过' : '投后一审不通过'

      update = {
        pro_status: verify === '通过' ? '投后审核中' : '投前跟进',
        verify_status: verify === '通过' ? '二审中' : '一审不通过',
        verify1: verify,
        verify1_manage_id: verify_manage_id,
        verify1_manage_user: verify_manage_user,
        verify1_time: date.formatDate(),
        verify1_remark: verify_remark
      }
    } else if (verify_num === 2) {
      assert.ok(project.verify_status === '二审中', '项目不存在!')
      sub_title = verify === '通过' ? '投后二审通过' : '投后二审不通过'

      if (project.verify_num === 2) {
        update = {
          pro_status: verify === '通过' ? '投后管理' : '投前跟进',
          verify_status: verify === '通过' ? '审核通过' : '二审不通过',
          verify2: verify,
          verify2_manage_id: verify_manage_id,
          verify2_manage_user: verify_manage_user,
          verify2_time: date.formatDate(),
          verify2_remark: verify_remark
        }
      } else {
        update = {
          pro_status: verify === '通过' ? '投后审核中' : '投前跟进',
          verify_status: verify === '通过' ? '三审中' : '二审不通过',
          verify2: verify,
          verify2_manage_id: verify_manage_id,
          verify2_manage_user: verify_manage_user,
          verify2_time: date.formatDate(),
          verify2_remark: verify_remark
        }
      }
    } else if (verify_num === 3) {
      assert.ok(project.verify_status === '三审中', '项目不存在!')
      sub_title = verify === '通过' ? '投后三审通过' : '投后三审不通过'

      update = {
        pro_status: verify === '通过' ? '投后管理' : '投前跟进',
        verify_status: verify === '通过' ? '审核通过' : '三审不通过',
        verify3: verify,
        verify3_manage_id: verify_manage_id,
        verify3_manage_user: verify_manage_user,
        verify3_time: date.formatDate(),
        verify3_remark: verify_remark
      }
    }

    await ctx.orm().info_projects.update(update, {
      where: {
        id: project.id
      }
    })

    project = await ctx.orm().info_projects.findOne({
      where: {
        id: project.id
      }
    })

    await ctx.orm().info_project_update.create({
      sub_title: sub_title,
      pro_id: project.id,
      pro_sub_verify: JSON.stringify(project.dataValues)
    })
  },
  submitProjectSub: async ctx => {
    let { id, pro_id, a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, remark, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let projectsSub = await ctx.orm().info_projects_sub.findOne({
        where: {
          id
        }
      })

      assert.ok(!!projectsSub, '项目进展不存在!')

      await ctx.orm().info_projects_sub.update({
        a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, remark, manage_id, manage_user
      }, {
        where: {
          id: projectsSub.id
        }
      })
    } else {
      await ctx.orm().info_projects_sub.create({
        pro_id, a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, remark, manage_id, manage_user
      })
    }
  },
  getProjectSub: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { pro_id } = ctx.request.body;

    let where = {};

    Object.assign(where, pro_id && { pro_id })

    let result = await ctx.orm().info_projects_sub.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where: where,
      order: [['id', 'desc']]
    })

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
};
