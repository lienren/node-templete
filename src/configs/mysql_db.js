/*
 * @Author: Lienren
 * @Date: 2018-04-19 11:53:57
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 22:44:35
 */
'use strict';

const path = require('path');
const dbs = require('../config.json').dbs;

// sequelize-auto -o "./src/models" -d db_test -h localhost -u root -p 3306 -x 123456 -e mysql

function getDatabaseConfig() {
  return dbs.map(db => {
    return {
      modelPath: path.resolve(__dirname, db.modelPath),
      db: db.dbname,
      dialect: db.dbtype,
      port: db.port,
      replication: {
        // Separation of reading and writing
        read: db.read,
        write: db.write
      },
      pool: {
        ...db.pool
      },
      define: {
        timestamps: false
      },
      logging: false
    };
  });
}

module.exports = getDatabaseConfig();
