/*
 * @Author: Lienren
 * @Date: 2018-12-17 10:39:50
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-17 11:24:58
 */
'use strict';

const jsonwebtoken = require('jsonwebtoken');
const auth = require('../config.js').auth;

module.exports = {
  getToken: (data, options) => {
    let token = jsonwebtoken.sign(data, auth.authKey, options || auth.authOptions);
    return token;
  },
  verifyToken: (token, options) => {
    let data = null;
    try {
      data = jsonwebtoken.verify(token, auth.authKey, options || { algorithms: [auth.authOptions.algorithm] });
    } catch (error) {
      data = null;
    }

    return data;
  }
};
