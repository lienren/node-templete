/*
 * @Author: Lienren
 * @Date: 2019-10-16 20:03:47
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-18 10:50:02
 */
'use strict';

const assert = require('assert');
const validate = require('../../utils/validate');

module.exports = {
  isNull: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
  },
  isEmpty: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
    assert.ok(val !== '', errorMsg);
    assert.ok(val !== 0, errorMsg);
  },
  isNumber: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
    assert.ok(val !== '', errorMsg);
    assert.ok(validate.chkFormat(val, 'number'), errorMsg);
  },
  isNumberGreaterThan0: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
    assert.ok(val !== '', errorMsg);
    assert.ok(validate.chkFormat(val, 'number'), errorMsg);
    assert.ok(val > 0, errorMsg);
  },
  isArray: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
    assert.ok(Array.isArray(val), errorMsg);
  },
  isArrayLengthGreaterThan0: (val, errorMsg = '入参不能为空！') => {
    assert.ok(val !== null, errorMsg);
    assert.ok(val !== undefined, errorMsg);
    assert.ok(Array.isArray(val), errorMsg);
    assert.ok(val.length > 0, errorMsg);
  }
};