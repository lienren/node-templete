/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2023-07-13 17:28:13
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/samp/rearend.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const excel = require('../../utils/excel');

const configData = require('../ConfigData');

const opStatusNameEnum = {
  1: '未回访',
  2: '已回访'
}

const areaIndex = [
  '玄武区',
  '秦淮区',
  '建邺区',
  '鼓楼区',
  '雨花台区',
  '栖霞区',
  '江宁区',
  '浦口区',
  '六合区',
  '溧水区',
  '高淳区',
  '江北新区'
]

const areaName = {
  '320104': '秦淮区',
  '320116': '六合区',
  '320106': '鼓楼区',
  '320114': '雨花台区',
  '320117': '溧水区',
  '320113': '栖霞区',
  '320192': '江北新区',
  '320126': '江北新区',
  '320102': '玄武区',
  '320105': '建邺区',
  '320118': '高淳区',
  '320115': '江宁区',
  '320111': '浦口区'
}

const streetName = {
  '320104011000': '瑞金路街道',
  '320105010000': '江心洲街道',
  '320102007000': '锁金村街道',
  '320116002000': '雄州街道',
  '320115005000': '淳化街道',
  '320104008000': '洪武路街道',
  '320115001000': '东山街道',
  '320113003000': '迈皋桥街道',
  '320113002000': '马群街道',
  '320116007000': '龙袍街道',
  '320118006000': '桠溪街道',
  '320106006000': '江东街道',
  '320118004000': '固城街道',
  '320102009000': '孝陵卫街道',
  '320104014000': '朝天宫街道',
  '320104001000': '秦虹街道',
  '320114005000': '板桥街道',
  '320192006000': '大厂街道',
  '320117107000': '和凤镇',
  '320106002000': '华侨路街道',
  '320111009000': '永宁街道',
  '320115007000': '横溪街道',
  '320104009000': '五老村街道',
  '320114006000': '铁心桥街道',
  '320111006000': '汤泉街道',
  '320106007000': '凤凰街道',
  '320105007000': '南苑街道',
  '320102008000': '红山街道',
  '320116003000': '横梁街道',
  '320117001000': '永阳街道',
  '320114008000': '梅山街道',
  '320106011000': '建宁路街道',
  '320192008000': '顶山街道',
  '320118001000': '淳溪街道',
  '320117101000': '白马镇',
  '320105011000': '莫愁湖街道',
  '320104010000': '大光路街道',
  '320115010000': '汤山街道',
  '320105008000': '双闸街道',
  '320117002000': '柘塘街道',
  '320104007000': '红花街道',
  '320117004000': '石湫街道',
  '320113001000': '尧化街道',
  '320111004000': '江浦街道',
  '320106010000': '幕府山街道',
  '320192010000': '盘城街道',
  '320113004000': '燕子矶街道',
  '320116004000': '金牛湖街道',
  '320192004000': '葛塘街道',
  '320113005000': '仙林街道',
  '320104013000': '光华路街道',
  '320105006000': '兴隆街道',
  '320117005000': '洪蓝街道',
  '320118003000': '漆桥街道',
  '320104006000': '中华门街道',
  '320115012000': '湖熟街道',
  '320114002000': '赛虹桥街道',
  '320114004000': '西善桥街道',
  '320115004000': '禄口街道',
  '320118005000': '东坝街道',
  '320114009000': '古雄街道',
  '320106008000': '下关街道',
  '320116110000': '竹镇镇',
  '320102002000': '梅园新村街道',
  '320115011000': '秣陵街道',
  '320102005000': '玄武门街道',
  '320111400000': '老山林场',
  '320111005000': '桥林街道',
  '320111401000': '汤泉农场',
  '320192007000': '泰山街道',
  '320113009000': '八卦洲街道',
  '320118101000': '阳江镇',
  '320102003000': '新街口街道',
  '320106012000': '宝塔桥街道',
  '320192009000': '沿江街道',
  '320115009000': '谷里街道',
  '320113008000': '栖霞街道',
  '320106001000': '宁海路街道',
  '320104002000': '夫子庙街道',
  '320114003000': '雨花街道',
  '320106013000': '小市街道',
  '320102010000': '玄武湖街道',
  '320115006000': '麒麟街道',
  '320118002000': '古柏街道',
  '320118102000': '砖墙镇',
  '320106003000': '湖南路街道',
  '320117106000': '晶桥镇',
  '320106009000': '热河南路街道',
  '320106005000': '挹江门街道',
  '320115008000': '江宁街道',
  '320116001000': '龙池街道',
  '320104012000': '月牙湖街道',
  '320116006000': '马鞍街道',
  '320105009000': '沙洲街道',
  '320111008000': '星甸街道',
  '320116005000': '程桥街道',
  '320192005000': '长芦街道',
  '320113010000': '西岗街道',
  '320106004000': '中央门街道',
  '320104004000': '双塘街道',
  '320117003000': '东屏街道',
  '320116008000': '冶山街道',
  '320113007000': '龙潭街道'
}

function formatDate (num) {
  if (typeof num === 'number') {
    let time = new Date((num - 25567 - 2) * 86400 * 1000 - 8 * 3600 * 1000);

    return date.formatDate(time)
  } else {
    return num.trim().split('.')[0]
  }
}


