/*
 * @Author: Lienren 
 * @Date: 2018-04-19 16:56:45 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-20 12:36:59
 */
'use strict';

const path = require('path');
const multer = require('koa-multer');
const comm = require('./comm');
const config = require('../config.json');

module.exports = {
  // 设置上传文件
  getMulter: savepath => {
    let storage = multer.diskStorage({
      //文件保存路径
      destination: function(req, file, cb) {
        savepath = path.resolve(__dirname, config.sys.uploadFilePath, savepath || '');
        
        // 新建目录
        comm.mkdirs(savepath, () => {
          cb(null, savepath);
        });
      },
      //修改文件名称
      filename: function(req, file, cb) {
        let fileFormat = file.originalname.split('.');
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
      }
    });

    return multer({ storage: storage });
  }
};
