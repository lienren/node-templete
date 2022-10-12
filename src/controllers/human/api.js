/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2022-10-12 07:58:26
 * @LastEditors: Lienren
 * @Description: 
 * @FilePath: /node-templete/src/controllers/human/api.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const sequelize = require('sequelize');
const comm = require('../../utils/comm');
const date = require('../../utils/date');
const jwt = require('../../utils/jwt');
const encrypt = require('../../utils/encrypt');

module.exports = {
  getAddress: async ctx => {
    let result = await ctx.orm().info_address.findAll()
    ctx.body = result
  }
};