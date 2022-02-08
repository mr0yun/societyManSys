const Router = require('koa-router');
const users = new Router();

// 引入数据库接口
const {userHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');



// 注册
users.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下3行，解除后面1行注释
  let data = JSON.stringify(ctx.request.body.data);
  let userInfo = JSON.parse(data);
  // let userInfo = JSON.parse(ctx.request.body.data);
  console.log(userInfo);

  // 查询用户名是否重复
  let isRepeat = await userHelper.haveRepeatUsername(userInfo.user_name);
  if(!isRepeat){  // 不重复
    let isAdd = await userHelper.addUser(userInfo);
    if(isAdd) ctx.body = new Response('注册成功', CODE.SUCCESS, false, null, null);
    else ctx.body = new Response('注册失败，SQL语句执行失败', CODE.ERROR, false, null, null);
  }
  else ctx.body = new Response('注册失败，用户名重复', CODE.ERROR, false, null, null);
})

// 登录
users.post('/login', async ctx => {
  let username = ctx.request.body.username;
  let psd = ctx.request.body.password;
  let res = await userHelper.loginCheck(username, psd);
  if(res.code === CODE.SUCCESS) ctx.body = new Response(res.message, res.code, true, 'json', res.data);
  else ctx.body = new Response('登录失败！'+res.message, false, null, null);
})

// 修改个人信息
users.patch('/', async ctx => {
  let token = ctx.headers['authorization'];
  let data = JSON.stringify(ctx.request.body.data);
  let userInfo = JSON.parse(data);
  // let userInfo = JSON.parse(ctx.request.body.data);
  console.log(userInfo);

  let valid = await userHelper.tokenCheck(userInfo.id, token);
  if(valid){  
    // token校验通过
    let res = await userHelper.updateUser(userInfo);
    if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
    else ctx.body = new Response('更新失败', CODE.ERROR, false);
  }
  else ctx.body = new Response('登录状态过期，需重新登录！', CODE.ERROR, false, null, null, true);
})

// 修改密码
users.patch('/psd', async ctx => {
  let username = ctx.request.body.username;
  let oldPsd = ctx.request.body.oldPassword;
  let newPsd = ctx.request.body.newPassword;
  let res = await userHelper.loginCheck(username, oldPsd, false);
  if(res.code === CODE.SUCCESS){
    let updateRes = await userHelper.updatePassword(username, newPsd);
    if(updateRes) ctx.body = new Response('修改成功', CODE.SUCCESS, false);
    else ctx.body = new Response('修改失败', CODE.ERROR, false);
  }
  else ctx.body = new Response('密码错误', CODE.ERROR, false, null, null, true);
})

module.exports = users;