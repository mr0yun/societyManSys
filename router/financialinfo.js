const Router = require('koa-router');
const financialinfos = new Router();

// 引入数据库接口
const {financialHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
financialinfos.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 添加财务信息
financialinfos.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下2行，解除后面2行注释
  let financialInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let financialInfo = JSON.parse(ctx.request.body.data);
  console.log(financialInfo);

  let res = await financialHelper.addFinancialInfo(financialInfo);
  if(res) ctx.body = new Response('添加成功', CODE.SUCCESS, false);
  else ctx.body = new Response('添加失败', CODE.ERROR, false);
})

// 修改财务信息：
financialinfos.patch('/', async ctx => {
  let financialInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let financialInfo = JSON.parse(ctx.request.body.data);
  let res = await financialHelper.updateFinancialInfo(financialInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 获取财务信息
financialinfos.get('/', async ctx => {
  let sId = ctx.query.id;
  let res = await financialHelper.getFinancialInfos(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 按年获取财务信息
financialinfos.get('/export', async ctx => {
  let year = ctx.query.year;
  let res = await financialHelper.getFinancialInfosByYear(sId, year);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 删除财务信息
financialinfos.delete('/', async ctx => {
  let fId = ctx.request.body.data;
  let res = await financialHelper.delFinancialInfo(fId);
  if(res){
    ctx.body = new Response('删除成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
})


module.exports = financialinfos