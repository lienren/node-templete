/*
 * @Author: Lienren
 * @Date: 2019-11-21 16:14:34
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-02-27 23:10:18
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
  },
  getAppletBanners: async ctx => {
    let json = {
      index: {
        top: [
          {
            url: 'https://www.jiangxinzhiyin.com/pic/banners/index_1.png',
            link: ''
          }
        ],
        middle: {
          url: 'https://www.jiangxinzhiyin.com/pic/banners/middle_1.jpg',
          link: ''
        },
        bottom: {
          url: 'https://www.jiangxinzhiyin.com/pic/banners/bottom_1.jpg',
          link: ''
        }
      }
    };

    ctx.body = json;
  }
};
