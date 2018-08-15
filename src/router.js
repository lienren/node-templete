/*
 * @Author: Lienren 
 * @Date: 2018-06-07 14:35:15 
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-07-19 17:52:00
 */
'use strict';

const Router = require('koa-router');
const uploadFile = require('./utils/uploadfile');
const ctrl = require('./controllers/index.js');

const router = new Router();

router
  // hello world!
  .all('/hello', ctrl.demo.hello)
  // wait hello world!
  .all('/wait_hello', ctrl.demo.waitHello)
  // 获取数据库users表数据
  .all('/users', ctrl.demo.getUsers)
  // 获取redis中user数据
  .all('/redis_user', ctrl.demo.getUserByRedis)
  // post请求带参
  .post('/post_param', ctrl.demo.postParam)
  // post请求http
  .post('/req_http', ctrl.demo.requestHttp)
  // post上传图片
  .post('/upload_file', uploadFile.getMulter('demo').any(), ctrl.demo.uploadFile)
  // 生成图形验证码
  .all('/img_code', ctrl.demo.getImageCode)
  // 设置RebitMQ
  .all('/set_rebitmq', ctrl.demo.setRebitMQ);

module.exports = router.routes();
