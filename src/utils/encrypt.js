/*
 * @Author: Lienren
 * @Date: 2018-04-19 12:06:42
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-12 23:23:19
 */
'use strict';

const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');
const rsaKeyData = fs.readFileSync(path.resolve(__dirname, './rsa_pri.key'), 'utf-8');
const rsaKey = new NodeRSA(rsaKeyData, 'pkcs8');

// Create Base64 Object
var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function(m) {
    var date = new Date();
    var e =
      'bh' +
      date.getFullYear() * m +
      (date.getMonth() + m) +
      date.getDate() +
      date.getDate() +
      (date.getMonth() + m * 2) +
      date.getFullYear();
    var t = '';
    var n, r, i, s, o, u, a;
    var f = 0;
    e = Base64._utf8_encode(e);
    while (f < e.length) {
      n = e.charCodeAt(f++);
      r = e.charCodeAt(f++);
      i = e.charCodeAt(f++);
      s = n >> 2;
      o = ((n & 3) << 4) | (r >> 4);
      u = ((r & 15) << 2) | (i >> 6);
      a = i & 63;
      if (isNaN(r)) {
        u = a = 64;
      } else if (isNaN(i)) {
        a = 64;
      }
      t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
    }
    return t.substring(0, 16);
  },
  _utf8_encode: function(e) {
    e = e.replace(/\r\n/g, '\n');
    var t = '';
    for (var n = 0; n < e.length; n++) {
      var r = e.charCodeAt(n);
      if (r < 128) {
        t += String.fromCharCode(r);
      } else if (r > 127 && r < 2048) {
        t += String.fromCharCode((r >> 6) | 192);
        t += String.fromCharCode((r & 63) | 128);
      } else {
        t += String.fromCharCode((r >> 12) | 224);
        t += String.fromCharCode(((r >> 6) & 63) | 128);
        t += String.fromCharCode((r & 63) | 128);
      }
    }
    return t;
  }
};

module.exports = {
  // 获取Md5加密
  getMd5: str => {
    return md5(str);
  },
  // 获取CryptoJS加密密文
  getEncryptVal: val => {
    let key = CryptoJS.enc.Utf8.parse(Base64.encode(1)).toString();
    let iv = CryptoJS.enc.Utf8.parse(Base64.encode(2)).toString();

    let encrypted = CryptoJS.TripleDES.encrypt(val, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }).toString();

    return encrypted;
  },
  // 获取CryptoJS解密密文
  getDecryptVal: val => {
    let key = CryptoJS.enc.Utf8.parse(Base64.encode(1)).toString();
    let iv = CryptoJS.enc.Utf8.parse(Base64.encode(2)).toString();

    try {
      let decrypted = CryptoJS.TripleDES.decrypt(val, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // 转换为 utf8 字符串
      decrypted = CryptoJS.enc.Utf8.stringify(decrypted) || '';

      return decrypted;
    } catch (e) {
      return '';
    }
  },
  // 获取RSA加密密文
  getRsaEncryptVal: (val, encoding = 'base64') => {
    return rsaKey.encrypt(val, encoding);
  },
  // 获取RSA解密密文
  getRsaDecryptVal: (val, encoding = 'utf8') => {
    return rsaKey.decrypt(val, encoding);
  }
};
