/*
 * @Author: Lienren
 * @Date: 2019-10-16 19:35:03
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-17 19:29:48
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
    '3': '打折券' // {fullPrice:200,discount:98}
  },
  disRangeTypeEnum: {
    '1': '全部商品',
    '2': '分类商品',
    '3': '选定商品'
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
    '999': '已结束'
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
  orderStatus: {
    '1': '待支付',
    '2': '待取货',
    '3': '待评价',
    '4': '已完成',
    '10': '退货审核中',
    '11': '待退货',
    '12': '退货完成',
    '999': '已取消'
  },
  orderShipStatus: {
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
