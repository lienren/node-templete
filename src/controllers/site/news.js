/*
 * @Author: Lienren 
 * @Date: 2021-01-28 20:30:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-02-19 17:10:38
 */
'use strict';

module.exports = {
  list: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10000;

    let result = await ctx.orm().website_news.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where: {
        status: 1,
        is_del: 0
      }
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          imgUrl: m.dataValues.img_url,
          createTime: m.dataValues.create_time
        }
      }),
    };
  }
}