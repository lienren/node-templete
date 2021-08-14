/*
 * @Author: Lienren 
 * @Date: 2021-04-11 11:50:42 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-04-13 22:17:18
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

module.exports = {
  getMemberList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 20;
    let keyword = ctx.request.body.keyword || '';
    let userCompanyId = ctx.request.body.userCompanyId || 0;

    let where = {
      is_del: 0
    };

    if (keyword !== '') {
      where.$or = [{
        username: {
          $like: `%${keyword}%`
        }
      }, {
        nickname: {
          $like: `%${keyword}%`
        }
      }];
    }

    if (userCompanyId) {
      where.user_company_id = userCompanyId;
    }

    let result = await ctx.orm().ums_member.findAndCountAll({
      attributes: ['id', 'member_level_id', 'username', 'nickname', 'phone', 'status', 'create_time', 'gender', 'personalized_signature', 'source_type', 'integration', 'luckey_count', 'history_integration', 'user_company_id', 'cmp_admin_id', 'cmp_admin_name'],
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where: where,
      order: [['create_time', 'desc']]
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          memberLevelId: m.dataValues.member_level_id,
          createTime: m.dataValues.create_time,
          personalizedSignature: m.dataValues.personalized_signature,
          sourceType: m.dataValues.source_type,
          luckeyCount: m.dataValues.luckey_count,
          historyIntegration: m.dataValues.history_integration,
          userCompanyId: m.dataValues.user_company_id,
          cmpAdminId: m.dataValues.cmp_admin_id,
          cmpAdminName: m.dataValues.cmp_admin_name
        }
      }),
    };
  },
  addMember: async (ctx) => {
    let adminId = ctx.request.body.adminId || 0;
    let opAdminId = ctx.request.body.opAdminId || 0;
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';
    let nickname = ctx.request.body.nickname || '';
    let phone = ctx.request.body.phone || '';
    let status = ctx.request.body.status || 1;
    let gender = ctx.request.body.gender || 1;
    let integration = ctx.request.body.integration || 0;
    let userCompanyId = ctx.request.body.userCompanyId || 0;

    integration = parseInt(integration);

    if (userCompanyId && adminId && opAdminId) {
      let admin = await ctx.orm().ums_admin.findOne({
        where: {
          id: adminId,
          status: 1,
          user_type: 2,
          user_company_id: userCompanyId,
          is_del: 0
        }
      });

      let opAdmin = await ctx.orm().ums_admin.findOne({
        where: {
          id: opAdminId,
          status: 1,
          is_del: 0
        }
      });

      if (admin && opAdmin) {
        // 减管理员积分
        let updateRow = await ctx.orm().cms_user_currency.update({
          user_currency: sequelize.literal(`user_currency - ${integration}`)
        }, {
          where: {
            user_id: admin.id,
            cmp_id: admin.user_company_id,
            user_currency: {
              $gte: integration
            },
            user_type: 2
          }
        })

        if (updateRow && updateRow.length > 0 && updateRow[0] > 0) {
          let member = await ctx.orm().ums_member.create({
            member_level_id: 4,
            username,
            password: encrypt.getMd5(`${password}|${username}`),
            nickname,
            phone,
            status,
            create_time: date.formatDate(),
            icon: '',
            gender,
            birthday: '1970-01-01',
            city: '',
            job: '',
            personalized_signature: '',
            source_type: 1,
            integration,
            growth: 0,
            luckey_count: 0,
            history_integration: 0,
            user_company_id: userCompanyId,
            is_del: 0,
            cmp_admin_id: admin.id,
            cmp_admin_name: admin.nick_name
          })

          if (integration > 0) {
            // 记录员工积分充值
            ctx.orm().cms_user_currency_log.create({
              cmp_admin_id: admin.id,
              cmp_admin_name: admin.nick_name,
              cmp_member_id: member.id,
              cmp_member_name: member.nickname,
              state_context: `用户成功充值${integration}积分`,
              state_time: date.formatDate(),
              remark: '新增用户充值',
              op_admin_id: opAdmin.id,
              op_admin_name: opAdmin.nick_name
            });
          }
        } else {
          await ctx.orm().ums_member.create({
            member_level_id: 4,
            username,
            password: encrypt.getMd5(`${password}|${username}`),
            nickname,
            phone,
            status,
            create_time: date.formatDate(),
            icon: '',
            gender,
            birthday: '1970-01-01',
            city: '',
            job: '',
            personalized_signature: '',
            source_type: 1,
            integration: 0,
            growth: 0,
            luckey_count: 0,
            history_integration: 0,
            user_company_id: userCompanyId,
            is_del: 0,
            cmp_admin_id: admin.id,
            cmp_admin_name: admin.nick_name
          })
        }
      }
    }

    ctx.body = {};
  },
  editMember: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let username = ctx.request.body.username || '';
    let password = ctx.request.body.password || '';
    let nickname = ctx.request.body.nickname || '';
    let phone = ctx.request.body.phone || '';
    let status = ctx.request.body.status || 1;
    let gender = ctx.request.body.gender || 1;

    if (password) {
      await ctx.orm().ums_member.update({
        username,
        password: encrypt.getMd5(`${password}|${username}`),
        nickname,
        phone,
        status,
        gender
      }, {
        where: {
          id,
          is_del: 0
        }
      })
    } else {
      await ctx.orm().ums_member.update({
        username,
        nickname,
        phone,
        status,
        gender
      }, {
        where: {
          id,
          is_del: 0
        }
      })
    }

    ctx.body = {};
  },
  editMemberState: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let status = ctx.request.body.status;

    await ctx.orm().ums_member.update({
      status
    }, {
      where: {
        id,
        is_del: 0
      }
    })

    ctx.body = {};
  },
  delMember: async (ctx) => {
    let id = ctx.request.body.id || 0;

    await ctx.orm().ums_member.update({
      is_del: 1
    }, {
      where: {
        id
      }
    })

    ctx.body = {};
  },
  editCurrency: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let opAdminId = ctx.request.body.opAdminId || 0;
    let integration = ctx.request.body.integration || 0;

    let opAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: opAdminId,
        status: 1,
        is_del: 0
      }
    });

    let member = await ctx.orm().ums_member.findOne({
      where: {
        id,
        is_del: 0
      }
    });

    if (opAdmin && member) {
      let admin = await ctx.orm().ums_admin.findOne({
        where: {
          id: member.cmp_admin_id,
          status: 1,
          user_type: 2,
          user_company_id: member.user_company_id,
          is_del: 0
        }
      });

      integration = parseInt(integration);

      if (admin && opAdmin && integration > 0) {
        // 减管理员积分
        let updateRow = await ctx.orm().cms_user_currency.update({
          user_currency: sequelize.literal(`user_currency - ${integration}`)
        }, {
          where: {
            user_id: admin.id,
            cmp_id: admin.user_company_id,
            user_currency: {
              $gte: integration
            },
            user_type: 2
          }
        })

        if (updateRow && updateRow.length > 0 && updateRow[0] > 0) {
          await ctx.orm().ums_member.update({
            integration: sequelize.literal(`integration + ${integration}`)
          }, {
            where: {
              id: member.id,
              is_del: 0
            }
          })

          // 记录员工积分充值
          ctx.orm().cms_user_currency_log.create({
            cmp_admin_id: admin.id,
            cmp_admin_name: admin.nick_name,
            cmp_member_id: member.id,
            cmp_member_name: member.nickname,
            state_context: `用户成功充值${integration}积分`,
            state_time: date.formatDate(),
            remark: '给用户充值',
            op_admin_id: opAdmin.id,
            op_admin_name: opAdmin.nick_name
          });
        }
      }
    }

    ctx.body = {};
  },
  stat1: async (ctx) => {
    let searchTime = ctx.request.body.searchTime || [];

    let startTime = '2021-08-01 00:00:00';
    let endTime = '2099-12-31 23:59:59';

    if (searchTime && searchTime.length === 2) {
      startTime = `${searchTime[0]} 00:00:00`
      endTime = `${searchTime[1]} 23:59:59`
    }

    let sql = `select 'orders', count(1) num from oms_order where create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'ordermembers', count(1) from (select member_id from oms_order where status in (1,2,3) and create_time between '${startTime}' and '${endTime}' group by member_id) a
    union all 
    select 'orderamouts', sum(total_amount) num from oms_order where create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'orderpays', count(1) num from oms_order where status in (1,2,3) and create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'orderpayamouts', sum(pay_amount) num from oms_order where status in (1,2,3) and create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'orderdiscountamouts', sum(total_amount) - sum(pay_amount) num from oms_order where status in (1,2,3) and create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'members', count(1) num from ums_member where create_time between '${startTime}' and '${endTime}' 
    union all 
    select 'providers', count(1) - 1 num from provider_info 
    union all 
    select 'onlineproducts', count(1) num from pms_product where delete_status = 0 and publish_status = 1 and is_del = 0 
    union all 
    select 'products', count(1) num from pms_product where delete_status = 0 and is_del = 0 
    union all 
    select 'skus', count(1) num from pms_sku_stock where product_id in (select id from pms_product where delete_status = 0 and is_del = 0) 
    union all 
    select 'brands', count(1) num from pms_brand where is_del = 0;`

    let stat = await ctx.orm().query(sql);

    ctx.body = stat;
  },
  stat2: async (ctx) => {
    let sql = `select 'authlogin', date, sum(num) pv, count(1) uv from (
      select DATE_FORMAT(addTimeYMD,'%Y-%m-%d') date, udcId, count(1) num from pagelogs group by DATE_FORMAT(addTimeYMD,'%Y-%m-%d'), udcId
    ) a 
    group by date 
    union all 
    select 'submitorders', date, sum(num) pv, count(1) uv from (
    select DATE_FORMAT(create_time,'%Y-%m-%d') date, member_id, count(1) num from oms_order group by DATE_FORMAT(create_time,'%Y-%m-%d'), member_id
    ) a 
    group by date 
    union all 
    select 'payorders', date, sum(num) pv, count(1) uv from (
    select DATE_FORMAT(create_time,'%Y-%m-%d') date, member_id, count(1) num from oms_order where status in (1, 2, 3) group by DATE_FORMAT(create_time,'%Y-%m-%d'), member_id
    ) a 
    group by date;`

    let stat = await ctx.orm().query(sql);
    let dataScope = date.dataScope(date.addDay(new Date(), -30), new Date());

    // { '日期': '2018-05-22', '访问用户': 32371, '下单用户': 19810, '支付用户': 200 },
    let rows = []

    for (let i = 0, j = dataScope.length; i < j; i++) {
      let row = {
        '日期': dataScope[i],
        '访问用户': 0,
        '下单用户': 0,
        '支付用户': 0
      }

      let f1 = stat.find(f => f.authlogin === 'authlogin' && f.date === dataScope[i])
      row.访问用户 = f1 ? f1.uv : 0


      let f2 = stat.find(f => f.authlogin === 'submitorders' && f.date === dataScope[i])
      row.下单用户 = f2 ? f2.uv : 0

      let f3 = stat.find(f => f.authlogin === 'payorders' && f.date === dataScope[i])
      row.支付用户 = f3 ? f3.uv : 0

      rows.push(row);
    }

    ctx.body = rows;
  },
  stat3: async (ctx) => {
    let brands = await ctx.orm().cmp_banners.findAll({
      where: {
        is_del: 0
      }
    })

    // { '日期': '2018-05-22', '访问用户': 32371, '下单用户': 19810, '支付用户': 200 },
    let columns = ['日期'];
    let rows = [];

    for (let i = 0, j = brands.length; i < j; i++) {
      columns.push(brands[i].title)
    }

    if (brands && brands.length > 0) {
      let sql = `select date, eventValue, count(udcId) uv, sum(num) pv from (
        select DATE_FORMAT(addTimeYMD,'%Y-%m-%d') date, eventValue, udcId, count(1) num from pagelogs 
        where eventName = '用户点击首页Banner' group by DATE_FORMAT(addTimeYMD,'%Y-%m-%d'), eventValue, udcId
        ) a 
        group by date, eventValue;`

      let stat = await ctx.orm().query(sql);
      let dataScope = date.dataScope(date.addDay(new Date(), -30), new Date());

      for (let i = 0, j = dataScope.length; i < j; i++) {
        let row = {
          '日期': dataScope[i]
        }

        for (let x = 0, y = brands.length; x < y; x++) {
          let find = stat.find(f => f.eventValue === brands[x].title && f.date === dataScope[i])
          row[brands[x].title] = find ? find.uv : 0
        }

        rows.push(row);
      }
    }

    ctx.body = {
      columns,
      rows
    };
  },
  stat4: async (ctx) => {
    let searchTime = ctx.request.body.searchTime || [];

    let startTime = '2021-08-01 00:00:00';
    let endTime = '2099-12-31 23:59:59';

    if (searchTime && searchTime.length === 2) {
      startTime = `${searchTime[0]} 00:00:00`
      endTime = `${searchTime[1]} 23:59:59`
    }

    let sql = `select * from (
      select * from (
      select 'view', eventValue, count(udcId) uv, sum(num) pv from (
      select eventValue, udcId, count(1) num from pagelogs 
      where eventName = '用户查看商品' and addTimeYMD between '${startTime}' and '${endTime}' group by eventValue, udcId 
      ) a
      group by eventValue) b 
      order by b.uv desc, b.pv desc limit 10) c 
      union all 
      select * from (
      select * from (
      select 'buy', product_name eventValue, count(member_id) uv, sum(num) pv from (
      select m.product_name, o.member_id, sum(product_quantity) num from oms_order_item m 
      inner join oms_order o on o.id = m.order_id 
      where o.status in (1,2,3) and o.create_time between '${startTime}' and '${endTime}' 
      group by m.product_name, o.member_id 
      ) a 
      group by product_name 
      ) b 
      order by b.uv desc, b.pv desc limit 10) c;`

    let stat = await ctx.orm().query(sql);

    ctx.body = stat;
  }
};