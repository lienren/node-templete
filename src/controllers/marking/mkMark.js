/*
 * @Author: Lienren
 * @Date: 2020-06-17 12:13:14
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-06-17 13:40:35
 */
'use strict';

const date = require('../../utils/date');
const cp = require('./checkParam');

const cpStatusNameEnum = {
  1: '未打标',
  2: '已打标',
};

const cpTypeNameEnum = {
  1: '沪深300',
  999: '其它',
};

module.exports = {
  editCompanyMark: async (ctx) => {
    let cpId = ctx.request.body.cpId || 0;
    let cpName = ctx.request.body.cpName || '';
    let opName = ctx.request.body.opName || '';
    let status = ctx.request.body.status || 1;
    let cpType = ctx.request.body.cpType || 1;
    let data = ctx.request.body.data || [];

    cp.isEmpty(cpId);
    cp.isEmpty(cpName);
    cp.isEmpty(opName);
    cp.isArrayLengthGreaterThan0(data);

    // 获取公司信息
    let cmp = await ctx.orm('manual_marking').mk_company.findOne({
      where: {
        id: cpId,
        isDel: 0,
      },
    });

    // 处理公司信息
    if (cmp) {
      // 公司存在，更新额度
      await ctx.orm('manual_marking').mk_company.update(
        {
          opName: opName,
          status: status,
          statusName: cpStatusNameEnum[status],
          cpType: cpType,
          cpTypeName: cpTypeNameEnum[cpType],
          modifyTime: date.formatDate(),
        },
        {
          where: {
            id: cmp.id,
            isDel: 0,
          },
        }
      );
    } else {
      // 公司不存在，新增公司
      cmp = await ctx.orm('manual_marking').mk_company.create({
        cpName,
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

      // 处理公司信息
      if (cmpData) {
        // 存在，更新
        await ctx.orm('manual_marking').mk_company_data.update(
          {
            dataValue: data[i].val,
            modifyTime: date.formatDate(),
          },
          {
            where: {
              id: cmpData.id,
              isDel: 0,
            },
          }
        );
      } else {
        // 不存在，新增
        await ctx.orm('manual_marking').mk_company_data.create({
          cpId: cmp.id,
          cpName: cmp.cpName,
          dataIndex: data[i].key,
          dataText: data[i].name,
          dataValue: data[i].val,
          addTime: date.formatDate(),
          modifyTime: date.formatDate(),
          isDel: 0,
        });
      }
    }

    ctx.body = {};
  },
};