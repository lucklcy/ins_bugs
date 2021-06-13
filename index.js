const Koa = require("koa");
const path = require("path");
const app = new Koa();
const Router = require("koa-router");
const hs = require("./service/hs");
const insService = require("./service/ins");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const argv = require("yargs").argv || {};
// 静态资源目录对于相对入口文件index.js的路径
app.use(static(path.join(__dirname, "./client")));
app.use(bodyParser());

// 装载所有子路由
let router = new Router();
router.use("/ins", insService.routes(), insService.allowedMethods());
router.use("/hs", hs.routes(), hs.allowedMethods());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

let port = argv.port || 8080;
app.listen(port, () => {
  console.log(`Landing ssr is starting at port ${port}`);
});
