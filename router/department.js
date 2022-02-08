const Router = require('koa-router');
const departments = new Router();

// 引入数据库接口
const {departmentHelper, applicationHelper} = require('../db/dbhelper');

// 引入中间件
const bodyparser = require('koa-bodyparser');
departments.use(bodyparser());

// 引入model类
const Response = require('../model/Response');
const { CODE } = require('../utils/constant');


// 新建部门
departments.post('/', async ctx => {
  // 测试接口用，写了前端后记得删掉以下2行，解除后面2行注释
  let departmentInfo = JSON.parse(JSON.stringify(ctx.request.body.department));
  let applicationInfo = JSON.parse(JSON.stringify(ctx.request.body.application));
  // let departmentInfo = JSON.parse(ctx.request.body.department);
  // let applicationInfos = JSON.parse(ctx.request.body.application);
  console.log(departmentInfo, applicationInfo);
  let res = await departmentHelper.addDepartment(departmentInfo);
  if(res){
    applicationInfo.associated_id = res;
    let applRes = await applicationHelper.addApplication(applicationInfo);
    if(applRes) ctx.body = new Response('申请成功', CODE.SUCCESS, false);
    else {
      await departmentHelper.delDepartment(res);
      ctx.body = new Response('申请失败', CODE.ERROR, false);
    }
  }
  else ctx.body = new Response('申请失败', CODE.ERROR, false);
})

// 修改部门信息：部长、介绍
departments.patch('/', async ctx => {
  let departmentInfo = JSON.parse(JSON.stringify(ctx.request.body.data));
  // let departmentInfo = JSON.parse(ctx.request.body.data);
  let res = await departmentHelper.updateDepartment(departmentInfo);
  if(res) ctx.body = new Response('更新成功', CODE.SUCCESS, false);
  else ctx.body = new Response('更新失败', CODE.ERROR, false);
})

// 获取部门信息
departments.get('/', async ctx => {
  let sId = ctx.query.id;
  let res = await departmentHelper.getDepartments(sId);
  if(res.code === CODE.SUCCESS){
    ctx.body = new Response(res.message, CODE.SUCCESS, true, 'json', res.data);
  }
  else ctx.body = new Response(res.message, CODE.ERROR, false);
})

module.exports = departments