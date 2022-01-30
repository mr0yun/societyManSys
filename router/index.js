const Router = require('koa-router');
const router = new Router();

// 引入其他模块路由
const users = require('./user');


// router.get()
router.use('/users', users.routes(), users.allowedMethods());


module.exports = router;