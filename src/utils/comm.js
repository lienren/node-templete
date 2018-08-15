/*
 * @Author: Lienren 
 * @Date: 2018-04-10 12:12:48 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-07-12 21:09:56
 */
'use strict';

const uuidv1 = require('uuid/v1');

module.exports = {
  // 获取GUID
  getGuid: () => {
    return uuidv1();
  },
  // 验证是否空值
  isEmpty: obj => {
    // null and undefined are "empty"
    if (obj === null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  },
  // 验证是否为数字
  isNumber: val => {
    var regPos = /^\d+$/; // 非负整数
    if (regPos.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  // 生成随机
  rand: (min, max) => {
    return (Math.random() * (max - min + 1) + min) | 0;
  },
  // 生成随机码（字母和数字）
  randCode: len => {
    let codes = 'ABCDEFGHKMNPQRSTUVWXYZ23456789YXWVUTSRQPNMKHGFEDCBA';
    let code = '';
    for (let i = 0; i < len; i++) {
      code += codes.charAt((Math.random() * codes.length) | 0);
    }
    return code;
  },
  // 生成随机码（数字）
  randNumberCode: len => {
    let codes = '1234567890987654321';
    let code = '';
    for (let i = 0; i < len; i++) {
      code += codes.charAt((Math.random() * codes.length) | 0);
    }
    return code;
  }
};
