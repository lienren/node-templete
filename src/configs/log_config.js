/*
 * @Author: Lienren 
 * @Date: 2018-04-19 15:44:38 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-07 14:07:37
 */
'use strict';

const path = require('path');
const config = require('../config.json');

//错误日志输出完整路径
let errorLogPath = path.resolve(__dirname, config.sys.logFilePath.errorLogPath);

//响应日志输出完整路径
let responseLogPath = path.resolve(__dirname, config.sys.logFilePath.responseLogPath);

module.exports = {
  appenders: {
    resLogger: {
      type: 'dateFile',
      filename: responseLogPath, //文件目录，当目录文件或文件夹不存在时，会自动创建
      alwaysIncludePattern: true, //（默认为false） - 将模式包含在当前日志文件的名称以及备份中
      pattern: '-yyyy-MM-dd-hh.log', //后缀，每小时创建一个新的日志文件
      maxLogSize: 10, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3, //当文件内容超过文件存储空间时，备份文件的数量
      //compress : true,//是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8', //default "utf-8"，文件的编码
      category: 'log_file',
      numBackups: 5, // keep five backup files
      // compress: true, // compress the backups
      encoding: 'utf-8'
    },
    errorLogger: {
      type: 'dateFile',
      filename: errorLogPath, //文件目录，当目录文件或文件夹不存在时，会自动创建
      alwaysIncludePattern: true, //（默认为false） - 将模式包含在当前日志文件的名称以及备份中
      pattern: '-yyyy-MM-dd-hh.log', //后缀，每小时创建一个新的日志文件
      maxLogSize: 10, //文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: 3, //当文件内容超过文件存储空间时，备份文件的数量
      //compress : true,//是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8', //default "utf-8"，文件的编码
      category: 'log_file',
      numBackups: 5, // keep five backup files
      // compress: true, // compress the backups
      encoding: 'utf-8'
    }
  },
  categories: {
    default: { appenders: ['resLogger'], level: 'trace' },
    resLogger: { appenders: ['resLogger'], level: 'trace' },
    errorLogger: { appenders: ['errorLogger'], level: 'error' }
  }
};
