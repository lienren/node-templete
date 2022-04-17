/*
 * @Author: Lienren
 * @Date: 2019-08-27 19:08:36
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-08-27 19:12:34
 */
'use strict';

const request = require('request');
const fs = require('fs');

module.exports = {
  downImage: (url, savepath) => {
    request(url).pipe(fs.createWriteStream(savepath));
  }
};
