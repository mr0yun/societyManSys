const Router = require('koa-router');
const users = new Router();

// 引入数据库接口
const helper = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

/* // 引入md5
const crypto = require('crypto');
const md5 = crypto.createHash('md5'); */

// 引入model类
const User = require('../model/User');
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');



// 注册
users.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下3行，解除后面2行注释
  let data = JSON.stringify(ctx.request.body.data);
  let userInfo = JSON.parse(data);
  console.log(userInfo);
  // let userInfo = JSON.parse(ctx.request.body.data);
  // console.log(userInfo);

  // 查询用户名是否重复
  let isRepeat = await helper.haveRepeatUsername(userInfo._username);
  if(!isRepeat){  // 不重复
    let isAdd = await helper.addUser(userInfo);
    if(isAdd) ctx.body = new Response('注册成功', CODE.SUCCESS, false, null, null);
    else ctx.body = new Response('注册失败，SQL语句执行失败', CODE.ERROR, false, null, null);
  }
  else ctx.body = new Response('注册失败，用户名重复', CODE.ERROR, false, null, null);
})

// 登录
users.post('/login', async ctx => {
  let username = ctx.request.body.username;
  let psd = ctx.request.body.password;
  let res = await helper.loginCheck(username, psd);
  if(res.code === CODE.SUCCESS) ctx.body = new Response(res.message, res.code, true, 'json', res.data);
  else ctx.body = new Response('登录失败！'+res.message, false, null, null);
})

module.exports = users;