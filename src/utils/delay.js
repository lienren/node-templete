/*
 * @Author: Lienren 
 * @Date: 2018-06-20 12:23:42 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-20 12:24:07
 */
'use strict';

// 延时器
module.exports = delay => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};
