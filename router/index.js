const Router = require('koa-router');
const router = new Router();

// 引入其他模块路由
const users = require('./user');
const societies = require('./society');
const departments = require('./department');
const members = require('./member');
const financialinfos = require('./financialinfo');
const activities = require('./activity');
const participants = require('./participant');
const recruitments = require('./recruitment');
const candidates = require('./candidate');
const news = require('./news');
const applications = require('./application');

const allowPage = ['/users'];
const Response = require('../model/Response');
const jwt = require("../middleware/jwt");
const { CODE } = require('../utils/constant');

router.use('/', async (ctx, next) => {
  console.log(ctx.path);
  if(allowPage.includes(ctx.path)){
    // 不必检验，允许通行
    await next();
  }
  else {
    // 进行token验证
    let token = ctx.headers['authorization'];
    let valid = await jwt.verify(token);
    if(valid.code === CODE.SUCCESS) await next();
    else ctx.body = new Response('身份验证未通过，请重新登录', CODE.ERROR, false, null, null, true);
  }
})

// router.get()
router.use('/users', users.routes(), users.allowedMethods());
router.use('/societies', societies.routes(), societies.allowedMethods());
router.use('/departments', departments.routes(), departments.allowedMethods());
router.use('/members', members.routes(), members.allowedMethods());
router.use('/financialinfos', financialinfos.routes(), financialinfos.allowedMethods());
router.use('/activities', activities.routes(), activities.allowedMethods());
router.use('/participants', participants.routes(), participants.allowedMethods());
router.use('/recruitments', recruitments.routes(), recruitments.allowedMethods());
router.use('/candidates', candidates.routes(), candidates.allowedMethods());
router.use('/news', news.routes(), news.allowedMethods());
router.use('/applications', applications.routes(), applications.allowedMethods());

module.exports = router;