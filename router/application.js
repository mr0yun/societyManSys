const Router = require('koa-router');
const applications = new Router();

// 引入数据库接口
const {applicationHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');

// 添加申请：注销社团、注销部门等
applications.post('/', async ctx => {
  let applicationInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let applicationInfo = JSON.parse(ctx.request.body.datan);
  console.log(applicationInfo);
  let res = await applicationHelper.addApplication(applicationInfo);
  if(res) ctx.body = new Response('申请成功', CODE.SUCCESS, false);
  ctx.body = new Response('申请失败', CODE.ERROR, false);
})