/*
 * @Author: Lienren
 * @Date: 2018-12-13 22:59:57
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-14 09:42:53
 */
'use strict';

const path = require('path');
const config = require('../config.js');

/**
 * 验证是否命中静态目录路径
 * @param {*} ctx ctx对象
 * @param {*} callback 回调方法
 */
module.exports = async function(ctx, callback) {
  let requestUrl = ctx.path || '';
  let sitepath = '';

  if (requestUrl && config.websites && config.websites.length > 0) {
    for (let i = 0, j = config.websites.length; i < j; i++) {
      // 根据请求目录转入指定静态目录
      if (requestUrl.indexOf(config.websites[i].sitename) > -1) {
        sitepath = config.websites[i].sitepath;
        break;
      }
    }
  }

  if (sitepath !== '' && typeof callback === 'function') {
    return await callback(ctx, requestUrl, sitepath);
  }

  return sitepath;
};
