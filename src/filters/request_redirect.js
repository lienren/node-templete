/*
 * @Author: Lienren
 * @Date: 2018-12-13 22:59:57
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-13 23:58:02
 */
'use strict';

const path = require('path');
const config = require('../config.js');

module.exports = async function(urlPath, callback) {
  let sitepath = '';
  if (urlPath && config.websites && config.websites.length > 0) {
    for (let i = 0, j = config.websites.length; i < j; i++) {
      // 根据请求目录转入指定静态目录
      if (urlPath.indexOf(config.websites[i].sitename) > -1) {
        sitepath = config.websites[i].sitepath;
        break;
      }
    }
  }

  if (sitepath !== '' && typeof callback === 'function') {
    return await callback(sitepath);
  }

  return sitepath;
};
