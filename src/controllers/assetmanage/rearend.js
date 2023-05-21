/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2023-05-18 10:59:26
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
const http = require('../../utils/http');

module.exports = {
  getHouses: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sn, street, community, streets, communitys, houseType, a1, a4, a5, a6, a7, a8, a9, a10, a11, a13, a14, a201, a202, a301, a302, a21, h_a1, h_a2, h_a301, h_a302, h_a701, h_a702, remark, notid, createTime, modifyTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    Object.assign(where, notid && { id: { $notIn: notid } })
    Object.assign(where, sn && { sn })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, a4 && { a4 })
    Object.assign(where, a5 && { a5 })
    Object.assign(where, a6 && { a6 })
    Object.assign(where, a7 && { a7 })
    Object.assign(where, a11 && { a11 })
    Object.assign(where, a13 && { a13 })
    Object.assign(where, a14 && { a14 })
    Object.assign(where, a21 && { a21 })
    Object.assign(where, houseType && { houseType })

    let where1 = {}
    Object.assign(where1, h_a1 && { a1: h_a1 })
    Object.assign(where1, h_a2 && { a2: { $like: `%${h_a2}%` } })
    if (h_a301 && h_a302) {
      where1.a3 = {
        $between: [h_a301, h_a302]
      }
    }
    if (h_a701 !== undefined && h_a702) {
      where1.a7 = {
        $between: [h_a701, h_a702]
      }
    }
    if (Object.keys(where1).length > 0) {
      let havings = await ctx.orm().info_house_having.findAll({
        attributes: ['hid'],
        where: where1
      })

      if (havings && havings.length > 0) {
        where.id = {
          $in: havings.map(m => {
            return m.dataValues.hid
          })
        }
      }
    }

    if (a201 && a202) {
      where.a2 = {
        $between: [a201, a202]
      }
    }

    if (a301 && a302) {
      where.a3 = {
        $between: [a301, a302]
      }
    }

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

    if (a1) {
      where.a1 = {
        $like: `%${a1}%`
      };
    }

    if (a8) {
      where.a8 = {
        $like: `%${a8}%`
      };
    }

    if (a9) {
      where.a9 = {
        $like: `%${a9}%`
      };
    }

    if (a10) {
      where.a10 = {
        $like: `%${a10}%`
      };
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

    let havings = null
    if (result && result.rows.length > 0) {
      havings = await ctx.orm().info_house_having.findAll({
        where: {
          hid: result.rows.map(m => {
            return m.dataValues.id
          }),
          ...where1
        }
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let h = havings && havings.length > 0 ? havings.filter(f => f.hid === m.dataValues.id) : []

        return {
          ...m.dataValues,
          having: h
        }
      }),
      pageIndex,
      pageSize
    }
  },
  getHousesPlus: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sn, street, community, streets, communitys, houseType, a1, a4, a5, a6, a7, a8, a9, a10, a11, a13, a14, a201, a202, a301, a302, a21, h_a1, h_a2, h_a301, h_a302, h_a501, h_a502, h_a701, h_a702, remark, createTime, modifyTime } = ctx.request.body;

    let where = {
      isDel: 0
    };

    let where1 = {}

    Object.assign(where, sn && { sn })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, a4 && { a4 })
    Object.assign(where, a5 && { a5 })
    Object.assign(where, a6 && { a6 })
    Object.assign(where, a7 && { a7 })
    Object.assign(where, a11 && { a11 })
    Object.assign(where, a13 && { a13 })
    Object.assign(where, a14 && { a14 })
    Object.assign(where, a21 && { a21 })
    Object.assign(where, houseType && { houseType })

    Object.assign(where1, h_a1 && { a1: h_a1 })
    Object.assign(where1, h_a2 && { a2: { $like: `%${h_a2}%` } })
    if (h_a301 && h_a302) {
      where1.a3 = {
        $between: [h_a301, h_a302]
      }
    }
    if (h_a501 && h_a502) {
      where1.a5 = {
        $between: [h_a501, h_a502]
      }
    }
    if (h_a701 !== undefined && h_a702) {
      where1.a7 = { $between: [h_a701, h_a702] }
    }
    if (Object.keys(where1).length > 0) {
      let hs = await ctx.orm().info_house_having.findAll({
        where: {
          ...where1
        }
      })
      if (hs && hs.length > 0) {
        where.id = {
          $in: hs.map(m => {
            return m.dataValues.hid
          })
        }
      }
    }

    if (a201 && a202) {
      where.a2 = {
        $between: [a201, a202]
      }
    }

    if (a301 && a302) {
      where.a3 = {
        $between: [a301, a302]
      }
    }

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

    if (a1) {
      where.a1 = {
        $like: `%${a1}%`
      };
    }

    if (a8) {
      where.a8 = {
        $like: `%${a8}%`
      };
    }

    if (a9) {
      where.a9 = {
        $like: `%${a9}%`
      };
    }

    if (a10) {
      where.a10 = {
        $like: `%${a10}%`
      };
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

    let havings = null
    if (result && result.rows.length > 0) {
      havings = await ctx.orm().info_house_having.findAll({
        where: {
          ...where1,
          hid: result.rows.map(m => {
            return m.dataValues.id
          })
        }
      })
    }

    let list = []
    for (let i = 0, j = result.rows.length; i < j; i++) {
      let m = result.rows[i].dataValues
      let h = havings && havings.length > 0 ? havings.filter(f => f.hid === m.id) : []

      let one = {}
      if (h && h.length > 0) {
        for (let x = 0, y = h.length; x < y; x++) {
          let m1 = h[x].dataValues
          one = {
            index: i + 1,
            ...m
          }

          Object.keys(m1).map(m2 => {
            one[`h_${m2}`] = m1[m2]
          })

          list.push(one)
        }
      } else {
        one = {
          index: i + 1,
          ...m
        }

        list.push(one)
      }
    }

    ctx.body = {
      total: result.count,
      list: list,
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

    ctx.body = {}
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
    let { houseType, sn, street, community, streets, communitys, a1, a4, a5, a6, a7, a11, a13, a14, a201, a202, a301, a302 } = ctx.request.body;

    let where = {
      a9: {
        $gte: date.formatDate()
      }
    };

    if (a301 && a302) {
      where.a3 = {
        $between: [a301, a302]
      }
    }

    let where1 = {
      isDel: 0
    };

    Object.assign(where1, sn && { sn })
    Object.assign(where1, street && { street })
    Object.assign(where1, community && { community })
    Object.assign(where1, a4 && { a4 })
    Object.assign(where1, a5 && { a5 })
    Object.assign(where1, a6 && { a6 })
    Object.assign(where1, a7 && { a7 })
    Object.assign(where1, a11 && { a11 })
    Object.assign(where1, a13 && { a13 })
    Object.assign(where1, a14 && { a14 })
    Object.assign(where1, houseType && { houseType })

    if (a201 && a202) {
      where1.a2 = {
        $between: [a201, a202]
      }
    }

    if (streets && streets.length > 0) {
      where1.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where1.community = {
        $in: communitys
      }
    }

    if (a1) {
      where1.a1 = {
        $like: `%${a1}%`
      };
    }

    let houses = await ctx.orm().info_house.findAll({
      where: where1
    })

    if (houses && houses.length > 0) {
      where.hid = {
        $in: houses.map(m => {
          return m.dataValues.id
        })
      }
    }

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
    let { id, sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, street, community, remark, houseType, houseRelege, houseImg } = ctx.request.body;

    let lon = ''
    let lat = ''

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

      let house = await ctx.orm().info_house.findOne({
        where: {
          id,
          isDel: 0
        }
      })
      assert.ok(!!house, '资产信息不存在！')

      lon = house.lon
      lat = house.lat
      if (house.a1 !== a1) {
        // 重新获取经度、纬度
        let res = await http.get({
          url: `https://restapi.amap.com/v3/geocode/geo?key=e6f2a4d50e731af88dac2646da574e3a&address=${encodeURIComponent(a1)}&city=${encodeURIComponent('南京市')}`
        })

        if (res && res.data && res.data.geocodes && res.data.geocodes.length > 0) {
          let geocode = res.data.geocodes[0]

          if (geocode.location) {
            lon = geocode.location.split(',')[0]
            lat = geocode.location.split(',')[1]
          }
        }
      }

      await ctx.orm().info_house.update({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, street, community, remark,
        lon, lat, houseType, houseRelege, houseImg
      }, {
        where: {
          id,
          isDel: 0
        }
      })
    } else {
      // 重新获取经度、纬度
      let res = await http.get({
        url: `https://restapi.amap.com/v3/geocode/geo?key=e6f2a4d50e731af88dac2646da574e3a&address=${encodeURIComponent(a1)}&city=${encodeURIComponent('南京市')}`
      })

      if (res && res.data && res.data.geocodes && res.data.geocodes.length > 0) {
        let geocode = res.data.geocodes[0]

        if (geocode.location) {
          lon = geocode.location.split(',')[0]
          lat = geocode.location.split(',')[1]
        }
      }

      await ctx.orm().info_house.create({
        sn, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, street, community, remark,
        lon: lon, lat: lat,
        houseType, houseRelege, houseImg,
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
    let { id, ptype, pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, b19, b20, b21, b22, manage_id, manage_user } = ctx.request.body;

    ptype = !ptype ? '普通项目' : ptype

    if (id) {
      let project = await ctx.orm().info_projects.findOne({
        where: {
          id
        }
      })

      assert.ok(!!project, '项目不存在!')

      await ctx.orm().info_projects.update({
        ptype, pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, b19, b20, b21, b22, manage_id, manage_user
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
        pro_sub_verify: JSON.stringify(project.dataValues),
        update_type: '更新项目内容'
      })
    } else {
      await ctx.orm().info_projects.create({
        ptype, pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source,
        a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21,
        manage_id, manage_user
      })
    }

    ctx.body = {}
  },
  submitBackProject: async ctx => {
    let { id, pro_status, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let oldProjectStatus = ''
      let newProjectStatus = pro_status
      let project = await ctx.orm().info_projects.findOne({
        where: {
          id
        }
      })

      assert.ok(!!project, '项目不存在!')

      oldProjectStatus = project.pro_status

      await ctx.orm().info_projects.update({
        pro_status: newProjectStatus, manage_id, manage_user
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
        sub_title: `项目状态从【${oldProjectStatus}】更新为【${newProjectStatus}】`,
        pro_id: project.id,
        pro_sub_verify: JSON.stringify(project.dataValues),
        age_id: manage_id,
        manage_user: manage_user,
        manage_remark: '',
        update_type: '项目状态更新'
      })
    }

    ctx.body = {}
  },
  submitProjectsND: async ctx => {
    let { id, ptype, pro_code, pro_name, pro_level, pro_status, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, b19, b20, b21, b22, manage_id, manage_user } = ctx.request.body;

    ptype = !ptype ? '普通项目' : ptype

    if (id) {
      let project = await ctx.orm().info_projects.findOne({
        where: {
          id
        }
      })

      assert.ok(!!project, '项目不存在!')

      await ctx.orm().info_projects.update({
        ptype, pro_code, pro_name, pro_level, a1, pro_type, pro_source, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, b19, b20, b21, b22, manage_id, manage_user
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
        pro_sub_verify: JSON.stringify(project.dataValues),
        update_type: '更新项目内容'
      })
    } else {
      await ctx.orm().info_projects.create({
        ptype, pro_code, pro_name, pro_level, a1, pro_type, pro_source,
        a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, b19, b20, b21, b22,
        manage_id, manage_user,
        pro_status: '投后管理',
        verify1_time: date.formatDate(),
        verify1_remark: '南大项目自动审核通过',
        verify2_time: date.formatDate(),
        verify2_remark: '南大项目自动审核通过',
        verify3_time: date.formatDate(),
        verify3_remark: '南大项目自动审核通过'
      })
    }

    ctx.body = {}
  },
  getProjects: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { ptype, a5, a51, a13, pro_code, pro_name, pro_level, pro_status, pro_type, pro_source, verify_status, verify_num, create_time, update_time } = ctx.request.body;

    let where = {};

    Object.assign(where, ptype && { ptype })
    Object.assign(where, pro_code && { pro_code })
    Object.assign(where, pro_name && { pro_name })
    Object.assign(where, pro_level && { pro_level })
    Object.assign(where, pro_type && { pro_type })
    Object.assign(where, pro_source && { pro_source })
    Object.assign(where, verify_status && { verify_status })
    Object.assign(where, verify_num && { verify_num })

    if (a51 && a5 !== null) {
      where.a5 = {}
      where.a5[`$${a51}`] = a5
    }

    if (a13 && a13.length > 0) {
      where.a13 = { $in: a13 }
    }

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
      where
    });

    let projectSubs = null
    if (result && result.count > 0) {
      projectSubs = await ctx.orm().info_projects_sub.findAll({
        where: {
          id: {
            $in: sequelize.literal(`(select max(id) id from info_projects_sub where pro_id in (${result.rows.map(m => {
              return m.dataValues.id
            }).join(',')}) group by pro_id)`)
          }
        }
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let fp = projectSubs && projectSubs.length > 0 ? projectSubs.find(f => f.pro_id === m.dataValues.id) : {}
        return {
          ...m.dataValues,
          projectSub: fp
        }
      }),
      pageIndex,
      pageSize
    }
  },
  getProjectUpdate: async ctx => {
    let { sub_title, pro_id, update_type } = ctx.request.body;

    let where = {};

    Object.assign(where, sub_title && { sub_title })
    Object.assign(where, pro_id && { pro_id })
    Object.assign(where, update_type && { update_type })

    let result = await ctx.orm().info_project_update.findAll({ where })

    ctx.body = result
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
      where: where1
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
      limit: pageSize
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
  submitProjectGoInProject: async ctx => {
    let { id, b17 } = ctx.request.body;

    let project = await ctx.orm().info_projects.findOne({
      where: {
        id,
        pro_status: '投前跟进'
      }
    })

    assert.ok(!!project, '项目不存在!')

    await ctx.orm().info_projects.update({
      pro_status: '项目立项',
      b17: b17
    }, {
      where: {
        id: project.id
      }
    })

    ctx.body = {}
  },
  submitProjectGoInVerify: async ctx => {
    let { id, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, verify_sub_manageid, verify_sub_manageuser } = ctx.request.body;

    let project = await ctx.orm().info_projects.findOne({
      where: {
        id,
        pro_status: '项目立项'
      }
    })

    assert.ok(!!project, '项目不存在!')

    let pro_status = '投后审核中'
    let verify_status = '一审中'
    let verify_num = 3

    await ctx.orm().info_projects.update({
      pro_status, verify_status, verify_num, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, verify_sub_manageid, verify_sub_manageuser
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
      pro_sub_verify: JSON.stringify(project.dataValues),
      update_type: '更新项目内容'
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
        pro_status: verify === '通过' ? '投后审核中' : '项目立项',
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
          pro_status: verify === '通过' ? '投后管理' : '项目立项',
          verify_status: verify === '通过' ? '审核通过' : '二审不通过',
          verify2: verify,
          verify2_manage_id: verify_manage_id,
          verify2_manage_user: verify_manage_user,
          verify2_time: date.formatDate(),
          verify2_remark: verify_remark
        }
      } else {
        update = {
          pro_status: verify === '通过' ? '投后审核中' : '项目立项',
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
        pro_status: verify === '通过' ? '投后管理' : '项目立项',
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
      pro_sub_verify: JSON.stringify(project.dataValues),
      manage_id: verify_manage_id,
      manage_user: verify_manage_user,
      manage_remark: verify_remark,
      update_type: '项目审核'
    })
  },
  submitProjectDueDiligence: async ctx => {
    let { id, b18 } = ctx.request.body;

    let project = await ctx.orm().info_projects.findOne({
      where: {
        id
      }
    })

    assert.ok(!!project, '项目不存在!')

    await ctx.orm().info_projects.update({
      b18: b18
    }, {
      where: {
        id: project.id
      }
    })

    ctx.body = {}
  },
  submitProjectSub: async ctx => {
    let { id, pro_id, a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, remark, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let projectsSub = await ctx.orm().info_projects_sub.findOne({
        where: {
          id
        }
      })

      assert.ok(!!projectsSub, '项目进展不存在!')

      await ctx.orm().info_projects_sub.update({
        a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, remark, manage_id, manage_user
      }, {
        where: {
          id: projectsSub.id
        }
      })
    } else {
      await ctx.orm().info_projects_sub.create({
        pro_id, a1, a2, a3, a40, a4, a5, a60, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, remark, manage_id, manage_user
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
  submitProjectManagement: async ctx => {
    let { id, pro_id, a1, a2, a3, a4, a5, manage_id, manage_user } = ctx.request.body;

    if (id) {
      let projectManagement = await ctx.orm().info_project_management.findOne({
        where: {
          id
        }
      })

      assert.ok(!!projectManagement, '项目管理不存在!')

      await ctx.orm().info_project_management.update({
        a1, a2, a3, a4, a5, manage_id, manage_user
      }, {
        where: {
          id: projectManagement.id
        }
      })
    } else {
      await ctx.orm().info_project_management.create({
        pro_id, a1, a2, a3, a4, a5, manage_id, manage_user
      })
    }
  },
  getProjectManagement: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { pro_id } = ctx.request.body;

    let where = {};

    Object.assign(where, pro_id && { pro_id })

    let result = await ctx.orm().info_project_management.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where: where
    })

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getProjectManagementList: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;

    let where = {};

    let result = await ctx.orm().info_project_management.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where: where
    })

    let projects = null
    if (result && result.rows.length > 0) {
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
        let fp = projects && projects.length > 0 ? projects.find(f => f.id === m.dataValues.pro_id) : null
        return {
          ...m.dataValues,
          project: fp
        }
      }),
      pageIndex,
      pageSize
    }
  },
  s1: async ctx => {
    let sql1 = `select 's1' title, count(1) num from info_house where isDel = 0 
    union all 
    select 's2' title, count(1) num from info_house_having where a1 = '出租' 
    union all 
    select 's3' title, count(1) num from info_house_having where a1 = '出借' 
    union all 
    select 's4' title, count(1) num from info_house_having where a1 = '空置' 
    union all 
    select 's5' title, count(1) num from info_house_having where a1 = '自用' 
    union all 
    select 's6' title, count(1) num from info_projects 
    union all 
    select 's7' title, count(1) num from info_projects where pro_status = '投前跟进' 
    union all 
    select 's8' title, count(1) num from info_projects where pro_status = '项目立项' 
    union all 
    select 's9' title, count(1) num from info_projects where pro_status = '投后审核中' 
    union all 
    select 's10' title, count(1) num from info_projects where pro_status = '投后管理'`

    let sql2 = `select DATE_FORMAT(a1,'%Y') year, sum(a3) num from info_house_yearrent where hid in (select id from info_house where houseType in ('自有房产')) group by DATE_FORMAT(a1,'%Y')`

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    let result3 = await ctx.orm().info_house_yearrent.findAll({
      where: {
        hid: {
          $in: sequelize.literal(`(select id from info_house where houseType in ('自有房产')) `)
        }
      }
    })
    let years = {}

    result3.map(m => {
      let diffMonth = moment(m.dataValues.a2).diff(moment(m.dataValues.a1), 'month')
      let montha3 = Math.round(m.dataValues.a3 / diffMonth)

      for (let i = 0, j = diffMonth; i < j; i++) {
        let year = moment(m.dataValues.a1).add(i, 'months').year()

        if (i + 1 === j) {
          montha3 = Math.round(m.dataValues.a3 - (diffMonth - 1) * montha3)
        }

        if (years[`${year}`]) {
          years[`${year}`] += montha3
        } else {
          years[`${year}`] = montha3
        }
      }
    })

    ctx.body = {
      result1: result1,
      result2: result2,
      result3: years
    };
  },
  runGeocode: async ctx => {
    let result = await ctx.orm().info_house.findAll({
      where: {
        isDel: 0
      }
    });

    for (let i = 0, j = result.length; i < j; i++) {
      if (!result[i].lon) {
        let res = await http.get({
          url: `https://restapi.amap.com/v3/geocode/geo?key=e6f2a4d50e731af88dac2646da574e3a&address=${encodeURIComponent(result[i].a1)}&city=${encodeURIComponent('南京市')}`
        })

        if (res && res.data && res.data.geocodes && res.data.geocodes.length > 0) {
          let geocode = res.data.geocodes[0]

          if (geocode.location) {
            let lon = geocode.location.split(',')[0]
            let lat = geocode.location.split(',')[1]

            await ctx.orm().info_house.update({
              lon: lon,
              lat: lat
            }, {
              where: {
                id: result[i].id
              }
            })
          }
        }
      }
    }
  },
  getHouseChecks: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let {
      sn, street, community, streets, communitys, houseType, a1, a4, a5, a6, a7, a8, a9, a10, a11, a13, a14, a201, a202, a301, a302, a21, h_a1, h_a2, h_a301, h_a302, h_a701, h_a702, remark, createTime, modifyTime,
      cType, cUserId, cStatus
    } = ctx.request.body

    let where = {}
    Object.assign(where, cType && { cType })
    Object.assign(where, cStatus && { cStatus: { $in: cStatus } })
    Object.assign(where, cUserId && { cUserIds: { $like: `%,${cUserId},%` } })

    let where1 = {};
    Object.assign(where1, sn && { sn })
    Object.assign(where1, street && { street })
    Object.assign(where1, community && { community })
    Object.assign(where1, a4 && { a4 })
    Object.assign(where1, a5 && { a5 })
    Object.assign(where1, a6 && { a6 })
    Object.assign(where1, a7 && { a7 })
    Object.assign(where1, a11 && { a11 })
    Object.assign(where1, a13 && { a13 })
    Object.assign(where1, a14 && { a14 })
    Object.assign(where1, a21 && { a21 })
    Object.assign(where1, houseType && { houseType })

    let where2 = {}
    Object.assign(where2, h_a1 && { a1: h_a1 })
    Object.assign(where2, h_a2 && { a2: { $like: `%${h_a2}%` } })
    if (h_a301 && h_a302) {
      where2.a3 = {
        $between: [h_a301, h_a302]
      }
    }
    if (h_a701 && h_a702) {
      where2.a7 = {
        $between: [h_a701, h_a702]
      }
    }
    if (Object.keys(where2).length > 0) {
      let havings = await ctx.orm().info_house_having.findAll({
        attributes: ['hid'],
        where: where2
      })

      if (havings && havings.length > 0) {
        where1.id = {
          $in: havings.map(m => {
            return m.dataValues.hid
          })
        }
      }
    }

    if (a201 && a202) {
      where1.a2 = {
        $between: [a201, a202]
      }
    }

    if (a301 && a302) {
      where1.a3 = {
        $between: [a301, a302]
      }
    }

    if (streets && streets.length > 0) {
      where1.street = {
        $in: streets
      }
    }

    if (communitys && communitys.length > 0) {
      where1.community = {
        $in: communitys
      }
    }

    if (a1) {
      where1.a1 = {
        $like: `%${a1}%`
      };
    }

    if (a8) {
      where1.a8 = {
        $like: `%${a8}%`
      };
    }

    if (a9) {
      where1.a9 = {
        $like: `%${a9}%`
      };
    }

    if (a10) {
      where1.a10 = {
        $like: `%${a10}%`
      };
    }

    if (remark) {
      where1.remark = {
        $like: `%${remark}%`
      };
    }

    if (createTime && createTime.length === 2) {
      where1.createTime = { $between: createTime }
    }

    if (modifyTime && modifyTime.length === 2) {
      where1.modifyTime = { $between: modifyTime }
    }

    if (Object.keys(where1).length > 0) {
      where1.isDel = 0

      let houses = await ctx.orm().info_house.findAll({
        attributes: ['id'],
        where: where1
      });

      if (houses && houses.length > 0) {
        where.hid = {
          $in: houses.map(m => {
            return m.dataValues.id
          })
        }
      }
    }

    let result = await ctx.orm().info_house_check.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [['id', 'desc']]
    });

    let shops = null
    if (result.rows && result.rows.length > 0) {
      shops = await ctx.orm().info_house_check_shops.findAll({
        where: {
          cid: result.rows.map(m => {
            return m.dataValues.id
          })
        }
      })
    }

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        let s = shops && shops.length > 0 ? shops.filter(f => f.cid === m.dataValues.id) : []
        return {
          ...m.dataValues,
          shops: s
        }
      }),
      pageIndex,
      pageSize
    }
  },
  getHouseCheck: async ctx => {
    let { id } = ctx.request.body

    let result = await ctx.orm().info_house_check.findOne({
      where: {
        id
      }
    });

    ctx.body = result
  },
  getHouseCheckShop: async ctx => {
    let { cid, sid } = ctx.request.body

    let where = {}
    Object.assign(where, cid && { cid })
    Object.assign(where, sid && { id: sid })

    let result = await ctx.orm().info_house_check_shops.findAll({
      where
    });

    let checkUsers = null
    if (result && result.length > 0) {
      checkUsers = await ctx.orm().info_house_check_users.findAll({
        where: {
          sid: result.map(m => {
            return m.dataValues.id
          })
        }
      })
    }

    ctx.body = result.map(m => {
      let u = checkUsers && checkUsers.length > 0 ? checkUsers.filter(f => f.sid === m.dataValues.id) : []
      return {
        ...m.dataValues,
        users: u
      }
    })
  },
  getHouseCheckUsers: async ctx => {
    let { id, cid, sid } = ctx.request.body

    let where = {}
    Object.assign(where, id && { id })
    Object.assign(where, cid && { cid })
    Object.assign(where, sid && { sid })

    let result = await ctx.orm().info_house_check_users.findAll({
      where
    });

    ctx.body = result
  },
  submitHouseCheck: async ctx => {
    let { id, hid, a1, cType, cUsers, cContent, cStatus } = ctx.request.body;

    if (id) {
      await ctx.orm().info_house_check.update({
        hid, a1, cType, cUsers: JSON.stringify(cUsers),
        cUserIds: ',' + cUsers.map(m => m.cUserId).join(',') + ',',
        cContent: JSON.stringify(cContent), cStatus
      }, {
        where: {
          id,
          cStatus: '未处理'
        }
      })
    } else {
      if (hid && hid.length > 0) {
        for (let i = 0, j = hid.length; i < j; i++) {
          await ctx.orm().info_house_check.create({
            hid: hid[i], a1: a1[i], cType,
            cUsers: JSON.stringify(cUsers),
            cUserIds: ',' + cUsers.map(m => m.cUserId).join(',') + ',',
            cContent: JSON.stringify(cContent), cStatus
          })
        }
      }
    }

    ctx.body = {}
  },
  submitHouseCheckShop: async ctx => {
    let { id, shopName, cUserId, cUsersName, cUserImg, cUnUserPhone, cRemark, cContent, cTime, cResult, isProblem, cProblem, cProblemImgs, cMeasure } = ctx.request.body;

    let check = await ctx.orm().info_house_check.findOne({
      where: {
        id
      }
    })

    assert.ok(!!check, '检查项目不存在!')

    await ctx.orm().info_house_check.update({
      cStatus: '处理中'
    }, {
      where: {
        id: check.id
      }
    })

    let shopStatus = isProblem === '存在' ? '待复查' : '已完成'

    let shop = await ctx.orm().info_house_check_shops.create({
      cid: check.id,
      a1: check.a1,
      shopName,
      cContent: JSON.stringify(cContent),
      cType: check.cType,
      cUsers: check.cUsers,
      cStatus: shopStatus
    })

    let users = JSON.parse(check.cUsers)
    let UserImgs = users.map(m => { return '' })
    let Remarks = users.map(m => { return '' })

    for (let i = 0, j = users.length; i < j; i++) {
      if (users[i].cUserId === cUserId) {
        UserImgs[i] = cUserImg
        Remarks[i] = cRemark
        break;
      }
    }

    let usercheck = await ctx.orm().info_house_check_users.create({
      cid: check.id,
      sid: shop.id,
      cUsers: check.cUsers,
      cUserImg: JSON.stringify(UserImgs),
      cRemark: JSON.stringify(Remarks),
      cContent: JSON.stringify(cContent),
      cTime,
      cResult,
      isProblem,
      cProblem,
      cProblemImgs: JSON.stringify(cProblemImgs),
      cMeasure,
      isRepeat: '不是',
      cUnUserPhone
    })

    ctx.body = {
      cid: check.id,
      sid: shop.id,
      uid: usercheck.id
    }
  },
  submitHouseCheckShopRepeat: async ctx => {
    let { id, sid, cUserId, cUsersName, cUserImg, cUnUserPhone, cRemark, cTime, cResult, isProblem, cProblemImgs, cMeasure } = ctx.request.body;

    let check = await ctx.orm().info_house_check.findOne({
      where: {
        id
      }
    })
    assert.ok(!!check, '检查项目不存在!')

    let shop = await ctx.orm().info_house_check_shops.findOne({
      where: {
        id: sid
      }
    })
    assert.ok(!!shop, '检查店铺不存在!')

    let shopStatus = isProblem === '未整改' ? '待复查' : '已完成'

    await ctx.orm().info_house_check_shops.update({
      cStatus: shopStatus
    }, {
      where: {
        id: shop.id
      }
    })

    let users = JSON.parse(check.cUsers)
    let UserImgs = users.map(m => { return '' })
    let Remarks = users.map(m => { return '' })

    for (let i = 0, j = users.length; i < j; i++) {
      if (users[i].cUserId === cUserId) {
        UserImgs[i] = cUserImg
        Remarks[i] = cRemark
        break;
      }
    }

    let usercheck = await ctx.orm().info_house_check_users.create({
      cid: check.id,
      sid: shop.id,
      cUsers: shop.cUsers,
      cUserImg: JSON.stringify(UserImgs),
      cRemark: JSON.stringify(Remarks),
      cContent: shop.cContent,
      cTime,
      cResult,
      isProblem,
      cProblemImgs: JSON.stringify(cProblemImgs),
      cMeasure,
      isRepeat: '是',
      cUnUserPhone
    })

    ctx.body = {
      cid: check.id,
      sid: shop.id,
      uid: usercheck.id
    }
  },
  submitHouseOver: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_house_check.update({
      cStatus: '已完成'
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  submitHouseCheckUnUser: async ctx => {
    let { cid, sid, uid, cUnUserName, cUnUserImg } = ctx.request.body;

    await ctx.orm().info_house_check_users.update({
      cUnUserName,
      cUnUserImg
    }, {
      where: {
        cid,
        sid,
        id: uid,
        cUnUserImg: {
          $is: null
        }
      }
    })

    ctx.body = {}
  },
  delHouseChecks: async ctx => {
    let { id } = ctx.request.body;

    await ctx.orm().info_house_check.destroy({
      where: {
        id
      }
    })

    await ctx.orm().info_house_check_shops.destroy({
      where: {
        cid: id
      }
    })

    await ctx.orm().info_house_check_users.destroy({
      where: {
        cid: id
      }
    })

    ctx.body = {}
  },
  getCheckUsers: async ctx => {
    let result = await ctx.orm().SuperManagerInfo.findAll({
      attributes: ['id', 'loginName', 'realName', 'phone'],
      where: {
        depName: '资产运营部',
        isDel: 0
      }
    });

    ctx.body = result;
  },
  s2: async ctx => {
    let { createTime } = ctx.request.body

    let where = ''
    if (createTime && createTime.length > 0) {
      where = ` and s.create_time between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59' `
    }

    // left join (select sid, cUnUserName, cUnUserImg, isProblem, cProblem, cContent, cProblemImgs from info_house_check_users u where u.isProblem = '存在' and u.isRepeat = '不是' and id in (select max(id) from info_house_check_users where isRepeat = '不是' group by sid)) u1 on u1.sid = s.id

    let sql = `select s.create_time, s.id, s.cType, s.shopName, s.a1, u1.cContent, u1.cUnUserName, u1.isProblem, u1.cProblem, u1.cProblemImgs, u1.cUnUserImg, u2.cMeasure, u2.isProblem isProblem1, u2.cProblemImgs cProblemImgs2, s.cUsers from info_house_check_shops s 
    left join (select sid, cUnUserName, cUnUserImg, isProblem, cProblem, cContent, cProblemImgs from info_house_check_users u where u.isRepeat = '不是') u1 on u1.sid = s.id 
    left join (select sid, cMeasure, isProblem, cContent, cProblemImgs from info_house_check_users u where u.isRepeat = '是' and id in (select max(id) from info_house_check_users where isRepeat = '是' group by sid)) u2 on u2.sid = s.id 
    where 1 = 1 ${where} `

    let result = await ctx.orm().query(sql)

    ctx.body = result
  },
  getContracts: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { a15, cname, createTime, modifyTime } = ctx.request.body;

    let where = {
      isDel: 0
    }

    if (a15) {
      where.a15 = a15
    }

    if (cname) {
      where.cname = cname
    }

    if (createTime && createTime.length === 2) {
      where.createTime = { $between: createTime }
    }

    if (modifyTime && modifyTime.length === 2) {
      where.modifyTime = { $between: modifyTime }
    }

    let result = await ctx.orm().info_house_contract.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  submitContract: async ctx => {
    let { id, cname, camount, a1, a2, a4, a5, a15, files } = ctx.request.body;

    if (id) {
      await ctx.orm().info_house_contract.update({ cname, camount, a1, a2, a4, a5, a15, files }, {
        where: {
          id
        }
      })
    } else {
      await ctx.orm().info_house_contract.create({
        cname, camount, a1, a2, a4, a5, a15, files,
        isDel: 0
      })
    }

    ctx.body = {}
  },
  delContract: async ctx => {
    let { id } = ctx.request.body;

    if (id) {
      await ctx.orm().info_house_contract.update({ isDel: 1 }, {
        where: {
          id
        }
      })
    }

    ctx.body = {}
  }
};
