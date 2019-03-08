/*
 * @Author: Lienren
 * @Date: 2018-06-07 14:35:15
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-05 12:05:14
 */
'use strict';

const Router = require('koa-router');
const uploadFile = require('./utils/uploadfile');
const ctrl = require('./controllers/index.js');

const router = new Router();

router.all('/cheetah/(.*)', ctrl.cheetah.proxyApi);

module.exports = router.routes();
