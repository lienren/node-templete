/*
 * @Author: Lienren 
 * @Date: 2018-06-21 19:51:37 
 * @Last Modified by: Lienren
 * @Last Modified time: 2021-01-20 17:50:22
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
    InputParamIsNull: '入参不能为空',
    ImageCodeTokenIsNull: '图形验证码Token不能为空',
    ImageCodeIsFail: '图形验证码获取失败',
    ManagerNotExists: '管理员帐号不存在',
    ManagerPasswordIsFail: '管理员密码输入错误',
    ManagerOldPasswordIsFail: '管理员原密码输入错误'
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