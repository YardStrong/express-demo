const express = require('express');
const logger = require('morgan');
const path = require('path');
const ejs = require('ejs');
const xmlparser = require('express-xml-bodyparser');

// 加载配置文件和中间件
const config = require('../common/profiles').getConfig();
const resultfulMiddleware = require('../common/middleware/resultfulMiddleware');
const clientInfoMiddleware = require('../common/middleware/clientInfoMiddleware');
const invalidMiddleware = require('../common/middleware/invalidMiddleware');
const mongoPlugin = require('../common/plugins/mongoPlugin');
// const redisLockPlugin = require('../common/plugins/redisLockPlugin');

let app = express();

app.set('views', path.join(__dirname, '../views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('app-port', config.app.port);
app.set('app-name', config.app.name);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger('dev'));
app.use(xmlparser());
app.use(resultfulMiddleware);
app.use(clientInfoMiddleware);

// 初始化插件
mongoPlugin.init(config.mongo.order);
// redisLockPlugin.init(config.redis);

// 路由
// const wxpayRouter = require('./router/wxpayRouter');
// const alipayRouter = require('./router/alipayRouter');
app.use('/ping', function(req, resp) {resp.json("OK")});
// app.use('/wxpay', wxpayRouter);
// app.use('/alipay', alipayRouter);
app.use(invalidMiddleware);

module.exports = app;
