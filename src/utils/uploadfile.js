/*
 * @Author: Lienren
 * @Date: 2018-04-19 16:56:45
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-03-21 13:42:01
 */
'use strict';

const path = require('path');
const multer = require('koa-multer');
const io = require('./io');
const config = require('../config.js');

module.exports = {
  // 设置上传文件
  getMulter: savepath => {
    let storage = multer.diskStorage({
      //文件保存路径
      destination: function (req, file, cb) {
        savepath = config.sys.uploadFilePath

        // 新建目录
        io.mkdirs(savepath, () => {
          cb(null, savepath);
        });
      },
      //修改文件名称
      filename: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif|excel/;
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype) {
          let fileFormat = file.originalname.split('.');
          cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
        } else {
          cb("错误：文件必须是有效的图像");
        }
      }
    });

    return multer({ storage: storage });
  }
};
