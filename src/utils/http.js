/*
 * @Author: Lienren 
 * @Date: 2018-04-19 18:08:39 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-27 01:26:40
 */
'use strict';

const axios = require('axios');

// 获取请求的headers，去掉host和connection
function getHeader(headers) {
  let ret = {};
  if (headers) {
    for (var i in headers) {
      if (!/host|connection/i.test(i)) {
        ret[i] = headers[i];
      }
    }
  }
  return ret;
}

module.exports = {
  // get请求
  get: ({ url = '', data = {}, headers = {} }) => {
    return axios({
      method: 'get',
      url: url,
      data: data,
      headers: getHeader(headers)
    });
  },
  // post请求
  post: ({ url = '', data = {}, headers = {} }) => {
    return axios({
      method: 'post',
      url: url,
      data: data,
      headers: getHeader(headers)
    });
  }
};
