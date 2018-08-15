/*
 * @Author: Lienren 
 * @Date: 2018-07-20 15:29:41 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-07-20 15:30:05
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ftpClient = require('ftp');

let ftpUtil = {
  list: async (config, dirpath) => {
    return new Promise((resolve, reject) => {
      let fc = new ftpClient();
      fc.on('ready', function() {
        fc.list(dirpath, function(err, list) {
          if (err) {
            console.error(err);
            fc.end();
            reject({
              state: 'error',
              error: err
            });
          } else {
            fc.end();
            resolve({
              state: 'success',
              list: list
            });
          }
        });
      });
      fc.connect(config);
    });
  },
  getfile: async (config, filepath, save_filepath) => {
    return new Promise((resolve, reject) => {
      let fc = new ftpClient();
      fc.on('ready', function() {
        fc.get(filepath, (err, stream) => {
          if (err) {
            console.error(err);
            reject({
              state: 'error',
              error: err
            });
          }

          stream.once('close', () => {
            fc.end();
            resolve({
              state: 'success',
              filepath: save_filepath
            });
          });
          stream.pipe(fs.createWriteStream(save_filepath));
        });
      });
      fc.connect(config);
    });
  },
  find: async (config, filename, save_filepath) => {
    let result = await ftpUtil.list(config, '');

    if (result.state === 'success' && result.list.length > 0) {
      let filter_list = result.list.filter((element, index, array) => {
        return path.basename(element.name).split('.')[0] === filename;
      });

      if (filter_list.length > 0) {
        let result_getfile = await ftpUtil.getfile(config, filter_list[0].name, save_filepath);
        return result_getfile;
      }
    }

    return {
      state: 'success',
      filepath: ''
    };
  }
};

module.exports = ftpUtil;
