const Router = require('koa-router')
// 安全检查
let hs = new Router()
hs.get('/', async ctx => {
  ctx.body = 'OK'
})
module.exports = hs
