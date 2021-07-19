/*
 * @Author: Lienren 
 * @Date: 2021-03-10 14:38:35 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-04-28 11:49:07
 */
'use strict';

module.exports = {
  getClientIP: (req) => {
    let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      req.ip ||
      req.connection.remoteAddress || // 判断 connection 的远程 IP
      req.socket.remoteAddress || // 判断后端的 socket 的 IP
      req.connection.socket.remoteAddress || ''
    if (ip) {
      ip = ip.replace('::ffff:', '').replace('127.0.0.1, ', '')
    }
    return ip;
  }
};