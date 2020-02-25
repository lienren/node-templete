/*
 * @Author: Lienren
 * @Date: 2020-02-23 11:34:17
 * @Last Modified by: Lienren
 * @Last Modified time: 2020-02-24 10:57:04
 */
'use strict';

const assert = require('assert');

module.exports = {
  getUserInfo: async ctx => {
    let openId = ctx.request.body.openId || '';

    assert.notStrictEqual(openId, '', '入参不能为空！');

    // 获取用户
    let user = await ctx.orm().user.findOne({
      where: {
        u_openid: openId
      }
    });

    let headImg = user.u_head;
    if (headImg.indexOf('http') < 0 && headImg.indexOf('https') < 0) {
      headImg = `https://www.jiangxinzhiyin.com${headImg}`;
    }

    ctx.body = {
      nickName: user.u_nick_name,
      integral: user.u_integral,
      headImg: headImg,
      openId: openId
    };
  }
};
