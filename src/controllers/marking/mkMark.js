/*
 * @Author: Lienren
 * @Date: 2020-06-17 12:13:14
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-22 14:17:25
 */
'use strict';

const date = require('../../utils/date');
const cp = require('./checkParam');

const cpStatusNameEnum = {
  1: '未打标',
  2: '已打标',
  3: '审核通过',
};

const cpTypeNameEnum = {
  1: '沪深300',
  2: '中证500',
  999: '其它',
};

module.exports = {
  editCompanyMark: async (ctx) => {
    let cpId = ctx.request.body.cpId || 0;
    let cpCode = ctx.request.body.cpCode || '';
    let cpName = ctx.request.body.cpName || '';
    let opName = ctx.request.body.opName || '';
    let status = ctx.request.body.status || 1;
    let cpType = ctx.request.body.cpType || 1;
    let data = ctx.request.body.data || [];

    cp.isNumberGreaterThan0(cpId);
    cp.isEmpty(cpName);
    cp.isEmpty(opName);
    cp.isArrayLengthGreaterThan0(data);

    // 获取公司信息
    let cmp = await ctx.orm('manual_marking').mk_company.findOne({
      where: {
        cpCode: cpCode,
        isDel: 0,
      },
    });

    // 处理公司信息
    if (cmp) {
      // 公司存在，更新额度
      await ctx.orm('manual_marking').mk_company.update({
        opName: opName,
        status: status,
        statusName: cpStatusNameEnum[status],
        cpType: cpType,
        cpTypeName: cpTypeNameEnum[cpType],
        modifyTime: date.formatDate(),
      }, {
        where: {
          id: cmp.id,
          isDel: 0,
        },
      });
    } else {
      // 公司不存在，新增公司
      cmp = await ctx.orm('manual_marking').mk_company.create({
        cpName,
        cpCode,
        opName,
        status,
        statusName: cpStatusNameEnum[status],
        cpType,
        cpTypeName: cpTypeNameEnum[cpType],
        addTime: date.formatDate(),
        modifyTime: date.formatDate(),
        isDel: 0,
      });
    }

    // 处理公司打标信息
    for (let i = 0, j = data.length; i < j; i++) {
      let cmpData = await ctx.orm('manual_marking').mk_company_data.findOne({
        where: {
          cpId: cmp.id,
          dataIndex: data[i].key,
          isDel: 0,
        },
      });

      // 如果是数组，则序列化存储
      let dataValue = data[i].val && Array.isArray(data[i].val) ? JSON.stringify(data[i].val) : data[i].val

      // 处理公司信息
      if (cmpData) {
        // 存在，更新
        await ctx.orm('manual_marking').mk_company_data.update({
          dataValue: dataValue,
          dataSource: data[i].source,
          modifyTime: date.formatDate(),
        }, {
          where: {
            id: cmpData.id,
            isDel: 0,
          },
        });
      } else {
        // 不存在，新增
        await ctx.orm('manual_marking').mk_company_data.create({
          cpId: cmp.id,
          cpName: cmp.cpName,
          dataIndex: data[i].key,
          dataText: data[i].name,
          dataValue: dataValue,
          dataSource: data[i].source,
          addTime: date.formatDate(),
          modifyTime: date.formatDate(),
          isDel: 0,
        });
      }
    }

    ctx.body = {};
  },
  getCompanyMark: async (ctx) => {
    let cpCode = ctx.request.body.cpCode || '';

    cp.isEmpty(cpCode);

    let cmp = await ctx.orm('manual_marking').mk_company.findOne({
      where: {
        cpCode: cpCode,
        isDel: 0,
      },
    });

    if (cmp) {
      let result = await ctx.orm('manual_marking').mk_company_data.findAll({
        where: {
          cpId: cmp.id,
          isDel: 0,
        },
      });

      let cmpData = result.map((m) => {
        return {
          key: m.dataValues.dataIndex,
          name: m.dataValues.dataText,
          // 如果是数组，则反序列化给前端
          val: m.dataValues.dataValue && m.dataValues.dataValue.indexOf('[') >= 0 ? JSON.parse(m.dataValues.dataValue) : m.dataValues.dataValue,
          source: m.dataValues.dataSource,
        };
      });

      ctx.body = cmpData;
    } else {
      ctx.body = [];
    }
  },
  setCompanysStatus: async (ctx) => {
    let cpId = ctx.request.body.cpId || 0;
    let status = ctx.request.body.status || 1;
    let opName = ctx.request.body.opName || '';

    cp.isNumberGreaterThan0(cpId);
    cp.isEmpty(opName);

    // 公司存在，更新额度
    await ctx.orm('manual_marking').mk_company.update({
      status: status,
      statusName: cpStatusNameEnum[status],
      modifyTime: date.formatDate(),
      verifyName: opName,
      verifyTime: date.formatDate()
    }, {
      where: {
        id: cpId,
        isDel: 0,
      },
    });
  }
};