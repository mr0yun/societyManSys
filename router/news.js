const Router = require('koa-router');
const news = new Router();

// 引入数据库接口
const {newsHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
news.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 添加新闻
news.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下1行，解除后面1行注释
  let newsInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let newsInfo = JSON.parse(ctx.request.body.data);
  console.log(newsInfo);

  let res = await newsHelper.addNews(newsInfo);
  if(res) ctx.body = new Response('添加成功', CODE.SUCCESS, false);
  else ctx.body = new Response('添加失败', CODE.ERROR, false);
})

// 修改新闻
news.patch('/', async ctx => {
  let newsInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let newsInfo = JSON.parse(ctx.request.body.data);
  let res = await newsHelper.updateNews(newsInfo);
  if(res) ctx.body = new Response('修改成功', CODE.SUCCESS, false);
  else ctx.body = new Response('修改失败', CODE.ERROR, false);
})

// 获取新闻
news.get('/', async ctx => {
  let sId = ctx.query.id;
  let res;
  if(sId == 0) res = await newsHelper.getAllNews();
  else res = await newsHelper.getNews(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 删除新闻
news.delete('/', async ctx => {
  let nId = ctx.request.body.data;
  let res = await newsHelper.delNews(nId);
  if(res){
    ctx.body = new Response('删除成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
})


module.exports = news