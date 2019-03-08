/*
 * @Author: Lienren
 * @Date: 2019-03-04 12:04:18
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-05 12:07:32
 */
'use strict';

const http = require('../utils/http');

// 域地址
// Pany320121#
const domain = `http://132.232.11.254:8081/`;

module.exports = {
  proxyApi: async (ctx, next) => {
    let apiUrl = ctx.path.replace('/cheetah/', '');
    let body = ctx.request.body || {};

    console.log('apiurl:', `${domain}/${apiUrl}`);
    console.log('method:', ctx.method);

    if (ctx.method === 'GET') {
      let result = await http.get({
        url: `${domain}/${apiUrl}`,
        headers: ctx.headers
      });

      ctx.body = result.data;
    } else if (ctx.method === 'POST') {
      let result = await http.post({
        url: `${domain}/${apiUrl}`,
        data: body,
        headers: ctx.headers
      });

      ctx.body = result.data;
    }
  }
};
