/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:35:03
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-28 17:15:05
 */
'use strict';

const date = require('../../utils/date');

module.exports = {
  userTypeEnum: {
    '1': '普通用户',
    '2': '团长',
    '999': '系统内部用户'
  },
  verifyTypeEnum: {
    '0': '未提交',
    '1': '待审核',
    '2': '审核通过',
    '3': '审核不通过',
    '999': '审核拒绝'
  },
  sortTypeEnum: {
    '1': '团长分类',
    '2': '平台分类'
  },
  proTypeEnum: {
    '1': '团长商品',
    '2': '平台商品'
  },
  proVerifyTypeEnum: {
    '1': '未提交',
    '2': '待审核',
    '3': '审核通过',
    '4': '审核不通过'
  },
  rebateTypeEnum: {
    '0': '无返佣',
    '1': '按销售价返佣',
    '2': '固定金额返佣',
    calc: (rebateType, sellPrice, rebateRate, rebatePrice) => {
      rebateType = rebateType || 0;
      switch (rebateType) {
        case 0:
          return 0;
        case 1:
          return (sellPrice * rebateRate) / 100;
        case 2:
          return rebatePrice || 0;
      }
    }
  },
  disSendTypeEnum: {
    '1': '新人券',
    '2': '自领券',
    '3': '普发券'
  },
  disTypeEnum: {
    '1': '直减券', // {fullPrice:0,disPrice:100}
    '2': '满减券', // {fullPrice:200,disPrice:100}
    '3': '打折券', // {fullPrice:200,discount:98}
    calc: (disType, disContext, orderSellPrice) => {
      disContext = typeof disContext === 'string' ? JSON.parse(disContext) : disContext;
      switch (disType) {
        case 1:
          return {
            orderSellPrice: orderSellPrice > disContext.disPrice ? orderSellPrice - disContext.disPrice : 0,
            orderDisPrice: orderSellPrice > disContext.disPrice ? disContext.disPrice : orderSellPrice
          };
        case 2:
          return {
            orderSellPrice:
              orderSellPrice >= disContext.fullPrice
                ? orderSellPrice > disContext.disPrice
                  ? orderSellPrice - disContext.disPrice
                  : 0
                : orderSellPrice,
            orderDisPrice:
              orderSellPrice >= disContext.fullPrice
                ? orderSellPrice > disContext.disPrice
                  ? disContext.disPrice
                  : orderSellPrice
                : 0
          };
        case 3:
          return {
            orderSellPrice:
              orderSellPrice >= disContext.fullPrice ? (orderSellPrice * disContext.discount) / 100 : orderSellPrice,
            orderDisPrice:
              orderSellPrice >= disContext.fullPrice ? orderSellPrice - (orderSellPrice * disContext.discount) / 100 : 0
          };
      }
    }
  },
  disRangeTypeEnum: {
    '1': '全部商品',
    '2': '分类商品',
    '3': '选定商品',
    verify: (disRangeType, disRange, proList) => {
      disRange = typeof disRange === 'string' ? JSON.parse(disRange) : disRange;
      switch (disRangeType) {
        case 1:
          return {
            isHit: true,
            disProList: proList,
            notDisProList: []
          };
        case 2:
          let disProList1 = proList.reduce((total, curr) => {
            if (disRange.indexOf(curr.sortId) >= 0) {
              total.push(curr);
            }
            return total;
          }, []);
          let disProIds1 = disProList1.map(m => m.proId);
          let notDisProList1 = proList.reduce((total, curr) => {
            if (disProIds1.indexOf(curr.proId) === -1) {
              total.push(curr);
            }
            return total;
          }, []);
          return {
            isHit: disProList1 && disProList1.length > 0,
            disProList: disProList1,
            notDisProList: notDisProList1
          };
        case 3:
          let disProList2 = proList.reduce((total, curr) => {
            if (disRange.indexOf(curr.proId) >= 0) {
              total.push(curr);
            }
            return total;
          }, []);
          let disProIds2 = disProList2.map(m => m.proId);
          let notDisProList2 = proList.reduce((total, curr) => {
            if (disProIds2.indexOf(curr.proId) === -1) {
              total.push(curr);
            }
            return total;
          }, []);
          return {
            isHit: disProList2 && disProList2.length > 0,
            disProList: disProList2,
            notDisProList: notDisProList2
          };
      }
    }
  },
  disValTypeEnum: {
    '1': '固定时间', // {startTime:'2019-10-01 00:00:00', endTime:'2019-10-07 23:59:59'}
    '2': '领取后X天', // {day:3}
    generationTime: (disValType, disVal, startTime) => {
      disVal = typeof disVal === 'string' ? JSON.parse(disVal) : disVal;
      switch (disValType) {
        case 1:
          return disVal;
        case 2:
          return {
            startTime: date.formatDate(startTime, 'YYYY-MM-DD 00:00:00'),
            endTime: date.formatDate(date.addDay(startTime, disVal.day), 'YYYY-MM-DD 23:59:59')
          };
      }
    }
  },
  groupTypeEnum: {
    '1': '团长发起',
    '2': '团长自动发起',
    '3': '平台发起',
    '4': '平台自动发起'
  },
  groupStatusEnum: {
    '1': '未开始',
    '2': '已开始',
    '999': '已结束',
    generationStatus: (groupStartTime, groupEndTime) => {
      if (date.compare(groupStartTime, groupEndTime)) {
        return 999;
      }

      let now = new Date();
      if (date.compare(groupStartTime, now)) {
        return 1;
      }
      if (date.isDateBetween(groupStartTime, groupEndTime, now)) {
        return 2;
      }
      if (date.compare(now, groupEndTime)) {
        return 999;
      }
    }
  },
  groupProTypeEnum: {
    '1': '普通商品',
    '2': '秒杀商品',
    '3': '团购商品'
  },
  orderTypeEnum: {
    '1': '主订单',
    '2': '子订单'
  },
  orderStatusEnum: {
    '1': '待支付',
    '2': '待取货',
    '3': '待评价',
    '4': '已完成',
    '5': '待发货',
    '10': '退货审核中',
    '11': '待退货',
    '12': '退货完成',
    '999': '已取消'
  },
  orderShipStatusEnum: {
    '1': '未发货',
    '2': '正在备货',
    '3': '已发货待签收',
    '4': '已签收'
  },
  shipStatusEnum: {
    '1': '备货中',
    '2': '已发货',
    '3': '已签收'
  },
  pickCashTypeEnum: {
    '1': '支付宝',
    '2': '银行卡'
  },
  pickCashStatusEnum: {
    '1': '待审核',
    '2': '待打款',
    '3': '已打款'
  }
};
