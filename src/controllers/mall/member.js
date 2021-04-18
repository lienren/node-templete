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
  }
};