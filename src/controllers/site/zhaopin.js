/*
 * @Author: Lienren 
 * @Date: 2021-01-28 20:30:57 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-02-19 17:10:42
 */
'use strict';

module.exports = {
  list: async (ctx) => {
    let pageNum = ctx.request.body.pageNum || 1;
    let pageSize = ctx.request.body.pageSize || 10000;

    let where = {
      status: 1,
      is_del: 0
    }

    let result = await ctx.orm().website_zhaopin.findAndCountAll({
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      where
    });

    ctx.body = {
      total: result.count,
      list: result.rows.map(m => {
        return {
          ...m.dataValues,
          workArea: m.dataValues.work_area,
          createTime: m.dataValues.create_time
        }
      }),
    };
  }
}