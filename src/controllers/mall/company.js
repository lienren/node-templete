/*
 * @Author: Lienren 
 * @Date: 2021-03-11 15:14:00 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-16 08:58:06
 */
'use strict';

const assert = require('assert');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const encrypt = require('../../utils/encrypt');
const cp = require('./checkParam');

const arriveStateEnum = {
  0: '未知',
  1: '未到帐',
  2: '全部到帐',
  3: '到部分帐'
}

const verifyStateEnum = {
  0: '未知',
  1: '未审核',
  2: '一审通过',
  21: '一审未通过',
  3: '二审通过',
  31: '二审未通过',
  999: '作废'
}

module.exports = {
  cmpList: async (ctx) => {
    let keyword = ctx.request.body.keyword || '';
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;

    let where = {
      is_del: 0
    }

    if (keyword) {
      where.name = {
        $like: `%${keyword}%`
      }
    }

    let result = await ctx.orm().cmp_info.findAndCountAll({
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
          contactUsername: m.dataValues.contact_username,
          contactPost: m.dataValues.contact_post,
          contactPhone: m.dataValues.contact_phone,
          contactEmail: m.dataValues.contact_email,
          createTime: m.dataValues.create_time,
          mainBusiness: m.dataValues.main_business,
          createTime: m.dataValues.create_time,
          updateTime: m.dataValues.update_time
        }
      }),
    };
  },
  cmpCreate: async (ctx) => {
    let name = ctx.request.body.name || '';
    let website = ctx.request.body.website || '';
    let phone = ctx.request.body.phone || '';
    let main_business = ctx.request.body.mainBusiness || '';
    let city = ctx.request.body.city || '';
    let address = ctx.request.body.address || '';
    let contact_username = ctx.request.body.contactUsername || '';
    let contact_post = ctx.request.body.contactPost || '';
    let contact_phone = ctx.request.body.contactPhone || '';
    let contact_email = ctx.request.body.contactEmail || '';

    await ctx.orm().cmp_info.create({
      name,
      website,
      phone,
      main_business,
      city,
      address,
      contact_username,
      contact_post,
      contact_phone,
      contact_email,
      is_del: 0
    });

    ctx.body = {}
  },
  cmpEdit: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let name = ctx.request.body.name || '';
    let website = ctx.request.body.website || '';
    let phone = ctx.request.body.phone || '';
    let main_business = ctx.request.body.mainBusiness || '';
    let city = ctx.request.body.city || '';
    let address = ctx.request.body.address || '';
    let contact_username = ctx.request.body.contactUsername || '';
    let contact_post = ctx.request.body.contactPost || '';
    let contact_phone = ctx.request.body.contactPhone || '';
    let contact_email = ctx.request.body.contactEmail || '';

    await ctx.orm().cmp_info.update({
      name,
      website,
      phone,
      main_business,
      city,
      address,
      contact_username,
      contact_post,
      contact_phone,
      contact_email
    }, {
      where: {
        id
      }
    });

    ctx.body = {}
  },
  cmpDel: async (ctx) => {
    let id = ctx.request.body.id || 0;

    // 删除公司
    await ctx.orm().cmp_info.update({
      is_del: 1
    }, {
      where: {
        id
      }
    });

    // 删除公司员工
    await ctx.orm().ums_admin.update({
      is_del: 1
    }, {
      where: {
        user_company_id: id,
        user_type: 1
      }
    });

    ctx.body = {}
  },
  cmpRechargeList: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10;
    let cmp_id = ctx.request.body.cmpId || 0;
    let create_admin_id = ctx.request.body.createAdminId || 0;
    let arrive_state = ctx.request.body.arriveState || 0;
    let verify_state = ctx.request.body.verifyState || 0;

    let where = {}
    if (cmp_id > 0) {
      where.cmp_id = cmp_id
    }

    if (create_admin_id > 0) {
      where.create_admin_id = create_admin_id
    }

    if (arrive_state > 0) {
      where.arrive_state = arrive_state
    }

    if (verify_state > 0) {
      where.verify_state = verify_state
    }

    let result = await ctx.orm().cmp_recharge.findAndCountAll({
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
          cmpId: m.dataValues.cmp_id,
          cmpName: m.dataValues.cmp_name,
          cmpAdminId: m.dataValues.cmp_admin_id,
          cmpAdminName: m.dataValues.cmp_admin_name,
          arriveState: m.dataValues.arrive_state,
          arriveStateName: m.dataValues.arrive_state_name,
          arriveStateImg1: m.dataValues.arrive_state_img1,
          arriveStateImg2: m.dataValues.arrive_state_img2,
          arrivePrice: m.dataValues.arrive_price,
          verifyState: m.dataValues.verify_state,
          verifyStateName: m.dataValues.verify_state_name,
          createAdminId: m.dataValues.create_admin_id,
          createAdminName: m.dataValues.create_admin_name,
          createTime: m.dataValues.create_time,
          updateTime: m.dataValues.update_time
        }
      }),
    };
  },
  cmpRechargeCreate: async (ctx) => {
    let cmp_id = ctx.request.body.cmpId || 0;
    let price = ctx.request.body.price || 0;
    let discount = ctx.request.body.discount || 0;
    let amount = ctx.request.body.amount || 0;
    let cmp_admin_id = ctx.request.body.cmpAdminId || 0;
    let arrive_state = ctx.request.body.arriveState || 0;
    let arrive_state_img1 = ctx.request.body.arriveStateImg1 || '';
    let arrive_state_img2 = ctx.request.body.arriveStateImg2 || '';
    let arrive_price = ctx.request.body.arrivePrice || 0;
    let create_admin_id = ctx.request.body.createAdminId || 0;
    let remark = ctx.request.body.remark || '';

    let company = await ctx.orm().cmp_info.findOne({
      where: {
        id: cmp_id,
        is_del: 0
      }
    })

    cp.isNull(company, '公司不存在！');

    let cmpAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: cmp_admin_id,
        user_company_id: company.id,
        user_type: 2,
        status: 1,
        is_del: 0
      }
    })

    cp.isNull(cmpAdmin, '公司管理员不存在！');

    let createAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: create_admin_id,
        user_type: 1,
        status: 1,
        is_del: 0
      }
    })

    cp.isNull(createAdmin, '管理员不存在！');

    await ctx.orm().cmp_recharge.create({
      cmp_id: company.id,
      cmp_name: company.name,
      price,
      discount,
      amount,
      cmp_admin_id: cmpAdmin.id,
      cmp_admin_name: cmpAdmin.nick_name,
      arrive_state: arrive_state,
      arrive_state_name: arriveStateEnum[arrive_state],
      arrive_state_img1: arrive_state_img1,
      arrive_state_img2: arrive_state_img2,
      arrive_price,
      verify_state: 1,
      verify_state_name: verifyStateEnum[1],
      create_admin_id: createAdmin.id,
      create_admin_name: createAdmin.nick_name,
      remark
    });

    ctx.body = {}
  },
  cmpRechargeEditArrive: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let arrive_state = ctx.request.body.arriveState || 0;
    let arrive_state_img1 = ctx.request.body.arriveStateImg1 || '';
    let arrive_state_img2 = ctx.request.body.arriveStateImg2 || '';
    let arrive_price = ctx.request.body.arrivePrice || 0;
    let op_admin_id = ctx.request.body.opAdminId || 0;
    let remark = ctx.request.body.remark || '';

    let opAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: op_admin_id,
        user_type: 1,
        status: 1,
        is_del: 0
      }
    })

    cp.isNull(opAdmin, '管理员不存在！');

    let cmpRecharge = await ctx.orm().cmp_recharge.findOne({
      where: {
        id
      }
    });

    cp.isNull(cmpRecharge, '充值记录不存在！');

    let updateRow = await ctx.orm().cmp_recharge.update({
      arrive_state: arrive_state,
      arrive_state_name: arriveStateEnum[arrive_state],
      arrive_state_img1: arrive_state_img1,
      arrive_state_img2: arrive_state_img2,
      arrive_price: parseFloat(cmpRecharge.arrive_price) + parseFloat(arrive_price)
    }, {
      where: {
        id: cmpRecharge.id,
        arrive_state: {
          $ne: 2
        }
      }
    });

    if (updateRow && updateRow.length > 0 && updateRow[0] > 0) {
      await ctx.orm().cmp_recharge_log.create({
        cmp_recharge_id: cmpRecharge.id,
        state_context: `更新到帐状态为【${arriveStateEnum[arrive_state]}】，到帐金额为【${arrive_price}】`,
        op_admin_id: opAdmin.id,
        op_admin_name: opAdmin.nick_name,
        remark
      })
    }

    ctx.body = {}
  },
  cmpRechargeEditVerify1: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let verify_state = ctx.request.body.verifyState || 0;
    let op_admin_id = ctx.request.body.opAdminId || 0;
    let remark = ctx.request.body.remark || '';

    let opAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: op_admin_id,
        user_type: 1,
        status: 1,
        is_del: 0
      }
    })

    cp.isNull(opAdmin, '管理员不存在！');

    let cmpRecharge = await ctx.orm().cmp_recharge.findOne({
      where: {
        id
      }
    });

    cp.isNull(cmpRecharge, '充值记录不存在！');

    let updateRow = await ctx.orm().cmp_recharge.update({
      verify_state: verify_state,
      verify_state_name: verifyStateEnum[verify_state]
    }, {
      where: {
        id: cmpRecharge.id,
        verify_state: 1
      }
    });

    if (updateRow && updateRow.length > 0 && updateRow[0] > 0) {
      await ctx.orm().cmp_recharge_log.create({
        cmp_recharge_id: cmpRecharge.id,
        state_context: `更新审核状态为【${verifyStateEnum[verify_state]}】`,
        op_admin_id: opAdmin.id,
        op_admin_name: opAdmin.nick_name,
        remark
      })
    }

    ctx.body = {}
  },
  cmpRechargeEditVerify2: async (ctx) => {
    let id = ctx.request.body.id || 0;
    let verify_state = ctx.request.body.verifyState || 0;
    let op_admin_id = ctx.request.body.opAdminId || 0;
    let remark = ctx.request.body.remark || '';

    let opAdmin = await ctx.orm().ums_admin.findOne({
      where: {
        id: op_admin_id,
        user_type: 1,
        status: 1,
        is_del: 0
      }
    })

    cp.isNull(opAdmin, '管理员不存在！');

    let cmpRecharge = await ctx.orm().cmp_recharge.findOne({
      where: {
        id
      }
    });

    cp.isNull(cmpRecharge, '充值记录不存在！');

    let updateRow = await ctx.orm().cmp_recharge.update({
      verify_state: verify_state,
      verify_state_name: verifyStateEnum[verify_state]
    }, {
      where: {
        id: cmpRecharge.id,
        verify_state: 2
      }
    });

    if (updateRow && updateRow.length > 0 && updateRow[0] > 0) {
      await ctx.orm().cmp_recharge_log.create({
        cmp_recharge_id: cmpRecharge.id,
        state_context: `更新审核状态为【${verifyStateEnum[verify_state]}】`,
        op_admin_id: opAdmin.id,
        op_admin_name: opAdmin.nick_name,
        remark
      })
    }

    if (verify_state === 3) {
      // 二审通过，需要给用户充值
      ctx.orm().cms_user_currency.update({
        user_currency: sequelize.literal(`user_currency + ${cmpRecharge.amount}`)
      }, {
        where: {
          user_id: cmpRecharge.cmp_admin_id,
          user_type: 2
        }
      })
    }

    ctx.body = {}
  },
  cmpRechargeVerifyLog: async (ctx) => {
    let id = ctx.request.body.id || 0;

    let result = await ctx.orm().cmp_recharge_log.findAll({
      where: {
        cmp_recharge_id: id
      }
    });

    ctx.body = result.map(m => {
      return {
        ...m.dataValues,
        cmpRechargeId: m.dataValues.cmp_recharge_id,
        stateContext: m.dataValues.state_context,
        stateTime: m.dataValues.state_time,
        opAdminId: m.dataValues.op_admin_id,
        opAdminName: m.dataValues.op_admin_name,
        remark: m.dataValues.remark,
        createTime: m.dataValues.create_time
      }
    })
  }
};