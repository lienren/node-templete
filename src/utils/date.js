/*
 * @Author: Lienren
 * @Date: 2018-04-19 12:02:43
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-10-18 12:07:21
 */
'use strict';

const moment = require('moment');
const comm = require('./comm');

module.exports = {
  // Date日期格式化
  formatDate: function(date = new Date(), formate = 'YYYY-MM-DD HH:mm:ss', isunix = false) {
    if (!date) {
      date = new Date();
    }

    if (!formate) {
      formate = 'YYYY-MM-DD HH:mm:ss';
    }

    let val;
    if (isunix) {
      val = moment.unix(date).format(formate);
    } else {
      val = moment(date).format(formate);
    }

    return val;
  },
  // 获取毫秒级时间戳
  getTimeStamp: function(second) {
    let date = new Date().getTime();

    if (second && comm.isNumber(second)) {
      date += second * 1000;
    }

    return date;
  },
  // 获取秒级时间戳
  getSecondStamp: function(second) {
    let date = parseInt(new Date().getTime() / 1000);

    if (second && comm.isNumber(second)) {
      date += second;
    }

    return date;
  },
  // 时间戳转时间，格式：yyyy-MM-DD HH:mm:ss
  timestampToTime: function(timestamp, position) {
    if (/^\d{10}$/.test(timestamp)) {
      timestamp = new Date(parseInt(timestamp) * 1000);
    }

    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return Y + M + D + h + m + s;
  },
  // 时间转时间戳，时间格式：yyyy-MM-DD HH:mm:ss
  timeToTimeStamp: function(time) {
    var date = new Date(time.replace(/-/g, '/'));
    return date.getTime();
  },
  // 获取今天开始和结束时间戳
  getTodayTimeStamp: function() {
    return {
      starttime: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
      endtime: new Date(new Date().setHours(23, 59, 59, 999)).getTime()
    };
  },
  // 获取两个时间之间的时间段
  dataScope: function(a, b) {
    var date1 = getDate(a);
    var date2 = getDate(b);
    date2.setDate(date2.getDate() + 1);
    if (date1 > date2) {
      var tempDate = date1;
      date1 = date2;
      date2 = tempDate;
    }
    date1.setDate(date1.getDate());
    var dateArr = [];
    var i = 0;
    while (
      !(
        date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate()
      )
    ) {
      var dayStr = date1.getDate().toString();
      var monthStr = (date1.getMonth() + 1).toString();
      dayStr = dayStr.length === 1 ? '0' + dayStr : dayStr;
      monthStr = monthStr.length === 1 ? '0' + monthStr : monthStr;
      dateArr[i] = date1.getFullYear() + '-' + monthStr + '-' + dayStr;
      i++;
      date1.setDate(date1.getDate() + 1);
    }
    return dateArr;
  },
  // 给日期加天
  addDay: function(date, day) {
    date = getDate(date);
    date = date.setDate(date.getDate() + day);
    date = new Date(date);
    return date;
  },
  // 比较时间
  compare: function(beginTime, endTime) {
    beginTime = getDate(beginTime);
    endTime = getDate(endTime);

    return beginTime > endTime;
  },
  // 当前时间是否在区间内
  isDateBetween: function(beginTime, endTime, nowTime) {
    beginTime = getDate(beginTime);
    endTime = getDate(endTime);
    nowTime = getDate(nowTime);

    return nowTime.getTime() - beginTime.getTime() > 0 && nowTime.getTime() - endTime.getTime() < 0;
  }
};

function getDate(date) {
  if (!date) {
    date = new Date();
  } else {
    // date类型
    if (date instanceof Date) {
    }
    // unix时间戳
    else if (/^\d{10}$/.test(date)) {
      date = new Date(parseInt(date) * 1000);
    }
    // 普通时间字符串
    else {
      if (date.indexOf('.') > -1) {
        date = date.split('.')[0];
      }
      date = new Date(date.replace(/-/g, '/'));
    }
  }
  return date;
}
