/*
 * @Author: Lienren
 * @Date: 2021-08-18 10:44:07
 * @LastEditTime: 2022-11-05 08:14:14
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
const excel = require('../../utils/excel');

module.exports = {
  getAddress: async ctx => {
    let result = await ctx.orm().info_address.findAll()
    ctx.body = result
  },
  importAddress: async ctx => {
    if (ctx.req.files && ctx.req.files.length > 0) {
      let filePath = path.resolve(path.join(__dirname, `../../../assets/uploads/${ctx.req.files[0].filename}`));

      let xlsx = excel.readExcel(filePath);

      let data = xlsx.filter(f => f.length === 18).map(m => {
        return {
          sid: m[0].trim(),
          phone: m[1].trim(),
          manageType: m[2].trim(),
          shopName: m[3].trim(),
          brandName: m[4].trim(),
          creditNum: m[5],
          bossName: m[6].trim(),
          bossPhone: m[7].trim(),
          pca: m[8].trim(),
          addr: m[9].trim(),
          level: m[10],
          accountNum: m[11],
          orderName: m[12].trim(),
          bdName: m[13].trim(),
          ctime: m[14].trim(),
          cstatus: m[15].trim(),
          lot: m[16].trim(),
          lat: m[17].trim()
        }
      });

      // 删除首行
      data.shift();

      await ctx.orm().info_address.bulkCreate(data);

      // 删除文件
      fs.unlink(filePath, function (error) {
        console.log('delete import excel file error:', error)
        return false
      })

      ctx.body = {};
    } else {
      ctx.body = {};
    }
  }
};