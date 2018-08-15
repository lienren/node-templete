/*
 * @Author: Lienren 
 * @Date: 2018-04-19 11:53:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-07 17:07:39
 */
'use strict';

const path = require('path');
const config = require('../config.json');

// sequelize-auto -o "./src/models" -d db_test -h localhost -u root -p 3306 -x 123456 -e mysql
module.exports = {
  modelPath: path.resolve(__dirname, config.db.modelPath),
  db: config.db.dbname,
  dialect: config.db.dbtype,
  port: config.db.port,
  replication: {
    // Separation of reading and writing
    read: config.db.read,
    write: config.db.write
  },
  pool: {
    ...config.db.pool
  },
  define: {
    timestamps: false
  },
  logging: false
};
