/*
 * @Author: Lienren
 * @Date: 2021-08-09 11:16:24
 * @LastEditTime: 2021-08-09 16:05:45
 * @LastEditors: Lienren
 * @Description: 生成Excel
 * @FilePath: /node-templete/src/utils/excel.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const xlsx = require('node-xlsx');

module.exports = {
  exportExcel: (sheetName, header = [], data = [], options = {}) => {
    let xlsxObj = [
      {
        name: sheetName,
        data: []
      }
    ]

    xlsxObj[0].data.push(header);
    data.map(m => { 
      xlsxObj[0].data.push(m);
    })

    return xlsx.build(xlsxObj, options);
  }
}