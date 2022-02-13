const Router = require('koa-router');
const activities = new Router();

// 引入数据库接口
const {activityHelper, applicationHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
activities.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 新建活动
activities.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下2行，解除后面2行注释
  let activityInfo = JSON.parse(JSON.stringify(ctx.request.body.activity));
  let applicationInfo = JSON.parse(JSON.stringify(ctx.request.body.application));
  // let activityInfo = JSON.parse(ctx.request.body.activity);
  // let applicationInfo = JSON.parse(ctx.request.body.application);
  console.log(activityInfo, applicationInfo);
  let res = await activityHelper.addActivity(activityInfo);
  if(res){
    applicationInfo.associated_id = res;
    let applRes = await applicationHelper.addApplication(applicationInfo);
    console.log(applRes);
    if(applRes) ctx.body = new Response('申请成功', CODE.SUCCESS, false);
    else {
      await activityHelper.delActivity(res);
      ctx.body = new Response('申请失败', CODE.ERROR, false);
    }
  }
})

// 修改活动信息
activities.patch('/', async ctx => {
  let activityInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let activityInfo = JSON.parse(ctx.request.body.data);
  let res = await activityHelper.updateActivity(activityInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 修改活动状态：开放签到、结束活动
activities.patch('/state', async ctx => {
  let activityId = ctx.request.body.activityId;
  let state = ctx.request.body.state;

  let res = await activityHelper.updateActivityState(activityId, state);
  if(res) ctx.body = new Response('状态更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('状态更新失败', CODE.ERROR, false);
})

// 获取活动信息
activities.get('/', async ctx => {
  let sId = ctx.query.id;
  let res;
  if(sId == 0){
    res = await activityHelper.getAllActivities();
  }
  else res = await activityHelper.getActivities(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 删除活动
activities.delete('/', async ctx => {
  let aId = ctx.request.body.data;
  let res = await activityHelper.delActivity(aId);
  if(res){
    let delRes = await applicationHelper.delApplicationByAid(aId);
    if(delRes) ctx.body = new Response('删除成功', CODE.SUCCESS, false);
    else ctx.body = new Response('活动已删除，但申请撤销失败，请联系管理员删除该活动申请', CODE.ERROR, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
})


module.exports = activities