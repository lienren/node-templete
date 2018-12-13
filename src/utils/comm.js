/*
 * @Author: Lienren
 * @Date: 2018-04-10 12:12:48
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 23:25:08
 */
'use strict';

const uuidv1 = require('uuid/v1');
const empty = require('is-empty');
const RAND_CODE = 'ABCDEFGHKMNPQRSTUVWXYZ23456789YXWVUTSRQPNMKHGFEDCBA';
const RAND_NUMBER = '123456789987654321';
const RAND_NUMBERCODE = '1234567890987654321';

function randString(len, str) {
  if (!str || str.length === 0) {
    return '';
  }
  let code = '';
  for (let i = 0; i < len; i++) {
    code += str.charAt((Math.random() * str.length) | 0);
  }
  return code;
}

module.exports = {
  // 获取GUID
  getGuid: () => {
    return uuidv1().replace(/-/g, '');
  },
  // 验证是否空值
  isEmpty: val => {
    return empty(val);
  },
  // 验证是否为数字
  isNumber: val => {
    return /^\d+$/.test(val); // 非负整数
  },
  // 生成随机
  rand: (min, max) => {
    return (Math.random() * (max - min + 1) + min) | 0;
  },
  // 生成随机码（字母和数字）
  randString: (len, str) => {
    return randString(len, str);
  },
  // 生成随机码（字母和数字）
  randCode: len => {
    return randString(len, RAND_CODE);
  },
  // 生成随机数字
  randNumber: len => {
    return randString(len, RAND_NUMBER);
  },
  // 生成随机码（数字）
  randNumberCode: len => {
    return randString(len, RAND_NUMBERCODE);
  }
};
