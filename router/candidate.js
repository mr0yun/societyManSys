const Router = require('koa-router');
const candidates = new Router();

// 引入数据库接口
const helper = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 普通用户参加社团招新
candidates.post('/', async ctx => {
  
})