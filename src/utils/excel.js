/*
 * @Author: Lienren
 * @Date: 2021-08-09 11:16:24
 * @LastEditTime: 2022-11-05 07:57:43
 * @LastEditors: Lienren
 * @Description: 生成Excel
 * @FilePath: /node-templete/src/utils/excel.js
 * PRESENTED BY ROOT Tech R&D TEAM 2021-2026.
 */
'use strict';

const xlsx = require('node-xlsx');
const exceljs = require('exceljs');

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
  exportBigMoreSheetExcel: async (xlsxObj = [], options = {}) => {
    let workbook = new exceljs.Workbook();

    for (let i = 0, j = xlsxObj.length; i < j; i++) {
      let sheet = workbook.addWorksheet(xlsxObj[i].name);

      sheet.columns = xlsxObj[i].data[0].map(m => {
        return { header: m, key: m }
      })

      sheet.addRows(xlsxObj[i].data.slice(1));
    }

    return await workbook.xlsx.writeBuffer();
  },
  readExcel: (filePath) => {
    let sheets = xlsx.parse(filePath)

    if (sheets.length === 0) {
      return [];
    }

    return sheets[0].data;
  }
}