/*
 * @Author: Lienren
 * @Date: 2021-08-09 11:16:24
 * @LastEditTime: 2021-11-18 19:33:15
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
  },
  exportMoreSheetExcel: (xlsxObj = [], options = {}) => {
    return xlsx.build(xlsxObj, options);
  },
  readExcel: (filePath) => {
    let sheets = xlsx.parse(filePath)

    if (sheets.length === 0) {
      return [];
    }

    return sheets[0].data;
  }
}