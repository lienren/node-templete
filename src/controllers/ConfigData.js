/*
 * @Author: Lienren 
 * @Date: 2018-06-21 19:51:37 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-06-21 23:53:58
 */
'use strict';

module.exports = {
  CONFIG_KEY_ENUM: {
    // 图形验证码随机长度
    ImageCodeRandomCount: 'ImageCodeRandomCount',
    // 图形验证码有效时长（单位：秒）
    ImageCodeOverTime: 'ImageCodeOverTime',
    // 管理员Token有效时间（单位：分钟）
    ManagerTokenOverTime: 'ManagerTokenOverTime',
    // 管理员密码索引位数
    ManagerPwdSaleCount: 'ManagerPwdSaleCount'
  },
  ERROR_KEY_ENUM: {
    InputParamIsNull: 'InputParamIsNull',
    ImageCodeTokenIsNull: 'ImageCodeTokenIsNull',
    ImageCodeIsFail: 'ImageCodeIsFail',
    ManagerNotExists: 'ManagerNotExists',
    ManagerPasswordIsFail: 'ManagerPasswordIsFail',
    ManagerOldPasswordIsFail: 'ManagerOldPasswordIsFail'
  },
  // 获取配置信息
  getConfig: async (ctx, configName) => {
    if (configName) {
      let result = await ctx.orm().BaseConfig.findOne({
        where: {
          key: configName
        }
      });

      if (result) {
        return result.value;
      } else {
        return -1;
      }
    } else {
      let result = await ctx.orm().BaseConfig.findAll({
        order: ['id']
      });

      return result;
    }
  }
};
