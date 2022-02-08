const Router = require('koa-router');
const societies = new Router();

// 引入数据库接口
const {societyHelper, applicationHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
societies.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 新建社团
societies.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下2行，解除后面2行注释
  let societyInfo = JSON.parse(JSON.stringify(ctx.request.body.society));
  let applicationInfo = JSON.parse(JSON.stringify(ctx.request.body.application));
  // let societyInfo = JSON.parse(ctx.request.body.society);
  // let applicationInfo = JSON.parse(ctx.request.body.application);
  console.log(societyInfo, applicationInfo);
  let res = await societyHelper.addSociety(societyInfo);
  if(res){
    applicationInfo.associated_id = res;
    let applRes = await applicationHelper.addApplication(applicationInfo);
    console.log(applRes);
    if(applRes) ctx.body = new Response('申请成功', CODE.SUCCESS, false);
    else {
      await societyHelper.delSociety(res);
      ctx.body = new Response('申请失败', CODE.ERROR, false);
    }
  }
  else ctx.body = new Response('申请失败', CODE.ERROR, false);
})

// 修改社团信息
societies.patch('/', async ctx => {
  let societyInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let societyInfo = JSON.parse(ctx.request.body.data);
  let res = await societyHelper.updateSociety(societyInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 获取社团信息
societies.get('/', async ctx => {
  let uId = ctx.query.id;
  console.log(uId);
  let res = await societyHelper.getSocieties(uId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

module.exports = societies