/*
 * @Author: Lienren
 * @Date: 2018-04-19 11:52:42
 * @Last Modified by: Lienren
 * @Last Modified time: 2018-12-14 00:01:53
 */
'use strict';

console.time('Startup');

const http = require('http');
const path = require('path');
const koa = require('koa');
const koastatic = require('koa-static');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const config = require('./config.js');

const app = new koa();

// 静态存放地址
app.use(koastatic(config.sys.staticPath));

// 配置跨域访问
app.use(cors());

// 清除content-encoding请求头编码
app.use(async (ctx, next) => {
  delete ctx.request.headers['content-encoding'];
  await next();
});

// 使用koa-bodyparser中间件
app.use(
  bodyParser({
    enableTypes: ['json', 'form']
  })
);

// 使用koa-orm中间件，sequelize，mysql
if (config.databases) {
  const orm = require('koa-orm')(config.databases);
  app.use(orm.middleware);
}

// 全局请求处理
const requestFilter = require('./filters/request_filter');
app.use(requestFilter);

// 路由
const router = require('./router.js');
app.use(router);

// 绑定访问端口
http.createServer(app.callback()).listen(config.sys.port);

console.timeEnd('Startup');
