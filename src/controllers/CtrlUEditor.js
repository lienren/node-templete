/*
 * @Author: Lienren 
 * @Date: 2018-08-15 17:00:24 
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-05-07 22:59:50
 */
'use strict';

const KoaUEditor = require('../utils/ueditor');
const config = require('../config.js');

module.exports = {
  ue: async (ctx, next) => {
    let ActionType = ctx.request.body.action;

    var uedictx = new KoaUEditor(ctx, next, {
      staticPath: '/assets/ueditor_files', //静态目录,文件保存根目录
      virtualPath: `${config.sys.domain}/ueditor_files`
    });

    if (ActionType === 'uploadimage' || ActionType === 'uploadvideo' || ActionType === 'uploadfile') {
      await uedictx.save();
    } else if (ActionType === 'listimage') {
      await uedictx.list();
    } else {
      ctx.set('Content-Type', 'application/json');
      ctx.redirect('/ueditor/config.json'); //根据自己的ueditor的配置文件的路径
    }
  }
};
