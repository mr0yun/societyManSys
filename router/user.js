const Router = require('koa-router');
const users = new Router();

// 引入数据库接口


// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

const jwt = require('jsonwebtoken');

/* // 引入md5
const crypto = require('crypto');
const md5 = crypto.createHash('md5'); */

// 引入model类
const User = require('../model/User');



// 注册
users.post('/', async ctx => {
  console.log(ctx.request.body);
  let userInfo = JSON.parse(ctx.request.body.data);
  console.log(userInfo);
})

// 登录
users.post('/login', async ctx => {

})
