const Koa = require('koa2');
const router = require('./router');
const app = new Koa();
const port = 5000;

// 引入koa2-cors中间件，允许跨域
const cors = require("koa2-cors");
// 这里cors中间件一定要写在路由之前
app.use(cors());

// 启动路由，允许任何方法
app.use(router.routes(), router.allowedMethods());

app.listen(port, ()=>{
  console.log(`Server is running at http://localhost:${port}`);
})