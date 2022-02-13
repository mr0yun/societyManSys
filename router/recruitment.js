const Router = require('koa-router');
const recruitments = new Router();

// 引入数据库接口
const {recruitmentHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
recruitments.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');

// 新建招募信息
recruitments.post('/', async ctx => {
  let recruitmentInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let recruitmentInfo = JSON.parse(ctx.request.body.data);
  console.log(recruitmentInfo);

  let res = await recruitmentHelper.addRecruitment(recruitmentInfo);
  if(res) ctx.body = new Response('创建成功', CODE.SUCCESS, false);
  else ctx.body = new Response('创建失败', CODE.ERROR, false);
})

// 修改招募信息
recruitments.patch('/', async ctx => {
  let recruitmentInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let recruitmentInfo = JSON.parse(ctx.request.body.data);
  console.log(recruitmentInfo);

  let res = await recruitmentHelper.updateRecruitment(recruitmentInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 获取招募信息
recruitments.get('/', async ctx => {
  let sId = ctx.query.id;
  let res;
  if(sId == 0) res = await recruitmentHelper.getAllRecruitments();
  else res = await recruitmentHelper.getRecruitments(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

/* // 删除招募信息
recruitments.delete('/', async ctx => {
  let uId = ctx.request.body.userId;
  let aId = ctx.request.body.activityId;
  console.log(uId, aId);
  let res = await recruitmentHelper.delRecruitment(uId, aId);
  if(res){
    ctx.body = new Response('删除成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
}) */


module.exports = recruitments