const Router = require('koa-router');
const financialinfos = new Router();

// 引入数据库接口
const {memberHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
financialinfos.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 添加成员
financialinfos.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下2行，解除后面2行注释
  let memberInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let memberInfo = JSON.parse(ctx.request.body.data);
  console.log(memberInfo);

  let res = await memberHelper.addMember(memberInfo);
  if(res) ctx.body = new Response('添加成功', CODE.SUCCESS, false);
  else ctx.body = new Response('添加失败', CODE.ERROR, false);
})

// 修改成员信息：部门、职级
financialinfos.patch('/', async ctx => {
  let memberInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let memberInfo = JSON.parse(ctx.request.body.data);
  let res = await memberHelper.updateMember(memberInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 获取成员信息
financialinfos.get('/', async ctx => {
  let sId = ctx.query.id;
  let res = await memberHelper.getfinancialinfos(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 删除成员
financialinfos.delete('/', async ctx => {
  let mId = ctx.request.body.data;
  let res = await memberHelper.delMember(mId);
  if(res){
    ctx.body = new Response('删除成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
})


module.exports = financialinfos