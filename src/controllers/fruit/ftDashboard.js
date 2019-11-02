/*
 * @Author: Lienren
 * @Date: 2019-11-01 10:00:23
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-02 16:15:16
 */
'use strict';

const pinyin = require('pinyin');
const date = require('../../utils/date');
const cp = require('./checkParam');
const dic = require('./fruitEnum');

module.exports = {
  line1: async ctx => {
    let sql1 = `select sum(sellPrice) totalSellPrice, sum(settlementPrice) totalSettlementPrice from ftOrders 
      where oStatus in (2,3,4,5) and oType = 1;`;
    let result1 = await ctx.orm().query(sql1);

    let sql2 = `select 
      sum(costPrice*pNum) totalCostPrice, 
      sum(totalProfit) totalProfit from ftOrderProducts 
      where oId in (select id from ftOrders where oStatus in (2,3,4,5) and oType = 1);`;
    let result2 = await ctx.orm().query(sql2);

    let sql3 = `select count(1) groupUserCount from ftUsers where isDel = 0 and userType = 2 and verifyType = 2;`;
    let result3 = await ctx.orm().query(sql3);

    let sql4 = `select count(1) todayGroupUserCount from ftUsers where isDel = 0 and userType = 2 and verifyType = 2 and verifyTime >= DATE(NOW());`;
    let result4 = await ctx.orm().query(sql4);

    ctx.body = {
      totalSellPrice: result1 && result1.length > 0 && result1[0].totalSellPrice ? result1[0].totalSellPrice : 0,
      totalSettlementPrice:
        result1 && result1.length > 0 && result1[0].totalSettlementPrice ? result1[0].totalSettlementPrice : 0,
      totalCostPrice: result2 && result2.length > 0 && result2[0].totalCostPrice ? result2[0].totalCostPrice : 0,
      totalProfit: result2 && result2.length > 0 && result2[0].totalProfit ? result2[0].totalProfit : 0,
      groupUserCount: result3 && result3.length > 0 && result3[0].groupUserCount ? result3[0].groupUserCount : 0,
      todayGroupUserCount:
        result4 && result4.length > 0 && result4[0].todayGroupUserCount ? result4[0].todayGroupUserCount : 0
    };
  },
  line2: async ctx => {
    let param = ctx.request.body || {};

    cp.isEmpty(param.startTime);
    cp.isEmpty(param.endTime);

    let scopeTime = date.dataScope(param.startTime, param.endTime);

    let sql1 = `select DATE(addTime) day, isPay, count(isPay) payNum from ftOrders where addTime between '${param.startTime} 00:00:00' and '${param.endTime} 23:59:59' group by DATE(addTime), isPay;`;
    let sql2 = `select 
        DATE(addTime) day,
        sum(costPrice*pNum) totalCostPrice, 
        sum(totalProfit) totalProfit 
        from ftOrderProducts 
        where 
            oId in (select id from ftOrders where oStatus in (2,3,4,5) and addTime between '${param.startTime} 00:00:00' and '${param.endTime} 23:59:59') and 
            addTime between '${param.startTime} 00:00:00' and '${param.endTime} 23:59:59' 
        group by DATE(addTime);`;

    let result1 = await ctx.orm().query(sql1);
    let result2 = await ctx.orm().query(sql2);

    let data = scopeTime.reduce((total, curr) => {
      let find1 = result1.find(f => {
        return f.day === curr && f.isPay === 0;
      });
      let find11 = result1.find(f => {
        return f.day === curr && f.isPay === 1;
      });
      let find2 = result2.find(f => {
        return f.day === curr;
      });

      total[curr] = {
        payNum: find1 ? find1.payNum : 0,
        noPayNum: find11 ? find11.payNum : 0,
        totalCostPrice: find2.totalCostPrice,
        totalProfit: find2.totalProfit
      };
    }, []);

    ctx.body = data;
  },
  line3: async ctx => {
    let sql = `select a.*, u.nickName, u.headImg from (
        select userId, count(1) totalOrderNum, sum(sellPrice) totalSellPrice from ftOrders where oStatus in (2,3,4,5) group by userId limit 20) a 
        inner join ftUsers u on u.id = a.userId 
        order by a.totalSellPrice desc;`;
    let result = await ctx.orm().query(sql);

    ctx.body = result;
  }
};
