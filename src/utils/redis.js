/*
 * @Author: Lienren 
 * @Date: 2018-04-19 14:05:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-07-19 17:32:41
 */
'use strict';

const config = require('../config.json');
const Redis = require('ioredis');

module.exports = {
  // 获取数据
  get: key => {
    let redis = new Redis(config.redis);
    return redis.get(key);
  },
  // 设置数据
  set: (key, val) => {
    let redis = new Redis(config.redis);
    redis.set(key, val);

    return true;
  }
};
