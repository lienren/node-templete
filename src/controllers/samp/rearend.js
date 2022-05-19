/*
 * @Author: Lienren
 * @Date: 2021-09-04 22:52:54
 * @LastEditTime: 2022-05-20 06:35:52
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
    let { batch_no, name, tel, cert_no, createTime, updateTime, cusId, cusName, opStatus, opStatusName, connectType, connectTypes, depName } = ctx.request.body;

    let where = {};

    Object.assign(where, batch_no && { batch_no })
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
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: updateTime }
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
          col['streetName'] = streetName[m[i]]
        } else if (keys[i] === 'IS_KCDJ') {
          if (!m[i]) {
            col[keys[i]] = 0
          } else {
            col[keys[i]] = m[i]
          }
        } else {
          col[keys[i]] = m[i]
        }
      }
      return col
    });

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

    await ctx.orm().info_users.update({
      tel, address, aap0112, bbp0103, bae0104, addr_area,
      opStatus: 1,
      opStatusName: opStatusNameEnum[1],
      connectType: ''
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  editUsersQA: async ctx => {
    let { id, qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12, qa13 } = ctx.request.body;

    await ctx.orm().info_users.update({
      qa1, qa2, qa3, qa4, qa5, qa6, qa7, qa8, qa9, qa10, qa11, qa12, qa13,
      opStatus: 2,
      opStatusName: opStatusNameEnum[2],
      connectType: '已接听',
      cusTime: date.formatDate(),
      cusConnectNum: sequelize.literal(`cusConnectNum + 1`)
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  editUserConnectType: async ctx => {
    let { id, connectType, qa12 } = ctx.request.body;

    // '无人接听': '无人接听',
    // '信息有误': '信息有误',
    // '关机': '关机',
    // '空号': '空号',
    // '停机': '停机',
    // '限制呼入': '限制呼入'

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
    await ctx.orm().info_users.update({
      connectType,
      qa12: qa12,
      opStatus: opStatus,
      opStatusName: opStatusNameEnum[opStatus],
      cusTime: date.formatDate(),
      cusConnectNum: sequelize.literal(`cusConnectNum + 1`)
    }, {
      where: {
        id
      }
    })

    ctx.body = {}
  },
  s1: async ctx => {
    let { batch_no, batchName } = ctx.request.body;

    let where = ' where 1=1 ';

    if (batch_no) {
      where += ` and batch_no = '${batch_no}' `
    }

    if (batchName) {
      where += ` and batchName = '${batchName}' `
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
    ) h1 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '接通后挂断' group by areaName
    ) h2 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '否' and qa13 = '去世' group by areaName
    ) h3 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '已接听' and qa2 = '不清楚/不记得' group by areaName
    ) h4 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '无人接听' group by areaName
    ) i1 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '信息有误' group by areaName
    ) i2 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '关机' group by areaName
    ) i3 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '空号' group by areaName
    ) i4 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '停机' group by areaName
    ) i5 on g.areaName = a.areaName 
    left join (
      select areaName, count(1) uv from info_users ${where} and opStatus = 2 and connectType = '限制呼入' group by areaName
    ) i6 on g.areaName = a.areaName`;

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
    let sampName = ctx.request.body.sampName || '';
    let depName1 = ctx.request.body.depName1 || '';
    let depName2 = ctx.request.body.depName2 || '';
    let where1 = ''
    let where2 = ''
    let where3 = ''

    if (sampName) {
      where1 += ` and sampName = '${sampName}'`
      where2 += ` and sampName = '${sampName}'`
      where3 += ` and sampName = '${sampName}'`
    }

    if (depName1) {
      where1 += ` and depName1 = '${depName1}'`
      where2 += ` and exists(select * from info_users where depName1 = '${depName1}' and id = info_user_samps.userId)`
    }

    if (depName2) {
      where1 += ` and depName2 = '${depName2}'`
      where2 += ` and exists(select * from info_users where depName2 = '${depName2}' and id = info_user_samps.userId)`
    }

    let sql1 = `select DATE_FORMAT(handleTime,'%Y-%m-%d') 日期, count(1) 采样人数 from info_user_samps 
    where handleType != '未采样' and handleTime >= DATE_ADD(now(),INTERVAL -8 day) ${where2}
    group by DATE_FORMAT(handleTime,'%Y-%m-%d')`

    let sql2 = `select 't1' title, count(1) num from info_users where 1=1 ${where1} 
    union all 
    select 't2' title, count(1) num from info_users where depId > 2 ${where1} 
    union all 
    select 't3' title, count(1) num from info_users where depId <= 2 ${where1} 
    union all 
    select 't4' title, count(1) num from info_user_samps where handleType != '未采样'  ${where2} 
    union all 
    select 't5' title, count(1) num from info_users where createTime >= DATE_FORMAT(now(),'%Y-%m-%d')  ${where1} 
    union all 
    select 't6' title, count(1) num from info_user_samps where handleTime >= DATE_FORMAT(now(),'%Y-%m-%d') and handleType != '未采样'  ${where2} 
    union all 
    select 't7' title, count(1) num from info_samps where 1=1 ${where3} 
    union all 
    select 't8' title, count(1) num from SuperManagerInfo where verifyLevel = 1 and isDel = 0 ${sampName ? ` and depName = '${sampName}'` : ''}`

    let sql3 = `select * from (
      select sampName 采样点, count(1) 采样人数 from info_user_samps where handleType != '未采样' and handleTime >= CURDATE() ${where2} group by sampName
      ) a order by a.采样人数 desc `


    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);
    let result3 = await ctx.orm().query(sql3);

    ctx.body = {
      line: result1,
      stat2: result2,
      line1: result3
    };
  },
  s3: async ctx => {
    let { tradeTypes, postNames, depName1s, depName2s, depName2, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampType, sampName, sampUserName, sampHandleTime, startEndTime, createTime, updateTime } = ctx.request.body;

    let where = '';

    if (sampType && sampType.length > 0) {
      where += ` and ss.sampType = '${sampType}'`;
    }

    if (tradeTypes && tradeTypes.length > 0) {
      where += ' and u.tradeType in (' + tradeTypes.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (postNames && postNames.length > 0) {
      where += ' and u.postName in (' + postNames.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName1s && depName1s.length > 0) {
      where += ' and u.depName1 in (' + depName1s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2s && depName2s.length > 0) {
      where += ' and u.depName2 in (' + depName2s.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (depName2) {
      where += ` and u.depName2 = '${depName2}' `;
    }

    if (depStreet) {
      where += ` and u.depStreet = '${depStreet}'`;
    }

    if (name) {
      where += ` and u.name = '${name}'`;
    }

    if (phone) {
      where += ` and u.phone = '${phone}'`;
    }

    if (idcard) {
      where += ` and u.idcard = '${idcard}'`;
    }

    if (tradeType) {
      where += ` and u.tradeType = '${tradeType}'`;
    }

    if (postName) {
      where += ` and u.postName = '${postName}'`;
    }

    if (periodType) {
      where += ` and u.periodType = '${periodType}'`;
    }

    if (street) {
      where += ` and u.street = '${street}'`;
    }

    if (community) {
      where += ` and u.community = '${community}'`;
    }

    if (streets && streets.length > 0) {
      where += ' and u.street in (' + streets.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (communitys && communitys.length > 0) {
      where += ' and u.community in (' + communitys.map(m => {
        return `'${m}'`
      }).join(',') + ')';
    }

    if (address) {
      where += ` and u.address like '%${address}%'`;
    }

    if (userType) {
      where += ` and u.userType = '${userType}'`;
    }

    if (sampStartTime && sampStartTime.length > 0) {
      where += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
    }

    if (sampName) {
      where += ` and u.sampName = '${sampName}'`;
    }

    if (sampUserName) {
      where += ` and u.sampUserName = '${sampUserName}'`;
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
    }

    if (createTime && createTime.length > 0) {
      where += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
    }

    if (updateTime && updateTime.length > 0) {
      where += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
    }

    if (startEndTime && startEndTime.length > 0) {
      where += ` and s.startTime >= '${startEndTime[0]}' and s.endTime <= '${startEndTime[1]}'`;
    }

    let sql1 = `select a.sampName, a.userType, count(1) num from (
      select 
      s.sampName, 
      case when u.depId = 2 then '愿检尽检' else '重点人群' end userType from info_user_samps s 
      inner join info_users u on u.id = s.userId 
      inner join info_samps ss on ss.sampName = s.sampName 
      where 1=1 and s.handleType = '已采样' ${where}) a 
      group by a.sampName, a.userType`;

    let result1 = await ctx.orm().query(sql1);

    let data = [];
    result1.map(m => {
      let f = data.find(f => f.name === m.sampName);

      if (f) {
        if (m.userType === '愿检尽检') {
          f.d1 = m.num;
        } else {
          f.d2 = m.num;
        }
      } else {
        data.push({
          name: m.sampName,
          d1: m.userType === '愿检尽检' ? m.num : 0,
          d2: m.userType === '重点人群' ? m.num : 0
        })
      }
    });

    let sum = data.reduce((total, curr) => {
      total.d1 += parseInt(curr.d1)
      total.d2 += parseInt(curr.d2)
      return total
    }, {
      name: '合计',
      d1: 0,
      d2: 0
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
    let { tradeTypes, postNames, depName1s, depName2s, depStreet, name, phone, idcard, tradeType, postName, periodType, street, community, streets, communitys, address, userType,
      sampStartTime, sampName, sampUserName, sampHandleTime, createTime, updateTime } = ctx.request.body;

    let where = {};

    Object.assign(where, depStreet && { depStreet })
    Object.assign(where, name && { name })
    Object.assign(where, phone && { phone })
    Object.assign(where, idcard && { idcard })
    Object.assign(where, tradeType && { tradeType })
    Object.assign(where, postName && { postName })
    Object.assign(where, periodType && { periodType })
    Object.assign(where, userType && { userType })
    Object.assign(where, street && { street })
    Object.assign(where, community && { community })
    Object.assign(where, sampName && { sampName })
    Object.assign(where, sampUserName && { sampUserName })

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

    if (sampStartTime && sampStartTime.length > 0) {
      where.sampStartTime = { $between: sampStartTime }
    }

    if (sampHandleTime && sampHandleTime.length > 0) {
      where.sampHandleTime = { $between: sampHandleTime }
    }

    if (createTime && createTime.length > 0) {
      where.createTime = { $between: createTime }
    }

    if (updateTime && updateTime.length > 0) {
      where.updateTime = { $between: updateTime }
    }

    if (address) {
      where.address = {
        $like: `%"${address}"%`
      }
    }

    let users = await ctx.orm().info_users.findAll({
      where
    });

    let samps = []
    if (users && users.length > 0) {
      let where1 = '';

      if (tradeTypes && tradeTypes.length > 0) {
        where1 += ' and u.tradeType in (' + tradeTypes.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (postNames && postNames.length > 0) {
        where1 += ' and u.postName in (' + postNames.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depName1s && depName1s.length > 0) {
        where1 += ' and u.depName1 in (' + depName1s.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depName2s && depName2s.length > 0) {
        where1 += ' and u.depName2 in (' + depName2s.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (depStreet) {
        where1 += ` and u.depStreet = '${depStreet}'`;
      }

      if (name) {
        where1 += ` and u.name = '${name}'`;
      }

      if (phone) {
        where1 += ` and u.phone = '${phone}'`;
      }

      if (idcard) {
        where1 += ` and u.idcard = '${idcard}'`;
      }

      if (tradeType) {
        where1 += ` and u.tradeType = '${tradeType}'`;
      }

      if (postName) {
        where1 += ` and u.postName = '${postName}'`;
      }

      if (periodType) {
        where1 += ` and u.periodType = '${periodType}'`;
      }

      if (street) {
        where1 += ` and u.street = '${street}'`;
      }

      if (community) {
        where1 += ` and u.community = '${community}'`;
      }

      if (streets && streets.length > 0) {
        where1 += ' and u.street in (' + streets.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (communitys && communitys.length > 0) {
        where1 += ' and u.community in (' + communitys.map(m => {
          return `'${m}'`
        }).join(',') + ')';
      }

      if (address) {
        where1 += ` and u.address like '%${address}%'`;
      }

      if (userType) {
        where1 += ` and u.userType = '${userType}'`;
      }

      if (sampStartTime && sampStartTime.length > 0) {
        where1 += ` and u.sampStartTime between '${sampStartTime[0]}' and '${sampStartTime[1]}'`;
      }

      if (sampName) {
        where1 += ` and u.sampName = '${sampName}'`;
      }

      if (sampUserName) {
        where1 += ` and u.sampUserName = '${sampUserName}'`;
      }

      if (sampHandleTime && sampHandleTime.length > 0) {
        where1 += ` and u.sampHandleTime between '${sampHandleTime[0]}' and '${sampHandleTime[1]}'`;
      }

      if (createTime && createTime.length > 0) {
        where1 += ` and u.createTime between '${createTime[0]}' and '${createTime[1]}'`;
      }

      if (updateTime && updateTime.length > 0) {
        where1 += ` and u.updateTime between '${updateTime[0]}' and '${updateTime[1]}'`;
      }

      let sql1 = `select s.*, u.depName1, u.depName2, u.depStreet, u.name, u.phone, u.idcard, u.street, u.community, u.address from info_user_samps s 
      inner join info_users u on u.id = s.userId 
      where 1=1 ${where1}`;
      samps = await ctx.orm().query(sql1);
    }

    let xlsxObj = [];
    xlsxObj.push({
      name: '采样人员列表',
      data: []
    })

    xlsxObj.push({
      name: '采样信息列表',
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
      '采样周期',
      '街道',
      '社区',
      '住址',
      '用户类型',
      '采集开始时间',
      '最新采样点名称',
      '最新采样人姓名',
      '最新采样时间',
      '创建时间',
      '最后修改时间'
    ])

    xlsxObj[1].data.push([
      '编号',
      '部门',
      '单位',
      '单位所在街道',
      '姓名',
      '手机号',
      '身份证号',
      '职业名称',
      '采样周期',
      '街道',
      '社区',
      '住址',
      '应采样开始时间',
      '应采样结束时间',
      '采样状态',
      '实际采样时间',
      '采样点',
      '采样人',
      '创建时间',
      '最后修改时间'
    ])


    for (let i = 0, j = users.length; i < j; i++) {
      let user = users[i];

      let arr = new Array();
      arr.push(user.id || '');
      arr.push(user.depName1 || '');
      arr.push(user.depName2 || '');
      arr.push(user.depStreet || '');
      arr.push(user.name);
      arr.push(user.phone);
      arr.push(user.idcard);
      arr.push(user.tradeType);
      arr.push(user.postName);
      arr.push(user.periodType);
      arr.push(user.street);
      arr.push(user.community);
      arr.push(user.address);
      arr.push(user.userType);
      arr.push(user.sampStartTime);
      arr.push(user.sampName);
      arr.push(user.sampUserName);
      arr.push(user.sampHandleTime);
      arr.push(user.createTime);
      arr.push(user.updateTime);

      xlsxObj[0].data.push(arr)
    }

    for (let i = 0, j = samps.length; i < j; i++) {
      let samp = samps[i];
      // let user = users.find(f => f.id === samp.dataValues.userId)

      let arr = new Array();
      arr.push(samp.id || '');
      arr.push(samp.depName1 || '');
      arr.push(samp.depName2 || '');
      arr.push(samp.depStreet || '');
      arr.push(samp.name);
      arr.push(samp.phone);
      arr.push(samp.idcard);
      arr.push(samp.postName);
      arr.push(samp.periodType);
      arr.push(samp.street);
      arr.push(samp.community);
      arr.push(samp.address);
      arr.push(samp.startTime);
      arr.push(samp.endTime);
      arr.push(samp.handleType);
      arr.push(samp.handleTime);
      arr.push(samp.sampName);
      arr.push(samp.sampUserName);
      arr.push(samp.createTime);
      arr.push(samp.updateTime);

      xlsxObj[1].data.push(arr)
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
  }
};