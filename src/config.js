/*
 * @Author: Lienren
 * @Date: 2018-12-13 23:49:41
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-01 11:14:43
 */
'use strict';

const path = require('path');

module.exports = {
  sys: {
    port: 20000,
    staticPath: path.resolve(__dirname, '../assets/'),
    uploadFilePath: path.resolve(__dirname, '../uploads/'),
    logConfig: {
      appenders: {
        resLogger: {
          type: 'dateFile',
          filename: path.resolve(__dirname, '../logs/response/response'), //文件目录，当目录文件或文件夹不存在时，会自动创建
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
          filename: path.resolve(__dirname, '../logs/error/error'), //文件目录，当目录文件或文件夹不存在时，会自动创建
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
    }
  },
  auth: {
    authOpen: true,
    authSite: 'authentication',
    authSource: 'authsource',
    authKey: '447CTXA2C2X9XMYBGQRYP3NMVCUXEA3BYQGP',
    authOptions: {
      expiresIn: '24h',
      issuer: 'RiskManager System',
      audience: 'AXON R&D TEAM 2018-2020.',
      algorithm: 'HS512'
    }
  },
  websites: [
    {
      sitename: 'website',
      sitepath: path.resolve(__dirname, '../assets/website/index.html')
    }
  ],
  // sequelize-auto -o "./src/models" -d db_test -h localhost -u root -p 3306 -x 123456 -e mysql
  databases: [
    {
      modelPath: path.resolve(__dirname, './models'),
      db: 'db_test',
      dialect: 'mysql',
      port: 3306,
      replication: {
        read: [{ host: 'localhost', username: 'root', password: '123456' }],
        write: { host: 'localhost', username: 'root', password: '123456' }
      },
      pool: {
        maxConnections: 20,
        minConnections: 0,
        maxIdleTime: 30000
      },
      define: {
        timestamps: false
      },
      logging: false
    }
  ],
  redis: {
    host: 'localhost',
    port: 6379,
    family: 4,
    password: '',
    db: 0
  },
  rebitmq: {
    protocol: 'amqp',
    hostname: '10.10.133.217',
    port: 5672,
    username: 'guest',
    password: 'guest'
  }
};
