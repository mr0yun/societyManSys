const Router = require('koa-router');
const applications = new Router();

// 引入数据库接口
const {applicationHelper, societyHelper, departmentHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
applications.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');
const { getLocalDatetime } = require('../utils/util');

// 添加申请：注销社团、注销部门、申请招新等
applications.post('/', async ctx => {
  let applicationInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let applicationInfo = JSON.parse(ctx.request.body.data);
  console.log(applicationInfo);
  let res = await applicationHelper.addApplication(applicationInfo);
  if(res) ctx.body = new Response('申请成功', CODE.SUCCESS, false);
  else ctx.body = new Response('申请失败', CODE.ERROR, false);
})

// 获取申请信息
applications.get('/', async ctx => {
  let res = await applicationHelper.getAllApplications();
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

// 审批申请
applications.patch('/', async ctx => {
  let apId = ctx.request.body.applicationId;
  let asId = ctx.request.body.associatedId;
  let type = ctx.request.body.type;
  let state = ctx.request.body.state;
  let opinion = ctx.request.body.opinion;
  console.log(apId, asId, type, state, opinion);

  let res = await applicationHelper.reviewApplication(apId, state, getLocalDatetime(), opinion);
  console.log(res);
  if(res && state == 1){
    let result;
    switch(type){
      case 1:
        result = await applicationHelper.updateRatify('society', asId, 1);
        break;
      case 2:
        result = await applicationHelper.updateRatify('department', asId, 1);
        break;
      case 3:
        result = await applicationHelper.updateRatify('activity', asId, 1);
        break;
      case 4:
        result = await societyHelper.updateSocietyRecruit(asId, 1);
        break;
      case 5: // 考核
        
        break;
      case 6: // 评优
       
        break;
      case 7:
        result = await societyHelper.delSociety(asId);
        break;
      case 8:
        result = await departmentHelper.delDepartment(asId);
        break;
      default:
        break;
    }
    if(result) ctx.body = new Response('审批成功', CODE.SUCCESS, false);
    else ctx.body = new Response('审批失败：数据库操作失败', CODE.ERROR, false);
  }
  else if(res) ctx.body = new Response('审批成功', CODE.SUCCESS, false);
  else ctx.body = new Response('审批失败', CODE.ERROR, false);
})

// 结束招新
applications.patch('/recruit', async ctx => {
  let res = await societyHelper.getSocietiesByRecruit(1);
  if(res.code === CODE.SUCCESS){
    let len = res.data.length;
    let cnt = 0;
    for(let i = 0; i < len; i++){
      let updateRes = await societyHelper.updateSocietyRecruit(res.data[i].id, 0);
      if(updateRes) cnt++;
    }
    if(cnt == len) ctx.body = new Response('结束成功', CODE.SUCCESS, false);
    else ctx.body = new Response('结束失败，请再次尝试', CODE.ERROR, false);
  }
  else ctx.body = new Response('获取社团信息失败', CODE.ERROR, false);
})

module.exports = applications