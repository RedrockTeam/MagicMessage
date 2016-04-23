const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const less = require('koa-less-middleware');
const koaStatic = require('koa-static');
const config = require('./config');

const index = require('./routes/index');
const api = require('./routes/api');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(less(__dirname + '/public')));
app.use(convert(koaStatic(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  ctx.set('ms', ms);
});

let routerPrefix = config.routerPrefix ? '/' + config.routerPrefix : '';
router.use(routerPrefix + '/', index.routes(), index.allowedMethods());
router.use(routerPrefix + '/api', api.routes(), api.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.log(err)
  log.error('server error', err, ctx);
});

require('./service/bootstrap');
module.exports = app;
