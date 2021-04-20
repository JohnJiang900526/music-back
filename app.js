const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const connectHistory = require('connect-history-api-fallback');
const static = require('koa-static');
const app = new Koa()

const users = require('./routes/users')
const recommend = require('./routes/recommend')
const singer = require('./routes/singer')
const rank = require('./routes/rank')
const search = require('./routes/search')
const song = require('./routes/song')
const file = require('./routes/file')

// 设置静态文件缓存
const staticUrl = static(path.resolve(__dirname + '/public'), {
  maxAge: 100000,
  gzip: true
});

// error handler
onerror(app)

// 处理PWA页面的History路由模式
app.use(async (ctx, next)=> {
  const middleware = connectHistory();

  middleware(ctx, null, () => {});
  await next();
});

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(staticUrl);

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// 设置响应头 允许跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Headers,Content-Length,Accept,Authorization,X-Requested-With");
  await next();
});

// routes
app.use(users.routes(), users.allowedMethods())
// 推荐接口
app.use(recommend.routes(), recommend.allowedMethods())
// 歌手
app.use(singer.routes(), singer.allowedMethods())
// 推荐
app.use(rank.routes(), rank.allowedMethods())
// 搜索
app.use(search.routes(), search.allowedMethods());
// 歌曲
app.use(song.routes(), song.allowedMethods());
// 测试
app.use(file.routes(), file.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
