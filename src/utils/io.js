/*
 * @Author: Lienren 
 * @Date: 2018-07-10 13:47:33 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-07-10 13:48:52
 */
'use strict';

const fs = require('fs');
const path = require('path');
const base64 = require('base64-img');

let dirUtil = {
  // 递归创建目录(异步方法)
  mkdirs: (dirname, callback) => {
    fs.exists(dirname, function(exists) {
      if (exists) {
        callback();
      } else {
        // console.log(path.dirname(dirname));
        dirUtil.mkdirs(path.dirname(dirname), function() {
          fs.mkdir(dirname, callback);
        });
      }
    });
  },
  // 递归创建目录(同步方法)
  mkdirsSync: dirname => {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (dirUtil.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
};

module.exports = {
  // 递归创建目录(异步方法)
  mkdirs: (dirname, callback) => {
    dirUtil.mkdirs(dirname, callback);
  },
  // 文件重命名
  reName: (oldpath, newpath) => {
    return new Promise((resolve, reject) => {
      fs.rename(oldpath, newpath, function(err) {
        if (err) {
          console.error(err);
          reject({
            state: 'error',
            error: err
          });
        } else {
          resolve({
            state: 'success'
          });
        }
      });
    });
  },
  // 递归创建目录(同步方法)
  mkdirsSync: dirname => {
    return dirUtil.mkdirsSync(dirname);
  },
  // base64转image
  base64ToImage: (base64img, filepath, filename) => {
    return new Promise((resolve, reject) => {
      dirUtil.mkdirsSync(filepath);

      base64.img(base64img, filepath, filename, (err, filepath) => {
        if (err) {
          console.log(err);
          reject({
            state: 'error',
            error: err
          });
        } else {
          resolve({
            state: 'success',
            filepath: filepath
          });
        }
      });
    });
  },
  // image转base64
  imageToBase64: imgpath => {
    return new Promise((resolve, reject) => {
      base64.base64(imgpath, (err, data) => {
        if (err) {
          console.log(err);
          reject({
            state: 'error',
            error: err
          });
        } else {
          resolve({
            state: 'success',
            data: data
          });
        }
      });
    });
  }
};
