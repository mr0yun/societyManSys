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