module.exports = {
  getUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { batch_no, batchName, name, tel, cert_no, createTime, updateTime, cusTime, cusId, cusName, opStatus, opStatusName, connectType, connectTypes, depName } = ctx.request.body;

    let where = {};

    Object.assign(where, batch_no && { batch_no })
    Object.assign(where, batchName && { batchName })
    Object.assign(where, name && { name })
    Object.assign(where, tel && { $or: [{ tel }, { contact_tel: tel }] })
    Object.assign(where, cert_no && { cert_no })
    Object.assign(where, cusId && { cusId })
    Object.assign(where, cusName && { cusName })
    Object.assign(where, opStatus && { opStatus })
    Object.assign(where, opStatusName && { opStatusName })
    Object.assign(where, connectType && { connectType })
    Object.assign(where, depName && { areaName: depName })

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`] }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: [`${updateTime[0]} 00:00:00`, `${updateTime[1]} 23:59:59`] }
    }

    if (cusTime && cusTime.length > 0) {
      where.cusTime = { $between: [`${cusTime[0]} 00:00:00`, `${cusTime[1]} 23:59:59`] }
    }

    if (connectTypes && connectTypes.length > 0) {
      where.connectType = {
        $in: connectTypes
      }
    }

    let result = await ctx.orm().info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getErrorUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { batch_no, batchName, name, tel, cert_no, createTime, updateTime, cusTime, cusId, cusName, opStatus, opStatusName, connectType, connectTypes, depName } = ctx.request.body;

    let where = {};

    Object.assign(where, batch_no && { batch_no })
    Object.assign(where, batchName && { batchName })
    Object.assign(where, name && { name })
    Object.assign(where, tel && { tel })
    Object.assign(where, cert_no && { cert_no })
    Object.assign(where, cusId && { cusId })
    Object.assign(where, cusName && { cusName })
    Object.assign(where, opStatus && { opStatus })
    Object.assign(where, opStatusName && { opStatusName })
    Object.assign(where, connectType && { connectType })
    Object.assign(where, depName && { areaName: depName })

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`] }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: [`${updateTime[0]} 00:00:00`, `${updateTime[1]} 23:59:59`] }
    }

    if (cusTime && cusTime.length > 0) {
      where.cusTime = { $between: [`${cusTime[0]} 00:00:00`, `${cusTime[1]} 23:59:59`] }
    }

    where.qa_num = 1
    where.is_repair = 0
    where.$or = [
      {
        connectType: {
          $in: ['信息有误', '空号', '停机', '限制呼入']
        }
      },
      {
        connectType: {
          $in: ['接通后挂断', '无人接听', '关机']
        },
        cusConnectNum: {
          $gte: 3
        }
      }
    ]

    let result = await ctx.orm().info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  getIntegrateUsers: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { batchName, cert_no, depName } = ctx.request.body;

    let where = ' where 1=1'

    if (batchName) {
      where += ` and batchName='${batchName}'`
    }

    if (cert_no) {
      where += ` and cert_no='${cert_no}'`
    }

    if (depName) {
      where += ` and areaName='${depName}'`
    }

    let sql1 = `select count(1) num from info_users where id in (
      select max(id) from (
      select id, batchName, cert_no from info_users ${where} 
      union all 
      select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) x 
      group by x.batchName, x.cert_no
    )`

    let sql2 = `select * from info_users where id in (
      select max(id) from (
      select id, batchName, cert_no from info_users ${where} 
      union all 
      select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) x 
      group by x.batchName, x.cert_no
    ) order by id desc limit ${(pageIndex - 1) * pageSize}, ${pageSize}`

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    ctx.body = {
      total: result1.length > 0 ? result1[0].num : 0,
      list: result2,
      pageIndex,
      pageSize
    }
  },
  importUsers: async ctx => {
    if (ctx.req.files && ctx.req.files.length > 0) {
      ctx.body = {
        filename: ctx.req.files[0].filename
      };
    } else {
      ctx.body = {
        filename: ''
      };
    }
  },
  handleUsers: async ctx => {
    let { batchName, cusIds, fileName } = ctx.request.body;

    let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${fileName}`));
    let xlsx = excel.readExcel(filePath);

    let keys = xlsx[0]
    xlsx.shift()

    let cus = await ctx.orm().SuperManagerInfo.findAll({
      where: {
        id: {
          $in: cusIds
        }
      }
    })

    assert.ok(cus && cus.length > 0, '客服不存在');

    let data = xlsx.map((m, index) => {

      let col = {
        batchName: batchName,
        cusId: cus[index % cus.length].dataValues.id,
        cusName: cus[index % cus.length].dataValues.realName,
        opStatus: 1,
        opStatusName: opStatusNameEnum[1]
      }

      for (let i = 0, j = m.length; i < j; i++) {
        if (keys[i] === 'id') {
          col['cx_id'] = m[i]
        } else if (keys[i] === 'tel') {
          if (m[i]) {
            m[i] = `${m[i]}`
            if (m[i].length === 8) {
              col[keys[i]] = `025${m[i]}`
            } else if (m[i].length === 11) {
              col[keys[i]] = m[i]
            } else {
              col[keys[i]] = m[i]
              col.opStatus = 2
              col.opStatusName = opStatusNameEnum[2]
              col.connectType = '信息有误'
              col.qa12 = '号码导入错误'
            }
          } else {
            col[keys[i]] = m[i]
            col.opStatus = 2
            col.opStatusName = opStatusNameEnum[2]
            col.connectType = '信息有误'
            col.qa12 = '号码导入错误'
          }

        } else if (keys[i] === 'cbp0113') {
          if (comm.isNumber(m[i])) {
            let time = parseInt(m[i])
            if (time > 500) {
              col[keys[i]] = date.secondToTimeStr(time)
            } else {
              col[keys[i]] = date.secondToTimeStr(time * 60)
            }
          } else {
            col[keys[i]] = m[i]
          }
        } else if (keys[i] === 'cbp0107' || keys[i] === 'cbp0108' || keys[i] === 'create_time') {
          col[keys[i]] = formatDate(m[i])
        } else if (keys[i] === 'ga_area') {
          col[keys[i]] = m[i]
          col['areaName'] = areaName[m[i]]
        } else if (keys[i] === 'ga_organ') {
          col[keys[i]] = m[i]
          // col['streetName'] = streetName[m[i]]
          col['streetName'] = m[i]
        } else if (keys[i] === 'IS_KCDJ') {
          if (!m[i]) {
            col[keys[i]] = 0
          } else {
            col[keys[i]] = m[i]
          }
        } else {
          if (keys[i]) {
            col[keys[i]] = m[i]
          }
        }
      }
      return col
    });

    data = data.filter(f => !!f.cx_id)

    await ctx.orm().info_users.bulkCreate(data);

    // 删除文件
    fs.unlink(filePath, function (error) {
      console.log('delete import excel file error:', error)
      return false
    })
  },
  editUser: async ctx => {
    let { id, tel, address, aap0112, bbp0103, bae0104, addr_area } = ctx.request.body;

    await ctx.orm().info_users.update({
      tel, address, aap0112, bbp0103, bae0104, addr_area
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  editUserError: async ctx => {
    let { id, tel, address, aap0112, bbp0103, bae0104, addr_area } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id,
        is_repair: 0
      }
    })

    /*
    insert into info_users
    (info_id,cx_id,batch_no,batchName,name,cert_type,cert_no,birthday,age,sex,tel,nation,contact_name,contact_relation,ga_area,ga_organ,ga_town,ga_address,addr_area,address,abp0114,abp0113,aap0113,is_assessment,assessment_organ,cbp0101,is_gpps,aap0114,abp0110,aap0112,bae0104,bae0102,bbp0103,bbp0102,cbp0107,cbp0108,cbp0113,cag0105,cag0104,cbp0103,creator_id,create_time,flag,result,addr_organ,gdid,IS_KCDJ,createTime,updateTime,
    cusId,cusName,opStatus,opStatusName,cusConnectNum,areaName,streetName,qa_num,parent_id)
    select u.info_id,u.cx_id,u.batch_no,CONCAT(u.batchName,'-二次'),u.name,u.cert_type,u.cert_no,u.birthday,u.age,u.sex,a.a3,u.nation,u.contact_name,u.contact_relation,u.ga_area,u.ga_organ,u.ga_town,u.ga_address,u.addr_area,u.address,u.abp0114,u.abp0113,u.aap0113,u.is_assessment,u.assessment_organ,u.cbp0101,u.is_gpps,u.aap0114,u.abp0110,u.aap0112,u.bae0104,u.bae0102,u.bbp0103,u.bbp0102,u.cbp0107,u.cbp0108,u.cbp0113,u.cag0105,u.cag0104,u.cbp0103,u.creator_id,u.create_time,u.flag,u.result,u.addr_organ,u.gdid,u.IS_KCDJ,u.createTime,u.updateTime,
    u.cusId,u.cusName,1,'未回访',0,u.areaName,u.streetName,2,u.id from abc a
    inner join info_users u on u.batchName = a.a1 and u.cert_no = a.a4;
    */

    if (user) {
      // 新增新回访
      await ctx.orm().info_users.create({
        info_id: user.info_id
        , cx_id: user.cx_id
        , batch_no: user.batch_no
        , batchName: user.batchName + '-二次'
        , name: user.name
        , cert_type: user.cert_type
        , cert_no: user.cert_no
        , birthday: user.birthday
        , age: user.age
        , sex: user.sex
        , tel: tel
        , nation: user.nation
        , contact_name: user.contact_name
        , contact_relation: user.contact_relation
        , ga_area: user.ga_area
        , ga_organ: user.ga_organ
        , ga_town: user.ga_town
        , ga_address: user.ga_address
        , addr_area: addr_area
        , address: address
        , abp0114: user.abp0114
        , abp0113: user.abp0113
        , aap0113: user.aap0113
        , is_assessment: user.is_assessment
        , assessment_organ: user.assessment_organ
        , cbp0101: user.cbp0101
        , is_gpps: user.is_gpps
        , aap0114: user.aap0114
        , abp0110: user.abp0110
        , aap0112: aap0112
        , bae0104: bae0104
        , bae0102: user.bae0102
        , bbp0103: bbp0103
        , bbp0102: user.bbp0102
        , cbp0107: user.cbp0107
        , cbp0108: user.cbp0108
        , cbp0113: user.cbp0113
        , cag0105: user.cag0105
        , cag0104: user.cag0104
        , cbp0103: user.cbp0103
        , creator_id: user.creator_id
        , create_time: user.create_time
        , flag: user.flag
        , result: user.result
        , addr_organ: user.addr_organ
        , gdid: user.gdid
        , IS_KCDJ: user.IS_KCDJ
        , cusId: user.cusId
        , cusName: user.cusName
        , opStatus: 1
        , opStatusName: opStatusNameEnum[1]
        , connectType: user.connectType
        , qa1: user.qa1
        , qa2: user.qa2
        , qa3: user.qa3
        , qa4: user.qa4
        , qa5: user.qa5
        , qa6: user.qa6
        , qa7: user.qa7
        , qa8: user.qa8
        , qa9: user.qa9
        , qa10: user.qa10
        , qa11: user.qa11
        , qa12: user.qa12
        , qa13: user.qa13
        , cusTime: user.cusTime
        , cusConnectNum: 0
        , areaName: user.areaName
        , streetName: user.streetName
        , summary: user.summary
        , qa_num: 2
        , parent_id: id
      })

      // 刷新原回访为已回状态
      await ctx.orm().info_users.update({
        opStatus: 2,
        opStatusName: opStatusNameEnum[2],
        tmp_data: '',
        is_repair: 1
      }, {
        where: {
          id
        }
      })
    }

    ctx.body = {}
  },
  editUsersQA: async ctx => {
    let { id, qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12, qa13, cusConnectNum } = ctx.request.body;

    // 写入总结
    // 不清楚/不记得、未享受，信息存在、去世

    let summary = '';
    if (qa2 === '是') {
      summary = '';
      qa13 = '';
    } else if (qa2 === '否') {
      switch (qa13) {
        case '未享受，信息存在':
        case '去世':
          summary = qa13;
          break;
        default:
          summary = '';
          qa13 = '';
          break;
      }
    } else {
      summary = '不清楚/不记得';
      qa13 = '';
    }

    await ctx.orm().info_users.update({
      summary: summary,
      qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12,
      qa13: qa13,
      opStatus: 2,
      opStatusName: opStatusNameEnum[2],
      connectType: '已接听',
      cusTime: date.formatDate(),
      cusConnectNum: sequelize.literal(`cusConnectNum + ${cusConnectNum}`),
      tmp_data: ''
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  tmpUsersQA: async ctx => {
    let { id, qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12, qa13 } = ctx.request.body;

    let tmp_data = {
      qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12, qa13
    }

    await ctx.orm().info_users.update({
      tmp_data: JSON.stringify(tmp_data)
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  editUserConnectType: async ctx => {
    let { id, connectType, qa12, cusConnectNum } = ctx.request.body;

    // '无人接听': '无人接听',
    // '信息有误': '信息有误',
    // '关机': '关机',
    // '空号': '空号',
    // '停机': '停机',
    // '限制呼入': '限制呼入'

    // 写入总结
    // 接通后挂断、无人接听、信息有误、关机、空号、停机、限制呼入

    let opStatus = 1
    switch (connectType) {
      case '信息有误':
      case '空号':
      case '停机':
      case '限制呼入':
        opStatus = 2
        break;
      default:
        opStatus = 1
        break;
    }
    let user = await ctx.orm().info_users.findOne({
      where: {
        id
      }
    })

    // 按要求“无人接听、关机、拒接、正忙”每天轮打三次属于已完成工单
    if (user && user.cusConnectNum >= 2) {
      opStatus = 2
    }

    await ctx.orm().info_users.update({
      summary: connectType,
      connectType,
      qa12: qa12,
      opStatus: opStatus,
      opStatusName: opStatusNameEnum[opStatus],
      cusTime: date.formatDate(),
      cusConnectNum: sequelize.literal(`cusConnectNum + ${cusConnectNum}`),
      tmp_data: ''
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  s1: async ctx => {
    let { batch_no, batchName, depName, createTime } = ctx.request.body;

    let where = ' where 1=1 and qa_num = 1 ';

    if (batch_no) {
      where += ` and batch_no = '${batch_no}' `
    }

    if (batchName) {
      where += ` and batchName = '${batchName}' `
    }

    if (depName) {
      where += ` and areaName = '${depName}' `
    }

    if (createTime && createTime.length > 0) {
      where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59' `
    }

    let sql1 = `select a.areaName, a.uv, ifnull(b.uv,0) u2, ifnull(c.uv,0) u3, ifnull(d.uv,0) u4, ifnull(e.uv,0) u5,
      ifnull(f.uv,0) u6, ifnull(g.uv,0) u7,
      ifnull(h1.uv,0) u9, ifnull(h2.uv,0) u10, ifnull(h3.uv,0) u11, ifnull(h4.uv,0) u12,
      ifnull(i1.uv,0) u13, ifnull(i2.uv,0) u14, ifnull(i3.uv,0) u15, ifnull(i4.uv,0) u16, ifnull(i5.uv,0) u17, ifnull(i6.uv,0) u18 
    from (select areaName, count(1) uv from info_users ${where} group by areaName) a 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 1 group by areaName
    ) b on b.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' group by areaName
    ) c on c.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '满意' group by areaName
    ) d on d.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '基本满意' group by areaName
    ) e on e.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不满意' group by areaName
    ) f on f.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不清楚/不记得' group by areaName
    ) g on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '未享受，信息存在' group by areaName
    ) h1 on h1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '接通后挂断' group by areaName
    ) h2 on h2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '去世' group by areaName
    ) h3 on h3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '不清楚/不记得' group by areaName
    ) h4 on h4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '无人接听' group by areaName
    ) i1 on i1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '信息有误' group by areaName
    ) i2 on i2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '关机' group by areaName
    ) i3 on i3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '空号' group by areaName
    ) i4 on i4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '停机' group by areaName
    ) i5 on i5.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '限制呼入' group by areaName
    ) i6 on i6.areaName = a.areaName`;

    let result1 = await ctx.orm().query(sql1);

    let data = []
    areaIndex.map(m => {
      let f = result1.find(f => f.areaName === m)

      if (f) {
        data.push(f)
      }
    })

    let sum = data.reduce((total, curr) => {
      total.uv += parseInt(curr.uv)
      total.u1 += parseInt(curr.u1)
      total.u2 += parseInt(curr.u2)
      total.u3 += parseInt(curr.u3)
      total.u4 += parseInt(curr.u4)
      total.u5 += parseInt(curr.u5)
      total.u6 += parseInt(curr.u6)
      total.u7 += parseInt(curr.u7)
      total.u9 += parseInt(curr.u9)
      total.u10 += parseInt(curr.u10)
      total.u11 += parseInt(curr.u11)
      total.u12 += parseInt(curr.u12)
      total.u13 += parseInt(curr.u13)
      total.u14 += parseInt(curr.u14)
      total.u15 += parseInt(curr.u15)
      total.u16 += parseInt(curr.u16)
      total.u17 += parseInt(curr.u17)
      total.u18 += parseInt(curr.u18)
      return total
    }, {
      areaName: '合计',
      uv: 0,
      u1: 0,
      u2: 0,
      u3: 0,
      u4: 0,
      u5: 0,
      u6: 0,
      u7: 0,
      u9: 0,
      u10: 0,
      u11: 0,
      u12: 0,
      u13: 0,
      u14: 0,
      u15: 0,
      u16: 0,
      u17: 0,
      u18: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  s2: async ctx => {
    let { batch_no, batchName, depName, createTime } = ctx.request.body;

    let where = ' where 1=1 and qa_num = 2 ';

    if (batch_no) {
      where += ` and batch_no = '${batch_no}' `
    }

    if (batchName) {
      where += ` and batchName = '${batchName}' `
    }

    if (depName) {
      where += ` and areaName = '${depName}' `
    }

    if (createTime && createTime.length > 0) {
      where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59' `
    }

    let sql1 = `select a.areaName, a.uv, ifnull(b.uv,0) u2, ifnull(c.uv,0) u3, ifnull(d.uv,0) u4, ifnull(e.uv,0) u5,
      ifnull(f.uv,0) u6, ifnull(g.uv,0) u7,
      ifnull(h1.uv,0) u9, ifnull(h2.uv,0) u10, ifnull(h3.uv,0) u11, ifnull(h4.uv,0) u12,
      ifnull(i1.uv,0) u13, ifnull(i2.uv,0) u14, ifnull(i3.uv,0) u15, ifnull(i4.uv,0) u16, ifnull(i5.uv,0) u17, ifnull(i6.uv,0) u18 
    from (select areaName, count(1) uv from info_users ${where} group by areaName) a 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 1 group by areaName
    ) b on b.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' group by areaName
    ) c on c.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '满意' group by areaName
    ) d on d.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '基本满意' group by areaName
    ) e on e.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不满意' group by areaName
    ) f on f.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不清楚/不记得' group by areaName
    ) g on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '未享受，信息存在' group by areaName
    ) h1 on h1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '接通后挂断' group by areaName
    ) h2 on h2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '去世' group by areaName
    ) h3 on h3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '不清楚/不记得' group by areaName
    ) h4 on h4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '无人接听' group by areaName
    ) i1 on i1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '信息有误' group by areaName
    ) i2 on i2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '关机' group by areaName
    ) i3 on i3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '空号' group by areaName
    ) i4 on i4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '停机' group by areaName
    ) i5 on i5.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '限制呼入' group by areaName
    ) i6 on i6.areaName = a.areaName`;

    let result1 = await ctx.orm().query(sql1);

    let data = []
    areaIndex.map(m => {
      let f = result1.find(f => f.areaName === m)

      if (f) {
        data.push(f)
      }
    })

    let sum = data.reduce((total, curr) => {
      total.uv += parseInt(curr.uv)
      total.u1 += parseInt(curr.u1)
      total.u2 += parseInt(curr.u2)
      total.u3 += parseInt(curr.u3)
      total.u4 += parseInt(curr.u4)
      total.u5 += parseInt(curr.u5)
      total.u6 += parseInt(curr.u6)
      total.u7 += parseInt(curr.u7)
      total.u9 += parseInt(curr.u9)
      total.u10 += parseInt(curr.u10)
      total.u11 += parseInt(curr.u11)
      total.u12 += parseInt(curr.u12)
      total.u13 += parseInt(curr.u13)
      total.u14 += parseInt(curr.u14)
      total.u15 += parseInt(curr.u15)
      total.u16 += parseInt(curr.u16)
      total.u17 += parseInt(curr.u17)
      total.u18 += parseInt(curr.u18)
      return total
    }, {
      areaName: '合计',
      uv: 0,
      u1: 0,
      u2: 0,
      u3: 0,
      u4: 0,
      u5: 0,
      u6: 0,
      u7: 0,
      u9: 0,
      u10: 0,
      u11: 0,
      u12: 0,
      u13: 0,
      u14: 0,
      u15: 0,
      u16: 0,
      u17: 0,
      u18: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  s3: async ctx => {
    let { batch_no, batchName, depName, createTime } = ctx.request.body;

    let where = ' where 1=1 ';

    if (batch_no) {
      where += ` and batch_no = '${batch_no}' `
    }

    if (batchName) {
      where += ` and batchName = '${batchName}' `
    }

    if (depName) {
      where += ` and areaName = '${depName}' `
    }

    if (createTime && createTime.length > 0) {
      where += ` and createTime between '${createTime[0]} 00:00:00' and '${createTime[1]} 23:59:59' `
    }

    let sql1 = `select a.areaName, a.uv, ifnull(b.uv,0) u2, ifnull(c.uv,0) u3, ifnull(d.uv,0) u4, ifnull(e.uv,0) u5,
      ifnull(f.uv,0) u6, ifnull(g.uv,0) u7,
      ifnull(h1.uv,0) u9, ifnull(h2.uv,0) u10, ifnull(h3.uv,0) u11, ifnull(h4.uv,0) u12,
      ifnull(i1.uv,0) u13, ifnull(i2.uv,0) u14, ifnull(i3.uv,0) u15, ifnull(i4.uv,0) u16, ifnull(i5.uv,0) u17, ifnull(i6.uv,0) u18 
    from (select areaName, count(1) uv from info_users where id in (
      select max(id) from (
      select id, batchName, cert_no from info_users ${where} 
      union all 
      select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) x
      group by x.batchName, x.cert_no
    ) group by areaName) a 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 1 group by areaName
    ) b on b.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' group by areaName
    ) c on c.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '满意' group by areaName
    ) d on d.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '基本满意' group by areaName
    ) e on e.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不满意' group by areaName
    ) f on f.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '是' and qa10 = '不清楚/不记得' group by areaName
    ) g on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '未享受，信息存在' group by areaName
    ) h1 on h1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '接通后挂断' group by areaName
    ) h2 on h2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '去世' group by areaName
    ) h3 on h3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '已接听' and qa2 = '不清楚/不记得' group by areaName
    ) h4 on h4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '无人接听' group by areaName
    ) i1 on i1.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '信息有误' group by areaName
    ) i2 on i2.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '关机' group by areaName
    ) i3 on i3.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '空号' group by areaName
    ) i4 on i4.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '停机' group by areaName
    ) i5 on i5.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users where id in (
        select max(id) from (
        select id, batchName, cert_no from info_users ${where} 
        union all 
        select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) a
        group by a.batchName, a.cert_no
      ) and opStatus = 2 and connectType = '限制呼入' group by areaName
    ) i6 on i6.areaName = a.areaName`;

    let result1 = await ctx.orm().query(sql1);

    let data = []
    areaIndex.map(m => {
      let f = result1.find(f => f.areaName === m)

      if (f) {
        data.push(f)
      }
    })

    let sum = data.reduce((total, curr) => {
      total.uv += parseInt(curr.uv)
      total.u1 += parseInt(curr.u1)
      total.u2 += parseInt(curr.u2)
      total.u3 += parseInt(curr.u3)
      total.u4 += parseInt(curr.u4)
      total.u5 += parseInt(curr.u5)
      total.u6 += parseInt(curr.u6)
      total.u7 += parseInt(curr.u7)
      total.u9 += parseInt(curr.u9)
      total.u10 += parseInt(curr.u10)
      total.u11 += parseInt(curr.u11)
      total.u12 += parseInt(curr.u12)
      total.u13 += parseInt(curr.u13)
      total.u14 += parseInt(curr.u14)
      total.u15 += parseInt(curr.u15)
      total.u16 += parseInt(curr.u16)
      total.u17 += parseInt(curr.u17)
      total.u18 += parseInt(curr.u18)
      return total
    }, {
      areaName: '合计',
      uv: 0,
      u1: 0,
      u2: 0,
      u3: 0,
      u4: 0,
      u5: 0,
      u6: 0,
      u7: 0,
      u9: 0,
      u10: 0,
      u11: 0,
      u12: 0,
      u13: 0,
      u14: 0,
      u15: 0,
      u16: 0,
      u17: 0,
      u18: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  s4: async ctx => {
    let { selectTime } = ctx.request.body;

    if (!selectTime) {
      selectTime = date.formatDate(new Date(), 'YYYY-MM-DD');
    }

    let sql1 = `select postName, count(1) num from info_users where depId > 2 and postName != '愿检尽检人群' group by postName`;
    let sql2 = `select u.postName, count(1) num from (
      select userId from info_user_samps 
      where 
        startTime <= '${selectTime}' and 
        endTime >= '${selectTime}' and 
        handleType = '未采样' and 
        userId in (select id from info_users where depId > 2)
      ) a
      inner join info_users u on u.id = a.userId
      group by u.postName`;
    let sql3 = `select postName, num from stats_postNameSamp`;
    let sql4 = `select u.postName, count(1) num from (
      select userId from info_user_samps 
      where 
        DATE_FORMAT(handleTime,'%Y-%m-%d') = '${selectTime}' and  
        handleType = '已采样' and 
        userId in (select id from info_users where depId > 2)
      ) a
      inner join info_users u on u.id = a.userId
      group by u.postName`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);
    let result4 = await ctx.orm().query(sql4);

    let data = result1.map(m => {
      let f2 = result2.find(f => f.postName === m.postName);
      let f3 = result3.find(f => f.postName === m.postName);
      let f4 = result4.find(f => f.postName === m.postName);
      return {
        postName: m.postName,
        n1: m.num,
        n2: f2 ? parseInt(f2.num) : 0,
        n3: f3 ? parseInt(f3.num) : 0,
        n4: f4 ? parseInt(f4.num) : 0
      }
    })

    let sum = data.reduce((total, curr) => {
      total.n1 += parseInt(curr.n1)
      total.n2 += parseInt(curr.n2)
      total.n3 += parseInt(curr.n3)
      total.n4 += parseInt(curr.n4)
      return total
    }, {
      postName: '合计',
      n1: 0,
      n2: 0,
      n3: 0,
      n4: 0
    })

    data.push(sum)

    ctx.body = data;
  },
  importSamp: async ctx => {
    let sampName = ctx.headers['sampname'] || ''
    sampName = decodeURIComponent(sampName)

    if (ctx.req.files && ctx.req.files.length > 0) {
      let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`))

      let xlsx = excel.readExcel(filePath)

      let data = xlsx.filter(f => f.length >= 5).map(m => {
        return {
          name: m[1].toString().trim(),
          idcard: m[2].toString().trim(),
          phone: m[3] ? m[3].toString().trim() : '',
          sampName: sampName,
          sampTime: formatDate(m[4]),
          status: 0
        }
      })

      // 删除首行
      data.shift()

      ctx.orm().tmp_info_samps.bulkCreate(data)

      // 删除文件
      fs.unlink(filePath, function (error) {
        console.log('delete import samp excel file error:', error)
        return false
      })

      ctx.body = {};
    } else {
      ctx.body = {};
    }
  },
  exportUsers: async ctx => {
    let { batch_no, batchName, name, tel, cert_no, createTime, updateTime, cusTime, cusId, cusName, opStatus, opStatusName, connectType, connectTypes, depName } = ctx.request.body;

    let where = {};

    Object.assign(where, batch_no && { batch_no })
    Object.assign(where, batchName && { batchName })
    Object.assign(where, name && { name })
    Object.assign(where, tel && { tel })
    Object.assign(where, cert_no && { cert_no })
    Object.assign(where, cusId && { cusId })
    Object.assign(where, cusName && { cusName })
    Object.assign(where, opStatus && { opStatus })
    Object.assign(where, opStatusName && { opStatusName })
    Object.assign(where, connectType && { connectType })
    Object.assign(where, depName && { areaName: depName })

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`] }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: [`${updateTime[0]} 00:00:00`, `${updateTime[1]} 23:59:59`] }
    }

    if (cusTime && cusTime.length > 0) {
      where.cusTime = { $between: [`${cusTime[0]} 00:00:00`, `${cusTime[1]} 23:59:59`] }
    }

    if (connectTypes && connectTypes.length > 0) {
      where.connectType = {
        $in: connectTypes
      }
    }

    let users = await ctx.orm().info_users.findAll({
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '回访数据',
      data: []
    })

    xlsxObj[0].data.push([
      '序号',
      '回访日期',
      '话务员姓名',
      '服务对象',
      '联系电话',
      '身份证',
      '年龄',
      '性别',
      '现居住地址',
      '服务地址',
      '服务项目',
      '服务人员',
      '服务组织',
      '开始时间',
      '结束时间',
      '服务时长(分钟)',
      '现居住县区市',
      '是否为本人',
      '是否享受上门服务',
      '享受服务项目',
      '服务次数/月',
      '服务时长/次',
      '服务人员是否固定',
      '服务人员是否着工作服、戴工牌',
      '服务员是否留下联系方式',
      '是否清楚提供服务的组织名称',
      '对服务人员整体评价',
      '服务意见和建议',
      '备注',
      '总结'
    ])

    for (let i = 0, j = users.length; i < j; i++) {
      let user = users[i];

      let arr = new Array();
      arr.push(user.id);
      arr.push(user.cusTime);
      arr.push(user.cusName);
      arr.push(user.name);
      arr.push(user.tel);
      arr.push(user.cert_no);
      arr.push(user.age);
      arr.push(user.sex);
      arr.push(user.address);
      arr.push(user.aap0112);
      arr.push(user.cag0104);
      arr.push(user.bbp0103);
      arr.push(user.bae0104);
      arr.push(user.cbp0107);
      arr.push(user.cbp0108);
      arr.push(user.cbp0113);
      arr.push(user.addr_area);
      arr.push(user.qa1);
      arr.push(user.qa2);
      arr.push(user.qa3);
      arr.push(user.qa4);
      arr.push(user.qa5);
      arr.push(user.qa6);
      arr.push(user.qa7);
      arr.push(user.qa8);
      arr.push(user.qa9);
      arr.push(user.qa10);
      arr.push(user.qa11);
      arr.push(user.qa12);
      arr.push(user.summary);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    // ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    // ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  },
  exportErrorUsers: async ctx => {
    let { batch_no, batchName, name, tel, cert_no, createTime, updateTime, cusTime, cusId, cusName, opStatus, opStatusName, connectType, connectTypes, depName } = ctx.request.body;

    let where = {};

    Object.assign(where, batch_no && { batch_no })
    Object.assign(where, batchName && { batchName })
    Object.assign(where, name && { name })
    Object.assign(where, tel && { tel })
    Object.assign(where, cert_no && { cert_no })
    Object.assign(where, cusId && { cusId })
    Object.assign(where, cusName && { cusName })
    Object.assign(where, opStatus && { opStatus })
    Object.assign(where, opStatusName && { opStatusName })
    Object.assign(where, connectType && { connectType })
    Object.assign(where, depName && { areaName: depName })

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: [`${createTime[0]} 00:00:00`, `${createTime[1]} 23:59:59`] }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: [`${updateTime[0]} 00:00:00`, `${updateTime[1]} 23:59:59`] }
    }

    if (cusTime && cusTime.length > 0) {
      where.cusTime = { $between: [`${cusTime[0]} 00:00:00`, `${cusTime[1]} 23:59:59`] }
    }

    where.qa_num = 1
    where.is_repair = 0
    where.$or = [
      {
        connectType: {
          $in: ['信息有误', '空号', '停机', '限制呼入']
        }
      },
      {
        connectType: {
          $in: ['接通后挂断', '无人接听', '关机']
        },
        cusConnectNum: {
          $gte: 3
        }
      }
    ]

    let users = await ctx.orm().info_users.findAll({
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '异常数据',
      data: []
    })

    xlsxObj[0].data.push([
      '序号',
      '回访日期',
      '话务员姓名',
      '服务对象',
      '联系电话',
      '身份证',
      '年龄',
      '性别',
      '现居住地址',
      '服务地址',
      '服务项目',
      '服务人员',
      '服务组织',
      '开始时间',
      '结束时间',
      '服务时长(分钟)',
      '现居住县区市',
      '是否为本人',
      '是否享受上门服务',
      '享受服务项目',
      '服务次数/月',
      '服务时长/次',
      '服务人员是否固定',
      '服务人员是否着工作服、戴工牌',
      '服务员是否留下联系方式',
      '是否清楚提供服务的组织名称',
      '对服务人员整体评价',
      '服务意见和建议',
      '备注',
      '总结'
    ])

    for (let i = 0, j = users.length; i < j; i++) {
      let user = users[i];

      let arr = new Array();
      arr.push(user.id);
      arr.push(user.cusTime);
      arr.push(user.cusName);
      arr.push(user.name);
      arr.push(user.tel);
      arr.push(user.cert_no);
      arr.push(user.age);
      arr.push(user.sex);
      arr.push(user.address);
      arr.push(user.aap0112);
      arr.push(user.cag0104);
      arr.push(user.bbp0103);
      arr.push(user.bae0104);
      arr.push(user.cbp0107);
      arr.push(user.cbp0108);
      arr.push(user.cbp0113);
      arr.push(user.addr_area);
      arr.push(user.qa1);
      arr.push(user.qa2);
      arr.push(user.qa3);
      arr.push(user.qa4);
      arr.push(user.qa5);
      arr.push(user.qa6);
      arr.push(user.qa7);
      arr.push(user.qa8);
      arr.push(user.qa9);
      arr.push(user.qa10);
      arr.push(user.qa11);
      arr.push(user.qa12);
      arr.push(user.summary);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    // ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    // ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  },
  exportIntegrateUsers: async ctx => {
    let { batchName, cert_no, depName } = ctx.request.body;

    let where = ' where 1=1'

    if (batchName) {
      where += ` and batchName='${batchName}'`
    }

    if (cert_no) {
      where += ` and cert_no='${cert_no}'`
    }

    if (depName) {
      where += ` and areaName='${depName}'`
    }

    let sql2 = `select * from info_users where id in (
      select max(id) from (
      select id, batchName, cert_no from info_users ${where} 
      union all 
      select id, REPLACE(batchName,'-二次','') batchName, cert_no from info_users where parent_id in (select id from info_users ${where})) x 
      group by x.batchName, x.cert_no
    ) order by id desc`

    let result2 = await ctx.orm().query(sql2);

    let xlsxObj = [];
    xlsxObj.push({
      name: '回访数据',
      data: []
    })

    xlsxObj[0].data.push([
      '序号',
      '回访日期',
      '话务员姓名',
      '服务对象',
      '联系电话',
      '身份证',
      '年龄',
      '性别',
      '现居住地址',
      '服务地址',
      '服务项目',
      '服务人员',
      '服务组织',
      '开始时间',
      '结束时间',
      '服务时长(分钟)',
      '现居住县区市',
      '是否为本人',
      '是否享受上门服务',
      '享受服务项目',
      '服务次数/月',
      '服务时长/次',
      '服务人员是否固定',
      '服务人员是否着工作服、戴工牌',
      '服务员是否留下联系方式',
      '是否清楚提供服务的组织名称',
      '对服务人员整体评价',
      '服务意见和建议',
      '备注',
      '总结'
    ])

    for (let i = 0, j = result2.length; i < j; i++) {
      let user = result2[i];

      let arr = new Array();
      arr.push(user.id);
      arr.push(user.cusTime);
      arr.push(user.cusName);
      arr.push(user.name);
      arr.push(user.tel);
      arr.push(user.cert_no);
      arr.push(user.age);
      arr.push(user.sex);
      arr.push(user.address);
      arr.push(user.aap0112);
      arr.push(user.cag0104);
      arr.push(user.bbp0103);
      arr.push(user.bae0104);
      arr.push(user.cbp0107);
      arr.push(user.cbp0108);
      arr.push(user.cbp0113);
      arr.push(user.addr_area);
      arr.push(user.qa1);
      arr.push(user.qa2);
      arr.push(user.qa3);
      arr.push(user.qa4);
      arr.push(user.qa5);
      arr.push(user.qa6);
      arr.push(user.qa7);
      arr.push(user.qa8);
      arr.push(user.qa9);
      arr.push(user.qa10);
      arr.push(user.qa11);
      arr.push(user.qa12);
      arr.push(user.summary);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)

    // ctx.set('Content-Type', 'application/vnd.openxmlformats');
    // ctx.set('Access-Control-Expose-Headers', 'Content-Disposition')
    // ctx.set('Content-Disposition', 'attachment; filename=' + 'orders_export.xlsx');
    ctx.body = excelFile;
  },
  tmpImportSamp: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { sampName, name, phone, idcard, status } = ctx.request.body;

    let where = {};

    Object.assign(where, sampName && { sampName })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_samps.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  tmpImportUser: async ctx => {
    let pageIndex = ctx.request.body.pageIndex || 1;
    let pageSize = ctx.request.body.pageSize || 50;
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, status } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_users.findAndCountAll({
      offset: (pageIndex - 1) * pageSize,
      limit: pageSize,
      where,
      order: [
        ['id', 'desc']
      ]
    });

    ctx.body = {
      total: result.count,
      list: result.rows,
      pageIndex,
      pageSize
    }
  },
  exportTmpImportUser: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, status } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })

    if (tradeTypes && tradeTypes.length > 0) {
      where.tradeType = {
        $in: tradeTypes
      }
    }

    if (postNames && postNames.length > 0) {
      where.postName = {
        $in: postNames
      }
    }

    if (depName1s && depName1s.length > 0) {
      where.depName1 = {
        $in: depName1s
      }
    }

    if (depName2s && depName2s.length > 0) {
      where.depName2 = {
        $in: depName2s
      }
    }

    if (status > -1) {
      where.status = status
    }

    let result = await ctx.orm().tmp_info_users.findAll({
      where,
      order: [
        ['id', 'desc']
      ]
    });

    let xlsxObj = [];
    xlsxObj.push({
      name: '重点人员导入列表',
      data: []
    })

    xlsxObj[0].data.push([
      '编号',
      '部门',
      '单位',
      '单位所在街道',
      '姓名',
      '手机号',
      '身份证号',
      '行业类别',
      '职业名称',
      '状态',
      '导入情况',
      '导入时间'
    ])

    for (let i = 0, j = result.length; i < j; i++) {
      let user = result[i];

      let arr = new Array();
      arr.push(user.id);
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.depStreet || '');
      arr.push(user.name || '');
      arr.push(user.phone || '');
      arr.push(user.idcard || '');
      arr.push(user.tradeType || '');
      arr.push(user.postName || '');
      arr.push(user.status === 0 ? '待导入' : user.status === 1 ? '导入成功' : '导入失败');
      arr.push(user.remark);
      arr.push(user.createTime);

      xlsxObj[0].data.push(arr)
    }

    let excelFile = await excel.exportBigMoreSheetExcel(xlsxObj)
    ctx.body = excelFile;
  },
  submitDep: async ctx => {
    let { id, depName, depStreet, parentDepName } = ctx.request.body;

    assert.ok(!!depName, 'InputParamIsNull');
    assert.ok(!!depStreet, 'InputParamIsNull');
    assert.ok(!!parentDepName, 'InputParamIsNull');

    let parentDep = await ctx.orm().info_deps.findOne({
      where: {
        depName: parentDepName,
        depLevel: 1,
        parentId: 0
      }
    })
    assert.ok(!!parentDep, '部门不存在');

    if (id) {
      let dep = await ctx.orm().info_deps.findOne({
        where: {
          id
        }
      })
      assert.ok(!!dep, '单位不存在');

      await ctx.orm().info_deps.update({
        depName,
        depStreet
      }, {
        where: {
          id: dep.id
        }
      })

      if (dep.depName !== depName) {
        await ctx.orm().info_users.update({
          depName2: depName,
          isUp: 0
        }, {
          where: {
            depName2: dep.depName
          }
        })
      }
    } else {
      await ctx.orm().info_deps.create({
        depName,
        depLevel: 2,
        depStreet,
        parentId: parentDep.id,
        isDel: 0
      })
    }

    ctx.body = {}
  },
  updateUserRest: async ctx => {
    let { id, restTime } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id,
        userType: {
          $in: ['在线', '已设置休假']
        },
        depId: {
          $gt: 2
        }
      }
    })

    assert.ok(!!user, '用户不存在');

    let userType = '在线'
    var oDate1 = new Date(restTime[0]);
    var oDate2 = new Date(date.formatDate(new Date(), 'YYYY-MM-DD'));
    if (oDate1.getTime() <= oDate2.getTime()) {
      userType = '正在休假'
    } else {
      userType = '已设置休假'
    }

    await ctx.orm().info_users.update({
      userType: userType,
      restStartTime: restTime[0],
      restEndTime: restTime[1]
    }, {
      where: {
        id: user.id
      }
    })
  },
  cancelUserRest: async ctx => {
    let { id } = ctx.request.body;

    let user = await ctx.orm().info_users.findOne({
      where: {
        id,
        userType: {
          $in: ['正在休假', '已设置休假']
        },
        depId: {
          $gt: 2
        }
      }
    })

    assert.ok(!!user, '用户不存在');

    await ctx.orm().info_users.update({
      userType: '在线',
      restStartTime: null,
      restEndTime: null
    }, {
      where: {
        id: user.id
      }
    })
  },
  getUpdateErrorSwitch: async ctx => {
    let updateErrorSwitch = await configData.getConfig(ctx, 'UpdateErrorSwitch');

    ctx.body = {
      val: updateErrorSwitch
    }
  },
  setUpdateErrorSwitch: async ctx => {
    let { val } = ctx.request.body;

    await ctx.orm().BaseConfig.update({
      value: val,
      lasttime: date.getTimeStamp()
    }, {
      where: {
        key: 'UpdateErrorSwitch'
      }
    })

    ctx.body = {}
  },
  getErrorSwitch: async ctx => {
    let errorSwitch = await configData.getConfig(ctx, 'ErrorSwitch');

    ctx.body = {
      val: errorSwitch
    }
  },
  setErrorSwitch: async ctx => {
    let { val } = ctx.request.body;

    await ctx.orm().BaseConfig.update({
      value: val,
      lasttime: date.getTimeStamp()
    }, {
      where: {
        key: 'ErrorSwitch'
      }
    })

    ctx.body = {}
  }
};