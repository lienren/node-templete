/*
 * @Author: Lienren 
 * @Date: 2018-04-19 12:02:43 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 23:09:12
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
  }
};
