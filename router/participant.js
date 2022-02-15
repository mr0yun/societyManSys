const Router = require('koa-router');
const participants = new Router();

// 引入数据库接口
const {participantHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
participants.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');
const { random } = require('../utils/util');


// 参加活动
participants.post('/', async ctx => {
  let uId = ctx.request.body.userId;
  let aId = ctx.request.body.activityId;
  console.log(uId, aId);

  let res = await participantHelper.addParticipant(uId, aId);
  if(res) ctx.body = new Response('参加成功', CODE.SUCCESS, false);
  else ctx.body = new Response('参加失败', CODE.ERROR, false);
})

// 签到
participants.patch('/state', async ctx => {
  let uId = ctx.request.body.userId;
  let aId = ctx.request.body.activityId;
  let res = await participantHelper.updateParticipantState(aId, uId, 1);
  if(res) ctx.body = new Response('签到成功', CODE.SUCCESS, false);
  else ctx.body = new Response('签到失败', CODE.ERROR, false);
})

// 发表活动评论
participants.patch('/comments', async ctx => {
  let uId = ctx.request.body.userId;
  let aId = ctx.request.body.activityId;
  let score = ctx.request.body.score;
  let comment = ctx.request.body.comment;
  let res = await participantHelper.updateParticipant(aId, uId, score, comment);
  if(res) ctx.body = new Response('评论成功', CODE.SUCCESS, false);
  else ctx.body = new Response('评论失败', CODE.ERROR, false);
})

// 获取参与者信息
participants.get('/', async ctx => {
  let aId = ctx.query.id;
  let res = await participantHelper.getParticipants(aId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', JSON.stringify(res.data));
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 退出活动
participants.delete('/', async ctx => {
  let uId = ctx.request.body.userId;
  let aId = ctx.request.body.activityId;
  console.log(uId, aId);
  let res = await participantHelper.delParticipant(uId, aId);
  if(res){
    ctx.body = new Response('退出成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('退出失败', CODE.ERROR, false);
})

// 抽奖
participants.patch('/lottery', async ctx => {
  let aId = ctx.request.body.activityId;
  let count = ctx.request.body.count;
  let level = ctx.request.body.level;
  let res = await participantHelper.getParticipants(aId);
  console.log(res);
  if(res.code === CODE.SUCCESS){
    // 抽号码
    let len = res.data.length;
    let list = [], draw = [];
    for(let i = 0; i < count; i++){
      let index = random(0, len);
      while(draw.includes(index)) 
        index = random(0, len);
      draw.push(index);
      list.push(res.data[index]);
    }
    console.log(draw, list);

    // 数据库操作
    let cnt = 0;
    for(let i = 0; i < len; i++){
      let updateRes = await participantHelper.updatelottery(list[i].id, level);
      if(updateRes) cnt++;
    }
    if(cnt == len) ctx.body = new Response('抽奖成功', CODE.SUCCESS, true, 'json', JSON.stringify(list));
    else ctx.body = new Response('抽奖失败', CODE.ERROR, false);
  }
})


module.exports = participants