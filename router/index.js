const Router = require('koa-router');
const router = new Router();

// 引入其他模块路由
const users = require('./user');
const societies = require('./society');
const departments = require('./department');
const members = require('./member');

// router.get()
router.use('/users', users.routes(), users.allowedMethods());
router.use('/societies', societies.routes(), societies.allowedMethods());
router.use('/departments', departments.routes(), departments.allowedMethods());
router.use('/members', members.routes(), members.allowedMethods());

module.exports = router;