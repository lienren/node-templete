/*
 * @Author: Lienren
 * @Date: 2019-11-21 16:14:34
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-11-21 16:20:23
 */
'use strict';

const http = require('../../utils/http');

module.exports = {
  getBannerList: async ctx => {
    let result = await http.post({
      url: 'https://www.jiangxinzhiyin.com/api/getRotationChartList',
      data: {},
      headers: {}
    });

    result = result && result.data ? result.data : result;

    if (result && result.code && result.code === '0') {
      ctx.body = result.data;
    } else {
      ctx.body = [];
    }
  }
};
