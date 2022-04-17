/*
 * @Author: Lienren 
 * @Date: 2021-01-28 20:30:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-28 23:56:29
 */
'use strict';

const assert = require('assert');
const date = require('../../utils/date');

module.exports = {
  create: async (ctx) => {
    let name = ctx.request.body.name || 0;
    let phone = ctx.request.body.phone || '';
    let area = ctx.request.body.area || '';
    let city = ctx.request.body.city || '';

    assert.notStrictEqual(name, '', 'InputParamIsNull');
    assert.notStrictEqual(phone, '', 'InputParamIsNull');
    assert.notStrictEqual(area, '', 'InputParamIsNull');
    assert.notStrictEqual(city, '', 'InputParamIsNull');

    ctx.orm().website_applyinfo.create({
      name: name,
      phone: phone,
      area: area,
      city: city,
      create_time: date.formatDate(),
      is_del: 0
    });

    ctx.body = {};
  }
}