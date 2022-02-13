const Router = require('koa-router');
const candidates = new Router();

// 引入数据库接口
const {candidateHelper, memberHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
users.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');
const Member = require('../model/Member');
const { getLocalDatetime } = require('../utils/util');


// 普通用户参加社团招新
candidates.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下1行，解除后面1行注释
  let candidateInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let candidateInfo = JSON.parse(ctx.request.body.data);
  console.log(candidateInfo);

  let res = await candidateHelper.addCandidate(candidateInfo);
  if(res) ctx.body = new Response('添加成功', CODE.SUCCESS, false);
  else ctx.body = new Response('添加失败', CODE.ERROR, false);
})

// 修改候选人信息：面试分数、面试评价
candidates.patch('/', async ctx => {
  let cId = ctx.request.body.candidateId;
  let score = ctx.request.body.score;
  let evaluation = ctx.request.body.evaluation;
  let pass = ctx.request.body.pass;

  let res = await candidateHelper.updateInterview(cId, score, evaluation, pass);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 修改候选人状态
candidates.patch('/state', async ctx => {
  let cId = ctx.request.body.candidateId;
  let state = ctx.request.body.state;

  let res = await candidateHelper.updateCandidateState(cId, state);
  if(res){
    if(state == 4){
      let queryRes = await candidateHelper.getDetails(cId);
      if(queryRes.code === CODE.SUCCESS){
        let freshman = new Member(null, queryRes.data[0].u_id, queryRes.data[0].s_id, queryRes.data[0].d_id, '部委', getLocalDatetime());
        let insertRes = await memberHelper.addMember(freshman);
        if(insertRes) ctx.body = new Response('状态更新成功，加入社团成功', CODE.SUCCESS, false);
        else ctx.body = new Response('状态更新成功，但加入社团失败', CODE.ERROR, false);
      }
      else ctx.body = new Response('状态更新成功，但加入社团失败', CODE.ERROR, false);
    }
    else ctx.body = new Response('状态更新成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('状态更新失败', CODE.ERROR, false);
})

// 获取候选人信息
candidates.get('/', async ctx => {
  let sId = ctx.query.id;
  let res = await candidateHelper.getCandidates(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

/* // 删除候选人
candidates.delete('/', async ctx => {
  let cId = ctx.request.body.data;
  let res = await candidateHelper.delCandidate(cId);
  if(res){
    ctx.body = new Response('删除成功', CODE.SUCCESS, false);
  }
  else ctx.body = new Response('删除失败', CODE.ERROR, false);
}) */
